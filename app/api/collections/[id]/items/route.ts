import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import CollectionItem from '@/models/CollectionItem'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: NextRequest, ctx: Ctx) {
    try {
        await connectDB()
        const { id } = await ctx.params
        const items = await CollectionItem.find({ collectionId: id }).sort({ createdAt: -1 }).lean()
        return NextResponse.json({ success: true, data: items })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest, ctx: Ctx) {
    try {
        await connectDB()
        const { id } = await ctx.params
        const { data } = await req.json()
        const item = await CollectionItem.create({ collectionId: id, data: data ?? {} })
        return NextResponse.json({ success: true, data: item })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
