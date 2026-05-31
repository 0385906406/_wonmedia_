import { notFound } from 'next/navigation'
import { hasLocale } from '../dictionaries'
import { BlogClient, type PostCard } from '@/components/client/blog/BlogClient'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'

const PER_PAGE = 13

const HEADINGS: Record<LocaleKey, string> = {
  vi: 'TIN TỨC',
  en: 'NEWS',
  ko: '뉴스',
  ja: 'ニュース',
  zh: '新闻',
}

const LABELS: Record<LocaleKey, Record<string, string>> = {
  vi: { articles: 'bài viết', empty: 'Chưa có tin tức nào.', prev: 'Trước', next: 'Tiếp', latest: 'Bài viết mới nhất' },
  en: { articles: 'articles',  empty: 'No news yet.',         prev: 'Prev',   next: 'Next', latest: 'Latest News' },
  ko: { articles: '개 글',    empty: '뉴스가 없습니다.',       prev: '이전',   next: '다음', latest: '최신 뉴스' },
  ja: { articles: '件',        empty: 'ニュースがありません。', prev: '前へ',   next: '次へ', latest: '最新ニュース' },
  zh: { articles: '篇文章',   empty: '暂无新闻。',             prev: '上一页', next: '下一页', latest: '最新新闻' },
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
  const page = Math.max(1, parseInt(sp.page ?? '1'))
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
