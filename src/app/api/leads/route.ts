import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { leadFormSchema, normalisePostcode } from '@/lib/validation'

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  return '0.0.0.0'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate with Zod
    const result = leadFormSchema.safeParse(body)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (field && typeof field === 'string') {
          fieldErrors[field] = issue.message
        }
      }
      return NextResponse.json(
        { success: false, errors: fieldErrors },
        { status: 400 }
      )
    }

    const data = result.data

    // Honeypot check — return 200 silently to not reveal the trap
    if (data.honeypot && data.honeypot.length > 0) {
      return NextResponse.json({ success: true, leadId: 'ok' })
    }

    const clientIp = getClientIp(request)

    // Rate limit: count leads from this IP in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentLeadCount = await prisma.lead.count({
      where: {
        consentIp: clientIp,
        createdAt: { gte: oneHourAgo },
      },
    })

    if (recentLeadCount >= 5) {
      return NextResponse.json(
        { success: false, message: 'Please wait a moment before submitting again.' },
        { status: 429 }
      )
    }

    // Normalise postcode
    const normalisedPostcode = normalisePostcode(data.postcode)

    // Create Lead record
    const lead = await prisma.lead.create({
      data: {
        captureMode: 'CENTRAL',
        status: 'NEW',
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || null,
        townCity: data.townCity,
        postcode: normalisedPostcode,
        approxValue: data.approxValue,
        reasonForSale: data.reasonForSale,
        timeline: data.timeline,
        consentMarketing: true,
        consentTimestamp: new Date(),
        consentIp: clientIp,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        utmTerm: data.utmTerm || null,
        utmContent: data.utmContent || null,
        referrerUrl: data.referrerUrl || null,
        assignedStudentId: null, // Phase 3 adds routing
      },
    })

    // Create LeadActivity record
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: 'FORM_SUBMITTED',
        payload: {
          sourcePage: data.referrerUrl || 'direct',
          captureMode: 'CENTRAL',
        },
      },
    })

    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again or call us on 0800 XXX XXXX.' },
      { status: 500 }
    )
  }
}
