import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Setting from '@/models/Setting'

// GET /api/settings — trả về settings hiện tại (hoặc giá trị mặc định)
export async function GET() {
    try {
        await connectDB()
        let setting = await Setting.findOne({ key: 'global' })
        if (!setting) {
            setting = await Setting.create({ key: 'global' })
        }
        return NextResponse.json({ success: true, data: setting })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// PUT /api/settings — cập nhật một hoặc nhiều nhóm settings
export async function PUT(req: NextRequest) {
    try {
        await connectDB()
        const body = await req.json()

        const allowed = ['general', 'header', 'integrations']
        const update: Record<string, unknown> = {}
        for (const group of allowed) {
            if (body[group] && typeof body[group] === 'object') {
                for (const [k, v] of Object.entries(body[group])) {
                    update[`${group}.${k}`] = v
                }
            }
        }

        const setting = await Setting.findOneAndUpdate(
            { key: 'global' },
            { $set: update },
            { new: true, upsert: true }
        )

        return NextResponse.json({ success: true, data: setting })
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
