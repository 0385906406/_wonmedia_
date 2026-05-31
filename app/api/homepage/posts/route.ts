import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const homepageOnly = searchParams.get('homepage') === '1'
    const filter = homepageOnly ? { showOnHomepage: true, active: true } : {}
    const posts = await Post.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: posts })
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
