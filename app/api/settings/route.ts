import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Setting from '@/models/Setting'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

// Tất cả fields trong integrations là sensitive — mask hết với non-admin
const SENSITIVE_INTEGRATION_KEYS = ['geminiApiKey', 'newsApiKey', 'resendApiKey']

// GET /api/settings — chỉ admin mới thấy API keys; public chỉ thấy general/header
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req)
  const isAdmin = user && ['admin', 'superadmin'].includes(user.role)

  try {
    await connectDB()
    const setting = await Setting.findOne({ key: 'global' })
    if (!setting) {
      // Không auto-create cho unauthenticated — chỉ admin mới trigger tạo
      if (!isAdmin) return NextResponse.json({ success: true, data: null })
      const created = await Setting.create({ key: 'global' })
      return NextResponse.json({ success: true, data: created })
    }

    const data = setting.toObject()

    if (!isAdmin && data.integrations) {
      // Mask tất cả API keys với non-admin
      const masked: Record<string, unknown> = { ...data.integrations }
      for (const key of SENSITIVE_INTEGRATION_KEYS) {
        if (masked[key]) masked[key] = '***'
      }
      data.integrations = masked as unknown as typeof data.integrations
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT /api/settings — admin only
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

    return NextResponse.json({ success: true, data: setting })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
