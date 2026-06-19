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
  ko: { title: '뉴스 – WON Media',      desc: 'WON Media의 최신 뉴스, 이벤트 및 기사를 확인하세요.' },
  ja: { title: 'ニュース – WON Media',   desc: 'WON Mediaからの最新ニュース、イベント、記事をご覧ください。' },
  zh: { title: '新闻 – WON Media',      desc: '查看WON Media的最新新闻、活动和文章。' },
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
  ko: '뉴스',
  ja: 'ニュース',
  zh: '新闻',
}

const LABELS: Record<LocaleKey, Record<string, string>> = {
  vi: { articles: 'bài viết', empty: 'Chưa có tin tức nào.',      prev: 'Trước',  next: 'Tiếp',   latest: 'Bài viết mới nhất', readMore: 'Đọc tiếp',    blogLabel: 'Blog', careerLabel: 'Tuyển dụng', loading: 'Đang tải...' },
  en: { articles: 'articles',  empty: 'No news yet.',              prev: 'Prev',   next: 'Next',   latest: 'Latest News',       readMore: 'Read more',   blogLabel: 'Blog', careerLabel: 'Career',     loading: 'Loading...' },
  ko: { articles: '개 글',    empty: '뉴스가 없습니다.',            prev: '이전',   next: '다음',   latest: '최신 뉴스',          readMore: '더 읽기',     blogLabel: '블로그', careerLabel: '채용',      loading: '로딩 중...' },
  ja: { articles: '件',        empty: 'ニュースがありません。',      prev: '前へ',   next: '次へ',   latest: '最新ニュース',        readMore: '続きを読む', blogLabel: 'ブログ', careerLabel: '採用',       loading: '読み込み中...' },
  zh: { articles: '篇文章',   empty: '暂无新闻。',                  prev: '上一页', next: '下一页', latest: '最新新闻',            readMore: '阅读更多',   blogLabel: '博客', careerLabel: '招聘',        loading: '加载中...' },
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
