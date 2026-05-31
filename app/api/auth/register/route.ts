import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { name, email, password } = await req.json()

        // Kiểm tra email đã tồn tại
        const existing = await User.findOne({ email })
        if (existing) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
        }

        const hashed = await bcrypt.hash(password, 12)
        const user = await User.create({ name, email, password: hashed })

        return NextResponse.json(
            { message: 'Registered successfully', userId: user._id },
            { status: 201 }
        )
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}