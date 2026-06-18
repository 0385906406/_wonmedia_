'use client'

import { useCallback, useEffect, useRef } from 'react'
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
  subheading: string
  seeMore: string
  readMore: string
  lang: string
}

// ─── MeshCard slide ───────────────────────────────────────────────────────────
function PostMeshCard({ post, lang, readMore }: { post: Post; lang: string; readMore: string }) {
  const href = `/${lang}/${post.type === 'blog' ? 'tin-tuc' : 'tuyen-dung'}/${post.slug}`
  const isBlog = post.type === 'blog'

  return (
    <a href={href} className="qp-mesh-card" style={{ textDecoration: 'none', height: '100%' }}>
      {/* Thumbnail */}
      <div className="qp-mesh-card__media">
        {post.thumbnail
          ? <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40"><path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" /></svg>}
      </div>

      {/* Body */}
      <div className="qp-mesh-card__body">
        {/* Category badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            className={`qp-category-badge${isBlog ? '' : ' is-policy'}`}
          >
            {post.category}
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-gray-text)', fontFamily: 'var(--font-monospace)' }}>
            {post.date}
          </span>
        </div>

        {/* Title */}
        <span className="qp-mesh-card__title">{post.title}</span>

        {/* Excerpt */}
        <p style={{
          fontSize: 13, lineHeight: 1.65, color: 'var(--color-gray-text)', margin: 0,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="qp-mesh-card__meta" style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--color-gray-border)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-teal-dark)', fontWeight: 700, fontSize: 12 }}>
            {readMore}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  )
}

// ─── Carousel ─────────────────────────────────────────────────────────────────
export function PostsCarousel({ posts, heading, subheading, seeMore, readMore, lang }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const isPausedRef = useRef(false)

  useEffect(() => {
    if (!emblaApi) return
    const id = setInterval(() => {
      if (!isPausedRef.current) emblaApi.scrollNext()
    }, 5500)
    return () => clearInterval(id)
  }, [emblaApi])

  if (!posts.length) return null

  return (
    <section
      style={{ background: 'var(--color-gray-light)', paddingBlock: 'var(--space-20)' }}
      onMouseEnter={() => { isPausedRef.current = true }}
      onMouseLeave={() => { isPausedRef.current = false }}
    >
      <div className="container">
        {/* Section head */}
        <div className="qp-sechead">
          <div className="qp-sechead__titles">
            <span className="qp-sechead__eyebrow type-tag" style={{ fontSize: '15px', letterSpacing: '1.5px' }}>{heading}</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0 }}>{subheading}</h2>
          </div>
          <a href={`/${lang}/tin-tuc`} className="qp-sechead__link">
            {seeMore}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* Carousel wrapper */}
        <div style={{ position: 'relative' }}>
          {/* Prev */}
          <button
            onClick={scrollPrev}
            aria-label="Prev"
            style={{
              position: 'absolute', top: '50%', left: -20, transform: 'translateY(-50%)',
              zIndex: 10, width: 40, height: 40, borderRadius: '50%',
              background: '#fff', border: '1.5px solid var(--color-gray-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--color-navy)',
              boxShadow: '0 2px 8px rgba(15,76,129,0.1)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-navy-pale)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-teal)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-gray-border)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div ref={emblaRef} style={{ overflow: 'hidden', padding: '4px 2px 8px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
              {posts.map(post => (
                <div
                  key={post.id}
                  style={{ flex: '0 0 calc(33.333% - 14px)', minWidth: 0 }}
                  className="qp-post-slide"
                >
                  <PostMeshCard post={post} lang={lang} readMore={readMore} />
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={scrollNext}
            aria-label="Next"
            style={{
              position: 'absolute', top: '50%', right: -20, transform: 'translateY(-50%)',
              zIndex: 10, width: 40, height: 40, borderRadius: '50%',
              background: '#fff', border: '1.5px solid var(--color-gray-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--color-navy)',
              boxShadow: '0 2px 8px rgba(15,76,129,0.1)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-navy-pale)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-teal)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-gray-border)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .qp-post-slide { flex: 0 0 calc(50% - 10px) !important; } }
        @media (max-width: 560px) { .qp-post-slide { flex: 0 0 88% !important; } }
      `}</style>
    </section>
  )
}
