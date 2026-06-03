import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

// GET /api/admin/users — list all users
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: users })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

const ALLOWED_ROLES = ['admin', 'user'] as const
type AllowedRole = typeof ALLOWED_ROLES[number]

// POST /api/admin/users — create user (superadmin only)
export async function POST(req: NextRequest) {
  const caller = await getAuthUser(req)
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (caller.role !== 'superadmin') return NextResponse.json({ error: 'Chỉ superadmin mới được tạo user mới' }, { status: 403 })

  try {
    await connectDB()
    const { name, email, password, role } = await req.json()
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 })
    }
    if (name.trim().length > 100) {
      return NextResponse.json({ error: 'Tên không được vượt quá 100 ký tự' }, { status: 400 })
    }
    if (password.length < 8 || password.length > 72) {
      return NextResponse.json({ error: 'Mật khẩu phải từ 8 đến 72 ký tự' }, { status: 400 })
    }
    // Allowlist tường minh — chỉ chấp nhận 'admin' hoặc 'user'
    const assignedRole: AllowedRole = ALLOWED_ROLES.includes(role) ? role : 'user'

    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)
    const newUser = await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashed, role: assignedRole })
    const { password: _, ...safe } = newUser.toObject()
    return NextResponse.json({ success: true, data: safe }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
