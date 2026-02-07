export type CaptureMode = 'CENTRAL' | 'STUDENT_DIRECT'

export interface LeadFormProps {
  captureMode?: CaptureMode
  studentId?: string
  studentName?: string
  sourceSubdomainSlug?: string
  compact?: boolean
}

export interface LeadApiResponse {
  success: boolean
  leadId?: string
  errors?: Record<string, string>
  message?: string
}

export interface UTMParams {
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
}
