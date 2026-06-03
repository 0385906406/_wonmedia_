import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

const LOCALES = ['vi', 'en', 'ko', 'ja', 'zh']

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  const isAdmin = user && ['admin', 'superadmin'].includes(user.role)

  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const homepageOnly = searchParams.get('homepage') === '1'

    // BUG-013: public luôn thấy active=true; admin thấy tất cả
    const filter: Record<string, unknown> = isAdmin ? {} : { active: true }
    if (homepageOnly) { filter.showOnHomepage = true; filter.active = true }

    const posts = await Post.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: posts })
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
    const post = await Post.create(body)
    // BUG-021: revalidate cache sau khi tạo post qua endpoint này
    const section = post.type === 'tuyen-dung' ? 'tuyen-dung' : 'tin-tuc'
    for (const locale of LOCALES) {
      revalidatePath(`/${locale}/${section}`)
    }
    return NextResponse.json({ success: true, data: post })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
