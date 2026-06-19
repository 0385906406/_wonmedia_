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
    <div style={{ position: 'relative', width: '100%', minHeight: 220, overflow: 'hidden', display: 'flex', alignItems: 'center', color: '#fff', marginTop: 'calc(-1 * var(--topbar-height))' }}>
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
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#00A98F', fontFamily: 'var(--font-primary)' }}>{t.bannerSubtitle}</span>
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
    { icon: <IPhone />, color: 'var(--color-teal)', bg: 'var(--color-teal-pale)',   label: lb(t.lang, 'hotlineLabel'), value: t.hotline || t.phone, href: `tel:${(t.hotline || t.phone).replace(/\s/g, '')}` },
    { icon: <IMail />,  color: 'var(--color-indigo)', bg: 'var(--color-indigo-pale)', label: lb(t.lang, 'emailLabel'),   value: t.email,              href: `mailto:${t.email}` },
    { icon: <IPin />,   color: 'var(--color-navy)',  bg: 'var(--color-navy-pale)',   label: lb(t.lang, 'addressLabel'), value: t.address,            href: t.googleMapsUrl || undefined },
  ]

  return (
    <section style={{ background: 'var(--color-gray-light)', paddingBlock: 'var(--space-20)', overflow: 'hidden' }}>
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeUp}
          className="qp-sechead" style={{ justifyContent: 'flex-start', textAlign: 'left', marginBottom: 48 }}>
          <div className="qp-sechead__titles" style={{ alignItems: 'flex-start' }}>
            <span className="qp-sechead__eyebrow type-tag" style={{ fontSize: 15, letterSpacing: '1.5px' }}>{lb(t.lang, 'headquarters')}</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>WON Media</h2>
          </div>
        </motion.div>

        <div className="won-info-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }}>
          {cards.map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.22 } }}
              onClick={() => c.href && window.open(c.href, '_blank')}
              style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--color-gray-border)', padding: '28px 24px', boxShadow: 'var(--shadow-card)', cursor: c.href ? 'pointer' : 'default', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${c.color}, transparent)`, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                {c.icon}
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-gray-text)', marginBottom: 8, fontFamily: 'var(--font-primary)' }}>{c.label}</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-navy-deep)', lineHeight: 1.6, fontFamily: 'var(--font-primary)', margin: 0 }}>{c.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeUp}
          style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lift)', border: '1.5px solid var(--color-gray-border)', height: 380 }}>
          {t.googleMapsEmbed && /^https:\/\/(www\.)?google\.com\/maps\//.test(t.googleMapsEmbed) ? (
            <iframe src={t.googleMapsEmbed} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} allowFullScreen loading="lazy" title="WON Media Map" />
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

      <style>{`
        @media (max-width: 640px) { .won-info-cards { grid-template-columns: 1fr !important; } }
        @media (min-width: 641px) and (max-width: 900px) { .won-info-cards { grid-template-columns: 1fr 1fr !important; } }
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
    width: '100%', padding: '13px 16px 13px 44px',
    background: 'var(--color-gray-light)',
    border: `1.5px solid ${hasErr ? 'var(--color-error)' : 'var(--color-gray-border)'}`,
    borderRadius: 'var(--radius-md)',
    fontSize: 14, color: 'var(--color-navy-deep)', fontFamily: 'var(--font-primary)',
    outline: 'none', transition: 'border-color 0.2s ease', boxSizing: 'border-box' as const,
  })
  const ic = (hasErr?: string) => ({ position: 'absolute' as const, left: 14, top: '50%', transform: 'translateY(-50%)', color: hasErr ? 'var(--color-error)' : 'var(--color-gray-border)', display: 'flex' as const })

  const disabled = submitting || countdown > 0

  return (
    <section style={{ background: '#fff', paddingBlock: 'var(--space-20)' }}>
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeUp}
          className="qp-sechead" style={{ justifyContent: 'flex-start', textAlign: 'left', marginBottom: 48 }}>
          <div className="qp-sechead__titles" style={{ alignItems: 'flex-start' }}>
            <span className="qp-sechead__eyebrow type-tag" style={{ fontSize: 15, letterSpacing: '1.5px' }}>{lb(lang, 'support')}</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>{t.formTitle}</h2>
          </div>
        </motion.div>

        <div className="won-form-wrap" style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lift)', border: '1px solid var(--color-gray-border)' }}>

          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeLeft}
            style={{ background: 'var(--gradient-g3)', padding: '48px 36px', display: 'flex', flexDirection: 'column', gap: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,169,143,0.14)', filter: 'blur(50px)' }} />
            <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', filter: 'blur(36px)' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(0,169,143,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-teal-light)', marginBottom: 20 }}>
                <IMsg />
              </div>
              <h3 style={{ fontSize: 'clamp(18px, 2.2vw, 26px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', fontFamily: 'var(--font-primary)', lineHeight: 1.25, marginBottom: 14 }}>{t.formTitle}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontFamily: 'var(--font-primary)', margin: 0 }}>{t.formSubtitle}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
              {[{ icon: <IPhone />, text: t.hotline || t.phone }, { icon: <IMail />, text: t.email }].map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-teal-light)', flexShrink: 0 }}>{row.icon}</div>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-primary)', fontWeight: 500 }}>{row.text}</span>
                </div>
              ))}
            </div>

            <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="qp-dot is-live" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-teal-light)', fontFamily: 'var(--font-primary)' }}>{lb(lang, 'support')}</span>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeRight}
            className="won-form-body" style={{ background: '#fff', padding: '48px 40px' }}>

            {flash && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-primary)', background: flash.ok ? 'var(--color-teal-pale)' : '#FEF2F2', color: flash.ok ? 'var(--color-teal-dark)' : 'var(--color-error)', border: `1px solid ${flash.ok ? 'rgba(0,169,143,0.25)' : 'rgba(220,38,38,0.2)'}` }}>
                {flash.ok ? '✅ ' : '❌ '}{flash.msg}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="won-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label={lb(lang, 'name')} error={errors.name}>
                  <div style={{ position: 'relative' }}>
                    <span style={ic(errors.name)}><IUser /></span>
                    <input type="text" value={form.name} placeholder={lb(lang, 'namePh')} style={inp(errors.name)}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); if (errors.name) setErrors(r => ({ ...r, name: '' })) }} />
                  </div>
                </Field>
                <Field label={lb(lang, 'email')} error={errors.email}>
                  <div style={{ position: 'relative' }}>
                    <span style={ic(errors.email)}><IMail /></span>
                    <input type="email" value={form.email} placeholder="example@gmail.com" style={inp(errors.email)}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); if (errors.email) setErrors(r => ({ ...r, email: '' })) }} />
                  </div>
                </Field>
              </div>

              <Field label={lb(lang, 'subject')} error={errors.subject}>
                <div style={{ position: 'relative' }}>
                  <span style={ic(errors.subject)}><IEdit /></span>
                  <input type="text" value={form.subject} placeholder={lb(lang, 'subjectPh')} style={inp(errors.subject)}
                    onChange={e => { setForm(f => ({ ...f, subject: e.target.value })); if (errors.subject) setErrors(r => ({ ...r, subject: '' })) }} />
                </div>
              </Field>

              <Field label={lb(lang, 'message')} error={errors.message}>
                <textarea rows={4} value={form.message} placeholder={lb(lang, 'messagePh')}
                  style={{ ...inp(errors.message), padding: '13px 16px', resize: 'none', height: 120 }}
                  onChange={e => { setForm(f => ({ ...f, message: e.target.value })); if (errors.message) setErrors(r => ({ ...r, message: '' })) }} />
              </Field>

              <motion.button type="submit" disabled={disabled}
                whileHover={!disabled ? { y: -2, boxShadow: 'var(--shadow-cta)' } : {}}
                style={{
                  width: '100%', padding: '15px 24px',
                  background: disabled ? 'var(--color-gray-border)' : 'var(--gradient-primary)',
                  color: disabled ? 'var(--color-gray-text)' : '#fff',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-primary)', letterSpacing: '0.3px',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'background 0.2s ease',
                  boxShadow: disabled ? 'none' : 'var(--shadow-cta)',
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
        @media (max-width: 768px) {
          .won-form-wrap { grid-template-columns: 1fr !important; }
          .won-form-body { padding: 32px 24px !important; }
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
      <InfoSection   t={t} />
      <FormSection   t={t} />
    </>
  )
}
