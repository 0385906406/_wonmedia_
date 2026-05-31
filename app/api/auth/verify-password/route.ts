import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const { password } = await req.json()
        if (!password) return NextResponse.json({ success: false, error: 'Thiếu mật khẩu' }, { status: 400 })

        // Tìm tài khoản admin/superadmin đầu tiên
        const admin = await User.findOne({ role: { $in: ['superadmin', 'admin'] } })
        if (!admin) return NextResponse.json({ success: false, error: 'Không tìm thấy tài khoản admin' }, { status: 404 })

        const ok = await bcrypt.compare(password, admin.password)
        return NextResponse.json({ success: ok })
    } catch {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
    }
}
