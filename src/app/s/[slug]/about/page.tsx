import type { Metadata } from 'next'
import { resolveSubdomain } from '@/lib/subdomain'
import StudentAboutClient from './StudentAboutClient'

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
    title: `About ${student.displayName} | Local Property Specialist`,
    description: `Learn about ${student.displayName}, your local property specialist. ${student.bio || 'Fair cash offers with no fees, no chains, and no obligation.'}`,
    alternates: {
      canonical: `https://${slug}.${domain}/about`,
    },
  }
}

export default async function StudentAboutPage({
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
    headshotUrl: student.headshotUrl,
    bio: student.bio,
    serviceAreas: student.serviceAreas.map((sa) => ({
      areaType: sa.areaType,
      areaValue: sa.areaValue,
    })),
  }

  return <StudentAboutClient student={studentData} />
}
