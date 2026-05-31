import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const post = await Post.findById(id).lean()
    if (!post) return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 })
    return NextResponse.json({ success: true, data: post })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()

    if (body.slug) {
      const exists = await Post.findOne({ slug: body.slug, _id: { $ne: id } })
      if (exists) return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 400 })
    }

    const post = await Post.findByIdAndUpdate(id, { $set: body }, { new: true })
    if (!post) return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 })
    return NextResponse.json({ success: true, data: post })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    await Post.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
