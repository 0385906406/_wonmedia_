import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'
import { getAuthUser } from '@/lib/auth-api'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  // Check post tồn tại và active
  const post = await Post.findById(id).select('likes active').lean() as { likes?: string[]; active?: boolean } | null
  if (!post || !post.active) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const likes = post.likes ?? []
  const alreadyLiked = likes.includes(user.id)

  // Dùng atomic $addToSet/$pull thay vì read-modify-write — tránh race condition
  if (alreadyLiked) {
    await Post.findByIdAndUpdate(id, { $pull: { likes: user.id } })
  } else {
    await Post.findByIdAndUpdate(id, { $addToSet: { likes: user.id } })
  }

  const updated = await Post.findById(id).select('likes').lean() as { likes?: string[] } | null
  const newLikes = updated?.likes ?? []
  return NextResponse.json({ liked: !alreadyLiked, count: newLikes.length })
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser(req)
  const { id } = await params
  await connectDB()
  const post = await Post.findById(id).select('likes active').lean() as { likes?: string[]; active?: boolean } | null
  if (!post || !post.active) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const likes = post.likes ?? []
  return NextResponse.json({ liked: user ? likes.includes(user.id) : false, count: likes.length })
}
