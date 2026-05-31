import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Collection from '@/models/Collection'
import CollectionItem from '@/models/CollectionItem'

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, ctx: Ctx) {
    try {
        await connectDB()
        const { id } = await ctx.params
        const body = await req.json()
        const col = await Collection.findByIdAndUpdate(id, { $set: body }, { new: true })
        if (!col) return NextResponse.json({ error: 'Không tìm thấy' }, { status: 404 })
        return NextResponse.json({ success: true, data: col })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function DELETE(_: NextRequest, ctx: Ctx) {
    try {
        await connectDB()
        const { id } = await ctx.params
        await Collection.findByIdAndDelete(id)
        await CollectionItem.deleteMany({ collectionId: id })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
