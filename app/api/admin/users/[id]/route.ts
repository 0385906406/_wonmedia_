import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { getAuthUser } from '@/lib/auth-api'

// PUT /api/admin/users/[id] — update role or reset password (superadmin only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const caller = await getAuthUser(req)
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (caller.role !== 'superadmin') return NextResponse.json({ error: 'Chỉ superadmin mới được sửa user' }, { status: 403 })

  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const update: Record<string, unknown> = {}

    if (body.role !== undefined) {
      if (!['admin', 'user'].includes(body.role)) {
        return NextResponse.json({ error: 'Role không hợp lệ' }, { status: 400 })
      }
      // BUG-042: không cho demote superadmin
      const target = await User.findById(id).select('role').lean() as { role?: string } | null
      if (target?.role === 'superadmin') {
        return NextResponse.json({ error: 'Không thể thay đổi role của superadmin' }, { status: 400 })
      }
      update.role = body.role
    }
    if (body.name !== undefined) {
      if (!body.name.trim()) return NextResponse.json({ error: 'Tên không được để trống' }, { status: 400 })
      if (body.name.trim().length > 100) return NextResponse.json({ error: 'Tên không được vượt quá 100 ký tự' }, { status: 400 })
      update.name = body.name.trim()
    }
    if (body.password !== undefined) {
      if (body.password.length < 8 || body.password.length > 72) {
        return NextResponse.json({ error: 'Mật khẩu phải từ 8 đến 72 ký tự' }, { status: 400 })
      }
      update.password = await bcrypt.hash(body.password, 12)
    }

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: 'Không có thay đổi nào' }, { status: 400 })
    }

    const updated = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).select('-password')
    if (!updated) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })
    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE — dùng findOneAndDelete atomic để tránh race condition
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const caller = await getAuthUser(req)
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (caller.role !== 'superadmin') return NextResponse.json({ error: 'Chỉ superadmin mới được xoá user' }, { status: 403 })

  try {
    await connectDB()
    const { id } = await params

    if (caller.id === id) return NextResponse.json({ error: 'Không thể xoá tài khoản đang đăng nhập' }, { status: 400 })

    // Atomic: xoá chỉ khi role KHÔNG phải superadmin — loại bỏ race condition
    const deleted = await User.findOneAndDelete({ _id: id, role: { $ne: 'superadmin' } })
    if (!deleted) {
      const exists = await User.findById(id)
      if (!exists) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })
      return NextResponse.json({ error: 'Không thể xoá tài khoản superadmin' }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
