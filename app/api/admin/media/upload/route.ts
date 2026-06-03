import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'
import { verifyImageMagicBytes } from '@/lib/verify-image'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })

    const buffer = new Uint8Array(await file.arrayBuffer())

    // Verify magic bytes — không tin Content-Type từ client
    const { ok, ext } = verifyImageMagicBytes(buffer)
    if (!ok) return NextResponse.json({ error: 'File không phải ảnh hợp lệ' }, { status: 400 })

    const filename = `rte-${Date.now()}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), Buffer.from(buffer))

    return NextResponse.json({ data: { url: `/uploads/${filename}` } })
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
