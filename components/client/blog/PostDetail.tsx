'use client'

import { motion } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'

export interface PostDetailData {
  slug: string
  type: 'blog' | 'tuyen-dung'
  thumbnail: string
  date: string
  category: string
  title: string
  excerpt: string
  content: string
  urgent?: boolean
  deadline?: string
  jobType?: string
  location?: string
  salary?: string
}

interface RelatedPost {
  _id: string; slug: string; title: string
  date: string; thumbnail: string; category: string; type: string
}

interface Props {
  post: PostDetailData
  postId: string
  lang: string
  backUrl: string
  backLabel: string
  relatedPosts: RelatedPost[]
  isLoggedIn?: boolean
  likeCount?: number
  thumbnailPosition?: string
}

const JOB_TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  'full-time':  { label: 'Full-time',  color: '#1d4ed8', bg: '#dbeafe' },
  'part-time':  { label: 'Part-time',  color: '#7c3aed', bg: '#ede9fe' },
  'remote':     { label: 'Remote',     color: '#0f766e', bg: '#ccfbf1' },
  'hybrid':     { label: 'Hybrid',     color: '#0369a1', bg: '#e0f2fe' },
  'internship': { label: 'Thực tập',   color: '#b45309', bg: '#fef3c7' },
  'freelance':  { label: 'Freelance',  color: '#be185d', bg: '#fce7f3' },
}

function getDaysLeft(deadline: string): number | null {
  if (!deadline) return null
  const d = new Date(deadline)
  if (isNaN(d.getTime())) return null
  const diff = Math.ceil((d.getTime() - Date.now()) / 86400000)
  return diff
}

function JobInfoPanel({ post }: { post: PostDetailData }) {
  const jt = post.jobType ? JOB_TYPE_LABELS[post.jobType] : null
  const daysLeft = getDaysLeft(post.deadline ?? '')
  const isExpired = daysLeft !== null && daysLeft < 0
  const deadlineDate = post.deadline ? new Date(post.deadline).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''

  const infoItems = [
    post.location && {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      label: 'Địa điểm',
      value: post.location,
    },
    post.salary && {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      label: 'Mức lương',
      value: post.salary,
    },
    post.deadline && {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      label: 'Hạn nộp hồ sơ',
      value: isExpired
        ? `${deadlineDate} (Đã hết hạn)`
        : daysLeft === 0
          ? `${deadlineDate} (Hôm nay!)`
          : `${deadlineDate} (còn ${daysLeft} ngày)`,
      valueColor: isExpired ? '#ef4444' : daysLeft !== null && daysLeft <= 7 ? '#f59e0b' : '#00A98F',
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; valueColor?: string }[]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1 }}
      style={{ marginBottom: 40 }}
    >
      <div style={{
        background: 'linear-gradient(135deg, #062340 0%, #0F4C81 60%, #1565a8 100%)',
        borderRadius: 20,
        padding: 'clamp(24px, 4vw, 36px)',
        boxShadow: '0 20px 60px -12px rgba(6,35,64,0.35)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,169,143,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: '30%', width: 140, height: 140, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {post.urgent && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 14px', borderRadius: 100,
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.4)',
                  color: '#fca5a5', fontSize: 11, fontWeight: 800,
                  letterSpacing: '1.5px', textTransform: 'uppercase',
                }}>
                  🔥 Tuyển gấp
                </span>
              )}
              {jt && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 14px', borderRadius: 100,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.8px',
                }}>
                  💼 {jt.label}
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              {infoItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>{item.icon}</span>
                    {item.label}
                  </div>
                  <div style={{ color: item.valueColor ?? '#fff', fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', flexShrink: 0 }}>
            {!isExpired ? (
              <a
                href={`mailto:hr@wonmedia.com?subject=Ứng tuyển: ${encodeURIComponent(post.title)}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 28px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #00A98F, #34D4B8)',
                  color: '#fff', fontSize: 14, fontWeight: 800,
                  textDecoration: 'none', letterSpacing: '0.2px',
                  boxShadow: '0 8px 24px -6px rgba(0,169,143,0.5)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px -6px rgba(0,169,143,0.6)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px -6px rgba(0,169,143,0.5)' }}
              >
                Ứng tuyển ngay
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
            ) : (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 28px', borderRadius: 12,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 700,
                letterSpacing: '0.2px',
              }}>
                Đã đóng tuyển dụng
              </span>
            )}
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
              Gửi CV tới <span style={{ color: 'rgba(255,255,255,0.7)' }}>hr@wonmedia.com</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function PostDetail({
  post, postId, lang, backUrl, backLabel, relatedPosts,
  isLoggedIn = false, likeCount: initLikeCount = 0,
  thumbnailPosition = 'center center',
}: Props) {
  const isBlog = post.type === 'blog'
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initLikeCount)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) return
    fetch(`/api/posts/${postId}/like`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setLiked(d.liked); setLikeCount(d.count) } })
      .catch(() => {})
  }, [postId, isLoggedIn])

  const handleLike = useCallback(async () => {
    if (!isLoggedIn) { window.location.href = '/auth/login'; return }
    const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
    if (!res.ok) return
    const data = await res.json()
    setLiked(data.liked)
    setLikeCount(data.count)
  }, [postId, isLoggedIn])

  const handleShare = useCallback(async (platform: string) => {
    const url = window.location.href
    const title = post.title
    if (platform === 'copy') {
      await navigator.clipboard.writeText(url)
      setSharing(true)
      setTimeout(() => setSharing(false), 2000)
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400')
    }
  }, [post.title])

  return (
    <div style={{ background: 'var(--wm-dark)', fontFamily: 'var(--font-vi)' }}>

      <section style={{
        position: 'relative', width: '100%', minHeight: '420px',
        display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
      }}>
        {post.thumbnail ? (
          <img src={post.thumbnail} alt={post.title} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: thumbnailPosition,
            filter: 'brightness(0.55) contrast(1.05) saturate(0.9)',
          }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #191B24, #0F4C81)' }} />
        )}

        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(25,27,36,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.45, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 0)', backgroundSize: '3px 3px' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '220px', background: 'linear-gradient(to bottom, transparent, var(--wm-dark))' }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: 'clamp(80px,10vw,100px) clamp(16px,4vw,32px) 48px' }}>

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

      <div style={{ background: '#F8F9FB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(32px,6vw,64px) clamp(16px,4vw,32px) clamp(48px,6vw,80px)' }}>

          {!isBlog && (
            <JobInfoPanel post={post} />
          )}

          <div>

            {post.thumbnail && (
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                style={{ marginBottom: 52, borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 40px rgba(15,76,129,0.12)' }}
              >
                <img src={post.thumbnail} alt={post.title}
                  style={{ width: '100%', aspectRatio: '16/8', objectFit: 'cover', objectPosition: thumbnailPosition, display: 'block' }} />
              </motion.div>
            )}

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

            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              margin: '48px 0 0', padding: '20px 0', flexWrap: 'wrap',
              borderTop: '1px solid #E5E8ED',
            }}>
              <button
                onClick={handleLike}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 100, border: 'none',
                  background: liked ? '#EEF0FE' : '#F8F9FB',
                  color: liked ? '#6366F1' : '#64748b',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: 'var(--font-primary)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24"
                  fill={liked ? 'currentColor' : 'none'}
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {likeCount > 0 ? `${likeCount} Thích` : 'Thích'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Chia sẻ:</span>
                <button onClick={() => handleShare('facebook')} title="Chia sẻ Facebook"
                  style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #E5E8ED', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#EAF1F8')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button onClick={() => handleShare('twitter')} title="Chia sẻ X/Twitter"
                  style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #E5E8ED', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#EAF1F8')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#000">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <button onClick={() => handleShare('copy')} title="Sao chép link"
                  style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #E5E8ED', background: sharing ? '#DEF5EE' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s', color: sharing ? '#007D69' : '#64748b' }}
                >
                  {sharing ? (
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div style={{ height: 1, background: '#E5E8ED', margin: '56px 0 40px' }} />

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

          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div style={{ background: '#fff', borderTop: '1px solid #E5E8ED', padding: '56px 24px 72px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

              <div className="wm-animate" style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{
                  color: '#0b2a59', fontSize: 'clamp(22px, 3vw, 36px)',
                  fontWeight: 800, letterSpacing: '-0.5px',
                  margin: '0 0 16px', fontFamily: 'var(--font-vi)',
                }}>
                  {({'vi':'Bài viết liên quan','en':'Related Posts','ko':'관련 기사','ja':'関連記事','zh':'相关文章'} as Record<string, string>)[lang] ?? 'Bài viết liên quan'}
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
