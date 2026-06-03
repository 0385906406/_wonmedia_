import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Category from '@/models/Category'
import Post from '@/models/Post'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

const ALLOWED_FOR_TYPES = ['blog', 'tuyen-dung', 'all'] as const

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const { id } = await params
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

    const body = await req.json()

    // Allowlist fields — tránh mass assignment (slug không được phép thay đổi)
    const update: Record<string, unknown> = {}
    if (body.name)   update.name   = { vi: body.name?.vi ?? '', en: body.name?.en ?? '', ko: body.name?.ko ?? '', ja: body.name?.ja ?? '', zh: body.name?.zh ?? '' }
    if (ALLOWED_FOR_TYPES.includes(body.forType)) update.forType = body.forType
    if (typeof body.active === 'boolean') update.active = body.active
    if (typeof body.order  === 'number')  update.order  = body.order

    const cat = await Category.findByIdAndUpdate(id, { $set: update }, { new: true })
    if (!cat) return NextResponse.json({ error: 'Không tìm thấy danh mục' }, { status: 404 })
    return NextResponse.json({ success: true, data: cat })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const { id } = await params
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

    // Kiểm tra category tồn tại trước khi cascade
    const cat = await Category.findById(id)
    if (!cat) return NextResponse.json({ error: 'Không tìm thấy danh mục' }, { status: 404 })

    await Post.updateMany(
      { categoryId: id },
      { $set: { categoryId: '', category: { vi: '', en: '', ko: '', ja: '', zh: '' } } }
    )
    await Category.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
