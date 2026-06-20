import { notFound } from 'next/navigation'
import { hasLocale } from '../dictionaries'
import { BlogClient, type PostCard } from '@/components/client/blog/BlogClient'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'
import type { Metadata } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://wonmedia.vn'

const SEO_NEWS: Record<LocaleKey, { title: string; desc: string }> = {
  vi: { title: 'Tin tức – WON Media',   desc: 'Cập nhật tin tức, sự kiện và bài viết mới nhất từ WON Media.' },
  en: { title: 'News – WON Media',      desc: 'Latest news, events and articles from WON Media.' },
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const lk = lang as LocaleKey
  const { title, desc } = SEO_NEWS[lk]
  const url = `${SITE}/${lang}/tin-tuc`
  return {
    title,
    description: desc,
    alternates: {
      canonical: url,
      languages: { vi: `${SITE}/vi/tin-tuc`, en: `${SITE}/en/tin-tuc`, ko: `${SITE}/ko/tin-tuc`, ja: `${SITE}/ja/tin-tuc`, zh: `${SITE}/zh/tin-tuc` },
    },
    openGraph: { title, description: desc, url, type: 'website', siteName: 'WON Media', locale: lk },
    twitter: { card: 'summary_large_image', title, description: desc },
  }
}

const PER_PAGE = 13

const HEADINGS: Record<LocaleKey, string> = {
  vi: 'TIN TỨC',
  en: 'NEWS',
}

const LABELS: Record<LocaleKey, Record<string, string>> = {
  vi: { articles: 'bài viết', empty: 'Chưa có tin tức nào.',  prev: 'Trước', next: 'Tiếp', latest: 'Bài viết mới nhất', readMore: 'Đọc tiếp',  blogLabel: 'Blog', careerLabel: 'Tuyển dụng', loading: 'Đang tải...' },
  en: { articles: 'articles',  empty: 'No news yet.',          prev: 'Prev',  next: 'Next', latest: 'Latest News',       readMore: 'Read more', blogLabel: 'Blog', careerLabel: 'Career',     loading: 'Loading...' },
}

export default async function TinTucPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { lang } = await params
  const sp = await searchParams
  if (!hasLocale(lang)) notFound()

  const lk   = lang as LocaleKey
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)
  const skip = (page - 1) * PER_PAGE

  let posts: PostCard[] = []
  let total = 0

  try {
    await connectDB()
    const [docs, count] = await Promise.all([
      Post.find({ active: true, type: 'blog' }).sort({ createdAt: -1 }).skip(skip).limit(PER_PAGE).lean(),
      Post.countDocuments({ active: true, type: 'blog' }),
    ])
    total = count
    posts = docs.map(p => {
      const ml = (f: Record<string, string>) => f?.[lk] || f?.['vi'] || ''
      return {
        _id:               (p._id as { toString(): string }).toString(),
        slug:              p.slug,
        type:              p.type as 'blog' | 'tuyen-dung',
        thumbnail:         p.thumbnail || '',
        thumbnailPosition: (p as { thumbnailPosition?: string }).thumbnailPosition || 'center center',
        date:              p.date || '',
        category:          ml(p.category as Record<string, string>),
        title:             ml(p.title    as Record<string, string>),
        excerpt:           ml(p.excerpt  as Record<string, string>),
      }
    })
  } catch {}

  return (
    <BlogClient
      posts={posts}
      lang={lang}
      activeType="blog"
      total={total}
      page={page}
      pages={Math.ceil(total / PER_PAGE) || 1}
      heading={HEADINGS[lk]}
      labels={LABELS[lk]}
      hideFilter
      baseUrl="tin-tuc"
    />
  )
}
