import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const q    = searchParams.get('q') ?? ''
    const type = searchParams.get('type') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = 20

    const filter: Record<string, unknown> = {}
    if (type) filter.type = type
    if (q) filter['$or'] = [
      { 'title.vi': { $regex: q, $options: 'i' } },
      { 'title.en': { $regex: q, $options: 'i' } },
      { slug:       { $regex: q, $options: 'i' } },
    ]

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
  try {
    await connectDB()
    const body = await req.json()
    if (!body.slug) return NextResponse.json({ error: 'Slug là bắt buộc' }, { status: 400 })
    const exists = await Post.findOne({ slug: body.slug })
    if (exists) return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 400 })
    const post = await Post.create(body)
    return NextResponse.json({ success: true, data: post })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
