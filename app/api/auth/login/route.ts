import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { email, password } = await req.json()

        const user = await User.findOne({ email })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Tạo JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
        const token = await new SignJWT({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
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
            maxAge: 60 * 60 * 24 * 7, // 7 ngày
            path: '/',
        })

        return res
    } catch (error) {
        console.error('[login] error:', error)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}