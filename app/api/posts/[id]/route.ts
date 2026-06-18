import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'
import Comment from '@/models/Comment'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

const LOCALES = ['vi', 'en', 'ko', 'ja', 'zh']

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req)
  const isAdmin = user && ['admin', 'superadmin'].includes(user.role)

  try {
    await connectDB()
    const { id } = await params
    const isObjectId = /^[a-f\d]{24}$/i.test(id)
    const post = isObjectId
      ? await Post.findById(id).lean()
      : await Post.findOne({ slug: id }).lean()
    if (!post) return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 })
    // Public không thấy bài inactive
    if (!isAdmin && !(post as { active?: boolean }).active) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: post })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    if (body.slug) {
      const exists = await Post.findOne({ slug: body.slug, _id: { $ne: id } })
      if (exists) return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 400 })
    }

    // Allowlist fields — không dùng strict:false để tránh field injection
    const ALLOWED: string[] = [
      'slug', 'type', 'thumbnail', 'date', 'showOnHomepage', 'active',
      'category', 'title', 'excerpt', 'content', 'categoryId',
      'seoTitle', 'seoDescription', 'seoKeywords', 'ogImage', 'thumbnailPosition',
      'urgent', 'deadline', 'jobType', 'location', 'salary',
    ]
    const update: Record<string, unknown> = {}
    for (const key of ALLOWED) {
      if (key in body) update[key] = body[key]
    }

    const post = await Post.findByIdAndUpdate(id, { $set: update }, { new: true })
    if (!post) return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 })

    const section = post.type === 'tuyen-dung' ? 'tuyen-dung' : 'tin-tuc'
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}/${section}/${post.slug}`)
      revalidatePath(`/${locale}/${section}`)
    }

    return NextResponse.json({ success: true, data: post })
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
    // Xoá tất cả comment liên quan
    await Comment.deleteMany({ postId: id })
    await Post.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
