import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Collection from '@/models/Collection'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const cols = await Collection.find().sort({ createdAt: 1 }).lean()
    return NextResponse.json({ success: true, data: cols })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const body = await req.json()
    const { name, slug, description, fields } = body
    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: 'Tên và slug là bắt buộc' }, { status: 400 })
    }
    const exists = await Collection.findOne({ slug })
    if (exists) return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 400 })

    // Allowlist fields
    const col = await Collection.create({
      name: name.trim(),
      slug: slug.trim(),
      description: typeof description === 'string' ? description : '',
      fields: Array.isArray(fields) ? fields : [],
    })
    return NextResponse.json({ success: true, data: col })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
