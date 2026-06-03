import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import HomepagePostsConfig from '@/models/HomepagePostsConfig'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

export async function GET() {
  try {
    await connectDB()
    const raw = await HomepagePostsConfig.findOne({ key: 'posts' }).lean()
    if (!raw) {
      const created = await HomepagePostsConfig.create({ key: 'posts', mode: 'auto', selectedIds: [], limit: 6 })
      return NextResponse.json({ success: true, data: created })
    }
    // Đảm bảo `limit` luôn có giá trị dù document cũ chưa có field này
    const r = raw as unknown as Record<string, unknown>
    const data = { mode: r.mode ?? 'auto', selectedIds: r.selectedIds ?? [], limit: r.limit ?? 6 }
    return NextResponse.json({ success: true, data })
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
    const body = await req.json() as { mode?: string; selectedIds?: string[]; limit?: number }
    const update: Record<string, unknown> = {}
    if (body.mode !== undefined)        update.mode        = body.mode
    if (body.selectedIds !== undefined) update.selectedIds = body.selectedIds
    if (body.limit !== undefined)       update.limit       = Math.max(1, Math.min(20, Number(body.limit) || 6))
    const cfg = await HomepagePostsConfig.findOneAndUpdate(
      { key: 'posts' },
      { $set: update },
      { new: true, upsert: true, strict: false }  // strict:false cho phép lưu limit dù model bị cache cũ
    )
    return NextResponse.json({ success: true, data: cfg })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
