import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Comment from '@/models/Comment'
import Post from '@/models/Post'
import { getAuthUser } from '@/lib/auth-api'
import { eventBus } from '@/lib/event-bus'

// GET /api/posts/[id]/comments
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connectDB()
  const comments = await Comment.find({ postId: id, active: true })
    .sort({ createdAt: 1 })
    .lean()
  return NextResponse.json({ data: comments })
}

// POST /api/posts/[id]/comments
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Dùng shared getAuthUser — bao gồm tokenVersion check
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { content, parentId } = await req.json()

  if (!content?.trim() || content.trim().length > 2000) {
    return NextResponse.json({ error: 'Nội dung không hợp lệ' }, { status: 400 })
  }

  await connectDB()
  const post = await Post.findById(id).lean() as { slug: string; active?: boolean } | null
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  // BUG-015: không cho comment trên bài inactive
  if (!post.active) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // BUG-030: validate parentId tồn tại và thuộc đúng post
  if (parentId) {
    const parent = await Comment.findOne({ _id: parentId, postId: id, active: true }).lean()
    if (!parent) return NextResponse.json({ error: 'Comment cha không tồn tại' }, { status: 400 })
  }

  const comment = await Comment.create({
    postId:    id,
    postSlug:  post.slug,
    userId:    user.id,
    userName:  user.name ?? 'Người dùng',
    userEmail: user.email ?? '',
    content:   content.trim(),
    parentId:  parentId ?? null,
    likes:     [],
  })

  const plain = comment.toObject()
  eventBus.emit(`comment:${id}`, { type: 'new', comment: plain })
  return NextResponse.json({ data: plain }, { status: 201 })
}
