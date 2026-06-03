import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Category from '@/models/Category'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const ALLOWED_FOR_TYPES = ['blog', 'tuyen-dung', 'all'] as const

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = req.nextUrl
    const forType = searchParams.get('forType') || ''
    const filter: Record<string, unknown> = { active: true }
    if (forType && forType !== 'all') {
      filter.$or = [{ forType }, { forType: 'all' }]
    }
    const cats = await Category.find(filter).sort({ order: 1, createdAt: 1 }).lean()
    return NextResponse.json({ success: true, data: cats })
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
    if (!SLUG_RE.test(body.slug)) {
      return NextResponse.json({ error: 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang' }, { status: 400 })
    }
    if (!body.name?.vi?.trim()) return NextResponse.json({ error: 'Tên tiếng Việt là bắt buộc' }, { status: 400 })

    const exists = await Category.findOne({ slug: body.slug })
    if (exists) return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 400 })

    // Allowlist fields — tránh mass assignment
    const forType = ALLOWED_FOR_TYPES.includes(body.forType) ? body.forType : 'all'
    const cat = await Category.create({
      slug:    body.slug,
      name:    { vi: body.name?.vi ?? '', en: body.name?.en ?? '', ko: body.name?.ko ?? '', ja: body.name?.ja ?? '', zh: body.name?.zh ?? '' },
      forType,
      active:  typeof body.active === 'boolean' ? body.active : true,
      order:   typeof body.order  === 'number'  ? body.order  : 0,
    })
    return NextResponse.json({ success: true, data: cat }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
