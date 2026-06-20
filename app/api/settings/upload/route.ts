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

    const safeField = field.replace(/[^a-z0-9-_]/gi, '').slice(0, 30) || 'file'
    const buffer = Buffer.from(await file.arrayBuffer())

    // Cloudinary (preferred — works in dev & prod)
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const { v2: cloudinary } = await import('cloudinary')
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:    process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      })
      const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'wonmedia/settings', public_id: safeField, overwrite: true, resource_type: 'image' },
          (error, res) => { if (error || !res) reject(error ?? new Error('Upload failed')); else resolve(res) }
        ).end(buffer)
      })
      return NextResponse.json({ success: true, url: result.secure_url })
    }

    // Vercel Blob fallback
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const ext = MIME_EXT[file.type] ?? 'png'
      const { put } = await import('@vercel/blob')
      const blob = await put(`uploads/${safeField}-${Date.now()}.${ext}`, buffer, {
        access: 'public',
        contentType: file.type,
      })
      return NextResponse.json({ success: true, url: blob.url })
    }

    // Dev fallback: write to public/uploads/
    const ext = MIME_EXT[file.type] ?? 'png'
    const devFilename = `${safeField}-${Date.now()}.${ext}`
    const { writeFile, mkdir } = await import('fs/promises')
    const path = await import('path')
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, devFilename), buffer)
    return NextResponse.json({ success: true, url: `/uploads/${devFilename}` })

  } catch (e) {
    console.error('[settings/upload]', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
