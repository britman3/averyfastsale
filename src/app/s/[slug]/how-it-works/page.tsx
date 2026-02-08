import type { Metadata } from 'next'
import { resolveSubdomain } from '@/lib/subdomain'
import StudentHowItWorksClient from './StudentHowItWorksClient'

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
    title: `How It Works | ${student.displayName} — A Very Fast Sale`,
    description: `Find out how ${student.displayName} can help you sell your house fast. Simple 3-step process: tell us about your property, receive a cash offer, complete on your timeline.`,
    alternates: {
      canonical: `https://${slug}.${domain}/how-it-works`,
    },
  }
}

export default async function StudentHowItWorksPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const resolution = await resolveSubdomain(slug)
  if (resolution.type !== 'student') return null

  return <StudentHowItWorksClient studentName={resolution.student.displayName} />
}
