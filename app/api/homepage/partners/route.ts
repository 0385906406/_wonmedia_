import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import HomepagePartner from '@/models/HomepagePartner'

export async function GET() {
  try {
    await connectDB()
    const items = await HomepagePartner.find().sort({ order: 1 }).lean()
    return NextResponse.json({ success: true, data: items })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const count = await HomepagePartner.countDocuments()
    const item = await HomepagePartner.create({ ...body, order: body.order ?? count })
    return NextResponse.json({ success: true, data: item })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
