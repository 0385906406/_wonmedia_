import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'
import { sendContactNotification } from '@/lib/email'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'
import { checkRateLimit } from '@/lib/rate-limiter'

// GET — admin only
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const list = await ContactSubmission.find().sort({ createdAt: -1 }).limit(100).lean()
    const unread = await ContactSubmission.countDocuments({ read: false })
    return NextResponse.json({ success: true, data: list, unread })
  } catch (e) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

// POST — public (user submit form), with rate limiting
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (!checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Gửi quá nhiều lần. Vui lòng thử lại sau 1 giờ.' }, { status: 429 })
  }

  try {
    await connectDB()
    const { name, email, subject, message } = await req.json()
    if (!name || !email || !subject || !message)
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin.' }, { status: 400 })
    // BUG-026: giới hạn độ dài để tránh storage DoS
    if (typeof name !== 'string' || name.trim().length > 200)
      return NextResponse.json({ error: 'Tên không hợp lệ (tối đa 200 ký tự).' }, { status: 400 })
    if (typeof subject !== 'string' || subject.trim().length > 500)
      return NextResponse.json({ error: 'Chủ đề không hợp lệ (tối đa 500 ký tự).' }, { status: 400 })
    if (typeof message !== 'string' || message.trim().length > 10000)
      return NextResponse.json({ error: 'Nội dung quá dài (tối đa 10,000 ký tự).' }, { status: 400 })
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRx.test(email))
      return NextResponse.json({ error: 'Email không hợp lệ.' }, { status: 400 })
    await ContactSubmission.create({ name, email, subject, message })

    sendContactNotification({ name, email, subject, message }).catch((err) => {
      console.error('[contact] Email notification error:', err)
    })

    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

// PUT — admin only (mark read)
export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const { id, read } = await req.json()
    await ContactSubmission.findByIdAndUpdate(id, { read })
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const { id } = await req.json()
    await ContactSubmission.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
