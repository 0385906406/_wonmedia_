'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

interface Post {
  id: string
  date: string
  category: string
  type: 'blog' | 'tuyen-dung'
  thumbnail: string
  title: string
  excerpt: string
  slug: string
}

interface Props {
  posts: Post[]
  heading: string
  seeMore: string
  lang: string
}

// ─── Card — same hover style as blog page GridCard ────────────────────────────
function PostCard({ post, lang, seeMore }: { post: Post; lang: string; seeMore: string }) {
  const [hovered, setHovered] = useState(false)
  const isBlog = post.type === 'blog'
  const href = `/${lang}/${isBlog ? 'tin-tuc' : 'tuyen-dung'}/${post.slug}`

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        background: '#fff', borderRadius: '16px',
        overflow: 'hidden', textDecoration: 'none', color: 'inherit',
        border: '1px solid #E5E8ED',
        boxShadow: hovered
          ? '0 24px 48px -12px rgba(15,76,129,0.15)'
          : '0 2px 12px rgba(15,76,129,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'none',
        transition: 'transform 0.4s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.4s ease',
        height: '100%',
      }}
    >
      {/* Thumbnail */}
      <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
        {post.thumbnail
          ? <img src={post.thumbnail} alt={post.title} style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.55s cubic-bezier(0.2,0.8,0.2,1)',
            }} />
          : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#E8F5E9,#E3F2FD)' }} />}
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Badge + date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '1.5px', textTransform: 'uppercase',
            padding: '3px 10px', borderRadius: '100px',
            background: isBlog ? '#dcfce7' : '#dbeafe',
            color: isBlog ? '#15803d' : '#1d4ed8',
            fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))',
          }}>
            {post.category}
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--nic-font-monospace, monospace)' }}>
            {post.date}
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#EAF1F8' }} />

        {/* Title */}
        <h3 style={{
          fontSize: '16px', fontWeight: 700, lineHeight: 1.4,
          color: hovered ? '#15803d' : '#062340',
          margin: 0, fontFamily: 'var(--font-vi)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          transition: 'color 0.25s ease',
        }}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p style={{
          fontSize: '13px', lineHeight: 1.7, color: '#475569',
          margin: 0, flex: 1, fontFamily: 'var(--font-vi)',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.excerpt}
        </p>

        {/* See more */}
        <div style={{
          marginTop: 'auto', paddingTop: '10px',
          display: 'flex', alignItems: 'center', gap: 6,
          color: '#15803d', fontSize: '13px', fontWeight: 700,
          fontFamily: 'var(--font-vi)',
        }}>
          {seeMore}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>
    </a>
  )
}

// ─── Carousel ─────────────────────────────────────────────────────────────────
export function PostsCarousel({ posts, heading, seeMore, lang }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const id = setInterval(() => emblaApi.scrollNext(), 5500)
    return () => clearInterval(id)
  }, [emblaApi])

  if (!posts.length) return null

  return (
    <section style={{ background: '#F8F9FB', padding: '88px 24px', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Heading */}
        <div className="wm-animate" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{
            color: '#0b2a59', fontSize: 'clamp(26px, 4vw, 44px)',
            fontWeight: 800, letterSpacing: '-0.5px',
            margin: '0 0 20px', fontFamily: 'var(--font-vi)',
          }}>
            {heading}
          </h2>
          <div style={{
            width: '80px', height: '4px', margin: '0 auto', borderRadius: '2px',
            background: 'linear-gradient(90deg, var(--color-teal), var(--color-indigo))',
          }} />
        </div>

        {/* Carousel */}
        <div style={{ position: 'relative' }}>
          <button onClick={scrollPrev} className="wm-carousel-btn wm-carousel-btn--prev wm-carousel-btn--light" aria-label="Prev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div ref={emblaRef} style={{ overflow: 'hidden', padding: '8px 4px 20px' }}>
            <div className="wm-carousel-track">
              {posts.map((post) => (
                <div key={post.id} className="wm-carousel-slide wm-post-slide-3">
                  <PostCard post={post} lang={lang} seeMore={seeMore} />
                </div>
              ))}
            </div>
          </div>

          <button onClick={scrollNext} className="wm-carousel-btn wm-carousel-btn--next wm-carousel-btn--light" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* See all link */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href={`/${lang}/bai-viet`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 32px', borderRadius: '100px',
            border: '1.5px solid #0b2a59', color: '#0b2a59',
            fontSize: '14px', fontWeight: 700, textDecoration: 'none',
            fontFamily: 'var(--font-vi)',
            transition: 'all 0.25s ease',
          }}
          className="wm-see-all-btn">
            {seeMore}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        .wm-see-all-btn:hover {
          background: #0b2a59 !important;
          color: #fff !important;
        }
      `}</style>
    </section>
  )
}
