import { notFound } from 'next/navigation'
import { hasLocale } from '../../dictionaries'
import { PostDetail, type PostDetailData } from '@/components/client/blog/PostDetail'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'

const BACK_LABELS: Record<LocaleKey, string> = {
  vi: 'Quay lại Tuyển dụng', en: 'Back to Careers',
  ko: '채용으로 돌아가기', ja: '採用情報に戻る', zh: '返回招聘',
}

export default async function TuyenDungDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()
  const lk = lang as LocaleKey

  await connectDB()
  const p = await Post.findOne({ slug, active: true, type: 'tuyen-dung' }).lean()
  if (!p) notFound()

  const ml = (f: Record<string, string>) => f?.[lk] || f?.['vi'] || ''

  const post: PostDetailData = {
    slug:      p.slug,
    type:      'tuyen-dung',
    thumbnail: p.thumbnail || '',
    date:      p.date || '',
    category:  ml(p.category as Record<string, string>),
    title:     ml(p.title    as Record<string, string>),
    excerpt:   ml(p.excerpt  as Record<string, string>),
    content:   ml(p.content  as Record<string, string>),
  }

  // Related: latest 3 tuyen-dung posts (excluding current)
  const related = await Post.find({ active: true, type: 'tuyen-dung', slug: { $ne: slug } })
    .sort({ createdAt: -1 }).limit(3).lean()

  const relatedPosts = related.map(r => ({
    _id:       (r._id as { toString(): string }).toString(),
    slug:      r.slug,
    title:     ml(r.title    as Record<string, string>),
    date:      r.date || '',
    thumbnail: r.thumbnail || '',
    category:  ml(r.category as Record<string, string>),
    type:      r.type as string,
  }))

  return (
    <PostDetail
      post={post}
      lang={lang}
      backUrl="tuyen-dung"
      backLabel={BACK_LABELS[lk]}
      relatedPosts={relatedPosts}
    />
  )
}
