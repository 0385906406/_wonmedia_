'use client'

import { motion } from 'framer-motion'

export interface PostDetailData {
  slug: string
  type: 'blog' | 'tuyen-dung'
  thumbnail: string
  date: string
  category: string
  title: string
  excerpt: string
  content: string
}

interface RelatedPost {
  _id: string; slug: string; title: string
  date: string; thumbnail: string; category: string; type: string
}

interface Props {
  post: PostDetailData
  lang: string
  backUrl: string
  backLabel: string
  relatedPosts: RelatedPost[]
}

export function PostDetail({ post, lang, backUrl, backLabel, relatedPosts }: Props) {
  const isBlog = post.type === 'blog'

  return (
    <div style={{ background: 'var(--wm-dark)', fontFamily: 'var(--font-vi)' }}>

      {/* ══ HERO — đúng style trang chủ ══ */}
      <section style={{
        position: 'relative', width: '100%', minHeight: '420px',
        display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
      }}>
        {/* Background ảnh thumbnail */}
        {post.thumbnail ? (
          <img src={post.thumbnail} alt={post.title} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            filter: 'brightness(0.55) contrast(1.05) saturate(0.9)',
          }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #191B24, #0F4C81)' }} />
        )}

        {/* Overlays y hệt trang chủ */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(25,27,36,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.45, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 0)', backgroundSize: '3px 3px' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '220px', background: 'linear-gradient(to bottom, transparent, var(--wm-dark))' }} />

        {/* Nội dung */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: 'clamp(80px,10vw,100px) clamp(16px,4vw,32px) 48px' }}>

          {/* Back */}
          <motion.a
            href={`/${lang}/${backUrl}`}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'var(--wm-text-muted)', fontSize: '13px', fontWeight: 600,
              textDecoration: 'none', marginBottom: 28,
              transition: 'color 0.2s',
            }}
            className="wm-back-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            {backLabel}
          </motion.a>

          {/* Category + date */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}
          >
            <span style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
              textTransform: 'uppercase', padding: '4px 12px', borderRadius: '100px',
              background: isBlog ? '#dcfce7' : '#dbeafe',
              color: isBlog ? '#15803d' : '#1d4ed8',
              fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))',
            }}>
              {post.category || (isBlog ? 'Blog' : 'Tuyển dụng')}
            </span>
            <span style={{
              color: 'var(--wm-text-muted)', fontSize: '12px',
              fontFamily: 'var(--nic-font-monospace, monospace)',
            }}>
              {post.date}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-vi)',
              fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900,
              letterSpacing: '-1.5px', lineHeight: 1.1,
              color: '#fff', margin: '0 0 18px',
              textShadow: '0 4px 40px rgba(0,0,0,0.4)',
            }}
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              style={{
                fontFamily: 'var(--font-vi)', fontSize: 'clamp(14px, 2vw, 17px)',
                color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, margin: 0,
                maxWidth: '720px',
              }}
            >
              {post.excerpt}
            </motion.p>
          )}
        </div>
      </section>

      {/* ══ CONTENT — nền F8F9FB y hệt section homepage ══ */}
      <div style={{ background: '#F8F9FB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(32px,6vw,64px) clamp(16px,4vw,32px) clamp(48px,6vw,80px)' }}>

          {/* Thumbnail featured image */}
          {/* Reading column — max 820px centered */}
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>

            {post.thumbnail && (
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: 52, borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 40px rgba(15,76,129,0.12)' }}
              >
                <img src={post.thumbnail} alt={post.title}
                  style={{ width: '100%', aspectRatio: '16/8', objectFit: 'cover', display: 'block' }} />
              </motion.div>
            )}

            {/* Article body */}
            {post.content ? (
              <motion.article
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="wm-article-body"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '48px 0', fontFamily: 'var(--font-vi)' }}>
                Nội dung đang được cập nhật...
              </p>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: '#E5E8ED', margin: '56px 0 40px' }} />

            {/* Back button */}
            <a href={`/${lang}/${backUrl}`}
            className="wm-detail-back"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: '10px',
              border: '1.5px solid #0b2a59', color: '#0b2a59',
              fontSize: '14px', fontWeight: 700, textDecoration: 'none',
              fontFamily: 'var(--font-vi)', transition: 'all 0.25s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            {backLabel}
          </a>

          </div>{/* end reading column */}
        </div>

        {/* ══ RELATED — dùng wm-bloom-card y chang PostsCarousel ══ */}
        {relatedPosts.length > 0 && (
          <div style={{ background: '#fff', borderTop: '1px solid #E5E8ED', padding: '56px 24px 72px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

              {/* Heading giống sections trang chủ */}
              <div className="wm-animate" style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{
                  color: '#0b2a59', fontSize: 'clamp(22px, 3vw, 36px)',
                  fontWeight: 800, letterSpacing: '-0.5px',
                  margin: '0 0 16px', fontFamily: 'var(--font-vi)',
                }}>
                  Bài viết liên quan
                </h2>
                <div style={{
                  width: '60px', height: '4px', margin: '0 auto', borderRadius: '2px',
                  background: 'linear-gradient(90deg, var(--color-teal), var(--color-indigo))',
                }} />
              </div>

              <div className="wm-related-grid">
                {relatedPosts.map((r, i) => {
                  const rIsBlog = r.type === 'blog'
                  return (
                    <motion.div
                      key={r._id}
                      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.15 }}
                      transition={{ duration: 0.55, delay: i * 0.1 }}
                    >
                      <a href={`/${lang}/${backUrl}/${r.slug}`}
                        className="wm-bloom-card"
                        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}
                      >
                        <div className="wm-bloom-img-wrap">
                          {r.thumbnail
                            ? <img src={r.thumbnail} alt={r.title} className="wm-bloom-img" />
                            : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#E8F5E9,#E3F2FD)' }} />}
                        </div>
                        <div className="wm-bloom-body">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
                              textTransform: 'uppercase', padding: '3px 10px', borderRadius: '100px',
                              background: rIsBlog ? '#dcfce7' : '#dbeafe',
                              color: rIsBlog ? '#15803d' : '#1d4ed8',
                              fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))',
                            }}>
                              {r.category}
                            </span>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--nic-font-monospace, monospace)' }}>
                              {r.date}
                            </span>
                          </div>
                          <div style={{ height: '1px', background: '#EAF1F8' }} />
                          <h3 style={{
                            fontSize: '15px', fontWeight: 700, lineHeight: 1.4,
                            color: '#062340', margin: 0,
                            fontFamily: 'var(--font-vi)',
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {r.title}
                          </h3>
                        </div>
                      </a>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .wm-back-link:hover { color: var(--wm-green) !important; }
        .wm-detail-back:hover { background: #0b2a59 !important; color: #fff !important; }
        .wm-related-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 24px;
        }
        @media (max-width: 900px) { .wm-related-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 580px) { .wm-related-grid { grid-template-columns: 1fr !important; } }

        /* ─── Article typography — dùng màu đúng WM ─── */
        .wm-article-body {
          font-family: var(--font-vi);
          font-size: 16px; line-height: 1.85; color: #334155;
        }
        .wm-article-body h1,.wm-article-body h2,.wm-article-body h3,
        .wm-article-body h4,.wm-article-body h5 {
          color: #0b2a59; font-weight: 800; line-height: 1.25;
          margin: 2em 0 0.7em; letter-spacing: -0.3px;
        }
        .wm-article-body h1 { font-size: 2em; }
        .wm-article-body h2 { font-size: 1.55em; }
        .wm-article-body h3 { font-size: 1.25em; }
        .wm-article-body p { margin: 0 0 1.3em; }
        .wm-article-body a { color: var(--wm-green-dark,#16a34a); text-decoration: underline; }
        .wm-article-body a:hover { color: var(--wm-green,#22c55e); }
        .wm-article-body img {
          max-width: 100%; border-radius: 12px; margin: 1.5em 0;
          display: block; box-shadow: 0 4px 24px rgba(15,76,129,0.1);
        }
        .wm-article-body ul,.wm-article-body ol {
          margin: 0 0 1.3em; padding-left: 1.5em;
        }
        .wm-article-body li { margin-bottom: 0.45em; }
        .wm-article-body blockquote {
          border-left: 4px solid var(--wm-green,#22c55e);
          background: #f0fdf4; margin: 1.5em 0;
          padding: 16px 20px; border-radius: 0 10px 10px 0;
          color: #166534; font-style: italic;
        }
        .wm-article-body code {
          background: #EAF1F8; color: #0b2a59;
          padding: 2px 7px; border-radius: 5px;
          font-family: var(--nic-font-monospace,monospace); font-size: 0.875em;
        }
        .wm-article-body pre {
          background: var(--wm-darker,#05070b); color: rgba(255,255,255,0.88);
          padding: 20px 24px; border-radius: 12px;
          overflow-x: auto; margin: 1.5em 0;
          font-family: var(--nic-font-monospace,monospace); font-size: 14px; line-height: 1.7;
        }
        .wm-article-body pre code { background: none; color: inherit; padding: 0; }
        .wm-article-body table { width: 100%; border-collapse: collapse; margin: 1.5em 0; }
        .wm-article-body th {
          background: #0b2a59; color: #fff;
          padding: 10px 14px; text-align: left; font-weight: 700; font-size: 13px;
        }
        .wm-article-body td { padding: 10px 14px; border-bottom: 1px solid #E5E8ED; font-size: 14px; }
        .wm-article-body tr:hover td { background: #F8F9FB; }
        .wm-article-body hr { border: none; border-top: 1px solid #E5E8ED; margin: 2em 0; }
        .wm-article-body strong { color: #0b2a59; font-weight: 700; }
      `}</style>
    </div>
  )
}
