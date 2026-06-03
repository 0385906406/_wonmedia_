import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export interface AuthUser {
  id: string
  name?: string
  email?: string
  role: string
  tokenVersion?: number
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)
    const jwtUser = payload as unknown as AuthUser

    // Verify tokenVersion với DB để detect logout / token bị revoke
    if (jwtUser.id) {
      await connectDB()
      const dbUser = await User.findById(jwtUser.id).select('tokenVersion').lean() as { tokenVersion?: number } | null
      if (!dbUser) return null
      const dbVersion = dbUser.tokenVersion ?? 0
      const jwtVersion = jwtUser.tokenVersion ?? 0
      if (jwtVersion !== dbVersion) return null
    }

    return jwtUser
  } catch {
    return null
  }
}

export function requireAdmin(user: AuthUser | null): NextResponse | null {
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['admin', 'superadmin'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}
