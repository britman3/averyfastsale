import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'A Very Fast Sale',
  description: 'Sell your property quickly with A Very Fast Sale',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
