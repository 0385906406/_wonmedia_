import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Comment from '@/models/Comment'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// GET /api/admin/comments?page=1&postSlug=xxx&search=xxx
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  await connectDB()
  const { searchParams } = req.nextUrl
  const page     = Math.min(1000, Math.max(1, parseInt(searchParams.get('page') ?? '1')))
  const limit    = 20
  const postSlug = searchParams.get('postSlug') || ''
  const search   = searchParams.get('search') || ''

  const filter: Record<string, unknown> = {}
  if (postSlug) filter.postSlug = postSlug
  if (search)   filter.content  = { $regex: escapeRegex(search), $options: 'i' }

  const [data, total] = await Promise.all([
    Comment.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Comment.countDocuments(filter),
  ])

  return NextResponse.json({ data, total, page, pages: Math.ceil(total / limit) })
}

// DELETE /api/admin/comments  body: { id }
export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    const body = await req.json()
    const { id } = body
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })
    }
    await connectDB()
    const deleted = await Comment.findByIdAndDelete(id)
    // BUG-032: trả 404 nếu không tìm thấy
    if (!deleted) return NextResponse.json({ error: 'Không tìm thấy bình luận' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
