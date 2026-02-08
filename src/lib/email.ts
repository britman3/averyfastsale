import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'leads@averyfastsale.com'
const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'admin@averyfastsale.com'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://averyfastsale.com'

type EmailResult = { success: boolean; error?: string }

// ── Shared styles ──

const NAVY = '#1a2340'
const GREEN = '#22c55e'
const LIGHT_BG = '#f9fafb'

function emailWrapper(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>A Very Fast Sale</title>
</head>
<body style="margin:0;padding:0;background-color:${LIGHT_BG};font-family:Arial,Helvetica,sans-serif;color:#333;line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${LIGHT_BG};padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;max-width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:${NAVY};padding:24px 32px;text-align:center;">
              <h1 style="margin:0;font-size:22px;color:#ffffff;font-family:'Montserrat',Arial,Helvetica,sans-serif;letter-spacing:0.5px;">
                A Very Fast Sale
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;text-align:center;font-size:12px;color:#999;border-top:1px solid #eee;">
              A Very Fast Sale &nbsp;|&nbsp; <a href="${BASE_URL}" style="color:${GREEN};text-decoration:none;">averyfastsale.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ── Template 1: Seller Confirmation ──

export async function sendSellerConfirmation(lead: {
  fullName: string
  email: string
  postcode: string
  addressLine1: string
}): Promise<EmailResult> {
  try {
    const firstName = lead.fullName.split(' ')[0]

    const html = emailWrapper(`
      <p style="margin:0 0 16px;font-size:16px;">Hi ${firstName},</p>
      <p style="margin:0 0 16px;font-size:16px;">
        Thanks for getting in touch. We've received your details for
        <strong>${lead.addressLine1}, ${lead.postcode}</strong>.
      </p>
      <p style="margin:0 0 16px;font-size:16px;">
        A local property specialist will review your property and be in touch within 24 hours.
      </p>
      <p style="margin:0 0 16px;font-size:16px;">
        This is a no-obligation enquiry. You are under no pressure to accept any offer.
      </p>
      <p style="margin:0 0 0;font-size:16px;">
        If you have any questions in the meantime, reply to this email or call us on
        <a href="tel:0800XXXXXXX" style="color:${GREEN};text-decoration:none;font-weight:bold;">0800 XXX XXXX</a>.
      </p>
    `)

    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: lead.email,
      subject: "We've received your property details",
      html,
    })

    if (error) {
      console.error('Seller confirmation email failed:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Seller confirmation email error:', message)
    return { success: false, error: message }
  }
}

// ── Template 2: Student Lead Alert ──

interface LeadDetails {
  id: string
  fullName: string
  phone: string
  email: string | null
  addressLine1: string
  addressLine2: string | null
  townCity: string
  postcode: string
  approxValue: string
  reasonForSale: string | null
  timeline: string | null
  captureMode: string
  sourceSubdomainSlug: string | null
  createdAt: Date
}

export async function sendStudentLeadAlert(
  studentEmail: string,
  studentName: string,
  lead: LeadDetails,
): Promise<EmailResult> {
  try {
    const submittedAt = lead.createdAt.toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    const fullAddress = [lead.addressLine1, lead.addressLine2, lead.townCity]
      .filter(Boolean)
      .join(', ')

    const rows = [
      { label: 'Name', value: lead.fullName },
      {
        label: 'Phone',
        value: `<a href="tel:${lead.phone}" style="color:${GREEN};text-decoration:none;">${lead.phone}</a>`,
      },
      {
        label: 'Email',
        value: lead.email
          ? `<a href="mailto:${lead.email}" style="color:${GREEN};text-decoration:none;">${lead.email}</a>`
          : '—',
      },
      { label: 'Address', value: fullAddress },
      { label: 'Postcode', value: lead.postcode },
      { label: 'Approx value', value: `£${lead.approxValue}` },
      { label: 'Reason', value: lead.reasonForSale || '—' },
      { label: 'Timeline', value: lead.timeline || '—' },
      { label: 'Submitted', value: submittedAt },
    ]

    const tableRows = rows
      .map(
        r => `
      <tr>
        <td style="padding:8px 12px;font-size:14px;color:#666;font-weight:bold;white-space:nowrap;border-bottom:1px solid #f0f0f0;">${r.label}</td>
        <td style="padding:8px 12px;font-size:14px;border-bottom:1px solid #f0f0f0;">${r.value}</td>
      </tr>`,
      )
      .join('')

    const html = emailWrapper(`
      <p style="margin:0 0 16px;font-size:16px;">Hi ${studentName},</p>
      <p style="margin:0 0 16px;font-size:16px;">You have a new lead. Here are the details:</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
        ${tableRows}
      </table>
      <p style="margin:0 0 16px;font-size:16px;font-weight:bold;">
        Speed of response matters. Please contact this seller as soon as possible.
      </p>
      <p style="margin:0 0 16px;font-size:16px;">
        Reply to this email or call
        <a href="tel:${lead.phone}" style="color:${GREEN};text-decoration:none;font-weight:bold;">${lead.phone}</a> now.
      </p>
    `)

    const subject = `🏠 New lead: ${lead.postcode} — ${lead.reasonForSale || 'Property enquiry'}`

    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: studentEmail,
      subject,
      html,
    })

    if (error) {
      console.error('Student lead alert email failed:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Student lead alert email error:', message)
    return { success: false, error: message }
  }
}

// ── Template 3: Admin Alert ──

export async function sendAdminLeadAlert(
  lead: LeadDetails,
  studentName?: string,
): Promise<EmailResult> {
  try {
    const assignedTo = studentName
      ? studentName
      : '⚠️ NOT ASSIGNED — no routing rule matched'

    const source = lead.sourceSubdomainSlug || 'main site'
    const adminLink = `${BASE_URL}/admin/leads/${lead.id}`

    const html = emailWrapper(`
      <p style="margin:0 0 16px;font-size:16px;font-weight:bold;">New Lead Submitted</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        <tr><td style="padding:6px 0;font-size:14px;color:#666;">Name:</td><td style="padding:6px 0;font-size:14px;">${lead.fullName}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#666;">Phone:</td><td style="padding:6px 0;font-size:14px;"><a href="tel:${lead.phone}" style="color:${GREEN};text-decoration:none;">${lead.phone}</a></td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#666;">Postcode:</td><td style="padding:6px 0;font-size:14px;">${lead.postcode}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#666;">Approx value:</td><td style="padding:6px 0;font-size:14px;">£${lead.approxValue}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#666;">Reason:</td><td style="padding:6px 0;font-size:14px;">${lead.reasonForSale || '—'}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#666;">Timeline:</td><td style="padding:6px 0;font-size:14px;">${lead.timeline || '—'}</td></tr>
      </table>
      <p style="margin:0 0 8px;font-size:14px;"><strong>Assigned to:</strong> ${assignedTo}</p>
      <p style="margin:0 0 8px;font-size:14px;"><strong>Capture mode:</strong> ${lead.captureMode}</p>
      <p style="margin:0 0 20px;font-size:14px;"><strong>Source:</strong> ${source}</p>
      <p style="margin:0;">
        <a href="${adminLink}" style="display:inline-block;padding:10px 24px;background-color:${GREEN};color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:bold;">
          View Lead in Admin
        </a>
      </p>
    `)

    const subject = `New lead: ${lead.postcode} → ${studentName || 'Unassigned'}`

    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
    })

    if (error) {
      console.error('Admin lead alert email failed:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Admin lead alert email error:', message)
    return { success: false, error: message }
  }
}

// ── Template 4: Unrouted Lead Warning ──

export async function sendUnroutedLeadAlert(
  lead: LeadDetails,
): Promise<EmailResult> {
  try {
    const adminLink = `${BASE_URL}/admin/leads/${lead.id}`

    const html = emailWrapper(`
      <p style="margin:0 0 16px;font-size:16px;font-weight:bold;color:#dc2626;">
        ⚠️ Unrouted Lead — Manual Assignment Needed
      </p>
      <p style="margin:0 0 16px;font-size:16px;">
        A lead has been submitted but no routing rule matched.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        <tr><td style="padding:6px 0;font-size:14px;color:#666;">Name:</td><td style="padding:6px 0;font-size:14px;">${lead.fullName}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#666;">Phone:</td><td style="padding:6px 0;font-size:14px;"><a href="tel:${lead.phone}" style="color:${GREEN};text-decoration:none;">${lead.phone}</a></td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#666;">Postcode:</td><td style="padding:6px 0;font-size:14px;">${lead.postcode}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#666;">Approx value:</td><td style="padding:6px 0;font-size:14px;">£${lead.approxValue}</td></tr>
      </table>
      <p style="margin:0 0 20px;font-size:16px;">
        Please assign this lead manually in the admin panel.
      </p>
      <p style="margin:0;">
        <a href="${adminLink}" style="display:inline-block;padding:10px 24px;background-color:${GREEN};color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:bold;">
          Assign Lead Now
        </a>
      </p>
    `)

    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `⚠️ Unrouted lead: ${lead.postcode} — manual assignment needed`,
      html,
    })

    if (error) {
      console.error('Unrouted lead alert email failed:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Unrouted lead alert email error:', message)
    return { success: false, error: message }
  }
}
