import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon']
const MAX_SIZE_BYTES = 2 * 1024 * 1024 // 2MB

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

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
        }

        if (file.size > MAX_SIZE_BYTES) {
            return NextResponse.json({ error: 'File too large (max 2MB)' }, { status: 400 })
        }

        // Extension từ MIME type — không tin client filename
        const MIME_EXT: Record<string, string> = {
          'image/png': 'png', 'image/jpeg': 'jpg',
          'image/svg+xml': 'svg', 'image/x-icon': 'ico',
          'image/vnd.microsoft.icon': 'ico',
        }
        const ext = MIME_EXT[file.type] ?? 'png'
        // Sanitize field name để dùng trong filename
        const safeField = field.replace(/[^a-z0-9-_]/gi, '').slice(0, 30) || 'file'
        const filename = `${safeField}-${Date.now()}.${ext}`
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        const filePath = path.join(uploadDir, filename)

        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(filePath, buffer)

        const url = `/uploads/${filename}`
        return NextResponse.json({ success: true, url })
    } catch {
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}
