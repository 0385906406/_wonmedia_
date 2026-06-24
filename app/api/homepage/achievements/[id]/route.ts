import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import HomepageAchievement from '@/models/HomepageAchievement'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const item = await HomepageAchievement.findByIdAndUpdate(id, { $set: body }, { new: true, strict: false }).lean()
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    revalidatePath('/[lang]', 'page')
    return NextResponse.json({ success: true, data: item })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr
  try {
    await connectDB()
    const { id } = await params
    await HomepageAchievement.findByIdAndDelete(id)
    revalidatePath('/[lang]', 'page')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
