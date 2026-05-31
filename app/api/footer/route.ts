import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import FooterConfig from '@/models/FooterConfig'

export async function GET() {
  try {
    await connectDB()
    const cfg = await FooterConfig.findOne({ key: 'global' }).lean()
    return NextResponse.json({ success: true, data: cfg ?? null })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const cfg = await FooterConfig.findOneAndUpdate(
      { key: 'global' }, { $set: body }, { new: true, upsert: true, strict: false }
    )
    return NextResponse.json({ success: true, data: cfg })
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
