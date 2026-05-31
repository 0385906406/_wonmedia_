import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local')
}

// Cache connection để tránh tạo nhiều connection trong dev
let cached = global.mongoose as {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
    // Mongoose already connected (by any means) — sync cache and return
    if (mongoose.connection.readyState === 1) {
        cached.conn = mongoose
        cached.promise = null
        return cached.conn
    }

    // Clear stale/failed cache
    if (mongoose.connection.readyState !== 2) {
        // Not connecting → reset everything
        cached.conn = null
        cached.promise = null
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        }).catch((err) => {
            cached.conn = null
            cached.promise = null
            throw err
        })
    }

    cached.conn = await cached.promise
    return cached.conn
}