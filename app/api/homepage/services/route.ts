import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import HomepageService from '@/models/HomepageService'

export async function GET() {
  try {
    await connectDB()
    const items = await HomepageService.find().sort({ order: 1 }).lean()
    return NextResponse.json({ success: true, data: items })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const count = await HomepageService.countDocuments()
    const item = await HomepageService.create({ ...body, order: body.order ?? count })
    return NextResponse.json({ success: true, data: item })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
