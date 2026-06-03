import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import Collection from '@/models/Collection'
import CollectionItem from '@/models/CollectionItem'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, ctx: Ctx) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const { id } = await ctx.params
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

    const body = await req.json()
    // Allowlist fields — không cho phép thay đổi slug sau khi tạo
    const update: Record<string, unknown> = {}
    if (body.name?.trim())                         update.name        = body.name.trim()
    if (typeof body.description === 'string')      update.description = body.description
    if (Array.isArray(body.fields))                update.fields      = body.fields
    if (typeof body.important === 'boolean')       update.important   = body.important

    const col = await Collection.findByIdAndUpdate(id, { $set: update }, { new: true })
    if (!col) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
    return NextResponse.json({ success: true, data: col })
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
    const { id } = await ctx.params
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'ID không hợp lệ' }, { status: 400 })

    const col = await Collection.findById(id)
    if (!col) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })

    await CollectionItem.deleteMany({ collectionId: id })
    await Collection.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
