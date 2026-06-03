import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { getAuthUser } from '@/lib/auth-api'

export async function POST(req: NextRequest) {
  // Tăng tokenVersion để vô hiệu hoá token hiện tại (JWT revocation)
  try {
    const user = await getAuthUser(req)
    if (user?.id) {
      await connectDB()
      await User.findByIdAndUpdate(user.id, { $inc: { tokenVersion: 1 } })
    }
  } catch {
    // Không block logout dù DB fail
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return res
}
