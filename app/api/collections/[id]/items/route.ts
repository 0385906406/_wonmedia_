import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Collection from '@/models/Collection'
import CollectionItem from '@/models/CollectionItem'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const { id } = await ctx.params
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })
    const items = await CollectionItem.find({ collectionId: id }).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ success: true, data: items })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const { id } = await ctx.params
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

    // Kiểm tra collection cha tồn tại
    const col = await Collection.findById(id)
    if (!col) return NextResponse.json({ error: 'Collection không tồn tại' }, { status: 404 })

    const { data } = await req.json()
    const item = await CollectionItem.create({ collectionId: id, data: data ?? {} })
    return NextResponse.json({ success: true, data: item })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
