import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'avfs_admin_token'

async function verifyTokenEdge(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'averyfastsale.com'

  // ── Subdomain detection ──
  // "john-smith.averyfastsale.com" → "john-smith"
  // "averyfastsale.com" → null
  // "www.averyfastsale.com" → null (treat www as main)
  // "localhost:3098" → null (dev mode)
  let subdomain: string | null = null

  if (host.includes(domain) && host !== domain && !host.startsWith('www.')) {
    subdomain = host.replace(`.${domain}`, '').split(':')[0]
  }

  // For local development, support ?subdomain=john-smith query param
  if (!subdomain && process.env.NODE_ENV === 'development') {
    subdomain = request.nextUrl.searchParams.get('subdomain')
  }

  if (subdomain) {
    // Don't intercept admin or API routes even on subdomains
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return NextResponse.next()
    }

    // Rewrite to student site route group
    const url = request.nextUrl.clone()
    url.pathname = `/s/${subdomain}${pathname}`
    const response = NextResponse.rewrite(url)
    response.headers.set('x-subdomain', subdomain)
    return response
  }

  // ── Admin auth protection (main site only) ──

  // Skip login page and auth endpoint
  if (pathname === '/admin/login' || pathname === '/api/admin/auth') {
    return NextResponse.next()
  }

  // Protect admin routes and admin API routes
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')

  if (isAdminRoute || isAdminApi) {
    const token = request.cookies.get(COOKIE_NAME)?.value

    if (!token) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const valid = await verifyTokenEdge(token)
    if (!valid) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico|uploads|robots.txt).*)',
  ],
}
