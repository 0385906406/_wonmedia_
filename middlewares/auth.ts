import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    const { pathname } = req.nextUrl

    const isAdminPath = pathname.startsWith('/admin')
    const isAuthPath = pathname.startsWith('/auth')

    if (isAdminPath) {
        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', req.url))
        }
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
            await jwtVerify(token, secret)
        } catch {
            return NextResponse.redirect(new URL('/auth/login', req.url))
        }
    }

    // Đã login thì không vào trang auth nữa
    if (isAuthPath && token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
            await jwtVerify(token, secret)
            return NextResponse.redirect(new URL('/admin/dashboard', req.url))
        } catch {
            // token lỗi thì cho vào auth bình thường
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/auth/:path*'],
}