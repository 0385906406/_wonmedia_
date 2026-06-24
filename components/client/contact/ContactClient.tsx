'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

export interface ContactT {
  lang: string
  bannerSubtitle: string; bannerTitle: string
  address: string; phone: string; hotline: string
  email: string; zalo: string
  googleMapsUrl: string; googleMapsEmbed: string
  formTitle: string; formSubtitle: string
}

const VP = { once: true, amount: 0.2 }
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const fadeUp   = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7,  ease: EASE } } }
const fadeLeft = { hidden: { opacity: 0, x: -48 }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } } }
const fadeRight= { hidden: { opacity: 0, x: 48  }, visible: { opacity: 1, x: 0, transition: { duration: 0.75, ease: EASE } } }

const IPhone = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.09-1.09a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
const IMail  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const IPin   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const ISend  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
const IMsg   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const IUser  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IEdit  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="17" height="17"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IAlert = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const ILoader= () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ animation: 'wm-contact-spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>

const LABELS: Record<string, Record<string, string>> = {
  name:         { vi: 'Họ và tên',         en: 'Full Name',          ko: '성명',    ja: 'お名前',      zh: '姓名'   },
  email:        { vi: 'Email',              en: 'Email',              ko: '이메일',  ja: 'メール',       zh: '邮箱'   },
  subject:      { vi: 'Chủ đề',            en: 'Subject',            ko: '제목',    ja: '件名',        zh: '主题'   },
  message:      { vi: 'Lời nhắn',          en: 'Message',            ko: '메시지',  ja: 'メッセージ',   zh: '留言'   },
  send:         { vi: 'Gửi yêu cầu ngay',  en: 'Send Message',       ko: '메시지 보내기', ja: '送信する', zh: '发送消息' },
  sending:      { vi: 'Đang xử lý...',     en: 'Processing...',      ko: '처리 중...', ja: '送信中...', zh: '处理中...' },
  wait:         { vi: 'Chờ',               en: 'Wait',               ko: '대기',    ja: '待機',        zh: '等待'   },
  seconds:      { vi: 's',                 en: 's',                  ko: '초',      ja: '秒',          zh: '秒'     },
  namePh:       { vi: 'Nguyễn Văn A',      en: 'John Doe',           ko: '홍길동',  ja: '山田太郎',     zh: '张三'   },
  subjectPh:    { vi: 'Tôi muốn hợp tác...', en: 'I want to collaborate...', ko: '협업하고 싶습니다...', ja: '協力したいです...', zh: '我想合作...' },
  messagePh:    { vi: 'Nội dung chi tiết...', en: 'How can we help?', ko: '자세한 내용...', ja: '詳細を入力...', zh: '详细内容...' },
  support:      { vi: 'Hỗ trợ 24/7',       en: 'Support 24/7',       ko: '24/7 지원', ja: '24/7サポート', zh: '24/7支持' },
  openMap:      { vi: 'Xem trên Google Maps', en: 'Open in Google Maps', ko: 'Google Maps에서 열기', ja: 'Google Mapsで開く', zh: '在Google地图中打开' },
  successMsg:   { vi: 'Gửi thành công! Chúng tôi sẽ phản hồi sớm.', en: 'Sent! We will reply soon.', ko: '전송 성공!', ja: '送信しました！', zh: '发送成功！' },
  errorMsg:     { vi: 'Lỗi hệ thống, vui lòng thử lại.', en: 'Error, please try again.', ko: '오류가 발생했습니다.', ja: 'エラーが発生しました。', zh: '发生错误，请重试。' },
  required:     { vi: 'Không được để trống', en: 'Required',          ko: '필수 항목', ja: '必須項目',   zh: '不能为空' },
  invalidEmail: { vi: 'Email không hợp lệ', en: 'Invalid email',      ko: '이메일 형식 오류', ja: 'メール形式が無効', zh: '邮箱格式无效' },
  headquarters: { vi: 'TRỤ SỞ CHÍNH',       en: 'HEADQUARTERS',       ko: '본사',    ja: '本社',        zh: '总部'   },
  addressLabel: { vi: 'Địa chỉ',            en: 'Address',            ko: '주소',    ja: '住所',        zh: '地址'   },
  emailLabel:   { vi: 'Email liên hệ',      en: 'Email',              ko: '이메일',  ja: 'メール',       zh: '邮箱'   },
  hotlineLabel: { vi: 'Hotline',            en: 'Hotline',            ko: '핫라인',  ja: 'ホットライン', zh: '热线'   },
}
function lb(lang: string, key: string) { return LABELS[key]?.[lang] || LABELS[key]?.en || key }

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--color-gray-text)', fontFamily: 'var(--font-primary)' }}>{label}</label>
      {children}
      {error && (
        <p style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--color-error)', fontFamily: 'var(--font-primary)', margin: 0 }}>
          <IAlert />{error}
        </p>
      )}
    </div>
  )
}

function BannerSection({ t }: { t: ContactT }) {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 240, overflow: 'hidden', display: 'flex', alignItems: 'center', color: '#fff', marginTop: 'calc(-1 * var(--topbar-height))' }}>
      <motion.div
        initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={VP}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: 0, backgroundImage: "url('/banners/banner.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(6,35,64,0.88) 0%, rgba(0,169,143,0.22) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.28, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 0)', backgroundSize: '4px 4px' }} />

      <div className="container won-contact-banner" style={{ position: 'relative', zIndex: 10, paddingTop: 'calc(var(--topbar-height) + 52px)', paddingBottom: '52px' }}>
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP} transition={{ duration: 0.7, delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ width: 40, height: 3, background: 'var(--color-teal)', borderRadius: 2, display: 'block' }} />
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#00A98F', fontFamily: 'var(--font-primary)' }}>{t.bannerSubtitle}</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={VP}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          style={{ fontSize: 'clamp(24px, 3.5vw, 42px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', fontFamily: 'var(--font-primary)', color: '#fff', textShadow: '0 4px 32px rgba(0,0,0,0.3)', margin: 0 }}
        >
          {t.bannerTitle}
        </motion.h1>
      </div>
    </div>
  )
}

function InfoSection({ t }: { t: ContactT }) {
  const cards = [
    { icon: <IPhone />, color: 'var(--color-teal)',   bg: 'var(--color-teal-pale)',   label: lb(t.lang, 'hotlineLabel'), value: t.hotline || t.phone, href: `tel:${(t.hotline || t.phone).replace(/\s/g, '')}` },
    { icon: <IMail />,  color: 'var(--color-indigo)', bg: 'var(--color-indigo-pale)', label: lb(t.lang, 'emailLabel'),   value: t.email,              href: `mailto:${t.email}` },
    { icon: <IPin />,   color: 'var(--color-navy)',   bg: 'var(--color-navy-pale)',   label: lb(t.lang, 'addressLabel'), value: t.address,            href: t.googleMapsUrl || undefined },
  ]

  return (
    <section style={{ background: 'var(--color-gray-light)', paddingBlock: 'var(--space-20)', overflow: 'hidden' }}>
      <div className="container">
        <div className="won-info-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'stretch' }}>

          {/* Left: heading + cards */}
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeLeft}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <span className="qp-sechead__eyebrow type-tag" style={{ fontSize: 16, letterSpacing: '1.5px' }}>{lb(t.lang, 'headquarters')}</span>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.5px', margin: '8px 0 0' }}>WON Media</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {cards.map((c, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  onClick={() => c.href && window.open(c.href, '_blank')}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--color-gray-border)', padding: '16px 20px', boxShadow: 'var(--shadow-card)', cursor: c.href ? 'pointer' : 'default', transition: 'box-shadow 0.2s, transform 0.2s' }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {c.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--color-gray-text)', margin: '0 0 3px', fontFamily: 'var(--font-primary)' }}>{c.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-navy-deep)', lineHeight: 1.5, fontFamily: 'var(--font-primary)', margin: 0 }}>{c.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: map */}
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeRight}
            style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lift)', border: '1.5px solid var(--color-gray-border)', minHeight: 280 }}>
            {t.googleMapsEmbed && /^https:\/\/(www\.)?google\.com\/maps\//.test(t.googleMapsEmbed) ? (
              <iframe src={t.googleMapsEmbed} style={{ width: '100%', height: '100%', minHeight: 280, border: 'none', display: 'block' }} allowFullScreen loading="lazy" title="WON Media Map" />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--color-navy-pale)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <div style={{ color: 'var(--color-navy)', opacity: 0.35, transform: 'scale(2)' }}><IPin /></div>
                {t.googleMapsUrl && (
                  <a href={t.googleMapsUrl} target="_blank" rel="noreferrer" className="qp-btn-secondary" style={{ marginTop: 8, fontSize: 12 }}>
                    {lb(t.lang, 'openMap')} <span className="qp-arrow">→</span>
                  </a>
                )}
              </div>
            )}
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .won-info-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

function FormSection({ t }: { t: ContactT }) {
  const [form, setForm]           = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors]       = useState<Record<string, string>>({})
  const [submitting, setSubmit]   = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [flash, setFlash]         = useState<{ msg: string; ok: boolean } | null>(null)
  const lang = t.lang
  const isSubmittingRef = useRef(false)

  useEffect(() => {
    const last = localStorage.getItem('contact_sent')
    if (last) { const diff = Date.now() - +last; if (diff < 60000) setCountdown(Math.ceil((60000 - diff) / 1000)) }
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const id = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [countdown])

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim())    e.name    = lb(lang, 'required')
    if (!form.email.trim())   e.email   = lb(lang, 'required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = lb(lang, 'invalidEmail')
    if (!form.subject.trim()) e.subject = lb(lang, 'required')
    if (!form.message.trim()) e.message = lb(lang, 'required')
    setErrors(e); return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (countdown > 0 || !validate()) return
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setSubmit(true)
    try {
      const res  = await fetch('/api/contact/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) {
        setFlash({ msg: lb(lang, 'successMsg'), ok: true })
        localStorage.setItem('contact_sent', Date.now().toString())
        setCountdown(60)
        setForm({ name: '', email: '', subject: '', message: '' })
        setErrors({})
      } else {
        setFlash({ msg: data.error || lb(lang, 'errorMsg'), ok: false })
      }
    } catch { setFlash({ msg: lb(lang, 'errorMsg'), ok: false }) }
    finally { isSubmittingRef.current = false; setSubmit(false); setTimeout(() => setFlash(null), 4000) }
  }

  const inp = (hasErr?: string): React.CSSProperties => ({
    width: '100%', padding: '12px 16px',
    background: hasErr ? '#FEF2F2' : '#F8FAFC',
    border: `1.5px solid ${hasErr ? '#fca5a5' : '#E2E8F0'}`,
    borderRadius: 10, fontSize: 14,
    color: 'var(--color-navy-deep)', fontFamily: 'var(--font-primary)',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
    boxSizing: 'border-box' as const,
  })

  const disabled = submitting || countdown > 0

  return (
    <section style={{ background: '#F8F9FB', paddingBlock: 'var(--space-20)' }}>
      <div className="container">

        {/* Header */}
        <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="type-tag" style={{ fontSize: 14, letterSpacing: '2px', color: '#00A98F', fontWeight: 700, display: 'block', marginBottom: 12 }}>{lb(lang, 'support')}</span>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, letterSpacing: '-0.5px', color: '#062340', margin: '0 0 14px', fontFamily: 'var(--font-primary)' }}>{t.formTitle}</h2>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: '0 auto', maxWidth: 520, fontFamily: 'var(--font-primary)' }}>{t.formSubtitle}</p>
          <div style={{ width: 56, height: 4, background: 'linear-gradient(90deg, #00A98F, #6366f1)', borderRadius: 2, margin: '20px auto 0' }} />
        </motion.div>

        <div className="won-form-wrap" style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 0, borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 48px rgba(6,35,64,0.13)', border: '1px solid #E2E8F0' }}>

          {/* Left panel */}
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeLeft}
            style={{ background: 'linear-gradient(160deg, #062340 0%, #0a3d6b 55%, #00534a 100%)', padding: '52px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>

            {/* Decorative blobs */}
            <div style={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'rgba(0,169,143,0.18)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(99,102,241,0.14)', filter: 'blur(48px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 0)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Icon */}
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(0,169,143,0.22)', border: '1px solid rgba(0,169,143,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D4B8', marginBottom: 28 }}>
                <IMsg />
              </div>
              <h3 style={{ fontSize: 'clamp(20px, 2vw, 28px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', fontFamily: 'var(--font-primary)', lineHeight: 1.2, margin: '0 0 16px' }}>{t.formTitle}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, fontFamily: 'var(--font-primary)', margin: 0 }}>{t.formSubtitle}</p>
            </div>

            {/* Contact rows */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 0, margin: '40px 0' }}>
              {[
                { icon: <IPhone />, label: lb(lang, 'hotlineLabel'), value: t.hotline || t.phone, href: `tel:${(t.hotline || t.phone).replace(/\s/g, '')}` },
                { icon: <IMail />,  label: lb(lang, 'emailLabel'),   value: t.email,              href: `mailto:${t.email}` },
              ].map((row, i) => (
                <a key={i} href={row.href}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none', textDecoration: 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D4B8', flexShrink: 0 }}>{row.icon}</div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-primary)' }}>{row.label}</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: 'var(--font-primary)' }}>{row.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Live badge */}
            <div style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(0,169,143,0.15)', border: '1px solid rgba(0,169,143,0.3)', borderRadius: 100, padding: '8px 16px', alignSelf: 'flex-start' }}>
              <span className="qp-dot is-live" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#34D4B8', fontFamily: 'var(--font-primary)' }}>{lb(lang, 'support')}</span>
            </div>
          </motion.div>

          {/* Right panel: form */}
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeRight}
            className="won-form-body" style={{ background: '#fff', padding: '52px 48px' }}>

            {flash && (
              <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                style={{ marginBottom: 28, padding: '14px 18px', borderRadius: 12, fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-primary)', display: 'flex', alignItems: 'center', gap: 10, background: flash.ok ? '#F0FDF9' : '#FEF2F2', color: flash.ok ? '#065f46' : '#991b1b', border: `1.5px solid ${flash.ok ? '#6ee7b7' : '#fca5a5'}` }}>
                {flash.ok
                  ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                {flash.msg}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="won-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label={`${lb(lang, 'name')} *`} error={errors.name}>
                  <input type="text" value={form.name} placeholder={lb(lang, 'namePh')} className="won-inp"
                    style={inp(errors.name)}
                    onChange={e => { setForm(f => ({ ...f, name: e.target.value })); if (errors.name) setErrors(r => ({ ...r, name: '' })) }} />
                </Field>
                <Field label={`${lb(lang, 'email')} *`} error={errors.email}>
                  <input type="email" value={form.email} placeholder="example@gmail.com" className="won-inp"
                    style={inp(errors.email)}
                    onChange={e => { setForm(f => ({ ...f, email: e.target.value })); if (errors.email) setErrors(r => ({ ...r, email: '' })) }} />
                </Field>
              </div>

              <Field label={`${lb(lang, 'subject')} *`} error={errors.subject}>
                <input type="text" value={form.subject} placeholder={lb(lang, 'subjectPh')} className="won-inp"
                  style={inp(errors.subject)}
                  onChange={e => { setForm(f => ({ ...f, subject: e.target.value })); if (errors.subject) setErrors(r => ({ ...r, subject: '' })) }} />
              </Field>

              <Field label={`${lb(lang, 'message')} *`} error={errors.message}>
                <textarea rows={5} value={form.message} placeholder={lb(lang, 'messagePh')} className="won-inp"
                  style={{ ...inp(errors.message), resize: 'vertical', minHeight: 130 }}
                  onChange={e => { setForm(f => ({ ...f, message: e.target.value })); if (errors.message) setErrors(r => ({ ...r, message: '' })) }} />
              </Field>

              <motion.button type="submit" disabled={disabled}
                whileHover={!disabled ? { y: -2 } : {}}
                style={{
                  width: '100%', padding: '15px 28px', marginTop: 4,
                  background: disabled ? '#cbd5e1' : 'linear-gradient(135deg, #00A98F, #0a6be6)',
                  color: disabled ? '#94a3b8' : '#fff', border: 'none', borderRadius: 12,
                  fontSize: 15, fontWeight: 800, fontFamily: 'var(--font-primary)', letterSpacing: '0.2px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: disabled ? 'none' : '0 8px 24px -4px rgba(0,169,143,0.4)',
                  transition: 'box-shadow 0.2s, background 0.2s',
                }}>
                {submitting
                  ? <><ILoader />{lb(lang, 'sending')}</>
                  : countdown > 0
                    ? `${lb(lang, 'wait')} ${countdown}${lb(lang, 'seconds')}`
                    : <>{lb(lang, 'send')}<ISend /></>}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes wm-contact-spin { to { transform: rotate(360deg); } }
        .won-inp:focus { border-color: #00A98F !important; background: #fff !important; box-shadow: 0 0 0 3px rgba(0,169,143,0.12) !important; }
        @media (max-width: 768px) {
          .won-form-wrap { grid-template-columns: 1fr !important; }
          .won-form-body { padding: 36px 24px !important; }
          .won-form-row  { grid-template-columns: 1fr !important; }
          .won-contact-banner { padding-block: 48px !important; }
        }
      `}</style>
    </section>
  )
}

export function ContactClient({ t }: { t: ContactT }) {
  return (
    <>
      <BannerSection t={t} />
      <FormSection   t={t} />
      <InfoSection   t={t} />
    </>
  )
}
