import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { hasLocale } from '../../dictionaries'
import { sanitizeHtml } from '@/lib/sanitize-html'
import { PostDetail, type PostDetailData } from '@/components/client/blog/PostDetail'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'

const BACK_LABELS: Record<LocaleKey, string> = {
  vi: 'Quay lại Tuyển dụng', en: 'Back to Careers',
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const lk = lang as LocaleKey

  try { await connectDB() } catch { return {} }
  const p = await Post.findOne({ slug, active: true, type: 'tuyen-dung' }).lean().catch(() => null)
  if (!p) return {}

  const ml = (f: Record<string, string>) => f?.[lk] || f?.['vi'] || ''

  const title       = ml((p.seoTitle       as Record<string, string>) ?? {}) || ml(p.title   as Record<string, string>)
  const description = ml((p.seoDescription as Record<string, string>) ?? {}) || ml(p.excerpt as Record<string, string>)
  const keywords    = ml((p.seoKeywords    as Record<string, string>) ?? {})
  const ogImage     = (p as { ogImage?: string }).ogImage || p.thumbnail || ''
  const url         = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wonmedia.vn'}/${lang}/tuyen-dung/${slug}`

  return {
    title,
    description,
    ...(keywords ? { keywords: keywords.split(',').map(k => k.trim()) } : {}),
    alternates: {
      canonical: url,
      languages: {
        vi: `/vi/tuyen-dung/${slug}`,
        en: `/en/tuyen-dung/${slug}`,
        ko: `/ko/tuyen-dung/${slug}`,
        ja: `/ja/tuyen-dung/${slug}`,
        zh: `/zh/tuyen-dung/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
      siteName: 'WON Media',
      locale: lk,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
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
    content:   sanitizeHtml(ml(p.content  as Record<string, string>)),
    urgent:   (p as { urgent?: boolean }).urgent   ?? false,
    deadline: (p as { deadline?: string }).deadline ?? '',
    jobType:  (p as { jobType?: string }).jobType  ?? '',
    location: (p as { location?: string }).location ?? '',
    salary:   (p as { salary?: string }).salary    ?? '',
  }

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
      thumbnailPosition={(p as { thumbnailPosition?: string }).thumbnailPosition ?? 'center center'}
    />
  )
}
