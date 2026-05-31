import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'

export async function GET() {
  try {
    await connectDB()
    const list = await ContactSubmission.find().sort({ createdAt: -1 }).limit(100).lean()
    const unread = await ContactSubmission.countDocuments({ read: false })
    return NextResponse.json({ success: true, data: list, unread })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, email, subject, message } = await req.json()
    if (!name || !email || !subject || !message)
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin.' }, { status: 400 })
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRx.test(email))
      return NextResponse.json({ error: 'Email không hợp lệ.' }, { status: 400 })
    await ContactSubmission.create({ name, email, subject, message })
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const { id, read } = await req.json()
    await ContactSubmission.findByIdAndUpdate(id, { read })
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB()
    const { id } = await req.json()
    await ContactSubmission.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
