'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

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
  lang: string
  backUrl: string
  backLabel: string
  relatedPosts: RelatedPost[]
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

const ILocation = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const ISalary = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)
const ICalendar = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)

function getDaysLeft(deadline: string): number | null {
  if (!deadline) return null
  const d = new Date(deadline)
  if (isNaN(d.getTime())) return null
  return Math.ceil((d.getTime() - Date.now()) / 86400000)
}

function JobSidebar({ post, lang, backUrl, backLabel, thumbnailPosition }: {
  post: PostDetailData; lang: string; backUrl: string; backLabel: string; thumbnailPosition: string
}) {
  const jt = post.jobType ? JOB_TYPE_LABELS[post.jobType] : null
  const daysLeft = getDaysLeft(post.deadline ?? '')
  const isExpired = daysLeft !== null && daysLeft < 0
  const deadlineDate = post.deadline
    ? new Date(post.deadline).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : ''

  const infoItems = [
    post.location && { icon: <ILocation />, label: 'Địa điểm', value: post.location, color: undefined },
    post.salary   && { icon: <ISalary />,   label: 'Mức lương', value: post.salary,   color: undefined },
    post.deadline && {
      icon: <ICalendar />, label: 'Hạn nộp hồ sơ',
      value: isExpired
        ? `${deadlineDate} · Đã hết hạn`
        : daysLeft === 0 ? `${deadlineDate} · Hôm nay!`
        : `${deadlineDate} · còn ${daysLeft} ngày`,
      color: isExpired ? '#ef4444' : daysLeft !== null && daysLeft <= 7 ? '#f59e0b' : '#00A98F',
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; color?: string }[]

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')
    try {
      const res = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: `Ứng tuyển: ${post.title}`,
          message: [
            form.phone ? `Điện thoại: ${form.phone}` : '',
            form.message,
          ].filter(Boolean).join('\n\n'),
        }),
      })
      const data = await res.json()
      if (!res.ok) { setErrMsg(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.'); setStatus('error') }
      else setStatus('success')
    } catch {
      setErrMsg('Không thể kết nối. Vui lòng thử lại.')
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px', borderRadius: 10,
    border: '1.5px solid #E2E8F0',
    fontSize: 13, fontFamily: 'var(--font-vi)', color: '#0f172a',
    background: '#F8FAFC', outline: 'none',
    transition: 'border-color 0.2s',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 700,
    color: '#475569', marginBottom: 6, letterSpacing: '0.3px',
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 'calc(var(--topbar-height) + 24px)' }}
    >

      {/* ── Application form ── */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E8ED', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,169,143,0.10)' }}>
        <div style={{ height: 4, background: 'linear-gradient(90deg, #00A98F, #34D4B8)' }} />
        <div style={{ padding: '22px 22px 24px' }}>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#DEF5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="24" height="24" fill="none" stroke="#00A98F" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800, color: '#062340' }}>Đã gửi thành công!</p>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.</p>
            </div>
          ) : isExpired ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#94a3b8' }}>Vị trí này đã đóng tuyển dụng</p>
            </div>
          ) : (
            <>
              <h3 style={{ margin: '0 0 18px', fontSize: 15, fontWeight: 800, color: '#062340', letterSpacing: '-0.2px' }}>
                Ứng tuyển vị trí này
              </h3>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Họ và tên <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    className="wm-form-input" required value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Nguyễn Văn A" style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    className="wm-form-input" type="email" required value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@example.com" style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Số điện thoại</label>
                  <input
                    className="wm-form-input" type="tel" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="0901 234 567" style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Giới thiệu bản thân</label>
                  <textarea
                    className="wm-form-input" value={form.message} rows={4}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Chia sẻ về kinh nghiệm và lý do bạn phù hợp với vị trí này..."
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 96 }}
                  />
                </div>

                {errMsg && (
                  <p style={{ margin: 0, fontSize: 12, color: '#ef4444', background: '#FEF2F2', padding: '8px 12px', borderRadius: 8, border: '1px solid #fecaca' }}>
                    {errMsg}
                  </p>
                )}

                <button type="submit" disabled={status === 'loading'}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '13px 20px', borderRadius: 12, border: 'none', cursor: status === 'loading' ? 'wait' : 'pointer',
                    background: status === 'loading' ? '#94a3b8' : 'linear-gradient(135deg, #00A98F, #34D4B8)',
                    color: '#fff', fontSize: 14, fontWeight: 800,
                    letterSpacing: '0.2px', boxShadow: status === 'loading' ? 'none' : '0 6px 20px -4px rgba(0,169,143,0.4)',
                    transition: 'all 0.2s',
                  }}
                >
                  {status === 'loading' ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'wm-spin 1s linear infinite' }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    <>Gửi đơn ứng tuyển <IArrow /></>
                  )}
                </button>

                <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5 }}>
                  Hoặc gửi CV tới <span style={{ color: '#0F4C81', fontWeight: 600 }}>hr@wonmedia.com</span>
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ── Thumbnail ── */}
      {post.thumbnail && (
        <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(15,76,129,0.14)', border: '1px solid #E5E8ED' }}>
          <img src={post.thumbnail} alt={post.title}
            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', objectPosition: thumbnailPosition, display: 'block' }} />
        </div>
      )}

      {/* ── Job info ── */}
      {(post.urgent || jt || infoItems.length > 0) && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E8ED', overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,76,129,0.06)' }}>
          <div style={{ height: 4, background: 'linear-gradient(90deg, #062340, #00A98F)' }} />
          <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(post.urgent || jt) && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {post.urgent && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', background: '#FEF2F2', color: '#dc2626', border: '1px solid #fecaca' }}>🔥 Tuyển gấp</span>
                )}
                {jt && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: jt.bg, color: jt.color, border: `1px solid ${jt.color}28` }}>💼 {jt.label}</span>
                )}
              </div>
            )}
            {infoItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>{item.icon}</div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: item.color ?? '#062340', lineHeight: 1.4 }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Back button ── */}
      <a href={`/${lang}/${backUrl}`} className="wm-detail-back"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 20px', borderRadius: 10, border: '1.5px solid #0b2a59', color: '#0b2a59', fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-vi)', transition: 'all 0.25s ease' }}
      ><IBack />{backLabel}</a>
    </motion.aside>
  )
}

function BlogSidebar({ post, lang, backUrl, backLabel, thumbnailPosition }: {
  post: PostDetailData; lang: string; backUrl: string; backLabel: string; thumbnailPosition: string
}) {
  const wordCount = post.content?.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length ?? 0
  const readMin = Math.max(1, Math.round(wordCount / 200))

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 'calc(var(--topbar-height) + 24px)' }}
    >
      {/* Thumbnail */}
      {post.thumbnail && (
        <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(15,76,129,0.14)', border: '1px solid #E5E8ED' }}>
          <img src={post.thumbnail} alt={post.title}
            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', objectPosition: thumbnailPosition, display: 'block' }} />
        </div>
      )}

      {/* Metadata card */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E8ED', overflow: 'hidden', boxShadow: '0 4px 20px rgba(15,76,129,0.06)' }}>
        <div style={{ height: 4, background: 'linear-gradient(90deg, #062340, #00A98F)' }} />
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Category badge */}
          {post.category && (
            <span style={{
              alignSelf: 'flex-start', padding: '5px 14px', borderRadius: 100,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase',
              background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0',
            }}>{post.category}</span>
          )}

          {/* Info rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {post.date && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ngày đăng</p>
                  <p style={{ margin: '3px 0 0', fontSize: 13, fontWeight: 700, color: '#062340' }}>{post.date}</p>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Thời gian đọc</p>
                <p style={{ margin: '3px 0 0', fontSize: 13, fontWeight: 700, color: '#062340' }}>{readMin} phút đọc</p>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: '#F1F5F9' }} />

          {/* Back button */}
          <a href={`/${lang}/${backUrl}`} className="wm-detail-back"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 10,
              border: '1.5px solid #0b2a59', color: '#0b2a59',
              fontSize: 13, fontWeight: 700, textDecoration: 'none',
              fontFamily: 'var(--font-vi)', transition: 'all 0.25s ease',
            }}
          ><IBack />{backLabel}</a>
        </div>
      </div>
    </motion.aside>
  )
}

export function PostDetail({
  post, lang, backUrl, backLabel, relatedPosts,
  thumbnailPosition = 'center center',
}: Props) {
  const isBlog = post.type === 'blog'

  return (
    <div style={{ background: 'var(--wm-dark)', fontFamily: 'var(--font-vi)', marginTop: 'calc(-1 * var(--topbar-height))' }}>

      {/* ── Hero banner ── */}
      <section style={{
        position: 'relative', width: '100%', minHeight: 'calc(240px + var(--topbar-height))',
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
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, transparent, var(--wm-dark))' }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1280px', margin: '0 auto', padding: 'calc(var(--topbar-height) + 20px) clamp(16px,4vw,32px) 28px' }}>
          <motion.a href={`/${lang}/${backUrl}`}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--wm-text-muted)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: 28, transition: 'color 0.2s' }}
            className="wm-back-link"
          >
            <IBack />{backLabel}
          </motion.a>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}
          >
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '100px', background: isBlog ? '#dcfce7' : '#dbeafe', color: isBlog ? '#15803d' : '#1d4ed8', fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))' }}>
              {post.category || (isBlog ? 'Blog' : 'Tuyển dụng')}
            </span>
            <span style={{ color: 'var(--wm-text-muted)', fontSize: '12px', fontFamily: 'var(--nic-font-monospace, monospace)' }}>{post.date}</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontFamily: 'var(--font-vi)', fontSize: 'clamp(22px, 3.5vw, 38px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, color: '#fff', margin: '0 0 18px', textShadow: '0 4px 40px rgba(0,0,0,0.4)' }}
          >{post.title}</motion.h1>

          {post.excerpt && (
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
              style={{ fontFamily: 'var(--font-vi)', fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, margin: 0, maxWidth: '720px' }}
            >{post.excerpt}</motion.p>
          )}
        </div>
      </section>

      {/* ── Content area ── */}
      <div style={{ background: '#F8F9FB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(32px,6vw,64px) clamp(16px,4vw,32px) clamp(48px,6vw,80px)' }}>

          {/* Blog: two-column layout */}
          {isBlog && (
            <div className="wm-job-layout">
              {/* Left: article content */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                {post.content ? (
                  <article className="wm-article-body" dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '48px 0', fontFamily: 'var(--font-vi)' }}>Nội dung đang được cập nhật...</p>
                )}
                <div style={{ height: 1, background: '#E5E8ED', margin: '48px 0 0' }} />
              </motion.div>

              {/* Right: blog sidebar */}
              <BlogSidebar post={post} lang={lang} backUrl={backUrl} backLabel={backLabel} thumbnailPosition={thumbnailPosition} />
            </div>
          )}

          {/* Tuyen dung: two-column layout */}
          {!isBlog && (
            <div className="wm-job-layout">
              {/* Left: article content */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                {post.content ? (
                  <article className="wm-article-body" dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p style={{ color: '#94a3b8', textAlign: 'center', padding: '48px 0', fontFamily: 'var(--font-vi)' }}>Nội dung đang được cập nhật...</p>
                )}
                <div style={{ height: 1, background: '#E5E8ED', margin: '48px 0 0' }} />
              </motion.div>

              {/* Right: sidebar */}
              <JobSidebar post={post} lang={lang} backUrl={backUrl} backLabel={backLabel} thumbnailPosition={thumbnailPosition} />
            </div>
          )}
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div style={{ background: '#fff', borderTop: '1px solid #E5E8ED', padding: '56px 24px 72px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <div className="wm-animate" style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{ color: '#0b2a59', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.5px', margin: '0 0 16px', fontFamily: 'var(--font-vi)' }}>
                  {({'vi':'Bài viết liên quan','en':'Related Posts','ko':'관련 기사','ja':'関連記事','zh':'相关文章'} as Record<string,string>)[lang] ?? 'Bài viết liên quan'}
                </h2>
                <div style={{ width: '60px', height: '4px', margin: '0 auto', borderRadius: '2px', background: 'linear-gradient(90deg, var(--color-teal), var(--color-indigo))' }} />
              </div>
              <div className="wm-related-grid">
                {relatedPosts.map((r, i) => {
                  const rIsBlog = r.type === 'blog'
                  return (
                    <motion.div key={r._id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.15 }} transition={{ duration: 0.55, delay: i * 0.1 }}>
                      <a href={`/${lang}/${backUrl}/${r.slug}`} className="wm-bloom-card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
                        <div className="wm-bloom-img-wrap">
                          {r.thumbnail ? <img src={r.thumbnail} alt={r.title} className="wm-bloom-img" /> : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#E8F5E9,#E3F2FD)' }} />}
                        </div>
                        <div className="wm-bloom-body">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '100px', background: rIsBlog ? '#dcfce7' : '#dbeafe', color: rIsBlog ? '#15803d' : '#1d4ed8', fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))' }}>
                              {r.category}
                            </span>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--nic-font-monospace, monospace)' }}>{r.date}</span>
                          </div>
                          <div style={{ height: '1px', background: '#EAF1F8' }} />
                          <h3 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.4, color: '#062340', margin: 0, fontFamily: 'var(--font-vi)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
        .wm-form-input:focus { border-color: #00A98F !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(0,169,143,0.12) !important; }
        @keyframes wm-spin { to { transform: rotate(360deg); } }

        /* Two-column job layout */
        .wm-job-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .wm-job-layout {
            grid-template-columns: 1fr !important;
          }
          .wm-job-layout aside {
            position: static !important;
            order: -1;
          }
        }

        .wm-related-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        @media (max-width: 900px) { .wm-related-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 580px) { .wm-related-grid { grid-template-columns: 1fr !important; } }

        .wm-article-body { font-family: var(--font-vi); font-size: 16px; line-height: 1.85; color: #334155; }
        .wm-article-body h1,.wm-article-body h2,.wm-article-body h3,
        .wm-article-body h4,.wm-article-body h5 { color: #0b2a59; font-weight: 800; line-height: 1.25; margin: 2em 0 0.7em; letter-spacing: -0.3px; }
        .wm-article-body h1 { font-size: 2em; }
        .wm-article-body h2 { font-size: 1.55em; }
        .wm-article-body h3 { font-size: 1.25em; }
        .wm-article-body p { margin: 0 0 1.3em; }
        .wm-article-body a { color: var(--wm-green-dark,#16a34a); text-decoration: underline; }
        .wm-article-body a:hover { color: var(--wm-green,#22c55e); }
        .wm-article-body img { max-width: 100%; border-radius: 12px; margin: 1.5em 0; display: block; box-shadow: 0 4px 24px rgba(15,76,129,0.1); }
        .wm-article-body ul,.wm-article-body ol { margin: 0 0 1.3em; padding-left: 1.5em; }
        .wm-article-body li { margin-bottom: 0.45em; }
        .wm-article-body blockquote { border-left: 4px solid var(--wm-green,#22c55e); background: #f0fdf4; margin: 1.5em 0; padding: 16px 20px; border-radius: 0 10px 10px 0; color: #166534; font-style: italic; }
        .wm-article-body code { background: #EAF1F8; color: #0b2a59; padding: 2px 7px; border-radius: 5px; font-family: var(--nic-font-monospace,monospace); font-size: 0.875em; }
        .wm-article-body pre { background: var(--wm-darker,#05070b); color: rgba(255,255,255,0.88); padding: 20px 24px; border-radius: 12px; overflow-x: auto; margin: 1.5em 0; font-family: var(--nic-font-monospace,monospace); font-size: 14px; line-height: 1.7; }
        .wm-article-body pre code { background: none; color: inherit; padding: 0; }
        .wm-article-body table { width: 100%; border-collapse: collapse; margin: 1.5em 0; }
        .wm-article-body th { background: #0b2a59; color: #fff; padding: 10px 14px; text-align: left; font-weight: 700; font-size: 13px; }
        .wm-article-body td { padding: 10px 14px; border-bottom: 1px solid #E5E8ED; font-size: 14px; }
        .wm-article-body tr:hover td { background: #F8F9FB; }
        .wm-article-body hr { border: none; border-top: 1px solid #E5E8ED; margin: 2em 0; }
        .wm-article-body strong { color: #0b2a59; font-weight: 700; }
      `}</style>
    </div>
  )
}
