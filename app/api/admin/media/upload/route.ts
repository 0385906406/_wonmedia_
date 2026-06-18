import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'
import { verifyImageMagicBytes } from '@/lib/verify-image'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json({ error: 'Chưa cấu hình Cloudinary trong biến môi trường.' }, { status: 503 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File quá lớn (tối đa 10MB)' }, { status: 400 })

    const buffer = new Uint8Array(await file.arrayBuffer())
    const { ok } = verifyImageMagicBytes(buffer)
    if (!ok) return NextResponse.json({ error: 'File không phải ảnh hợp lệ' }, { status: 400 })

    const cloudinary = (await import('cloudinary')).v2
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'wonmedia', resource_type: 'image' },
        (err, res) => err ? reject(err) : resolve(res as { secure_url: string })
      )
      stream.end(Buffer.from(buffer))
    })

    return NextResponse.json({ data: { url: result.secure_url } })

  } catch (e) {
    console.error('[media/upload]', e)
    return NextResponse.json({ error: 'Upload thất bại' }, { status: 500 })
  }
}
