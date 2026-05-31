'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, MessageCircle, ArrowUpRight, Send, User, Edit3, AlertCircle, Loader2 } from 'lucide-react'

export interface ContactT {
  lang: string
  bannerSubtitle: string; bannerTitle: string
  address: string; phone: string; hotline: string
  email: string; zalo: string
  googleMapsUrl: string; googleMapsEmbed: string
  formTitle: string; formSubtitle: string
}

const VP = { once: false, amount: 0.25 }

const LABELS: Record<string, Record<string, string>> = {
  name:         { vi: 'Họ và tên',    en: 'Full Name',   ko: '성명',   ja: 'お名前', zh: '姓名' },
  email:        { vi: 'Email',        en: 'Email',       ko: '이메일', ja: 'メール', zh: '邮箱' },
  subject:      { vi: 'Chủ đề',      en: 'Subject',     ko: '제목',   ja: '件名',   zh: '主题' },
  message:      { vi: 'Lời nhắn',    en: 'Message',     ko: '메시지', ja: 'メッセージ', zh: '留言' },
  send:         { vi: 'Gửi yêu cầu ngay', en: 'Send Message', ko: '메시지 보내기', ja: '送信する', zh: '发送消息' },
  sending:      { vi: 'Đang xử lý...', en: 'Processing...', ko: '처리 중...', ja: '送信中...', zh: '处理中...' },
  wait:         { vi: 'Chờ', en: 'Wait', ko: '대기', ja: '待機', zh: '等待' },
  seconds:      { vi: 's', en: 's', ko: '초', ja: '秒', zh: '秒' },
  namePh:       { vi: 'Nguyễn Văn A', en: 'John Doe', ko: '홍길동', ja: '山田太郎', zh: '张三' },
  subjectPh:    { vi: 'Tôi muốn hợp tác...', en: 'I want to collaborate...', ko: '협업하고 싶습니다...', ja: '協力したいです...', zh: '我想合作...' },
  messagePh:    { vi: 'Nội dung chi tiết...', en: 'How can we help?', ko: '자세한 내용...', ja: '詳細を入力...', zh: '详细内容...' },
  support:      { vi: 'Hỗ trợ 24/7', en: 'Support 24/7', ko: '24/7 지원', ja: '24/7サポート', zh: '24/7支持' },
  openMap:      { vi: 'Dẫn đường trên Google Maps', en: 'Open in Google Maps', ko: 'Google Maps에서 열기', ja: 'Google Mapsで開く', zh: '在Google地图中打开' },
  successMsg:   { vi: '✅ Gửi thành công! Chúng tôi sẽ phản hồi sớm.', en: '✅ Sent! We will reply soon.', ko: '✅ 전송 성공!', ja: '✅ 送信しました！', zh: '✅ 发送成功！' },
  errorMsg:     { vi: '❌ Lỗi hệ thống, vui lòng thử lại.', en: '❌ Error, please try again.', ko: '❌ 오류가 발생했습니다.', ja: '❌ エラーが発生しました。', zh: '❌ 发生错误，请重试。' },
  required:     { vi: 'Không được để trống', en: 'Required', ko: '필수 항목', ja: '必須項目', zh: '不能为空' },
  invalidEmail: { vi: 'Email không hợp lệ', en: 'Invalid email', ko: '이메일 형식 오류', ja: 'メール形式が無効', zh: '邮箱格式无效' },
  headquarters: { vi: 'TRỤ SỞ CHÍNH', en: 'HEADQUARTERS', ko: '본사', ja: '本社', zh: '总部' },
}

function l(lang: string, key: string) {
  return LABELS[key]?.[lang] || LABELS[key]?.['en'] || key
}

function BannerSection({ t }: { t: ContactT }) {
  return (
    <div className="relative w-full h-64 sm:h-[520px] overflow-hidden text-white select-none">
      <motion.div initial={{ scale: 1.12 }} whileInView={{ scale: 1 }} viewport={VP}
        transition={{ duration: 1.5, ease: 'easeOut' }} className="absolute inset-0"
        style={{ backgroundImage: "url('/banners/banner.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP}
        transition={{ duration: 1 }} className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
            transition={{ duration: 0.8, delay: 0.2 }} className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[3px] bg-green-500" />
            <span className="text-lg text-gray-200">{t.bannerSubtitle}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-3xl sm:text-5xl font-bold uppercase leading-tight">
            {t.bannerTitle}
          </motion.h1>
        </div>
      </div>
    </div>
  )
}

function InfoSection({ t }: { t: ContactT }) {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-green-700 flex items-center justify-center text-white shadow-lg shadow-green-100">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-green-700 uppercase tracking-[0.2em]">WON MEDIA</p>
                <h3 className="text-2xl md:text-3xl font-black text-[#0b2a59] uppercase">{l(t.lang, 'headquarters')}</h3>
              </div>
            </div>
            <div className="space-y-8 border-l-2 border-green-100 pl-8 ml-7">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Address</p>
                <p className="text-lg text-slate-700 leading-relaxed font-medium">{t.address}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</p>
                  <p className="text-slate-900 font-bold flex items-center gap-2">
                    <Mail size={16} className="text-green-600" />{t.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Hotline</p>
                  <p className="text-slate-900 font-bold flex items-center gap-2">
                    <Phone size={16} className="text-green-600" />{t.hotline}
                  </p>
                </div>
              </div>
              {t.googleMapsUrl && (
                <div className="pt-2">
                  <a href={t.googleMapsUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all duration-300 shadow-xl">
                    {l(t.lang, 'openMap')} <ArrowUpRight size={16} />
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP} transition={{ duration: 0.7 }}
            className="h-[280px] md:h-[400px] w-full rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl border-4 md:border-8 border-slate-50">
            {t.googleMapsEmbed ? (
              <iframe src={t.googleMapsEmbed} className="w-full h-full border-none" allowFullScreen loading="lazy" title="map" />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                <MapPin size={40} strokeWidth={1.5} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
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
    if (!form.name.trim())    e.name    = l(lang, 'required')
    if (!form.email.trim())   e.email   = l(lang, 'required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = l(lang, 'invalidEmail')
    if (!form.subject.trim()) e.subject = l(lang, 'required')
    if (!form.message.trim()) e.message = l(lang, 'required')
    setErrors(e); return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (countdown > 0 || !validate()) return
    setSubmit(true)
    try {
      const res  = await fetch('/api/contact/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) {
        setFlash({ msg: l(lang, 'successMsg'), ok: true })
        localStorage.setItem('contact_sent', Date.now().toString())
        setCountdown(60)
        setForm({ name: '', email: '', subject: '', message: '' })
        setErrors({})
      } else {
        setFlash({ msg: data.error || l(lang, 'errorMsg'), ok: false })
      }
    } catch { setFlash({ msg: l(lang, 'errorMsg'), ok: false }) }
    finally { setSubmit(false); setTimeout(() => setFlash(null), 4000) }
  }

  const ic = (err?: string) => `w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-all ${err ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100 focus:border-green-500'}`

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 rounded-3xl">

          {/* Sidebar */}
          <div className="md:w-2/5 bg-green-700 p-6 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black leading-tight mb-6 uppercase">{t.formTitle}</h2>
              <p className="text-green-50/80 leading-relaxed font-medium mb-8">{t.formSubtitle}</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><MessageCircle size={20} /></div>
                <p className="text-sm font-bold">{l(lang, 'support')}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:w-3/5 p-5 md:p-10">
            {flash && (
              <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${flash.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {flash.msg}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{l(lang, 'name')}</label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.name ? 'text-red-400' : 'text-slate-300'}`} size={18} />
                    <input type="text" value={form.name} placeholder={l(lang, 'namePh')} className={ic(errors.name)}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); if (errors.name) setErrors(er => ({ ...er, name: '' })) }} />
                  </div>
                  {errors.name && <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1 ml-1"><AlertCircle size={12} />{errors.name}</p>}
                </div>
                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{l(lang, 'email')}</label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-400' : 'text-slate-300'}`} size={18} />
                    <input type="email" value={form.email} placeholder="example@gmail.com" className={ic(errors.email)}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); if (errors.email) setErrors(er => ({ ...er, email: '' })) }} />
                  </div>
                  {errors.email && <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1 ml-1"><AlertCircle size={12} />{errors.email}</p>}
                </div>
              </div>
              {/* Subject */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{l(lang, 'subject')}</label>
                <div className="relative">
                  <Edit3 className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.subject ? 'text-red-400' : 'text-slate-300'}`} size={18} />
                  <input type="text" value={form.subject} placeholder={l(lang, 'subjectPh')} className={ic(errors.subject)}
                    onChange={e => { setForm(f => ({ ...f, subject: e.target.value })); if (errors.subject) setErrors(er => ({ ...er, subject: '' })) }} />
                </div>
                {errors.subject && <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1 ml-1"><AlertCircle size={12} />{errors.subject}</p>}
              </div>
              {/* Message */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{l(lang, 'message')}</label>
                <textarea rows={4} value={form.message} placeholder={l(lang, 'messagePh')}
                  className={`w-full p-4 bg-slate-50 border rounded-2xl focus:outline-none focus:bg-white transition-all resize-none ${errors.message ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100 focus:border-green-500'}`}
                  onChange={e => { setForm(f => ({ ...f, message: e.target.value })); if (errors.message) setErrors(er => ({ ...er, message: '' })) }} />
                {errors.message && <p className="text-red-500 text-[11px] flex items-center gap-1 mt-1 ml-1"><AlertCircle size={12} />{errors.message}</p>}
              </div>
              {/* Submit */}
              <button type="submit" disabled={submitting || countdown > 0}
                className={`group w-full py-5 text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 shadow-xl ${
                  submitting || countdown > 0 ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-slate-900 shadow-green-100'}`}>
                {submitting
                  ? <><Loader2 size={18} className="animate-spin" />{l(lang, 'sending')}</>
                  : countdown > 0
                    ? `${l(lang, 'wait')} ${countdown}${l(lang, 'seconds')}`
                    : <>{l(lang, 'send')}<Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export function ContactClient({ t }: { t: ContactT }) {
  return (
    <>
      <BannerSection t={t} />
      <InfoSection t={t} />
      <FormSection t={t} />
    </>
  )
}
