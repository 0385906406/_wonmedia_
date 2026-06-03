import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

const LOCALES = ['vi', 'en', 'ko', 'ja', 'zh']

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  const isAdmin = user && ['admin', 'superadmin'].includes(user.role)

  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const q    = searchParams.get('q') ?? ''
    const type = searchParams.get('type') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1)
    const limit = 20

    // Public callers chỉ thấy bài active; admin thấy tất cả
    const filter: Record<string, unknown> = isAdmin ? {} : { active: true }

    if (type && ['blog', 'tuyen-dung'].includes(type)) filter.type = type
    if (q) {
      const safe = escapeRegex(q)
      filter['$or'] = [
        { 'title.vi': { $regex: safe, $options: 'i' } },
        { 'title.en': { $regex: safe, $options: 'i' } },
        { slug:       { $regex: safe, $options: 'i' } },
      ]
    }

    const [posts, total] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Post.countDocuments(filter),
    ])

    return NextResponse.json({ success: true, data: posts, total, page, pages: Math.ceil(total / limit) })
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
    if (!body.slug) return NextResponse.json({ error: 'Slug là bắt buộc' }, { status: 400 })
    const exists = await Post.findOne({ slug: body.slug })
    if (exists) return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 400 })

    // Allowlist fields — tránh mass assignment
    const {
      slug, type, thumbnail, date, showOnHomepage, active,
      category, title, excerpt, content, categoryId,
      seoTitle, seoDescription, seoKeywords, ogImage, thumbnailPosition,
      urgent, deadline, jobType, location, salary,
    } = body
    const post = await Post.create({
      slug, type, thumbnail, date, showOnHomepage, active,
      category, title, excerpt, content, categoryId,
      seoTitle, seoDescription, seoKeywords, ogImage, thumbnailPosition,
      urgent, deadline, jobType, location, salary,
    })

    const section = post.type === 'tuyen-dung' ? 'tuyen-dung' : 'tin-tuc'
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}/${section}`)
    }
    return NextResponse.json({ success: true, data: post })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
