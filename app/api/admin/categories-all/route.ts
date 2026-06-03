import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Category from '@/models/Category'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const cats = await Category.find({}).sort({ order: 1, createdAt: 1 }).lean()
    return NextResponse.json({ success: true, data: cats })
  } catch (e) { return NextResponse.json({ error: 'Server error' }, { status: 500 }) }
}
