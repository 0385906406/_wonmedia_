import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { checkRateLimit } from '@/lib/rate-limiter'

export async function POST(req: NextRequest) {
    // Ưu tiên x-real-ip (Vercel/Nginx set), fallback x-forwarded-for first IP
    const ip = req.headers.get('x-real-ip')
      ?? req.headers.get('x-forwarded-for')?.split(',')[0].trim()
      ?? 'unknown'
    if (!checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
        return NextResponse.json({ error: 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.' }, { status: 429 })
    }

    try {
        await connectDB()
        const { email, password } = await req.json()

        // BUG-009: validate type — chặn NoSQL injection ({ $gt: "" })
        if (typeof email !== 'string' || typeof password !== 'string') {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
        const token = await new SignJWT({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion ?? 0,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(secret)

        const res = NextResponse.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        })

        res.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        })

        return res
    } catch (error) {
        console.error('[login] error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
