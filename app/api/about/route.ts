import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import AboutConfig from '@/models/AboutConfig'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

export async function GET() {
  try {
    await connectDB()
    const cfg = await AboutConfig.findOne({ key: 'global' }).lean()
    return NextResponse.json({ success: true, data: cfg ?? null })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    await connectDB()
    const body = await req.json()
    const cfg = await AboutConfig.findOneAndUpdate(
      { key: 'global' },
      { $set: body },
      { new: true, upsert: true, strict: false }
    )
    revalidatePath('/[lang]/gioi-thieu', 'page')
    return NextResponse.json({ success: true, data: cfg })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
