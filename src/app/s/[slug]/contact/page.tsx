import { Suspense } from 'react'
import type { Metadata } from 'next'
import { resolveSubdomain } from '@/lib/subdomain'
import StudentContactClient from './StudentContactClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const resolution = await resolveSubdomain(slug)
  if (resolution.type !== 'student') return {}

  const { student } = resolution
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'averyfastsale.com'

  return {
    title: `Contact ${student.displayName} | Get a Free Cash Offer`,
    description: `Contact ${student.displayName} for a free, no-obligation cash offer on your property. Call, WhatsApp, or fill in the form.`,
    alternates: {
      canonical: `https://${slug}.${domain}/contact`,
    },
  }
}

export default async function StudentContactPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const resolution = await resolveSubdomain(slug)
  if (resolution.type !== 'student') return null

  const { student } = resolution

  const studentData = {
    id: student.id,
    slug: student.slug,
    displayName: student.displayName,
    phone: student.phone,
    email: student.email,
    whatsappNumber: student.whatsappNumber,
  }

  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-warm-white" />}>
      <StudentContactClient student={studentData} />
    </Suspense>
  )
}
