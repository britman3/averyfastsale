import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { leadFormSchema, normalisePostcode } from '@/lib/validation'
import { routeLeadFull } from '@/lib/routing'
import {
  sendSellerConfirmation,
  sendStudentLeadAlert,
  sendAdminLeadAlert,
  sendUnroutedLeadAlert,
} from '@/lib/email'

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

    // Determine capture mode and routing
    const requestedCaptureMode = body.captureMode || 'CENTRAL'
    let captureMode: 'CENTRAL' | 'STUDENT_DIRECT' = 'CENTRAL'
    let directStudentId: string | null = null
    let sourceSubdomainSlug: string | null = body.sourceSubdomainSlug || null

    if (requestedCaptureMode === 'STUDENT_DIRECT' && body.studentId) {
      // Verify student exists and is active
      const directStudent = await prisma.student.findUnique({
        where: { id: body.studentId, isActive: true },
      })
      if (directStudent) {
        captureMode = 'STUDENT_DIRECT'
        directStudentId = directStudent.id
      }
    }

    // Create Lead record
    const lead = await prisma.lead.create({
      data: {
        captureMode,
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
        sourceSubdomainSlug,
        assignedStudentId: directStudentId,
      },
    })

    // Create LeadActivity record for form submission
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: 'FORM_SUBMITTED',
        payload: {
          sourcePage: data.referrerUrl || 'direct',
          captureMode,
          ...(sourceSubdomainSlug ? { sourceSubdomainSlug } : {}),
        },
      },
    })

    // Route the lead (skip routing engine for STUDENT_DIRECT — already assigned)
    let assignedStudentId: string | null = directStudentId

    if (!assignedStudentId) {
      // Central mode — use routing engine
      assignedStudentId = await routeLeadFull(lead.postcode, lead.townCity)
    }

    // Fetch assigned student details (needed for emails)
    let assignedStudent: { id: string; email: string; displayName: string } | null = null

    if (assignedStudentId && !directStudentId) {
      // Only update if routed (not already set at creation)
      await prisma.lead.update({
        where: { id: lead.id },
        data: { assignedStudentId },
      })
    }

    if (assignedStudentId) {
      assignedStudent = await prisma.student.findUnique({
        where: { id: assignedStudentId },
        select: { id: true, email: true, displayName: true },
      })

      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: 'ASSIGNED',
          payload: {
            studentId: assignedStudentId,
            method: captureMode === 'STUDENT_DIRECT' ? 'STUDENT_DIRECT' : 'AUTO_ROUTE',
          },
        },
      })
    } else {
      await prisma.leadActivity.create({
        data: {
          leadId: lead.id,
          type: 'ASSIGNED',
          payload: { method: 'UNROUTED', reason: 'No matching routing rule' },
        },
      })
    }

    // ── Send emails (fire and forget) ──
    const emailPromises: Promise<{ success: boolean; error?: string }>[] = []

    // 1. Seller confirmation (if email provided)
    if (lead.email) {
      emailPromises.push(sendSellerConfirmation(lead as { fullName: string; email: string; postcode: string; addressLine1: string }))
    }

    // 2. Student alert (if assigned)
    if (assignedStudent) {
      emailPromises.push(
        sendStudentLeadAlert(assignedStudent.email, assignedStudent.displayName, lead),
      )
    }

    // 3. Admin alert (always)
    emailPromises.push(sendAdminLeadAlert(lead, assignedStudent?.displayName))

    // 4. Unrouted warning (if no student assigned)
    if (!assignedStudentId) {
      emailPromises.push(sendUnroutedLeadAlert(lead))
    }

    // Log email activities (don't block response)
    const activityPromises: Promise<unknown>[] = []
    if (lead.email) {
      activityPromises.push(
        prisma.leadActivity.create({
          data: { leadId: lead.id, type: 'EMAIL_SENT', payload: { to: 'seller' } },
        }),
      )
    }
    if (assignedStudent) {
      activityPromises.push(
        prisma.leadActivity.create({
          data: {
            leadId: lead.id,
            type: 'EMAIL_SENT',
            payload: { to: 'student', studentId: assignedStudent.id },
          },
        }),
      )
    }
    activityPromises.push(
      prisma.leadActivity.create({
        data: { leadId: lead.id, type: 'EMAIL_SENT', payload: { to: 'admin' } },
      }),
    )

    // Don't block response on emails — fire and log errors
    Promise.allSettled([...emailPromises, ...activityPromises]).then(results => {
      results.forEach((result, i) => {
        if (result.status === 'rejected') {
          console.error(`Email/activity ${i} failed:`, result.reason)
        }
      })
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
