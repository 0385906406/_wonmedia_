import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

// GET /api/admin/users/me — trả về info user từ DB (luôn fresh, không dùng JWT cũ)
export async function GET(req: NextRequest) {
  const token = await getAuthUser(req)
  const authErr = requireAdmin(token)
  if (authErr) return authErr

  try {
    await connectDB()
    const user = await User.findById(token!.id).select('-password').lean()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json({ id: user._id.toString(), name: user.name, email: user.email, role: user.role })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
