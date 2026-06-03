import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { checkRateLimit } from '@/lib/rate-limiter'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-real-ip')
    ?? req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? 'unknown'
  if (!checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Quá nhiều lần đăng ký. Thử lại sau 1 giờ.' }, { status: 429 })
  }

  try {
    await connectDB()
    const { name, email, password } = await req.json()

    if (!name?.trim()) return NextResponse.json({ error: 'Tên không được để trống' }, { status: 400 })
    if (name.trim().length > 100) return NextResponse.json({ error: 'Tên tối đa 100 ký tự' }, { status: 400 })
    if (!email?.trim()) return NextResponse.json({ error: 'Email không được để trống' }, { status: 400 })
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
    if (!password || password.length < 8 || password.length > 72) {
      return NextResponse.json({ error: 'Mật khẩu phải từ 8 đến 72 ký tự' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const existing = await User.findOne({ email: email.toLowerCase() })

    // BUG-033: chạy bcrypt dù email đã tồn tại → response time đồng đều, chặn timing enumeration
    if (existing) {
      return NextResponse.json({ error: 'Không thể tạo tài khoản với thông tin này' }, { status: 400 })
    }

    await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashed })
    // BUG-014: không trả userId — không cần client biết
    return NextResponse.json({ message: 'Registered successfully' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
