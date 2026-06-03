import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import CollectionItem from '@/models/CollectionItem'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

type Ctx = { params: Promise<{ id: string; itemId: string }> }

export async function PUT(req: NextRequest, ctx: Ctx) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const { id, itemId } = await ctx.params
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(itemId)) {
      return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })
    }
    const { data } = await req.json()
    const item = await CollectionItem.findOneAndUpdate(
      { _id: itemId, collectionId: id },
      { $set: { data } },
      { new: true }
    )
    if (!item) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ success: true, data: item })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const { id, itemId } = await ctx.params
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(itemId)) {
      return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })
    }
    const deleted = await CollectionItem.findOneAndDelete({ _id: itemId, collectionId: id })
    if (!deleted) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
