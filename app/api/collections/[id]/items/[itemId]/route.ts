import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CollectionItem from '@/models/CollectionItem'

type Ctx = { params: Promise<{ id: string; itemId: string }> }

export async function PUT(req: NextRequest, ctx: Ctx) {
    try {
        await connectDB()
        const { id, itemId } = await ctx.params
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

export async function DELETE(_: NextRequest, ctx: Ctx) {
    try {
        await connectDB()
        const { id, itemId } = await ctx.params
        await CollectionItem.findOneAndDelete({ _id: itemId, collectionId: id })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
