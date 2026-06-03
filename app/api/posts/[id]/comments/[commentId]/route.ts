import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Comment from '@/models/Comment'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'
import { eventBus } from '@/lib/event-bus'

// DELETE — admin only
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  const { id, commentId } = await params
  if (!Types.ObjectId.isValid(commentId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  await connectDB()
  // BUG-016: verify commentId thuộc đúng postId trong URL
  const deleted = await Comment.findOneAndDelete({ _id: commentId, postId: id })
  if (!deleted) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })

  eventBus.emit(`comment:${id}`, { type: 'delete', commentId })
  return NextResponse.json({ success: true })
}

// POST — toggle like comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, commentId } = await params
  if (!Types.ObjectId.isValid(commentId)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

  await connectDB()
  // BUG-016: verify comment thuộc đúng post
  const comment = await Comment.findOne({ _id: commentId, postId: id })
  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const idx = comment.likes.findIndex((l) => l.userId === user.id)
  if (idx >= 0) {
    comment.likes.splice(idx, 1)
  } else {
    comment.likes.push({ userId: user.id })
  }
  await comment.save()

  const plain = comment.toObject()
  eventBus.emit(`comment:${id}`, { type: 'like', commentId, likes: plain.likes })
  return NextResponse.json({ data: { likes: plain.likes } })
}
