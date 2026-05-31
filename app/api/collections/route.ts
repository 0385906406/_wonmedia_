import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Collection from '@/models/Collection'

export async function GET() {
    try {
        await connectDB()
        const cols = await Collection.find().sort({ createdAt: 1 }).lean()
        return NextResponse.json({ success: true, data: cols })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { name, slug, description, fields } = await req.json()
        if (!name || !slug) {
            return NextResponse.json({ error: 'Tên và slug là bắt buộc' }, { status: 400 })
        }
        const exists = await Collection.findOne({ slug })
        if (exists) {
            return NextResponse.json({ error: 'Slug đã tồn tại' }, { status: 400 })
        }
        const col = await Collection.create({ name, slug, description: description ?? '', fields: fields ?? [] })
        return NextResponse.json({ success: true, data: col })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
