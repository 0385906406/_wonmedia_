import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongodb'
import HomepageHero from '@/models/HomepageHero'
import { getAuthUser, requireAdmin } from '@/lib/auth-api'

const DEFAULT_HERO = {
  title:    { vi: 'BRINGING MUSIC', en: 'BRINGING MUSIC', ko: 'BRINGING MUSIC', ja: 'BRINGING MUSIC', zh: 'BRINGING MUSIC' },
  title2:   { vi: 'TO THE WORLD',   en: 'TO THE WORLD',   ko: 'TO THE WORLD',   ja: 'TO THE WORLD',   zh: 'TO THE WORLD' },
  subtitle: {
    vi: 'WON Media – Đơn vị phát hành âm nhạc & khai thác bản quyền hàng đầu Việt Nam.',
    en: 'WON Media – Vietnam\'s leading music distribution & copyright management company.',
    ko: 'WON Media – 베트남 최고의 음악 배급 및 저작권 관리 회사.',
    ja: 'WON Media – ベトナムを代表する音楽配信・著作権管理会社。',
    zh: 'WON Media – 越南领先的音乐发行与版权管理公司。',
  },
}

export async function GET() {
  try {
    await connectDB()
    let hero = await HomepageHero.findOne({ key: 'main' }).lean()
    if (!hero) {
      hero = await HomepageHero.create({ key: 'main', ...DEFAULT_HERO })
    }
    return NextResponse.json({ success: true, data: hero })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser(req)
  const authErr = requireAdmin(user)
  if (authErr) return authErr
  try {
    await connectDB()
    const body = await req.json()
    const hero = await HomepageHero.findOneAndUpdate(
      { key: 'main' },
      { $set: body },
      { upsert: true, new: true }
    ).lean()
    revalidatePath('/', 'layout')
    return NextResponse.json({ success: true, data: hero })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
