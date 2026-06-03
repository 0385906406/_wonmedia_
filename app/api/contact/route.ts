import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ContactConfig from '@/models/ContactConfig'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

export async function GET() {
  try {
    await connectDB()
    const raw = await ContactConfig.findOne({ key: 'global' }).lean()
    return NextResponse.json({ success: true, data: raw ?? null })
  } catch (e) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const body = await req.json()
    const cfg = await ContactConfig.findOneAndUpdate(
      { key: 'global' }, { $set: body }, { new: true, upsert: true }
    )
    return NextResponse.json({ success: true, data: cfg })
  } catch (e) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
