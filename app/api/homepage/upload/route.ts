import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'
import { verifyImageMagicBytes } from '@/lib/verify-image'

const MAX_SIZE = 3 * 1024 * 1024 // 3MB

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large (max 3MB)' }, { status: 400 })

    const buffer = new Uint8Array(await file.arrayBuffer())
    const { ok, ext } = verifyImageMagicBytes(buffer)
    if (!ok) return NextResponse.json({ error: 'File không phải ảnh hợp lệ' }, { status: 400 })

    const filename = `upload-${Date.now()}.${ext}`
    const dir = join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, filename), Buffer.from(buffer))

    return NextResponse.json({ success: true, url: `/uploads/${filename}` })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
