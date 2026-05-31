import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ContactConfig from '@/models/ContactConfig'

export async function GET() {
  try {
    await connectDB()
    const raw = await ContactConfig.findOne({ key: 'global' }).lean()
    return NextResponse.json({ success: true, data: raw ?? null })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const cfg = await ContactConfig.findOneAndUpdate(
      { key: 'global' }, { $set: body }, { new: true, upsert: true, strict: false }
    )
    return NextResponse.json({ success: true, data: cfg })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
