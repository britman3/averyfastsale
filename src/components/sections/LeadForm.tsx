'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { getUTMParams, getReferrerUrl, type UTMData } from '@/lib/utm'
import type { LeadFormProps, LeadApiResponse } from '@/types'

const REASON_OPTIONS = [
  { value: 'Need a quick sale', label: 'Need a quick sale' },
  { value: 'Probate / Inherited', label: 'Probate / Inherited' },
  { value: 'Divorce / Separation', label: 'Divorce / Separation' },
  { value: 'Mortgage Arrears', label: 'Mortgage Arrears' },
  { value: 'Tenant Issues', label: 'Tenant Issues' },
  { value: 'Relocating', label: 'Relocating' },
  { value: 'Downsizing', label: 'Downsizing' },
  { value: 'Other', label: 'Other' },
]

const TIMELINE_OPTIONS = [
  { value: 'ASAP', label: 'ASAP' },
  { value: 'Within 4 weeks', label: 'Within 4 weeks' },
  { value: '4-8 weeks', label: '4–8 weeks' },
  { value: 'Just exploring', label: 'Just exploring' },
]

interface FormErrors {
  [key: string]: string
}

export default function LeadForm({
  captureMode = 'CENTRAL',
  studentId,
  studentName,
  compact = false,
}: LeadFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')
  const [submittedName, setSubmittedName] = useState('')
  const [submittedPostcode, setSubmittedPostcode] = useState('')

  // Form state
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [townCity, setTownCity] = useState('')
  const [postcode, setPostcode] = useState('')
  const [approxValue, setApproxValue] = useState('')
  const [reasonForSale, setReasonForSale] = useState('')
  const [timeline, setTimeline] = useState('')
  const [consentMarketing, setConsentMarketing] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  // Hidden UTM fields
  const [utmParams, setUtmParams] = useState<UTMData>({
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
  })
  const [referrerUrl, setReferrerUrl] = useState('')

  // Populate UTM params and referrer on mount
  useEffect(() => {
    setUtmParams(getUTMParams())
    setReferrerUrl(getReferrerUrl())
  }, [])

  // Pre-fill fields from URL params (for compact form redirect)
  useEffect(() => {
    const name = searchParams.get('fullName')
    const ph = searchParams.get('phone')
    const pc = searchParams.get('postcode')
    if (name) setFullName(name)
    if (ph) setPhone(ph)
    if (pc) setPostcode(pc)
  }, [searchParams])

  function validateCompact(): boolean {
    const newErrors: FormErrors = {}
    if (fullName.trim().length < 2) newErrors.fullName = 'Please enter your name'
    if (!/^(\+44|0)\d{9,10}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid UK phone number'
    }
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(postcode.trim())) {
      newErrors.postcode = 'Please enter a valid UK postcode'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function validateFull(): boolean {
    const newErrors: FormErrors = {}
    if (fullName.trim().length < 2) newErrors.fullName = 'Please enter your name'
    if (!/^(\+44|0)\d{9,10}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid UK phone number'
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (addressLine1.trim().length < 3) newErrors.addressLine1 = 'Please enter your address'
    if (townCity.trim().length < 2) newErrors.townCity = 'Please enter your town or city'
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(postcode.trim())) {
      newErrors.postcode = 'Please enter a valid UK postcode'
    }
    if (!approxValue.trim()) newErrors.approxValue = 'Please enter an approximate value'
    if (!reasonForSale) newErrors.reasonForSale = 'Please select a reason'
    if (!timeline) newErrors.timeline = 'Please select a timeline'
    if (!consentMarketing) newErrors.consentMarketing = 'You must agree to be contacted'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleCompactSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateCompact()) return

    // Redirect to /get-offer with pre-filled params
    const params = new URLSearchParams({
      fullName: fullName.trim(),
      phone: phone.replace(/\s/g, ''),
      postcode: postcode.trim(),
    })
    router.push(`/get-offer?${params.toString()}`)
  }

  async function handleFullSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validateFull()) return

    setLoading(true)
    setServerError('')

    try {
      const payload = {
        fullName: fullName.trim(),
        phone: phone.replace(/\s/g, ''),
        email: email.trim() || '',
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || '',
        townCity: townCity.trim(),
        postcode: postcode.trim(),
        approxValue: approxValue.trim(),
        reasonForSale,
        timeline,
        consentMarketing: true,
        honeypot,
        ...utmParams,
        referrerUrl,
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data: LeadApiResponse = await res.json()

      if (res.status === 429) {
        setServerError('Please wait a moment before submitting again.')
        return
      }

      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setServerError(data.message || 'Something went wrong. Please try again or call us on 0800 XXX XXXX.')
        }
        return
      }

      setSubmittedName(fullName.trim())
      setSubmittedPostcode(postcode.trim().toUpperCase())
      setSubmitted(true)
    } catch {
      setServerError('Something went wrong. Please try again or call us on 0800 XXX XXXX.')
    } finally {
      setLoading(false)
    }
  }

  // Thank you state
  if (submitted) {
    const thankYouName = studentName || 'a local property specialist'
    return (
      <Card variant="form" className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green/10">
          <svg className="h-8 w-8 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 font-heading text-2xl font-bold text-navy">
          Thanks, {submittedName}!
        </h3>
        <p className="mb-4 text-ink">
          We&apos;ve received your details for {submittedPostcode}.{' '}
          {studentName
            ? `${studentName} will be in touch shortly.`
            : 'A local property specialist will be in touch shortly.'}
        </p>
        <p className="text-sm text-ink/70">
          In the meantime, find out{' '}
          <a href="/how-it-works" className="text-green underline hover:text-green-hover">
            how it works
          </a>
          .
        </p>
      </Card>
    )
  }

  // Compact form (hero)
  if (compact) {
    return (
      <Card variant="form">
        <form onSubmit={handleCompactSubmit} noValidate>
          <div className="space-y-4">
            <Input
              name="fullName"
              label="Full Name"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              required
            />
            <Input
              name="phone"
              label="Phone"
              type="tel"
              placeholder="07XXX XXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              required
            />
            <Input
              name="postcode"
              label="Postcode"
              placeholder="e.g. B1 1AA"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              error={errors.postcode}
              required
            />

            {/* Honeypot */}
            <div className="honeypot-field" aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Get My Free Cash Offer
            </Button>
          </div>
          <p className="mt-3 text-center text-sm text-ink/60">
            Or{' '}
            <a href="/get-offer" className="text-green underline hover:text-green-hover">
              tell us more for a faster response &rarr;
            </a>
          </p>
        </form>
      </Card>
    )
  }

  // Full form
  return (
    <Card variant="form">
      <form onSubmit={handleFullSubmit} noValidate>
        <div className="space-y-4">
          <Input
            name="fullName"
            label="Full Name"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="phone"
              label="Phone"
              type="tel"
              placeholder="07XXX XXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              required
            />
            <Input
              name="email"
              label="Email (optional)"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
          </div>

          <Input
            name="addressLine1"
            label="Property Address Line 1"
            placeholder="123 High Street"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            error={errors.addressLine1}
            required
          />
          <Input
            name="addressLine2"
            label="Address Line 2 (optional)"
            placeholder="Flat 2, etc."
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="townCity"
              label="Town / City"
              placeholder="Birmingham"
              value={townCity}
              onChange={(e) => setTownCity(e.target.value)}
              error={errors.townCity}
              required
            />
            <Input
              name="postcode"
              label="Postcode"
              placeholder="e.g. B1 1AA"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              error={errors.postcode}
              required
            />
          </div>

          <Input
            name="approxValue"
            label="Approx. Property Value (£)"
            placeholder="e.g. 150000"
            value={approxValue}
            onChange={(e) => setApproxValue(e.target.value)}
            error={errors.approxValue}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              name="reasonForSale"
              label="Reason for Sale"
              placeholder="Select a reason…"
              options={REASON_OPTIONS}
              value={reasonForSale}
              onChange={(e) => setReasonForSale(e.target.value)}
              error={errors.reasonForSale}
              required
            />
            <Select
              name="timeline"
              label="Timeline"
              placeholder="How soon do you want to sell?"
              options={TIMELINE_OPTIONS}
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              error={errors.timeline}
              required
            />
          </div>

          {/* Consent checkbox */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="consentMarketing"
                checked={consentMarketing}
                onChange={(e) => setConsentMarketing(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-border-grey text-green focus:ring-green"
              />
              <span className="text-sm text-ink">
                I agree to be contacted about selling my property. See our{' '}
                <a href="/privacy" className="text-green underline hover:text-green-hover">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            {errors.consentMarketing && (
              <p className="mt-1 text-sm text-error">{errors.consentMarketing}</p>
            )}
          </div>

          {/* Honeypot - visually hidden */}
          <div className="honeypot-field" aria-hidden="true">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {serverError && (
            <div className="rounded-lg border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
              {serverError}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Get My Free Cash Offer
          </Button>

          <p className="text-center text-xs text-ink/50">
            By submitting this form you agree to be contacted by phone and email about selling your property.
            Your data will be processed in accordance with our{' '}
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </form>
    </Card>
  )
}
