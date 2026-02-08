import { notFound, redirect } from 'next/navigation'
import { resolveSubdomain } from '@/lib/subdomain'
import { StudentProvider, type StudentData } from '@/lib/student-context'
import StudentNavbar from '@/components/layout/StudentNavbar'
import Footer from '@/components/layout/Footer'

export default async function StudentLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const resolution = await resolveSubdomain(slug)

  if (resolution.type === 'reserved') {
    redirect('/')
  }

  if (resolution.type === 'location') {
    redirect('/')
  }

  if (resolution.type === 'unknown') {
    notFound()
  }

  const { student } = resolution

  const studentData: StudentData = {
    id: student.id,
    slug: student.slug,
    displayName: student.displayName,
    phone: student.phone,
    email: student.email,
    whatsappNumber: student.whatsappNumber,
    headshotUrl: student.headshotUrl,
    bio: student.bio,
    serviceAreas: student.serviceAreas.map((sa) => ({
      id: sa.id,
      areaType: sa.areaType,
      areaValue: sa.areaValue,
      priority: sa.priority,
    })),
  }

  return (
    <StudentProvider student={studentData}>
      <StudentNavbar />
      <main>{children}</main>
      <Footer />
    </StudentProvider>
  )
}
