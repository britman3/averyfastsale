'use client'

export interface UTMData {
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
}

export function getUTMParams(): UTMData {
  if (typeof window === 'undefined') return { utmSource: '', utmMedium: '', utmCampaign: '', utmTerm: '', utmContent: '' }
  const params = new URLSearchParams(window.location.search)
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmTerm: params.get('utm_term') || '',
    utmContent: params.get('utm_content') || '',
  }
}

export function getReferrerUrl(): string {
  if (typeof window === 'undefined') return ''
  return document.referrer || ''
}
