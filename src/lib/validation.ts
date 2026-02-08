import { z } from 'zod/v4'

export const leadFormSchema = z.object({
  fullName: z.string().min(2, 'Please enter your name'),
  phone: z.string().regex(
    /^(\+44|0)\d{9,10}$/,
    'Please enter a valid UK phone number'
  ),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  addressLine1: z.string().min(3, 'Please enter your address'),
  addressLine2: z.string().optional().or(z.literal('')),
  townCity: z.string().min(2, 'Please enter your town or city'),
  postcode: z.string().regex(
    /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    'Please enter a valid UK postcode'
  ),
  approxValue: z.string().min(1, 'Please enter an approximate value'),
  reasonForSale: z.string().min(1, 'Please select a reason'),
  timeline: z.string().min(1, 'Please select a timeline'),
  consentMarketing: z.literal(true, {
    error: 'You must agree to be contacted',
  }),
  // Hidden fields
  honeypot: z.string().max(0).optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  referrerUrl: z.string().optional(),
  // Mode B fields (student direct capture)
  captureMode: z.enum(['CENTRAL', 'STUDENT_DIRECT']).optional(),
  studentId: z.string().optional(),
  sourceSubdomainSlug: z.string().optional(),
})

export type LeadFormData = z.infer<typeof leadFormSchema>

// Compact form schema for hero - only requires name, phone, postcode
export const compactLeadFormSchema = z.object({
  fullName: z.string().min(2, 'Please enter your name'),
  phone: z.string().regex(
    /^(\+44|0)\d{9,10}$/,
    'Please enter a valid UK phone number'
  ),
  postcode: z.string().regex(
    /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    'Please enter a valid UK postcode'
  ),
  honeypot: z.string().max(0).optional(),
})

export type CompactLeadFormData = z.infer<typeof compactLeadFormSchema>

/**
 * Normalise UK postcode to uppercase with correct spacing (e.g. "B1 1AA")
 */
export function normalisePostcode(postcode: string): string {
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase()
  // Inward code is always last 3 characters
  if (cleaned.length < 5) return cleaned
  const outward = cleaned.slice(0, -3)
  const inward = cleaned.slice(-3)
  return `${outward} ${inward}`
}

/**
 * Extract outward code from a UK postcode (the part before the space)
 */
export function extractOutwardCode(postcode: string): string {
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase()
  if (cleaned.length < 5) return cleaned
  return cleaned.slice(0, -3)
}

/**
 * Extract the district letter(s) from a UK postcode outward code
 * e.g. "B1" → "B", "SW1A" → "SW", "M60" → "M"
 */
export function extractDistrict(outwardCode: string): string {
  const match = outwardCode.match(/^[A-Z]+/)
  return match ? match[0] : outwardCode
}
