'use client'

import { useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'

export interface PostCard {
  _id: string
  slug: string
  type: 'blog' | 'tuyen-dung'
  thumbnail: string
  thumbnailPosition?: string
  date: string
  category: string
  title: string
  excerpt: string
  urgent?: boolean
  jobType?: string
  location?: string
  salary?: string
  deadline?: string
}

const JOB_TYPE_MAP: Record<string, string> = {
  'full-time': 'Full-time', 'part-time': 'Part-time',
  'remote': 'Remote', 'hybrid': 'Hybrid',
  'internship': 'Thực tập', 'freelance': 'Freelance',
}

const IBag = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
const IPin = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const ICoin = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const IClock = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IArrow = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>

function JobMeta({ post, labels, compact = false }: { post: PostCard; labels: Record<string, string>; compact?: boolean }) {
  if (post.type !== 'tuyen-dung') return null
  const items: { icon: React.ReactNode; text: string }[] = [
    post.jobType  ? { icon: <IBag />,   text: JOB_TYPE_MAP[post.jobType] || post.jobType } : null,
    post.location ? { icon: <IPin />,   text: post.location } : null,
    post.salary   ? { icon: <ICoin />,  text: post.salary }   : null,
  ].filter(Boolean) as { icon: React.ReactNode; text: string }[]

  if (!items.length && !post.urgent && !post.deadline) return null

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: compact ? 6 : 8, alignItems: 'center' }}>
      {post.urgent && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: compact ? 9 : 10, fontWeight: 800,
          letterSpacing: '1px', textTransform: 'uppercase',
          padding: compact ? '2px 7px' : '3px 9px', borderRadius: 100,
          background: '#FEE2E2', color: '#DC2626',
          border: '1px solid rgba(220,38,38,0.2)',
        }}>
          {labels.urgent || 'Gấp'}
        </span>
      )}
      {items.map((item, i) => (
        <span key={i} style={{
          fontSize: compact ? 10 : 11, color: '#64748b', fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          {item.icon}
          {item.text}
          {i < items.length - 1 && <span style={{ color: '#cbd5e1', marginLeft: 2 }}>·</span>}
        </span>
      ))}
      {post.deadline && (
        <span style={{
          fontSize: compact ? 10 : 11, color: '#64748b', fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <IClock />
          {labels.deadline || 'Hạn'}: {post.deadline}
        </span>
      )}
    </div>
  )
}

function CatBadge({ type, category, labels }: { type: string; category: string; labels: Record<string, string> }) {
  const isBlog = type === 'blog'
  const fallback = isBlog ? (labels.blogLabel || 'Blog') : (labels.careerLabel || 'Tuyển dụng')
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700,
      letterSpacing: '1.5px', textTransform: 'uppercase',
      padding: '3px 10px', borderRadius: '100px',
      background: isBlog ? 'rgba(0,169,143,0.12)' : 'rgba(15,76,129,0.1)',
      color: isBlog ? '#007D69' : '#0F4C81',
      whiteSpace: 'nowrap',
    }}>
      {category || fallback}
    </span>
  )
}

function FeaturedCard({ post, lang, baseUrl, labels }: { post: PostCard; lang: string; baseUrl: string; labels: Record<string, string> }) {
  const [hov, setHov] = useState(false)
  const href = `/${lang}/${baseUrl}/${post.slug}`
  const cta = post.type === 'tuyen-dung'
    ? (labels.viewDetail || 'Xem chi tiết')
    : (labels.readMore   || 'Đọc tiếp')

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
        background: '#fff', borderRadius: '16px',
        overflow: 'hidden', textDecoration: 'none',
        boxShadow: hov ? '0 20px 60px rgba(15,76,129,0.18)' : '0 4px 24px rgba(15,76,129,0.08)',
        transform: hov ? 'translateY(-4px)' : 'none',
        transition: 'transform 0.4s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.4s ease',
        border: '1px solid rgba(15,76,129,0.08)',
      }}
      className="blog-featured-card"
    >
      <div style={{ position: 'relative', overflow: 'hidden', height: 320 }}>
        {post.thumbnail
          ? <img src={post.thumbnail} alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                objectPosition: post.thumbnailPosition || 'center center',
                transform: hov ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.2,0.8,0.2,1)' }} />
          : <div style={{ width: '100%', height: '100%',
              background: 'linear-gradient(135deg, rgba(15,76,129,0.08), rgba(0,169,143,0.12))' }} />}
        <div style={{ position: 'absolute', top: 16, left: 16 }}>
          <CatBadge type={post.type} category={post.category} labels={labels} />
        </div>
      </div>

      <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
        <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'var(--nic-font-monospace, monospace)', letterSpacing: '0.5px' }}>
          {post.date}
        </span>
        <h2 style={{
          fontFamily: 'var(--font-vi)',
          fontSize: 'clamp(20px, 2.2vw, 28px)', fontWeight: 800,
          lineHeight: 1.25, letterSpacing: '-0.5px',
          color: hov ? '#007D69' : '#062340',
          margin: 0, transition: 'color 0.3s ease',
        }}>
          {post.title}
        </h2>
        {post.excerpt && (
          <p style={{
            fontFamily: 'var(--font-vi)', fontSize: '15px', lineHeight: 1.7,
            color: '#475569', margin: 0,
            display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {post.excerpt}
          </p>
        )}
        <JobMeta post={post} labels={labels} />
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: '13px', fontWeight: 700, color: '#007D69',
          fontFamily: 'var(--font-vi)',
        }}>
          {cta}
          <IArrow />
        </span>
      </div>
    </motion.a>
  )
}

function GridCard({ post, lang, delay = 0, baseUrl, labels }: { post: PostCard; lang: string; delay?: number; baseUrl: string; labels: Record<string, string> }) {
  const [hov, setHov] = useState(false)
  const href = `/${lang}/${baseUrl}/${post.slug}`

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#fff', borderRadius: '12px',
        overflow: 'hidden', textDecoration: 'none',
        border: '1px solid rgba(15,76,129,0.07)',
        boxShadow: hov ? '0 20px 48px rgba(15,76,129,0.15)' : '0 2px 12px rgba(15,76,129,0.06)',
        transform: hov ? 'translateY(-6px)' : 'none',
        transition: 'transform 0.4s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.4s ease',
      }}
    >
      <div style={{ overflow: 'hidden', aspectRatio: '16/9', flexShrink: 0, position: 'relative' }}>
        {post.thumbnail
          ? <img src={post.thumbnail} alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                objectPosition: post.thumbnailPosition || 'center center',
                transform: hov ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.55s cubic-bezier(0.2,0.8,0.2,1)' }} />
          : <div style={{ width: '100%', height: '100%',
              background: 'linear-gradient(135deg, rgba(15,76,129,0.08), rgba(0,169,143,0.12))' }} />}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #0F4C81, #00A98F)',
          transform: hov ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left', transition: 'transform 0.4s ease',
        }} />
      </div>

      <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <CatBadge type={post.type} category={post.category} labels={labels} />
          <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--nic-font-monospace, monospace)' }}>
            {post.date}
          </span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-vi)', fontSize: '16px', fontWeight: 700,
          lineHeight: 1.35, letterSpacing: '-0.2px',
          color: hov ? '#007D69' : '#062340',
          margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          transition: 'color 0.25s ease',
        }}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p style={{
            fontFamily: 'var(--font-vi)', fontSize: '13px',
            color: '#64748b', lineHeight: 1.65, margin: 0, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {post.excerpt}
          </p>
        )}
        <JobMeta post={post} labels={labels} compact />
      </div>
    </motion.a>
  )
}

function ListCard({ post, lang, delay = 0, baseUrl, labels }: { post: PostCard; lang: string; delay?: number; baseUrl: string; labels: Record<string, string> }) {
  const [hov, setHov] = useState(false)
  const href = `/${lang}/${baseUrl}/${post.slug}`

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 20px', textDecoration: 'none',
        transition: 'background 0.2s',
        background: hov ? 'rgba(15,76,129,0.03)' : 'transparent',
        borderRadius: '8px',
      }}
    >
      <div style={{
        width: 80, height: 60, borderRadius: '8px',
        overflow: 'hidden', flexShrink: 0,
        background: 'linear-gradient(135deg, rgba(15,76,129,0.06), rgba(0,169,143,0.1))',
      }}>
        {post.thumbnail && (
          <img src={post.thumbnail} alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', objectPosition: post.thumbnailPosition || 'center center' }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <CatBadge type={post.type} category={post.category} labels={labels} />
          <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--nic-font-monospace, monospace)' }}>
            {post.date}
          </span>
        </div>
        <p style={{
          fontFamily: 'var(--font-vi)', fontSize: '14px', fontWeight: 600,
          color: hov ? '#007D69' : '#062340',
          margin: 0, lineHeight: 1.4, transition: 'color 0.25s ease',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.title}
        </p>
        {post.type === 'tuyen-dung' && (post.urgent || post.location || post.salary) && (
          <div style={{ marginTop: 4 }}>
            <JobMeta post={post} labels={labels} compact />
          </div>
        )}
      </div>
    </motion.a>
  )
}

function FilterBar({ lang, activeType, labels, baseUrl }: { lang: string; activeType: string; labels: Record<string, string>; baseUrl: string }) {
  const router = useRouter()

  function go(type: string) {
    router.push(type ? `/${lang}/${baseUrl}?type=${type}` : `/${lang}/${baseUrl}`)
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {[
        { v: '',           label: labels.all        || 'Tất cả' },
        { v: 'blog',       label: labels.blogLabel   || 'Blog' },
        { v: 'tuyen-dung', label: labels.careerLabel || 'Tuyển dụng' },
      ].map(({ v, label }) => (
        <button key={v} onClick={() => go(v)} style={{
          padding: '9px 22px', borderRadius: '100px',
          fontFamily: 'var(--font-vi)', fontSize: '13px', fontWeight: 700,
          background: activeType === v ? '#0F4C81' : '#fff',
          color:      activeType === v ? '#fff' : '#475569',
          border:     activeType === v ? '1.5px solid #0F4C81' : '1.5px solid rgba(15,76,129,0.12)',
          cursor: 'pointer', letterSpacing: '0.2px',
          transition: 'all 0.2s ease',
        }}>
          {label}
        </button>
      ))}
    </div>
  )
}

export interface BlogClientProps {
  posts: PostCard[]
  lang: string
  activeType: string
  total: number
  page: number
  pages: number
  heading: string
  labels: Record<string, string>
  hideFilter?: boolean
  baseUrl?: string
}

function BlogInner({ posts, lang, activeType, total, page, pages, heading, labels, hideFilter, baseUrl = 'tin-tuc' }: BlogClientProps) {
  const router = useRouter()

  function goPage(p: number) {
    router.push(`/${lang}/${baseUrl}?page=${p}`)
  }

  const isFirstPage = page <= 1
  const featured  = isFirstPage ? posts[0] : undefined
  const gridPosts = isFirstPage ? posts.slice(1, 7) : posts.slice(0, 6)
  const listPosts = isFirstPage ? posts.slice(7)    : posts.slice(6)

  return (
    <div style={{ fontFamily: 'var(--font-vi)' }}>

      <section style={{ position: 'relative', width: '100%', minHeight: 200, display: 'flex', alignItems: 'center', overflow: 'hidden', marginTop: 'calc(-1 * var(--topbar-height))' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #0F4C81 0%, #062340 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.25,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }} />
        <div style={{
          position: 'absolute', top: '-60px', right: '10%', width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,169,143,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: 'calc(var(--topbar-height) + 52px) 32px 44px', width: '100%' }}>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'block', marginBottom: 16,
              fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))',
              fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
              textTransform: 'uppercase', color: '#00A98F',
            }}
          >
            WON MEDIA
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-vi)',
              fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: 900,
              letterSpacing: '-1px', lineHeight: 1.1,
              color: '#fff', margin: '0 0 16px',
            }}
          >
            {heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', margin: 0 }}
          >
            {total} {labels.articles || 'bài viết'}
          </motion.p>
        </div>
      </section>

      <div style={{ background: '#F8F9FB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 24px 80px' }}>

          {!hideFilter && (
            <div style={{ marginBottom: 40 }}>
              <Suspense>
                <FilterBar lang={lang} activeType={activeType} labels={labels} baseUrl={baseUrl} />
              </Suspense>
            </div>
          )}

          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', padding: '80px 0' }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(0,169,143,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00A98F" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <p style={{ color: '#94a3b8', fontFamily: 'var(--font-vi)', fontSize: '15px' }}>
                {labels.empty || 'Chưa có bài viết nào.'}
              </p>
            </motion.div>
          ) : (
            <>
              {featured && (
                <div style={{ marginBottom: 48 }}>
                  <FeaturedCard post={featured} lang={lang} baseUrl={baseUrl} labels={labels} />
                </div>
              )}

              {gridPosts.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
                    <div style={{ width: 4, height: 24, borderRadius: 2, background: 'linear-gradient(180deg, #0F4C81, #00A98F)' }} />
                    <h2 style={{
                      fontFamily: 'var(--font-vi)', fontSize: '20px', fontWeight: 800,
                      letterSpacing: '-0.4px', color: '#062340', margin: 0,
                    }}>
                      {labels.latest || 'Bài viết mới nhất'}
                    </h2>
                  </div>

                  <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 48 }}>
                    {gridPosts.map((post, i) => (
                      <GridCard key={post._id} post={post} lang={lang} delay={i * 0.08} baseUrl={baseUrl} labels={labels} />
                    ))}
                  </div>
                </>
              )}

              {listPosts.length > 0 && (
                <div style={{
                  background: '#fff', borderRadius: '12px',
                  border: '1px solid rgba(15,76,129,0.07)',
                  boxShadow: '0 2px 12px rgba(15,76,129,0.06)',
                  padding: '8px 4px', marginBottom: 48,
                }}>
                  {listPosts.map((post, i) => (
                    <div key={post._id} style={{
                      borderBottom: i < listPosts.length - 1 ? '1px solid rgba(15,76,129,0.06)' : 'none',
                    }}>
                      <ListCard post={post} lang={lang} delay={i * 0.06} baseUrl={baseUrl} labels={labels} />
                    </div>
                  ))}
                </div>
              )}

              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => goPage(page - 1)}
                    disabled={page <= 1}
                    style={{
                      padding: '9px 18px', borderRadius: '8px',
                      border: '1.5px solid rgba(15,76,129,0.12)', background: '#fff',
                      cursor: page <= 1 ? 'not-allowed' : 'pointer',
                      opacity: page <= 1 ? 0.4 : 1,
                      fontSize: '13px', fontWeight: 600,
                      fontFamily: 'var(--font-vi)', color: '#475569',
                      transition: 'all 0.2s',
                    }}
                  >
                    ← {labels.prev || 'Trước'}
                  </button>

                  {(() => {
                    const items: (number | 'ellipsis-start' | 'ellipsis-end')[] = []
                    if (pages <= 7) {
                      for (let i = 1; i <= pages; i++) items.push(i)
                    } else {
                      items.push(1)
                      if (page > 4) items.push('ellipsis-start')
                      const start = Math.max(2, page - 1)
                      const end   = Math.min(pages - 1, page + 1)
                      for (let i = start; i <= end; i++) items.push(i)
                      if (page < pages - 3) items.push('ellipsis-end')
                      items.push(pages)
                    }
                    return items.map((item, idx) => {
                      if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                        return <span key={item} style={{ padding: '9px 4px', fontSize: '13px', color: '#94a3b8', userSelect: 'none' }}>…</span>
                      }
                      const isActive = item === page
                      return (
                        <button key={idx} onClick={() => goPage(item)} style={{
                          padding: '9px 14px', borderRadius: '8px', minWidth: 40,
                          border: `1.5px solid ${isActive ? '#0F4C81' : 'rgba(15,76,129,0.12)'}`,
                          background: isActive ? '#0F4C81' : '#fff',
                          color: isActive ? '#fff' : '#475569',
                          cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                          fontFamily: 'var(--font-vi)',
                          transition: 'all 0.2s ease',
                          boxShadow: isActive ? '0 2px 8px -2px rgba(15,76,129,0.35)' : 'none',
                        }}>
                          {item}
                        </button>
                      )
                    })
                  })()}

                  <button
                    onClick={() => goPage(page + 1)}
                    disabled={page >= pages}
                    style={{
                      padding: '9px 18px', borderRadius: '8px',
                      border: '1.5px solid rgba(15,76,129,0.12)', background: '#fff',
                      cursor: page >= pages ? 'not-allowed' : 'pointer',
                      opacity: page >= pages ? 0.4 : 1,
                      fontSize: '13px', fontWeight: 600,
                      fontFamily: 'var(--font-vi)', color: '#475569',
                      transition: 'all 0.2s',
                    }}
                  >
                    {labels.next || 'Tiếp'} →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 900px) { .blog-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 580px) { .blog-grid { grid-template-columns: 1fr !important; } }
        .blog-featured-card { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) { .blog-featured-card { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

export function BlogClient(props: BlogClientProps) {
  return (
    <Suspense fallback={
      <div style={{ padding: '120px 24px', textAlign: 'center', color: '#94a3b8', fontFamily: 'var(--font-vi)' }}>
        {props.labels?.loading || 'Đang tải...'}
      </div>
    }>
      <BlogInner {...props} />
    </Suspense>
  )
}
