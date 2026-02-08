'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useStudent } from '@/lib/student-context'

export default function StudentNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const student = useStudent()

  return (
    <nav className="sticky top-0 z-50 border-b border-border-grey bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-heading text-xl font-extrabold text-navy">
          {student.displayName}
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/about" className="text-sm font-medium text-navy hover:text-green">
            About
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium text-navy hover:text-green">
            How It Works
          </Link>
          <Link href="/contact" className="text-sm font-medium text-navy hover:text-green">
            Contact
          </Link>
          <Link
            href="/contact"
            className="rounded-[12px] bg-green px-6 py-2.5 font-heading text-sm font-bold text-white hover:bg-green-hover"
          >
            Get Offer
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Backed by bar */}
      <div className="border-t border-border-grey bg-warm-white px-4 py-1.5 text-center text-xs text-ink/60">
        Backed by{' '}
        <span className="font-semibold text-navy">A Very Fast Sale</span>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border-grey bg-white px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-3">
            <Link href="/about" className="text-sm font-medium text-navy" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-navy" onClick={() => setMobileOpen(false)}>
              How It Works
            </Link>
            <Link href="/contact" className="text-sm font-medium text-navy" onClick={() => setMobileOpen(false)}>
              Contact
            </Link>
            <Link
              href="/contact"
              className="mt-2 rounded-[12px] bg-green px-6 py-2.5 text-center font-heading text-sm font-bold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Get Offer
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
