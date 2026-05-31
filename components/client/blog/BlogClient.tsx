'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'

export interface PostCard {
  _id: string
  slug: string
  type: 'blog' | 'tuyen-dung'
  thumbnail: string
  date: string
  category: string
  title: string
  excerpt: string
}

// ─── Category badge — same style as PostsCarousel ────────────────────────────
function CatBadge({ type, category }: { type: string; category: string }) {
  const isBlog = type === 'blog'
  return (
    <span style={{
      fontSize: '10px', fontWeight: 700,
      letterSpacing: '1.5px', textTransform: 'uppercase',
      padding: '3px 10px', borderRadius: '100px',
      background: isBlog ? '#dcfce7' : '#dbeafe',
      color: isBlog ? '#15803d' : '#1d4ed8',
      fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))',
      whiteSpace: 'nowrap',
    }}>
      {category || (isBlog ? 'Blog' : 'Tuyển dụng')}
    </span>
  )
}

// ─── Featured card (large, left image) ───────────────────────────────────────
function FeaturedCard({ post, lang, baseUrl }: { post: PostCard; lang: string; baseUrl: string }) {
  const [hovered, setHovered] = useState(false)
  const href = `/${lang}/${baseUrl}/${post.slug}`
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
        background: '#fff', borderRadius: '20px',
        overflow: 'hidden', textDecoration: 'none',
        boxShadow: hovered ? '0 32px 64px -20px rgba(15,76,129,0.18)' : '0 4px 24px rgba(15,76,129,0.08)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'transform 0.4s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.4s ease',
        border: '1px solid #E5E8ED',
      }}
      className="featured-grid-mobile"
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 300 }}>
        {post.thumbnail
          ? <img src={post.thumbnail} alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.6s cubic-bezier(0.2,0.8,0.2,1)' }} />
          : <div style={{ width: '100%', height: '100%', minHeight: 300, background: 'linear-gradient(135deg, #E8F5E9, #E3F2FD)' }} />}
        <div style={{ position: 'absolute', top: 16, left: 16 }}>
          <CatBadge type={post.type} category={post.category} />
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: '40px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
        <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'var(--nic-font-monospace, monospace)' }}>
          {post.date}
        </span>
        <h2 style={{
          fontFamily: 'var(--font-vi)', fontSize: 'clamp(22px, 2.5vw, 30px)',
          fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.5px',
          color: '#0b2a59', margin: 0,
          transition: 'color 0.3s ease',
          ...(hovered ? { color: '#15803d' } : {}),
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
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: '13px', fontWeight: 700, color: '#15803d',
          fontFamily: 'var(--font-vi)',
        }}>
          Đọc tiếp
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
      </div>
    </motion.a>
  )
}

// ─── Grid card — matches wm-bloom-card style ──────────────────────────────────
function GridCard({ post, lang, delay = 0, baseUrl }: { post: PostCard; lang: string; delay?: number; baseUrl: string }) {
  const [hovered, setHovered] = useState(false)
  const href = `/${lang}/${baseUrl}/${post.slug}`
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#fff', borderRadius: '16px',
        overflow: 'hidden', textDecoration: 'none',
        border: '1px solid #E5E8ED',
        boxShadow: hovered ? '0 24px 48px -12px rgba(15,76,129,0.15)' : '0 2px 12px rgba(15,76,129,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        transition: 'transform 0.4s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.4s ease',
      }}
    >
      {/* Thumbnail */}
      <div className="wm-bloom-img-wrap" style={{ overflow: 'hidden', aspectRatio: '16/9', flexShrink: 0 }}>
        {post.thumbnail
          ? <img src={post.thumbnail} alt={post.title} className="wm-bloom-img"
              style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.55s cubic-bezier(0.2,0.8,0.2,1)' }} />
          : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #E8F5E9, #E3F2FD)' }} />}
      </div>
      {/* Body */}
      <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <CatBadge type={post.type} category={post.category} />
          <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--nic-font-monospace, monospace)' }}>{post.date}</span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-vi)', fontSize: '16px', fontWeight: 700,
          lineHeight: 1.35, letterSpacing: '-0.2px', color: '#0b2a59', margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          transition: 'color 0.25s ease',
          ...(hovered ? { color: '#15803d' } : {}),
        }}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p style={{
            fontFamily: 'var(--font-vi)', fontSize: '13px', color: '#64748b',
            lineHeight: 1.65, margin: 0, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {post.excerpt}
          </p>
        )}
      </div>
    </motion.a>
  )
}

// ─── List card (horizontal compact) ──────────────────────────────────────────
function ListCard({ post, lang, delay = 0, baseUrl }: { post: PostCard; lang: string; delay?: number; baseUrl: string }) {
  const [hovered, setHovered] = useState(false)
  const href = `/${lang}/${baseUrl}/${post.slug}`
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '16px 0', textDecoration: 'none',
        borderBottom: '1px solid #F1F5F9',
        transition: 'opacity 0.2s',
        opacity: hovered ? 0.75 : 1,
      }}
    >
      {/* Thumb */}
      <div style={{
        width: 80, height: 60, borderRadius: 10,
        overflow: 'hidden', flexShrink: 0,
        background: 'linear-gradient(135deg, #E8F5E9, #E3F2FD)',
      }}>
        {post.thumbnail && (
          <img src={post.thumbnail} alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
      </div>
      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <CatBadge type={post.type} category={post.category} />
          <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--nic-font-monospace, monospace)' }}>{post.date}</span>
        </div>
        <p style={{
          fontFamily: 'var(--font-vi)', fontSize: '14px', fontWeight: 600,
          color: hovered ? '#15803d' : '#0b2a59', margin: 0, lineHeight: 1.4,
          transition: 'color 0.25s ease',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.title}
        </p>
      </div>
    </motion.a>
  )
}

// ─── Filter bar ───────────────────────────────────────────────────────────────
function FilterBar({ lang, activeType, labels }: { lang: string; activeType: string; labels: Record<string, string> }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function go(type: string) {
    const sp = new URLSearchParams(searchParams.toString())
    type ? sp.set('type', type) : sp.delete('type')
    sp.delete('page')
    router.push(`/${lang}/tin-tuc?${sp}`)
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {[
        { v: '',           label: labels.all    || 'Tất cả' },
        { v: 'blog',       label: labels.blog   || 'Blog' },
        { v: 'tuyen-dung', label: labels.career || 'Tuyển dụng' },
      ].map(({ v, label }) => (
        <button key={v} onClick={() => go(v)} style={{
          padding: '9px 22px', borderRadius: '100px',
          fontFamily: 'var(--font-vi)', fontSize: '13px', fontWeight: 700,
          background: activeType === v ? '#0b2a59' : '#fff',
          color:      activeType === v ? '#fff'    : '#475569',
          border:     activeType === v ? '1.5px solid #0b2a59' : '1.5px solid #E5E8ED',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          letterSpacing: '0.2px',
        }}>
          {label}
        </button>
      ))}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
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
  baseUrl?: string   // e.g. 'tin-tuc' or 'tuyen-dung'
}

function BlogInner({ posts, lang, activeType, total, page, pages, heading, labels, hideFilter, baseUrl = 'tin-tuc' }: BlogClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function goPage(p: number) {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set('page', String(p))
    router.push(`/${lang}/${baseUrl}?${sp}`)
  }

  const featured  = posts[0]
  const gridPosts = posts.slice(1, 7)    // 6 grid cards
  const listPosts = posts.slice(7)        // rest as list

  return (
    <div style={{ background: 'var(--wm-dark, #0f1117)', fontFamily: 'var(--font-vi)' }}>

      {/* ── Banner — same style as homepage hero ── */}
      <section style={{
        position: 'relative', width: '100%', height: '340px',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        <img src="/banners/banner.png" alt="" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', filter: 'brightness(0.65) saturate(1.1)',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,35,64,0.92) 0%, rgba(6,35,64,0.55) 60%, rgba(6,35,64,0.3) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 0)', backgroundSize: '3px 3px' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1280px', margin: '0 auto', padding: '0 32px', width: '100%' }}>
          <span className="wm-animate" style={{
            fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))',
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: '#34D4B8', display: 'block', marginBottom: 16,
          }}>
            WON MEDIA
          </span>
          <h1 className="wm-animate" style={{
            fontFamily: 'var(--font-vi)',
            fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 900,
            letterSpacing: '-2px', lineHeight: 1.0,
            color: '#fff', margin: '0 0 14px',
            textShadow: '0 4px 40px rgba(0,0,0,0.4)',
          }}>
            {heading}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-vi)', fontSize: '14px', margin: 0 }}>
            {total} {labels.articles || 'bài viết'}
          </p>
        </div>
      </section>

      {/* ── Content — white background ── */}
      <div style={{ background: '#F8F9FB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 24px 80px' }}>

          {/* Filter */}
          {!hideFilter && (
            <div style={{ marginBottom: 40 }}>
              <Suspense>
                <FilterBar lang={lang} activeType={activeType} labels={labels} />
              </Suspense>
            </div>
          )}

          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <p style={{ color: '#94a3b8', fontFamily: 'var(--font-vi)', fontSize: '15px' }}>
                {labels.empty || 'Chưa có bài viết nào.'}
              </p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <div style={{ marginBottom: 48 }}>
                  <FeaturedCard post={featured} lang={lang} baseUrl={baseUrl} />
                </div>
              )}

              {/* Grid heading */}
              {gridPosts.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
                    <h2 style={{
                      fontFamily: 'var(--font-vi)', fontSize: '22px', fontWeight: 800,
                      letterSpacing: '-0.4px', color: '#0b2a59', margin: 0,
                    }}>
                      {labels.latest || 'Bài viết mới nhất'}
                    </h2>
                    <div style={{ width: '60px', height: '3px', borderRadius: '2px', background: 'linear-gradient(90deg, #22c55e, #0ea5e9)' }} />
                  </div>

                  <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 48 }}>
                    {gridPosts.map((post, i) => (
                      <GridCard key={post._id} post={post} lang={lang} delay={i * 0.08} baseUrl={baseUrl} />
                    ))}
                  </div>
                </>
              )}

              {/* List */}
              {listPosts.length > 0 && (
                <div style={{
                  background: '#fff', borderRadius: '16px',
                  border: '1px solid #E5E8ED', padding: '8px 24px', marginBottom: 48,
                }}>
                  {listPosts.map((post, i) => (
                    <div key={post._id} style={{ borderBottom: i < listPosts.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <ListCard post={post} lang={lang} delay={i * 0.06} baseUrl={baseUrl} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {page > 1 && (
                    <button onClick={() => goPage(page - 1)} style={{
                      padding: '10px 20px', borderRadius: '10px',
                      border: '1.5px solid #E5E8ED', background: '#fff',
                      cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                      fontFamily: 'var(--font-vi)', color: '#475569',
                    }}>
                      ← {labels.prev || 'Trước'}
                    </button>
                  )}
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => goPage(p)} style={{
                      padding: '10px 16px', borderRadius: '10px',
                      border: `1.5px solid ${p === page ? '#0b2a59' : '#E5E8ED'}`,
                      background: p === page ? '#0b2a59' : '#fff',
                      color: p === page ? '#fff' : '#475569',
                      cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                      fontFamily: 'var(--font-vi)',
                      transition: 'all 0.2s ease',
                    }}>
                      {p}
                    </button>
                  ))}
                  {page < pages && (
                    <button onClick={() => goPage(page + 1)} style={{
                      padding: '10px 20px', borderRadius: '10px',
                      border: '1.5px solid #E5E8ED', background: '#fff',
                      cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                      fontFamily: 'var(--font-vi)', color: '#475569',
                    }}>
                      {labels.next || 'Tiếp'} →
                    </button>
                  )}
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
        .featured-grid-mobile { grid-template-columns: 1fr 1fr !important; }
        @media (max-width: 768px) { .featured-grid-mobile { grid-template-columns: 1fr !important; } }
        @media (max-width: 580px) {
          .blog-banner-text h1 { font-size: 32px !important; letter-spacing: -1px !important; }
          .blog-banner-text    { padding: 80px 16px 40px !important; }
        }
      `}</style>
    </div>
  )
}

export function BlogClient(props: BlogClientProps) {
  return (
    <Suspense fallback={<div style={{ padding: '120px 24px', textAlign: 'center', color: '#94a3b8', fontFamily: 'var(--font-vi)' }}>Đang tải...</div>}>
      <BlogInner {...props} />
    </Suspense>
  )
}
