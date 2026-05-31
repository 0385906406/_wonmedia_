/**
 * Seed script: tạo tài khoản superadmin mặc định.
 * Chạy: npx tsx scripts/seed-superadmin.ts
 */
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wonmedia'

const SUPER_ADMIN = {
    name: 'Super Admin',
    email: 'admin@wonmedia.com',
    password: 'Admin@123456',
    role: 'superadmin' as const,
}

const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true, lowercase: true },
        password: String,
        role: { type: String, enum: ['superadmin', 'admin', 'user'], default: 'user' },
    },
    { timestamps: true }
)

async function seed() {
    console.log('🔗 Connecting to MongoDB:', MONGODB_URI)
    await mongoose.connect(MONGODB_URI)

    const User = mongoose.models.User || mongoose.model('User', UserSchema)

    const existing = await User.findOne({ email: SUPER_ADMIN.email })
    if (existing) {
        console.log(`✅ Super admin đã tồn tại: ${SUPER_ADMIN.email}`)
        await mongoose.disconnect()
        return
    }

    const hashed = await bcrypt.hash(SUPER_ADMIN.password, 12)
    const user = await User.create({
        name: SUPER_ADMIN.name,
        email: SUPER_ADMIN.email,
        password: hashed,
        role: SUPER_ADMIN.role,
    })

    console.log('✅ Super admin đã được tạo:')
    console.log(`   Email   : ${SUPER_ADMIN.email}`)
    console.log(`   Password: ${SUPER_ADMIN.password}`)
    console.log(`   Role    : ${SUPER_ADMIN.role}`)
    console.log(`   ID      : ${user._id}`)

    await mongoose.disconnect()
    console.log('🔌 Disconnected.')
}

seed().catch((err) => {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
})
