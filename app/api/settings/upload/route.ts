import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/webp']
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2MB

const MIME_EXT: Record<string, string> = {
  'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp',
  'image/svg+xml': 'svg', 'image/x-icon': 'ico', 'image/vnd.microsoft.icon': 'ico',
}

// POST /api/settings/upload?field=faviconUrl|logoImageUrl
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  try {
    const { searchParams } = new URL(req.url)
    const field = searchParams.get('field') ?? 'file'

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    if (file.size > MAX_SIZE_BYTES) return NextResponse.json({ error: 'File too large (max 2MB)' }, { status: 400 })

    const ext = MIME_EXT[file.type] ?? 'png'
    const safeField = field.replace(/[^a-z0-9-_]/gi, '').slice(0, 30) || 'file'
    const filename = `${safeField}-${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    // Vercel Blob in production, local filesystem in dev
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const blob = await put(`uploads/${filename}`, buffer, {
        access: 'public',
        contentType: file.type,
      })
      return NextResponse.json({ success: true, url: blob.url })
    }

    // Dev fallback: write to public/uploads/
    const { writeFile, mkdir } = await import('fs/promises')
    const path = await import('path')
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), buffer)
    return NextResponse.json({ success: true, url: `/uploads/${filename}` })

  } catch (e) {
    console.error('[settings/upload]', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
