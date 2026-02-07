import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const COOKIE_NAME = 'avfs_admin_token'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): object | null {
  try {
    return jwt.verify(token, JWT_SECRET) as object
  } catch {
    return null
  }
}

export async function getAuthFromCookies(): Promise<{ authenticated: boolean; role: string }> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return { authenticated: false, role: '' }
  }

  const payload = verifyToken(token)
  if (!payload) {
    return { authenticated: false, role: '' }
  }

  return { authenticated: true, role: 'admin' }
}

export { COOKIE_NAME }
