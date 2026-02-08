import { Suspense } from 'react'
import type { Metadata } from 'next'
import { resolveSubdomain } from '@/lib/subdomain'
import StudentHomepageClient from './StudentHomepageClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const resolution = await resolveSubdomain(slug)
  if (resolution.type !== 'student') return {}

  const { student } = resolution
  const primaryArea =
    student.serviceAreas.length > 0
      ? student.serviceAreas.sort((a, b) => a.priority - b.priority)[0].areaValue
      : 'Your Area'

  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'averyfastsale.com'

  return {
    title: `Sell Your House Fast in ${primaryArea} | ${student.displayName} — A Very Fast Sale`,
    description: `Get a fair cash offer from ${student.displayName}, your local property specialist in ${primaryArea}. No fees, no chains, no obligation.`,
    alternates: {
      canonical: `https://${slug}.${domain}`,
    },
  }
}

export default async function StudentHomepage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const resolution = await resolveSubdomain(slug)
  if (resolution.type !== 'student') return null

  const { student } = resolution
  const primaryArea =
    student.serviceAreas.length > 0
      ? student.serviceAreas.sort((a, b) => a.priority - b.priority)[0].areaValue
      : 'Your Area'

  const studentData = {
    id: student.id,
    slug: student.slug,
    displayName: student.displayName,
    phone: student.phone,
    headshotUrl: student.headshotUrl,
    primaryArea,
  }

  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-warm-white" />}>
      <StudentHomepageClient student={studentData} />
    </Suspense>
  )
}
