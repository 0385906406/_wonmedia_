import { notFound } from 'next/navigation'
import { hasLocale } from '../dictionaries'
import { BlogClient, type PostCard } from '@/components/client/blog/BlogClient'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'

const PER_PAGE = 13

const HEADINGS: Record<LocaleKey, string> = {
  vi: 'TUYỂN DỤNG',
  en: 'CAREERS',
  ko: '채용',
  ja: '採用情報',
  zh: '招聘',
}

const LABELS: Record<LocaleKey, Record<string, string>> = {
  vi: { articles: 'vị trí',   empty: 'Hiện chưa có vị trí tuyển dụng.',     prev: 'Trước',  next: 'Tiếp',   latest: 'Vị trí đang tuyển',      viewDetail: 'Xem chi tiết', urgent: 'Gấp',    deadline: 'Hạn nộp', blogLabel: 'Blog', careerLabel: 'Tuyển dụng', loading: 'Đang tải...' },
  en: { articles: 'openings',  empty: 'No open positions at the moment.',     prev: 'Prev',   next: 'Next',   latest: 'Open Positions',          viewDetail: 'View Details', urgent: 'Urgent', deadline: 'Deadline', blogLabel: 'Blog', careerLabel: 'Career',     loading: 'Loading...' },
  ko: { articles: '개 채용',   empty: '현재 채용 중인 포지션이 없습니다.',    prev: '이전',   next: '다음',   latest: '채용 중인 포지션',          viewDetail: '자세히 보기',  urgent: '긴급',   deadline: '마감일',  blogLabel: '블로그', careerLabel: '채용',      loading: '로딩 중...' },
  ja: { articles: '件',         empty: '現在募集中のポジションはありません。', prev: '前へ',   next: '次へ',   latest: '募集中のポジション',          viewDetail: '詳細を見る',   urgent: '緊急',   deadline: '締切',    blogLabel: 'ブログ', careerLabel: '採用',       loading: '読み込み中...' },
  zh: { articles: '个职位',    empty: '暂无招聘职位。',                        prev: '上一页', next: '下一页', latest: '招聘职位',                 viewDetail: '查看详情',    urgent: '紧急',   deadline: '截止日期', blogLabel: '博客', careerLabel: '招聘',        loading: '加载中...' },
}

export default async function TuyenDungPage({
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
      Post.find({ active: true, type: 'tuyen-dung' }).sort({ createdAt: -1 }).skip(skip).limit(PER_PAGE).lean(),
      Post.countDocuments({ active: true, type: 'tuyen-dung' }),
    ])
    total = count
    posts = docs.map(p => {
      const ml = (f: Record<string, string>) => f?.[lk] || f?.['vi'] || ''
      const jp = p as unknown as { urgent?: boolean; jobType?: string; location?: string; salary?: string; deadline?: string }
      return {
        _id:       (p._id as { toString(): string }).toString(),
        slug:      p.slug,
        type:      p.type as 'blog' | 'tuyen-dung',
        thumbnail: p.thumbnail || '',
        date:      p.date || '',
        category:  ml(p.category as Record<string, string>),
        title:     ml(p.title    as Record<string, string>),
        excerpt:   ml(p.excerpt  as Record<string, string>),
        urgent:   jp.urgent   ?? false,
        jobType:  jp.jobType  ?? '',
        location: jp.location ?? '',
        salary:   jp.salary   ?? '',
        deadline: jp.deadline ?? '',
      }
    })
  } catch { /* DB unavailable */ }

  return (
    <BlogClient
      posts={posts}
      lang={lang}
      activeType="tuyen-dung"
      total={total}
      page={page}
      pages={Math.ceil(total / PER_PAGE) || 1}
      heading={HEADINGS[lk]}
      labels={LABELS[lk]}
      hideFilter
      baseUrl="tuyen-dung"
    />
  )
}
