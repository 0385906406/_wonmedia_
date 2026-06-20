'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ImageIcon, MapPinIcon, MailIcon, SaveIcon, Loader2Icon,
  InboxIcon, Trash2Icon, EyeIcon, EyeOffIcon,
} from 'lucide-react'
import { useToast } from '@/components/admin/toast-provider'
import { ADMIN_LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'

interface ContactForm {
  bannerSubtitle: MultiLang; bannerTitle: MultiLang
  address: MultiLang
  phone: string; hotline: string; email: string; zalo: string
  googleMapsUrl: string; googleMapsEmbed: string
  formTitle: MultiLang; formSubtitle: MultiLang
}

interface Submission { _id: string; name: string; email: string; subject: string; message: string; read: boolean; createdAt: string }

function defaultForm(): ContactForm {
  return {
    bannerSubtitle: emptyMultiLang(), bannerTitle: emptyMultiLang(),
    address: emptyMultiLang(), phone: '', hotline: '', email: '', zalo: '',
    googleMapsUrl: '', googleMapsEmbed: '',
    formTitle: emptyMultiLang(), formSubtitle: emptyMultiLang(),
  }
}

function LangTabs({ active, onChange }: { active: LocaleKey; onChange: (l: LocaleKey) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--color-gray-light)', borderRadius: 8, width: 'fit-content', flexWrap: 'wrap' }}>
      {ADMIN_LOCALES.map(l => (
        <button key={l} onClick={() => onChange(l)} style={{
          padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
          border: 'none', cursor: 'pointer', transition: 'all 0.15s',
          background: active === l ? 'white' : 'transparent',
          color: active === l ? 'var(--color-navy-deep)' : 'var(--color-gray-text)',
          boxShadow: active === l ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label className="dh-label">
        {label} <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>({LOCALE_META[lang].flag} {LOCALE_META[lang].short})</span>
      </label>
      {multi
        ? <textarea value={value[lang] ?? ''} onChange={e => onChange({ ...value, [lang]: e.target.value })}
            rows={rows} className="dh-input" style={{ minHeight: 80, resize: 'none' }}
            placeholder={`${label} (${LOCALE_META[lang].short})...`} />
        : <input value={value[lang] ?? ''} onChange={e => onChange({ ...value, [lang]: e.target.value })}
            className="dh-input" placeholder={`${label} (${LOCALE_META[lang].short})...`} />}
    </div>
  )
}

const TABS = [
  { value: 'banner', label: 'Banner',    icon: ImageIcon  },
  { value: 'info',   label: 'Thông tin', icon: MapPinIcon },
  { value: 'inbox',  label: 'Tin nhắn',  icon: InboxIcon  },
]

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 10, border: '1px solid var(--color-gray-border)', padding: 16, background: 'var(--color-gray-light)', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gray-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</p>
      {children}
    </div>
  )
}

function LienHeAdminInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = searchParams.get('tab') ?? 'banner'

  const [form, setForm]   = useState<ContactForm>(defaultForm)
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [lang, setLang]       = useState<LocaleKey>('vi')
  const [subs, setSubs]     = useState<Submission[]>([])
  const [unread, setUnread] = useState(0)
  const [subLoading, setSubLoading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/contact')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(r => { if (r.data) setForm(f => ({ ...f, ...r.data })) })
      .catch(() => toast.error('Không tải được cấu hình liên hệ'))
      .finally(() => setLoading(false))
  }, [toast.error])

  useEffect(() => {
    if (tab !== 'inbox') return
    setSubLoading(true)
    fetch('/api/contact/submit')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(r => { if (r.data) setSubs(r.data); if (r.unread !== undefined) setUnread(r.unread) })
      .catch(() => toast.error('Không tải được hộp thư'))
      .finally(() => setSubLoading(false))
  }, [tab, toast.error])

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) toast.success('Đã lưu trang Liên hệ!')
      else toast.error(data.error ?? 'Lỗi lưu')
    } catch { toast.error('Lỗi kết nối')
    } finally { setSaving(false) }
  }

  async function markRead(sub: Submission) {
    const newRead = !sub.read
    setSubs(s => s.map(x => x._id === sub._id ? { ...x, read: newRead } : x))
    setUnread(u => newRead ? Math.max(0, u - 1) : u + 1)
    const res = await fetch('/api/contact/submit', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sub._id, read: newRead }),
    })
    if (!res.ok) {
      setSubs(s => s.map(x => x._id === sub._id ? { ...x, read: sub.read } : x))
      setUnread(u => newRead ? u + 1 : Math.max(0, u - 1))
      toast.error('Cập nhật thất bại')
    }
  }

  async function deleteSub(id: string) {
    if (!confirm('Xoá tin nhắn này?')) return
    const res = await fetch('/api/contact/submit', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) { toast.error('Xoá thất bại'); return }
    setSubs(s => s.filter(x => x._id !== id))
  }

  const saveBtn = (
    <button onClick={save} disabled={saving} className="dh-btn dh-btn-primary gap-2">
      {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu thay đổi
    </button>
  )

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256, gap: 8, color: 'var(--color-gray-text)' }}>
      <Loader2Icon size={20} className="animate-spin" />Đang tải...
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="dh-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-navy-pale)', color: 'var(--color-navy)' }}>
            <MailIcon size={20} />
          </div>
          <div>
            <h1 className="dh-page-title">Trang Liên hệ</h1>
            <p className="dh-page-desc">Quản lý nội dung &amp; tin nhắn · Đa ngôn ngữ VI/EN</p>
          </div>
          {unread > 0 && <span className="dh-badge" style={{ background: '#ef4444', color: 'white', marginLeft: 4 }}>{unread} mới</span>}
        </div>
      </div>

      <div className="dh-card" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid var(--color-gray-border)' }}>
          {TABS.map(({ value, label, icon: Icon }) => (
            <button key={value} onClick={() => router.push(`/admin/lien-he?tab=${value}`)}
              style={{
                flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '14px 0', fontSize: 13, fontWeight: tab === value ? 600 : 500,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: 'transparent',
                color: tab === value ? 'var(--color-navy)' : 'var(--color-gray-text)',
                borderBottom: tab === value ? '3px solid var(--color-navy)' : '3px solid transparent',
              }}>
              <Icon size={15} />{label}
              {value === 'inbox' && unread > 0 && (
                <span style={{ marginLeft: 4, padding: '0 6px 1px', fontSize: 10, background: '#ef4444', color: 'white', borderRadius: 99, fontWeight: 700 }}>{unread}</span>
              )}
            </button>
          ))}
        </div>

        <div className="dh-card-body" style={{ padding: 24 }}>

          {tab === 'banner' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Banner trang Liên hệ</h3>
                  <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Ảnh nền + tiêu đề hiển thị trên cùng</p>
                </div>
                {saveBtn}
              </div>
              <LangTabs active={lang} onChange={setLang} />
              <MLField label="Dòng phụ (subtitle)" value={form.bannerSubtitle} onChange={v => setForm(f => ({ ...f, bannerSubtitle: v }))} lang={lang} />
              <MLField label="Tiêu đề chính" value={form.bannerTitle} onChange={v => setForm(f => ({ ...f, bannerTitle: v }))} lang={lang} />
              <div style={{ borderRadius: 10, overflow: 'hidden', position: 'relative', height: 160, background: 'linear-gradient(135deg, #1e293b, #0f172a)', display: 'flex', alignItems: 'flex-end', padding: 24 }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: "url('/banners/banner.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ color: 'var(--color-teal)', fontSize: 13 }}>{form.bannerSubtitle[lang] || 'Dòng phụ...'}</p>
                  <h1 style={{ color: 'white', fontSize: 22, fontWeight: 700, textTransform: 'uppercase' }}>{form.bannerTitle[lang] || 'Tiêu đề...'}</h1>
                </div>
              </div>
            </div>
          )}

          {tab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Thông tin liên hệ &amp; Form</h3>
                  <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Địa chỉ, điện thoại, email, bản đồ và nội dung form</p>
                </div>
                {saveBtn}
              </div>
              <LangTabs active={lang} onChange={setLang} />

              <SectionBox title="Địa chỉ &amp; Bản đồ">
                <MLField label="Địa chỉ văn phòng" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} lang={lang} multi rows={2} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label className="dh-label">Google Maps URL</label>
                    <input value={form.googleMapsUrl} onChange={e => setForm(f => ({ ...f, googleMapsUrl: e.target.value }))}
                      placeholder="https://maps.app.goo.gl/..." className="dh-input" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label className="dh-label">Google Maps Embed URL</label>
                    <input value={form.googleMapsEmbed} onChange={e => setForm(f => ({ ...f, googleMapsEmbed: e.target.value }))}
                      placeholder="https://www.google.com/maps/embed?pb=..." className="dh-input" />
                  </div>
                </div>
              </SectionBox>

              <SectionBox title="Liên lạc">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { key: 'phone',   label: 'Số điện thoại' },
                    { key: 'hotline', label: 'Hotline' },
                    { key: 'email',   label: 'Email' },
                    { key: 'zalo',    label: 'Zalo' },
                  ].map(({ key, label }) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label className="dh-label">{label}</label>
                      <input value={(form as unknown as Record<string, string>)[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={label} className="dh-input" />
                    </div>
                  ))}
                </div>
              </SectionBox>

              <SectionBox title="Nội dung Form liên hệ">
                <MLField label="Tiêu đề form" value={form.formTitle} onChange={v => setForm(f => ({ ...f, formTitle: v }))} lang={lang} />
                <MLField label="Mô tả form" value={form.formSubtitle} onChange={v => setForm(f => ({ ...f, formSubtitle: v }))} lang={lang} multi rows={3} />
              </SectionBox>
            </div>
          )}

          {tab === 'inbox' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Hộp thư đến</h3>
                <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>{subs.length} tin nhắn{unread > 0 ? ` · ${unread} chưa đọc` : ''}</p>
              </div>
              {subLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-gray-text)', padding: '32px 0' }}>
                  <Loader2Icon size={16} className="animate-spin" />Đang tải tin nhắn...
                </div>
              ) : subs.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '64px 0', color: '#94a3b8' }}>
                  <InboxIcon size={32} strokeWidth={1.5} />
                  <p style={{ fontSize: 13 }}>Chưa có tin nhắn nào</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {subs.map(sub => (
                    <div key={sub._id} style={{
                      borderRadius: 10, border: `1px solid ${sub.read ? 'var(--color-gray-border)' : 'var(--color-navy-pale)'}`,
                      background: sub.read ? 'white' : 'var(--color-sky)',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
                        onClick={() => setExpanded(expanded === sub._id ? null : sub._id)}>
                        {!sub.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-navy)', flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 13, fontWeight: sub.read ? 500 : 600, color: 'var(--color-navy-deep)' }}>{sub.name}</span>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>{sub.email}</span>
                            <span className="dh-badge dh-badge-gray">{sub.subject}</span>
                          </div>
                          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{new Date(sub.createdAt).toLocaleString('vi-VN')}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          <button onClick={e => { e.stopPropagation(); markRead(sub) }}
                            className="dh-btn-icon"
                            title={sub.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}>
                            {sub.read ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                          </button>
                          <button onClick={e => { e.stopPropagation(); deleteSub(sub._id) }}
                            className="dh-btn-icon" style={{ color: '#ef4444' }}>
                            <Trash2Icon size={14} />
                          </button>
                        </div>
                      </div>
                      {expanded === sub._id && (
                        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-gray-border)' }}>
                          <p style={{ fontSize: 13, color: 'var(--color-gray-text)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{sub.message}</p>
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
