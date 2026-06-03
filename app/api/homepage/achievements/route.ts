import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import HomepageAchievement from '@/models/HomepageAchievement'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

export async function GET() {
  try {
    await connectDB()
    const items = await HomepageAchievement.find().sort({ order: 1 }).lean()
    return NextResponse.json({ success: true, data: items })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr
  try {
    await connectDB()
    const body = await req.json()
    const count = await HomepageAchievement.countDocuments()
    const item = await HomepageAchievement.create({ ...body, order: body.order ?? count })
    return NextResponse.json({ success: true, data: item })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
