'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  ImageIcon, MapPinIcon, MailIcon, SaveIcon, Loader2Icon,
  SparklesIcon, CheckCircle2Icon, AlertCircleIcon, InboxIcon,
  Trash2Icon, EyeIcon, EyeOffIcon,
} from 'lucide-react'
import { LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'

// ─── Types ────────────────────────────────────────────────────────────────────
interface ContactForm {
  bannerSubtitle: MultiLang; bannerTitle: MultiLang
  address: MultiLang
  phone: string; hotline: string; email: string; zalo: string
  googleMapsUrl: string; googleMapsEmbed: string
  formTitle: MultiLang; formSubtitle: MultiLang
}

interface Submission { _id: string; name: string; email: string; subject: string; message: string; read: boolean; createdAt: string }

const IC = 'h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/10 text-sm'
const TA = 'rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/10 text-sm resize-none'

function defaultForm(): ContactForm {
  return {
    bannerSubtitle: emptyMultiLang(), bannerTitle: emptyMultiLang(),
    address: emptyMultiLang(), phone: '', hotline: '', email: '', zalo: '',
    googleMapsUrl: '', googleMapsEmbed: '',
    formTitle: emptyMultiLang(), formSubtitle: emptyMultiLang(),
  }
}

// ─── Sub components ───────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {type === 'success' ? <CheckCircle2Icon size={16} /> : <AlertCircleIcon size={16} />}
      {msg}
    </div>
  )
}

function LangTabs({ active, onChange }: { active: LocaleKey; onChange: (l: LocaleKey) => void }) {
  return (
    <div className="flex gap-1 p-1 bg-[#F1F5F9] rounded-lg w-fit flex-wrap">
      {LOCALES.map(l => (
        <button key={l} onClick={() => onChange(l)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${active === l ? 'bg-white shadow text-[#0f172a]' : 'text-[#64748b] hover:text-[#0f172a]'}`}>
          {LOCALE_META[l].flag} {LOCALE_META[l].short}
        </button>
      ))}
    </div>
  )
}

function MLField({ label, value, onChange, lang, multi, rows = 3 }: {
  label: string; value: MultiLang; onChange: (v: MultiLang) => void
  lang: LocaleKey; multi?: boolean; rows?: number
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-[#374151]">
        {label} <span className="font-mono text-xs text-[#94a3b8]">({LOCALE_META[lang].flag} {LOCALE_META[lang].short})</span>
      </Label>
      {multi
        ? <Textarea value={value[lang] ?? ''} onChange={e => onChange({ ...value, [lang]: e.target.value })}
            rows={rows} className={TA + ' min-h-[80px]'} placeholder={`${label} (${LOCALE_META[lang].short})...`} />
        : <Input value={value[lang] ?? ''} onChange={e => onChange({ ...value, [lang]: e.target.value })}
            className={IC} placeholder={`${label} (${LOCALE_META[lang].short})...`} />}
    </div>
  )
}

// ─── TABS ────────────────────────────────────────────────────────────────────
const TABS = [
  { value: 'banner', label: 'Banner',       icon: ImageIcon  },
  { value: 'info',   label: 'Thông tin',    icon: MapPinIcon },
  { value: 'inbox',  label: 'Tin nhắn',     icon: InboxIcon  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────
function LienHeAdminInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = searchParams.get('tab') ?? 'banner'

  const [form, setForm]   = useState<ContactForm>(defaultForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [lang, setLang]       = useState<LocaleKey>('vi')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  // Submissions
  const [subs, setSubs]     = useState<Submission[]>([])
  const [unread, setUnread] = useState(0)
  const [subLoading, setSubLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500)
  }, [])

  useEffect(() => {
    fetch('/api/contact').then(r => r.json()).then(r => {
      if (r.data) setForm(f => ({ ...f, ...r.data }))
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (tab !== 'inbox') return
    setSubLoading(true)
    fetch('/api/contact/submit').then(r => r.json()).then(r => {
      if (r.data) setSubs(r.data); if (r.unread !== undefined) setUnread(r.unread)
    }).finally(() => setSubLoading(false))
  }, [tab])

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) showToast('Đã lưu trang Liên hệ!', 'success')
      else showToast(data.error ?? 'Lỗi lưu', 'error')
    } finally { setSaving(false) }
  }

  async function markRead(sub: Submission) {
    await fetch('/api/contact/submit', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: sub._id, read: !sub.read }) })
    setSubs(s => s.map(x => x._id === sub._id ? { ...x, read: !x.read } : x))
    setUnread(u => sub.read ? u + 1 : Math.max(0, u - 1))
  }

  async function deleteSub(id: string) {
    await fetch('/api/contact/submit', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setSubs(s => s.filter(x => x._id !== id))
  }

  async function aiTranslate(fields: Record<string, string>, onDone: (t: Record<string, Record<string, string>>) => void) {
    const res = await fetch('/api/ai/translate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { title: fields.title, excerpt: fields.subtitle }, targetLocales: ['en', 'ko', 'ja', 'zh'] }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    onDone(data.translations)
  }

  const SaveBtn = () => (
    <Button onClick={save} disabled={saving} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
      {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu thay đổi
    </Button>
  )

  if (loading) return <div className="flex items-center justify-center h-64 gap-2 text-[#64748b]"><Loader2Icon size={20} className="animate-spin" />Đang tải...</div>

  return (
    <div className="p-6 max-w-6xl space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
          <MailIcon size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0f172a]">Trang Liên hệ</h1>
          <p className="text-xs text-[#64748b] mt-0.5">Quản lý nội dung & tin nhắn · Đa ngôn ngữ VI/EN/KO/JA/ZH</p>
        </div>
        {unread > 0 && <Badge className="bg-red-500 text-white ml-2">{unread} mới</Badge>}
      </div>

      {/* Tab card */}
      <div className="rounded-2xl bg-white border border-[#e5e8ed] shadow-sm overflow-hidden">
        {/* Tab bar */}
        <div className="flex w-full border-b border-[#e5e8ed]">
          {TABS.map(({ value, label, icon: Icon }) => (
            <button key={value} onClick={() => router.push(`/admin/lien-he?tab=${value}`)}
              className={`flex-1 relative flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors duration-150 hover:text-green-700 hover:bg-green-50/60 ${
                tab === value ? 'text-green-700 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-green-500 after:rounded-t-full' : 'text-[#64748b]'
              }`}>
              <Icon size={15} />{label}
              {value === 'inbox' && unread > 0 && <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-bold">{unread}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">

          {/* ── BANNER ── */}
          {tab === 'banner' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-[#0f172a]">Banner trang Liên hệ</h3>
                  <p className="text-sm text-[#64748b] mt-0.5">Ảnh nền + tiêu đề hiển thị trên cùng</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={saving}
                    className="gap-2 border-[#E5E8ED] text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                    onClick={async () => {
                      try {
                        await aiTranslate({ title: form.bannerTitle.vi, subtitle: form.bannerSubtitle.vi }, t => {
                          setForm(f => ({
                            ...f,
                            bannerTitle:    { ...f.bannerTitle,    ...Object.fromEntries(Object.entries(t).map(([lc, v]) => [lc, v.title])) },
                            bannerSubtitle: { ...f.bannerSubtitle, ...Object.fromEntries(Object.entries(t).map(([lc, v]) => [lc, v.excerpt])) },
                          }))
                          showToast('Đã dịch Banner!', 'success')
                        })
                      } catch (e) { showToast(String(e), 'error') }
                    }}>
                    <SparklesIcon size={13} />AI Dịch
                  </Button>
                  <SaveBtn />
                </div>
              </div>
              <LangTabs active={lang} onChange={setLang} />
              <MLField label="Dòng phụ (subtitle)" value={form.bannerSubtitle} onChange={v => setForm(f => ({ ...f, bannerSubtitle: v }))} lang={lang} />
              <MLField label="Tiêu đề chính" value={form.bannerTitle} onChange={v => setForm(f => ({ ...f, bannerTitle: v }))} lang={lang} />
              {/* Preview */}
              <div className="rounded-xl overflow-hidden relative h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-end p-6">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('/banners/banner.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="relative z-10">
                  <p className="text-green-400 text-sm">{form.bannerSubtitle[lang] || 'Dòng phụ...'}</p>
                  <h1 className="text-white text-2xl font-bold uppercase">{form.bannerTitle[lang] || 'Tiêu đề...'}</h1>
                </div>
              </div>
            </div>
          )}

          {/* ── INFO ── */}
          {tab === 'info' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-[#0f172a]">Thông tin liên hệ & Form</h3>
                  <p className="text-sm text-[#64748b] mt-0.5">Địa chỉ, điện thoại, email, bản đồ và nội dung form</p>
                </div>
                <SaveBtn />
              </div>
              <LangTabs active={lang} onChange={setLang} />

              <div className="rounded-xl border border-[#E5E8ED] p-4 bg-[#F8FAFC] space-y-4">
                <p className="text-xs font-bold text-[#64748b] uppercase tracking-wide">Địa chỉ & Bản đồ</p>
                <MLField label="Địa chỉ văn phòng" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} lang={lang} multi rows={2} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#374151]">Google Maps URL</Label>
                    <Input value={form.googleMapsUrl} onChange={e => setForm(f => ({ ...f, googleMapsUrl: e.target.value }))}
                      placeholder="https://maps.app.goo.gl/..." className={IC} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#374151]">Google Maps Embed URL</Label>
                    <Input value={form.googleMapsEmbed} onChange={e => setForm(f => ({ ...f, googleMapsEmbed: e.target.value }))}
                      placeholder="https://www.google.com/maps/embed?pb=..." className={IC} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#E5E8ED] p-4 bg-[#F8FAFC] space-y-4">
                <p className="text-xs font-bold text-[#64748b] uppercase tracking-wide">Liên lạc</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'phone',   label: 'Số điện thoại' },
                    { key: 'hotline', label: 'Hotline' },
                    { key: 'email',   label: 'Email' },
                    { key: 'zalo',    label: 'Zalo' },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-1.5">
                      <Label className="text-sm font-medium text-[#374151]">{label}</Label>
                      <Input value={(form as unknown as Record<string, string>)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={label} className={IC} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#E5E8ED] p-4 bg-[#F8FAFC] space-y-4">
                <p className="text-xs font-bold text-[#64748b] uppercase tracking-wide">Nội dung Form liên hệ</p>
                <MLField label="Tiêu đề form" value={form.formTitle} onChange={v => setForm(f => ({ ...f, formTitle: v }))} lang={lang} />
                <MLField label="Mô tả form" value={form.formSubtitle} onChange={v => setForm(f => ({ ...f, formSubtitle: v }))} lang={lang} multi rows={3} />
              </div>
            </div>
          )}

          {/* ── INBOX ── */}
          {tab === 'inbox' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#0f172a]">Hộp thư đến</h3>
                <p className="text-sm text-[#64748b] mt-0.5">{subs.length} tin nhắn{unread > 0 ? ` · ${unread} chưa đọc` : ''}</p>
              </div>
              {subLoading ? (
                <div className="flex items-center gap-2 text-[#64748b] py-8"><Loader2Icon size={16} className="animate-spin" />Đang tải tin nhắn...</div>
              ) : subs.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16 text-[#94a3b8]">
                  <InboxIcon size={32} strokeWidth={1.5} />
                  <p className="text-sm">Chưa có tin nhắn nào</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {subs.map(sub => (
                    <div key={sub._id} className={`rounded-xl border transition-colors ${sub.read ? 'border-[#E5E8ED] bg-white' : 'border-green-200 bg-green-50/40'}`}>
                      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded(expanded === sub._id ? null : sub._id)}>
                        {!sub.read && <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-sm font-semibold text-[#0f172a] ${!sub.read ? '' : 'font-medium'}`}>{sub.name}</span>
                            <span className="text-xs text-[#94a3b8]">{sub.email}</span>
                            <Badge variant="outline" className="text-xs">{sub.subject}</Badge>
                          </div>
                          <p className="text-xs text-[#94a3b8] mt-0.5">{new Date(sub.createdAt).toLocaleString('vi-VN')}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button onClick={e => { e.stopPropagation(); markRead(sub) }}
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-[#64748b] hover:text-green-700 hover:bg-green-50 transition-colors"
                            title={sub.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}>
                            {sub.read ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                          </button>
                          <button onClick={e => { e.stopPropagation(); deleteSub(sub._id) }}
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-[#64748b] hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2Icon size={14} />
                          </button>
                        </div>
                      </div>
                      {expanded === sub._id && (
                        <div className="px-4 pb-4 border-t border-[#F1F5F9] mt-1 pt-3">
                          <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">{sub.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LienHeAdminPage() {
  return <Suspense><LienHeAdminInner /></Suspense>
}
