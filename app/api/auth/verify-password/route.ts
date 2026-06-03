import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'
import { checkRateLimit } from '@/lib/rate-limiter'

export async function POST(req: NextRequest) {
  // Phải đăng nhập và là admin
  const caller = await getAuthUser(req)
  const authErr = requireAdmin(caller)
  if (authErr) return authErr

  // Rate limit: 5 lần / 15 phút per user
  if (!checkRateLimit(`verify-pw:${caller!.id}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ success: false, error: 'Thử quá nhiều lần. Vui lòng đợi 15 phút.' }, { status: 429 })
  }

  try {
    await connectDB()
    const { password } = await req.json()
    if (!password) return NextResponse.json({ success: false, error: 'Thiếu mật khẩu' }, { status: 400 })

    // Verify đúng password của user đang đăng nhập (không phải admin bất kỳ)
    const user = await User.findById(caller!.id)
    if (!user) return NextResponse.json({ success: false, error: 'Không tìm thấy tài khoản' }, { status: 404 })

    const ok = await bcrypt.compare(password, user.password)
    // Không trả về thông tin phân biệt "user không tồn tại" vs "sai password"
    return NextResponse.json({ success: ok })
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
