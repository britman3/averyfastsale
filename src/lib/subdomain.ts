import { prisma } from '@/lib/db'
import type { Student, StudentServiceArea, Location } from '@prisma/client'

export type StudentWithAreas = Student & { serviceAreas: StudentServiceArea[] }

export type SubdomainResolution =
  | { type: 'student'; student: StudentWithAreas }
  | { type: 'location'; location: Location }
  | { type: 'reserved' }
  | { type: 'unknown' }

export async function resolveSubdomain(slug: string): Promise<SubdomainResolution> {
  // 1. Check reserved subdomains
  const reserved = await prisma.reservedSubdomain.findUnique({ where: { slug } })
  if (reserved) return { type: 'reserved' }

  // 2. Check students
  const student = await prisma.student.findUnique({
    where: { slug, isActive: true },
    include: { serviceAreas: true },
  })
  if (student) return { type: 'student', student }

  // 3. Check locations
  const location = await prisma.location.findUnique({
    where: { slug, isPublished: true },
  })
  if (location) return { type: 'location', location }

  return { type: 'unknown' }
}
