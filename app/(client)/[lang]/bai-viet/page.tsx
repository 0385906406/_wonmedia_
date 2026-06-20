import { notFound } from 'next/navigation'
import { hasLocale } from '../dictionaries'
import { BlogClient, type PostCard } from '@/components/client/blog/BlogClient'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'

const PER_PAGE = 13

const HEADINGS: Record<LocaleKey, string> = {
  vi: 'TIN TỨC & TUYỂN DỤNG',
  en: 'NEWS & CAREERS',
}

const LABELS: Record<LocaleKey, Record<string, string>> = {
  vi: { all: 'Tất cả', blog: 'Tin tức', career: 'Tuyển dụng', articles: 'bài', empty: 'Chưa có bài viết.', prev: 'Trước', next: 'Tiếp', latest: 'Bài viết mới nhất' },
  en: { all: 'All',    blog: 'News',     career: 'Careers',    articles: 'posts', empty: 'No posts yet.',   prev: 'Prev',   next: 'Next', latest: 'Latest Posts' },
}

export default async function BaiVietPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ type?: string; page?: string }>
}) {
  const { lang } = await params
  const sp = await searchParams
  if (!hasLocale(lang)) notFound()

  const lk         = lang as LocaleKey
  const typeFilter = sp.type ?? ''
  const page       = Math.max(1, parseInt(sp.page ?? '1'))
  const skip       = (page - 1) * PER_PAGE

  let posts: PostCard[] = []
  let total = 0

  try {
    await connectDB()
    const filter: Record<string, unknown> = { active: true }
    if (typeFilter) filter.type = typeFilter

    const [docs, count] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(PER_PAGE).lean(),
      Post.countDocuments(filter),
    ])
    total = count
    posts = docs.map(p => {
      const ml = (f: Record<string, string>) => f?.[lk] || f?.['vi'] || ''
      return {
        _id:       (p._id as { toString(): string }).toString(),
        slug:      p.slug,
        type:      p.type as 'blog' | 'tuyen-dung',
        thumbnail: p.thumbnail || '',
        date:      p.date || '',
        category:  ml(p.category as Record<string, string>),
        title:     ml(p.title    as Record<string, string>),
        excerpt:   ml(p.excerpt  as Record<string, string>),
      }
    })
  } catch { /* DB unavailable */ }

  return (
    <BlogClient
      posts={posts}
      lang={lang}
      activeType={typeFilter}
      total={total}
      page={page}
      pages={Math.ceil(total / PER_PAGE) || 1}
      heading={HEADINGS[lk]}
      labels={LABELS[lk]}
      baseUrl="bai-viet"
    />
  )
}
