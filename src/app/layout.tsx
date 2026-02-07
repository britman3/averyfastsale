import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'A Very Fast Sale | Sell Your House Fast for Cash',
  description:
    'Get a fair cash offer for your property in as little as 48 hours. No fees, no chains, no hassle. We buy houses in any condition across England and Wales.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Source+Serif+4:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-warm-white text-ink antialiased">
        {children}
      </body>
    </html>
  )
}
