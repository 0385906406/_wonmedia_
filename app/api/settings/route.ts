import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import Setting from '@/models/Setting'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

const LOCALES = ['vi', 'en', 'ko', 'ja', 'zh']

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  const isAdmin = user && ['admin', 'superadmin'].includes(user.role)

  try {
    await connectDB()
    const setting = await Setting.findOne({ key: 'global' })
    if (!setting) {
      if (!isAdmin) return NextResponse.json({ success: true, data: null })
      const created = await Setting.create({ key: 'global' })
      return NextResponse.json({ success: true, data: created })
    }
    return NextResponse.json({ success: true, data: setting })
  } catch {
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

    LOCALES.forEach(lang => revalidatePath(`/${lang}`, 'layout'))
    return NextResponse.json({ success: true, data: setting })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
