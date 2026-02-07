'use client'

import { createContext, useContext } from 'react'

export interface StudentData {
  id: string
  slug: string
  displayName: string
  phone: string
  email: string
  whatsappNumber: string | null
  headshotUrl: string | null
  bio: string | null
  serviceAreas: {
    id: string
    areaType: string
    areaValue: string
    priority: number
  }[]
}

const StudentContext = createContext<StudentData | null>(null)

export function StudentProvider({
  student,
  children,
}: {
  student: StudentData
  children: React.ReactNode
}) {
  return (
    <StudentContext.Provider value={student}>{children}</StudentContext.Provider>
  )
}

export function useStudent(): StudentData {
  const ctx = useContext(StudentContext)
  if (!ctx) {
    throw new Error('useStudent must be used within a StudentProvider')
  }
  return ctx
}
