import type { MetadataRoute } from 'next'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://wonmedia.vn'
const LOCALES = ['vi', 'en']
const STATIC_PATHS = ['', '/gioi-thieu', '/lien-he', '/tin-tuc', '/tuyen-dung']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages × 5 locales
  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : 0.8,
      })
    }
  }

  // Dynamic: blog posts + job listings
  try {
    await connectDB()
    const posts = await Post.find({ active: true })
      .select('slug type updatedAt')
      .lean<{ slug: string; type: string; updatedAt: Date }[]>()

    for (const post of posts) {
      const segment = post.type === 'tuyen-dung' ? 'tuyen-dung' : 'tin-tuc'
      for (const locale of LOCALES) {
        entries.push({
          url: `${SITE}/${locale}/${segment}/${post.slug}`,
          lastModified: post.updatedAt ?? new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    }
  } catch { /* DB lỗi → chỉ trả static */ }

  return entries
}
