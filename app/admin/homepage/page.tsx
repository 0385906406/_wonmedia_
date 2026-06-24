'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  LayoutIcon, BriefcaseIcon, TrophyIcon, UsersIcon, FileTextIcon,
  PlusIcon, PencilIcon, Trash2Icon, SaveIcon, UploadIcon, GlobeIcon,
  CheckCircle2Icon, Loader2Icon, ImageIcon,
  ZapIcon, ListIcon, CheckSquareIcon, SquareIcon, ExternalLinkIcon, Link2Icon,
  MusicIcon, StarIcon, HeartIcon, AwardIcon, MicIcon, TrendingUpIcon,
  PlayCircleIcon, HeadphonesIcon, RadioIcon, BadgeCheckIcon, ThumbsUpIcon,
} from 'lucide-react'
import { useToast } from '@/components/admin/toast-provider'
import { ADMIN_LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'

interface HeroData {
  _id?: string
  title: MultiLang; title2: MultiLang; subtitle: MultiLang
  heroImageUrl?: string
  ctaPrimary?: MultiLang; ctaSecondary?: MultiLang
  servicesHeading?: MultiLang; achievementsHeading?: MultiLang; achievementsSubheading?: MultiLang
  partnersHeading?: MultiLang; partnersSubheading?: MultiLang
  postsHeading?: MultiLang; postsSubheading?: MultiLang; postsSeeMore?: MultiLang; postsReadMore?: MultiLang
}
interface ServiceItem { _id: string; order: number; iconKey: string; title: MultiLang; desc: MultiLang; link: string; active: boolean }
interface AchievementItem { _id: string; order: number; value: number; iconKey: string; label: MultiLang; active: boolean; color?: string }
interface PartnerItem { _id: string; order: number; name: string; logo: string; active: boolean }
interface PostItem {
  _id: string; slug: string; type: 'blog' | 'tuyen-dung'; thumbnail: string; date: string
  showOnHomepage: boolean; category: MultiLang; title: MultiLang; excerpt: MultiLang; content: MultiLang; active: boolean
}

function LangTabs({ activeLang, onChange }: { activeLang: LocaleKey; onChange: (l: LocaleKey) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--color-gray-light)', borderRadius: 8, width: 'fit-content', flexWrap: 'wrap' }}>
      {ADMIN_LOCALES.map((l) => (
        <button key={l} onClick={() => onChange(l)} style={{
          padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
          border: 'none', cursor: 'pointer', transition: 'all 0.15s',
          background: activeLang === l ? 'white' : 'transparent',
          color: activeLang === l ? 'var(--color-navy-deep)' : 'var(--color-gray-text)',
          boxShadow: activeLang === l ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        }}>
          {LOCALE_META[l].flag} {LOCALE_META[l].short}
        </button>
      ))}
    </div>
  )
}

function MLField({ label, value, onChange, multiline = false, lang }: {
  label: string; value: MultiLang; onChange: (v: MultiLang) => void; multiline?: boolean; lang: LocaleKey
}) {
  const handleChange = (v: string) => onChange({ ...value, [lang]: v })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label className="dh-label">{label} <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>({LOCALE_META[lang].flag} {LOCALE_META[lang].label})</span></label>
      {multiline ? (
        <textarea value={value[lang] ?? ''} onChange={(e) => handleChange(e.target.value)}
          rows={3} className="dh-input" style={{ minHeight: 92, resize: 'none' }}
          placeholder={`${label} (${LOCALE_META[lang].short})...`} />
      ) : (
        <input value={value[lang] ?? ''} onChange={(e) => handleChange(e.target.value)}
          className="dh-input" placeholder={`${label} (${LOCALE_META[lang].short})...`} />
      )}
    </div>
  )
}

function ImageUpload({ value, onChange, label }: { value: string; onChange: (url: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/homepage/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) onChange(data.url)
    } finally { setUploading(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label className="dh-label">{label}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL ảnh..."
          className="dh-input" style={{ flex: 1 }} />
        <button type="button" className="dh-btn dh-btn-secondary dh-btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2Icon size={14} className="animate-spin" /> : <UploadIcon size={14} />}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      {value && (
        <div style={{ width: 64, height: 48, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-gray-border)', background: 'var(--color-gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
      )}
    </div>
  )
}

function emptyHero(): HeroData {
  return {
    title: emptyMultiLang(), title2: emptyMultiLang(), subtitle: emptyMultiLang(),
    heroImageUrl: '',
    ctaPrimary: emptyMultiLang(), ctaSecondary: emptyMultiLang(),
    servicesHeading: emptyMultiLang(), achievementsHeading: emptyMultiLang(), achievementsSubheading: emptyMultiLang(),
    partnersHeading: emptyMultiLang(), partnersSubheading: emptyMultiLang(),
    postsHeading: emptyMultiLang(), postsSubheading: emptyMultiLang(), postsSeeMore: emptyMultiLang(), postsReadMore: emptyMultiLang(),
  }
}

function HeroEditor() {
  const [data, setData] = useState<HeroData>(emptyHero)
  const [lang, setLang] = useState<LocaleKey>('vi')
  const [heroTab, setHeroTab] = useState<'text' | 'image' | 'headings'>('text')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  useEffect(() => {
    fetch('/api/homepage/hero').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(r => {
      if (r.data) setData(prev => ({ ...prev, ...r.data }))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/homepage/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (res.ok) toast.success('Đã lưu banner!')
      else toast.error('Lỗi lưu banner')
    } finally { setSaving(false) }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/homepage/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.url) { setData(d => ({ ...d, heroImageUrl: json.url })); toast.success('Đã tải ảnh lên!') }
      else toast.error('Lỗi tải ảnh')
    } finally { setUploading(false) }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-gray-text)', padding: 32 }}>
      <Loader2Icon size={16} className="animate-spin" />Đang tải...
    </div>
  )

  const HERO_TABS = [
    { id: 'text' as const, label: 'Văn bản' },
    { id: 'image' as const, label: 'Ảnh nền & CTA' },
    { id: 'headings' as const, label: 'Heading sections' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header + Save */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Banner trang chủ</h3>
          <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Nội dung, ảnh nền và heading toàn trang chủ</p>
        </div>
        <button onClick={save} disabled={saving} className="dh-btn dh-btn-primary dh-btn-sm gap-2">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu thay đổi
        </button>
      </div>

      {/* Preview */}
      <div style={{ borderRadius: 10, overflow: 'hidden', position: 'relative', height: 140 }}>
        {data.heroImageUrl && (
          <img src={data.heroImageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: data.heroImageUrl ? 'transparent' : 'linear-gradient(135deg,#1a2030,#2f3441)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ color: 'white', fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em', margin: 0 }}>{data.title[lang] || 'BRINGING MUSIC'}</p>
          <p style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em', background: 'linear-gradient(90deg,#ff6900,#ffaa44)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            {data.title2[lang] || 'TO THE WORLD'}
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0, maxWidth: 380 }}>{data.subtitle[lang] || 'Subtitle...'}</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <span style={{ padding: '5px 14px', borderRadius: 8, background: '#00A98F', color: '#fff', fontSize: 11, fontWeight: 700 }}>{data.ctaPrimary?.[lang] || 'Khám phá dịch vụ'}</span>
            <span style={{ padding: '5px 14px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: 11, fontWeight: 700 }}>{data.ctaSecondary?.[lang] || 'Liên hệ ngay'}</span>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--color-gray-light)', borderRadius: 8, width: 'fit-content' }}>
        {HERO_TABS.map(t => (
          <button key={t.id} onClick={() => setHeroTab(t.id)} style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
            background: heroTab === t.id ? 'white' : 'transparent',
            color: heroTab === t.id ? 'var(--color-navy-deep)' : 'var(--color-gray-text)',
            boxShadow: heroTab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      <LangTabs activeLang={lang} onChange={setLang} />

      {/* Text tab */}
      {heroTab === 'text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <MLField label="Tiêu đề dòng 1 (màu trắng)" value={data.title} onChange={v => setData(d => ({ ...d, title: v }))} lang={lang} />
          <MLField label="Tiêu đề dòng 2 (màu cam)" value={data.title2} onChange={v => setData(d => ({ ...d, title2: v }))} lang={lang} />
          <MLField label="Phụ đề" value={data.subtitle} onChange={v => setData(d => ({ ...d, subtitle: v }))} multiline lang={lang} />
        </div>
      )}

      {/* Image & CTA tab */}
      {heroTab === 'image' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label className="dh-label">Ảnh nền Hero</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input value={data.heroImageUrl || ''} onChange={e => setData(d => ({ ...d, heroImageUrl: e.target.value }))}
                placeholder="https://... hoặc /banners/banner.png" className="dh-input" style={{ flex: 1 }} />
              <button type="button" className="dh-btn dh-btn-secondary dh-btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2Icon size={14} className="animate-spin" /> : <UploadIcon size={14} />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-gray-text)' }}>Để trống → dùng ảnh mặc định <code>/banners/banner.png</code></p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <MLField label='Nút CTA chính (xanh lá)' value={data.ctaPrimary ?? emptyMultiLang()} onChange={v => setData(d => ({ ...d, ctaPrimary: v }))} lang={lang} />
            <MLField label='Nút CTA phụ (viền trắng)' value={data.ctaSecondary ?? emptyMultiLang()} onChange={v => setData(d => ({ ...d, ctaSecondary: v }))} lang={lang} />
          </div>
        </div>
      )}

      {/* Headings tab */}
      {heroTab === 'headings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--color-gray-text)', padding: '8px 12px', background: 'var(--color-gray-light)', borderRadius: 8 }}>
            Để trống → dùng nhãn mặc định theo ngôn ngữ. Nhãn HEADING viết HOA, subheading thường.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <MLField label="Heading — Dịch vụ" value={data.servicesHeading ?? emptyMultiLang()} onChange={v => setData(d => ({ ...d, servicesHeading: v }))} lang={lang} />
            <MLField label="Heading — Thành tựu" value={data.achievementsHeading ?? emptyMultiLang()} onChange={v => setData(d => ({ ...d, achievementsHeading: v }))} lang={lang} />
            <MLField label="Subheading — Thành tựu" value={data.achievementsSubheading ?? emptyMultiLang()} onChange={v => setData(d => ({ ...d, achievementsSubheading: v }))} lang={lang} />
            <MLField label="Heading — Đối tác" value={data.partnersHeading ?? emptyMultiLang()} onChange={v => setData(d => ({ ...d, partnersHeading: v }))} lang={lang} />
            <MLField label="Subheading — Đối tác" value={data.partnersSubheading ?? emptyMultiLang()} onChange={v => setData(d => ({ ...d, partnersSubheading: v }))} lang={lang} />
            <MLField label="Heading — Bài viết" value={data.postsHeading ?? emptyMultiLang()} onChange={v => setData(d => ({ ...d, postsHeading: v }))} lang={lang} />
            <MLField label="Subheading — Bài viết" value={data.postsSubheading ?? emptyMultiLang()} onChange={v => setData(d => ({ ...d, postsSubheading: v }))} lang={lang} />
            <MLField label='Nút "Xem thêm" (section posts)' value={data.postsSeeMore ?? emptyMultiLang()} onChange={v => setData(d => ({ ...d, postsSeeMore: v }))} lang={lang} />
            <MLField label='Nút "Đọc thêm" (từng bài)' value={data.postsReadMore ?? emptyMultiLang()} onChange={v => setData(d => ({ ...d, postsReadMore: v }))} lang={lang} />
          </div>
        </div>
      )}
    </div>
  )
}

function ServicesEditor() {
  const toast = useToast()
  const [items, setItems] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState<ServiceItem | null>(null)
  const [lang, setLang] = useState<LocaleKey>('vi')
  const [saving, setSaving] = useState(false)
  const [linkMode, setLinkMode] = useState<'post' | 'external'>('external')
  const [posts, setPosts] = useState<{ _id: string; slug: string; type: string; title: MultiLang }[]>([])
  const [postsLoaded, setPostsLoaded] = useState(false)
  const [postSearch, setPostSearch] = useState('')

  const ICON_KEYS = ['play', 'music', 'youtube', 'shield', 'star', 'globe']

  async function loadPosts() {
    if (postsLoaded) return
    const res = await fetch('/api/posts')
    const data = await res.json()
    if (data.data) setPosts(data.data)
    setPostsLoaded(true)
  }

  useEffect(() => { fetchItems() }, [])
  function fetchItems() {
    setLoading(true)
    fetch('/api/homepage/services').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(r => { if (r.data) setItems(r.data) }).catch(() => {}).finally(() => setLoading(false))
  }

  function openNew() {
    setEditItem({ _id: '', order: items.length, iconKey: 'play', title: emptyMultiLang(), desc: emptyMultiLang(), link: '', active: true })
    setLinkMode('external')
  }

  async function saveItem() {
    if (!editItem) return
    setSaving(true)
    try {
      const isNew = !editItem._id
      const url = isNew ? '/api/homepage/services' : `/api/homepage/services/${editItem._id}`
      const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editItem) })
      if (res.ok) { toast.success(isNew ? 'Đã thêm dịch vụ!' : 'Đã cập nhật!'); fetchItems(); setEditItem(null) }
      else toast.error('Lỗi lưu dữ liệu')
    } finally { setSaving(false) }
  }

  async function deleteItem(id: string) {
    if (!confirm('Xóa dịch vụ này?')) return
    const res = await fetch(`/api/homepage/services/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Đã xóa!'); fetchItems() }
  }

  async function toggleActive(item: ServiceItem) {
    await fetch(`/api/homepage/services/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !item.active }) })
    fetchItems()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Dịch vụ của chúng tôi</h3>
          <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Quản lý các dịch vụ hiển thị trên trang chủ</p>
        </div>
        <button onClick={openNew} className="dh-btn dh-btn-primary dh-btn-sm gap-2"><PlusIcon size={14} />Thêm dịch vụ</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-gray-text)', padding: 16 }}>
          <Loader2Icon size={16} className="animate-spin" />Đang tải...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item) => (
            <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: '1px solid var(--color-gray-border)', borderRadius: 10, background: 'white', transition: 'background 0.15s' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-navy-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'monospace', color: 'var(--color-navy)', fontWeight: 700 }}>{item.order + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-navy-deep)' }}>{item.title.vi || '(Chưa có tiêu đề VI)'}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title.en || '(Chưa có tiêu đề EN)'}</p>
              </div>
              <span className={`dh-badge ${item.active ? 'dh-badge-green' : 'dh-badge-gray'}`}>{item.active ? 'Hiện' : 'Ẩn'}</span>
              <button onClick={() => toggleActive(item)} className={`dh-toggle ${item.active ? 'on' : 'off'}`}><span className="dh-toggle-knob" /></button>
              <button className="dh-btn-icon" onClick={() => {
                setEditItem(item); setLang('vi')
                const lk = item.link || ''
                setLinkMode(lk && !lk.startsWith('http') ? 'post' : 'external')
                if (lk && !lk.startsWith('http')) loadPosts()
              }}><PencilIcon size={14} /></button>
              <button className="dh-btn-icon" onClick={() => deleteItem(item._id)} style={{ color: '#ef4444' }}><Trash2Icon size={14} /></button>
            </div>
          ))}
          {items.length === 0 && <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '32px 0' }}>Chưa có dịch vụ nào. Thêm dịch vụ đầu tiên!</p>}
        </div>
      )}

      {editItem && (
        <div className="dh-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditItem(null) }}>
          <div className="dh-modal" style={{ maxWidth: 640 }}>
            <div className="dh-modal-header">
              <h3 className="dh-modal-title">{editItem._id ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</h3>
            </div>
            <div className="dh-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label className="dh-label">Icon</label>
                  <select value={editItem.iconKey} onChange={(e) => setEditItem(i => i ? { ...i, iconKey: e.target.value } : i)}
                    className="dh-input">
                    {ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label className="dh-label">Thứ tự</label>
                  <input type="number" value={editItem.order} onChange={(e) => setEditItem(i => i ? { ...i, order: +e.target.value } : i)} className="dh-input" />
                </div>
              </div>
              <LangTabs activeLang={lang} onChange={setLang} />
              <MLField label="Tên dịch vụ" value={editItem.title} onChange={(v) => setEditItem(i => i ? { ...i, title: v } : i)} lang={lang} />
              <MLField label="Mô tả" value={editItem.desc} onChange={(v) => setEditItem(i => i ? { ...i, desc: v } : i)} multiline lang={lang} />

              {/* Link section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label className="dh-label">Link khi bấm vào (tùy chọn)</label>
                <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--color-gray-light)', borderRadius: 8, width: 'fit-content' }}>
                  {([['post', 'Bài viết'], ['external', 'Link ngoài']] as const).map(([mode, label]) => (
                    <button key={mode} type="button"
                      onClick={() => {
                        setLinkMode(mode)
                        setEditItem(i => i ? { ...i, link: '' } : i)
                        if (mode === 'post') loadPosts()
                      }}
                      style={{
                        padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                        border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                        background: linkMode === mode ? 'white' : 'transparent',
                        color: linkMode === mode ? 'var(--color-navy-deep)' : 'var(--color-gray-text)',
                        boxShadow: linkMode === mode ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      }}>{label}</button>
                  ))}
                </div>

                {linkMode === 'post' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input value={postSearch} onChange={e => setPostSearch(e.target.value)}
                      placeholder="Tìm kiếm bài viết..." className="dh-input" />
                    <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--color-gray-border)', borderRadius: 8, background: 'white' }}>
                      {posts.filter(p => {
                        const q = postSearch.toLowerCase()
                        return !q || (p.title.vi || '').toLowerCase().includes(q) || p.slug.includes(q)
                      }).map(p => {
                        const linkVal = `bai-viet/${p.slug}`
                        const selected = editItem.link === linkVal
                        return (
                          <div key={p._id} onClick={() => setEditItem(i => i ? { ...i, link: linkVal } : i)}
                            style={{
                              padding: '9px 14px', cursor: 'pointer', fontSize: 13,
                              borderBottom: '1px solid var(--color-gray-border)',
                              background: selected ? 'var(--color-navy-pale)' : 'white',
                              color: selected ? 'var(--color-navy)' : 'var(--color-navy-deep)',
                              display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.1s',
                            }}>
                            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600, letterSpacing: '0.05em', flexShrink: 0,
                              background: p.type === 'blog' ? 'var(--color-indigo-pale)' : 'var(--color-yellow-light)',
                              color: p.type === 'blog' ? 'var(--color-indigo-dark)' : 'var(--color-yellow-dark)',
                            }}>{p.type === 'blog' ? 'Blog' : 'Tuyển dụng'}</span>
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title.vi || p.slug}</span>
                            {selected && <CheckCircle2Icon size={14} style={{ color: 'var(--color-navy)', flexShrink: 0 }} />}
                          </div>
                        )
                      })}
                      {posts.length === 0 && <p style={{ padding: 16, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>{postsLoaded ? 'Không có bài viết nào' : 'Đang tải...'}</p>}
                    </div>
                    {editItem.link && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--color-teal-dark)' }}>
                        <Link2Icon size={12} />
                        <span style={{ fontFamily: 'monospace' }}>/{editItem.link}</span>
                        <button type="button" onClick={() => setEditItem(i => i ? { ...i, link: '' } : i)}
                          style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Xóa</button>
                      </div>
                    )}
                  </div>
                )}

                {linkMode === 'external' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input value={editItem.link || ''} onChange={e => setEditItem(i => i ? { ...i, link: e.target.value } : i)}
                        placeholder="https://..." className="dh-input" style={{ flex: 1 }} />
                      {editItem.link && <button type="button" onClick={() => setEditItem(i => i ? { ...i, link: '' } : i)}
                        style={{ fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>✕</button>}
                    </div>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Link mở trong tab mới. Để trống nếu không cần link.</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => setEditItem(i => i ? { ...i, active: !i.active } : i)} className={`dh-toggle ${editItem.active ? 'on' : 'off'}`}><span className="dh-toggle-knob" /></button>
                <label className="dh-label" style={{ marginBottom: 0 }}>Hiển thị</label>
              </div>
            </div>
            <div className="dh-modal-footer">
              <button onClick={() => setEditItem(null)} className="dh-btn dh-btn-secondary">Hủy</button>
              <button onClick={saveItem} disabled={saving} className="dh-btn dh-btn-primary gap-2">
                {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ACHIEVEMENT_ICON_LIST = [
  { key: '', label: '— Không có' },
  { key: 'trophy',       label: 'Trophy (cúp)' },
  { key: 'users',        label: 'Users (người dùng)' },
  { key: 'music',        label: 'Music (âm nhạc)' },
  { key: 'star',         label: 'Star (ngôi sao)' },
  { key: 'globe',        label: 'Globe (toàn cầu)' },
  { key: 'heart',        label: 'Heart (trái tim)' },
  { key: 'zap',          label: 'Zap (tia sét)' },
  { key: 'award',        label: 'Award (giải thưởng)' },
  { key: 'mic',          label: 'Mic (micro)' },
  { key: 'trending-up',  label: 'Trending Up (tăng trưởng)' },
  { key: 'play-circle',  label: 'Play Circle (phát nhạc)' },
  { key: 'headphones',   label: 'Headphones (tai nghe)' },
  { key: 'radio',        label: 'Radio' },
  { key: 'badge-check',  label: 'Badge Check (xác nhận)' },
  { key: 'thumbs-up',    label: 'Thumbs Up (thích)' },
]

const ACHIEVEMENT_ICON_MAP: Record<string, React.ElementType> = {
  trophy:        TrophyIcon,
  users:         UsersIcon,
  music:         MusicIcon,
  star:          StarIcon,
  globe:         GlobeIcon,
  heart:         HeartIcon,
  zap:           ZapIcon,
  award:         AwardIcon,
  mic:           MicIcon,
  'trending-up': TrendingUpIcon,
  'play-circle': PlayCircleIcon,
  headphones:    HeadphonesIcon,
  radio:         RadioIcon,
  'badge-check': BadgeCheckIcon,
  'thumbs-up':   ThumbsUpIcon,
}

const ACH_COLORS = ['#f97316', '#00A98F', '#6366f1', '#0f4c81']

function AchievementsEditor() {
  const toast = useToast()
  const [items, setItems] = useState<AchievementItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState<AchievementItem | null>(null)
  const [lang, setLang] = useState<LocaleKey>('vi')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchItems() }, [])
  function fetchItems() {
    setLoading(true)
    fetch('/api/homepage/achievements').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(r => { if (r.data) setItems(r.data) }).catch(() => {}).finally(() => setLoading(false))
  }

  async function saveItem() {
    if (!editItem) return
    setSaving(true)
    try {
      const isNew = !editItem._id
      const url = isNew ? '/api/homepage/achievements' : `/api/homepage/achievements/${editItem._id}`
      const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editItem) })
      if (res.ok) { toast.success('Đã lưu!'); fetchItems(); setEditItem(null) }
      else toast.error('Lỗi lưu dữ liệu')
    } finally { setSaving(false) }
  }

  async function deleteItem(id: string) {
    if (!confirm('Xóa thành tựu này?')) return
    const res = await fetch(`/api/homepage/achievements/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Đã xóa!'); fetchItems() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Thành tựu</h3>
          <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Quản lý các chỉ số thành tựu</p>
        </div>
        <button onClick={() => setEditItem({ _id: '', order: items.length, value: 0, iconKey: '', label: emptyMultiLang(), active: true, color: '' })} className="dh-btn dh-btn-primary dh-btn-sm gap-2">
          <PlusIcon size={14} />Thêm
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-gray-text)', padding: 16 }}>
          <Loader2Icon size={16} className="animate-spin" />Đang tải...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {items.map((item, i) => {
            const accent = item.color || ACH_COLORS[i % 4]
            const IconComp = item.iconKey ? ACHIEVEMENT_ICON_MAP[item.iconKey] : null
            return (
              <div key={item._id} style={{ position: 'relative', border: '1px solid var(--color-gray-border)', borderRadius: 10, padding: 16, background: 'white', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                className="group">
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, borderRadius: '10px 10px 0 0', background: accent }} />
                {IconComp ? (
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                    <IconComp size={18} style={{ color: accent }} />
                  </div>
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                    <TrophyIcon size={16} style={{ color: '#CBD5E1' }} />
                  </div>
                )}
                <p style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-navy-deep)', margin: 0 }}>{item.value}<span style={{ color: accent, fontSize: 14 }}>+</span></p>
                <p style={{ fontSize: 10, color: 'var(--color-gray-text)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, margin: 0 }}>{item.label.vi}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, opacity: 0, transition: 'opacity 0.15s' }} className="group-hover-show">
                  <button className="dh-btn-icon" style={{ width: 24, height: 24 }} onClick={() => { setEditItem(item); setLang('vi') }}><PencilIcon size={12} /></button>
                  <button className="dh-btn-icon" style={{ width: 24, height: 24, color: '#ef4444' }} onClick={() => deleteItem(item._id)}><Trash2Icon size={12} /></button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editItem && (
        <div className="dh-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditItem(null) }}>
          <div className="dh-modal" style={{ maxWidth: 520 }}>
            <div className="dh-modal-header">
              <h3 className="dh-modal-title">{editItem._id ? 'Chỉnh sửa thành tựu' : 'Thêm thành tựu mới'}</h3>
            </div>
            <div className="dh-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label className="dh-label">Số liệu</label>
                  <input type="number" value={editItem.value} onChange={(e) => setEditItem(i => i ? { ...i, value: +e.target.value } : i)} className="dh-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label className="dh-label">Thứ tự</label>
                  <input type="number" value={editItem.order} onChange={(e) => setEditItem(i => i ? { ...i, order: +e.target.value } : i)} className="dh-input" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="dh-label">Icon hiển thị</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {ACHIEVEMENT_ICON_LIST.map(({ key, label }) => {
                    const IC = key ? ACHIEVEMENT_ICON_MAP[key] : null
                    const selected = editItem.iconKey === key
                    return (
                      <button key={key} type="button" onClick={() => setEditItem(i => i ? { ...i, iconKey: key } : i)}
                        title={label}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          gap: 4, padding: '10px 6px', borderRadius: 8, fontSize: 10, fontWeight: 500,
                          border: `2px solid ${selected ? 'var(--color-navy)' : 'var(--color-gray-border)'}`,
                          background: selected ? 'var(--color-navy-pale)' : 'white',
                          color: selected ? 'var(--color-navy)' : 'var(--color-gray-text)',
                          cursor: 'pointer', transition: 'all 0.12s',
                        }}>
                        {IC ? <IC size={18} /> : <span style={{ fontSize: 16, lineHeight: 1 }}>—</span>}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                          {key || 'Không'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="dh-label">Màu hiển thị</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {ACH_COLORS.concat(['#e11d48', '#0891b2', '#7c3aed', '#16a34a']).map(c => (
                    <button key={c} type="button" onClick={() => setEditItem(i => i ? { ...i, color: c } : i)}
                      style={{
                        width: 28, height: 28, borderRadius: '50%', background: c, border: 'none',
                        cursor: 'pointer', flexShrink: 0,
                        outline: editItem.color === c ? `3px solid ${c}` : '2px solid transparent',
                        outlineOffset: 2,
                        transition: 'outline 0.15s, transform 0.15s',
                        transform: editItem.color === c ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: editItem.color || '#E2E8F0', border: '1px solid #CBD5E1', flexShrink: 0 }} />
                    <input
                      type="text" placeholder="#HEX hoặc để trống = tự động"
                      value={editItem.color || ''}
                      onChange={e => setEditItem(i => i ? { ...i, color: e.target.value } : i)}
                      className="dh-input" style={{ width: 180, fontSize: 12 }}
                    />
                  </div>
                </div>
              </div>

              <LangTabs activeLang={lang} onChange={setLang} />
              <MLField label="Nhãn" value={editItem.label} onChange={(v) => setEditItem(i => i ? { ...i, label: v } : i)} lang={lang} />
            </div>
            <div className="dh-modal-footer">
              <button onClick={() => setEditItem(null)} className="dh-btn dh-btn-secondary">Hủy</button>
              <button onClick={saveItem} disabled={saving} className="dh-btn dh-btn-primary gap-2">
                {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PartnersEditor() {
  const toast = useToast()
  const [items, setItems] = useState<PartnerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState<PartnerItem | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchItems() }, [])
  function fetchItems() {
    setLoading(true)
    fetch('/api/homepage/partners').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(r => { if (r.data) setItems(r.data) }).catch(() => {}).finally(() => setLoading(false))
  }

  async function saveItem() {
    if (!editItem) return
    setSaving(true)
    try {
      const isNew = !editItem._id
      const url = isNew ? '/api/homepage/partners' : `/api/homepage/partners/${editItem._id}`
      const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editItem) })
      if (res.ok) { toast.success('Đã lưu!'); fetchItems(); setEditItem(null) }
      else toast.error('Lỗi lưu dữ liệu')
    } finally { setSaving(false) }
  }

  async function deleteItem(id: string) {
    if (!confirm(`Xóa đối tác "${items.find(i => i._id === id)?.name}"?`)) return
    const res = await fetch(`/api/homepage/partners/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Đã xóa!'); fetchItems() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Đối tác của chúng tôi</h3>
          <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Quản lý logo đối tác hiển thị trên trang chủ</p>
        </div>
        <button onClick={() => setEditItem({ _id: '', order: items.length, name: '', logo: '', active: true })} className="dh-btn dh-btn-primary dh-btn-sm gap-2">
          <PlusIcon size={14} />Thêm đối tác
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-gray-text)', padding: 16 }}>
          <Loader2Icon size={16} className="animate-spin" />Đang tải...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {items.map((item) => (
            <div key={item._id} style={{ position: 'relative', border: '1px solid var(--color-gray-border)', borderRadius: 10, padding: 12, background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'box-shadow 0.15s' }}
              className="group">
              {!item.active && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="dh-badge dh-badge-gray">Ẩn</span></div>}
              <div style={{ width: 64, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.logo ? <img src={item.logo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <ImageIcon size={24} style={{ color: '#94a3b8' }} />}
              </div>
              <p style={{ fontSize: 11, textAlign: 'center', color: 'var(--color-gray-text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{item.name || 'Chưa đặt tên'}</p>
              <div style={{ display: 'flex', gap: 4, opacity: 0, transition: 'opacity 0.15s' }} className="group-hover-show">
                <button className="dh-btn-icon" style={{ width: 24, height: 24 }} onClick={() => setEditItem(item)}><PencilIcon size={12} /></button>
                <button className="dh-btn-icon" style={{ width: 24, height: 24, color: '#ef4444' }} onClick={() => deleteItem(item._id)}><Trash2Icon size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editItem && (
        <div className="dh-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEditItem(null) }}>
          <div className="dh-modal" style={{ maxWidth: 480 }}>
            <div className="dh-modal-header">
              <h3 className="dh-modal-title">{editItem._id ? 'Chỉnh sửa đối tác' : 'Thêm đối tác mới'}</h3>
            </div>
            <div className="dh-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="dh-label">Tên đối tác</label>
                <input value={editItem.name} onChange={(e) => setEditItem(i => i ? { ...i, name: e.target.value } : i)} placeholder="YouTube, Facebook..." className="dh-input" />
              </div>
              <ImageUpload value={editItem.logo} onChange={(url) => setEditItem(i => i ? { ...i, logo: url } : i)} label="Logo" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label className="dh-label">Thứ tự</label>
                <input type="number" value={editItem.order} onChange={(e) => setEditItem(i => i ? { ...i, order: +e.target.value } : i)} className="dh-input" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => setEditItem(i => i ? { ...i, active: !i.active } : i)} className={`dh-toggle ${editItem.active ? 'on' : 'off'}`}><span className="dh-toggle-knob" /></button>
                <label className="dh-label" style={{ marginBottom: 0 }}>Hiển thị</label>
              </div>
            </div>
            <div className="dh-modal-footer">
              <button onClick={() => setEditItem(null)} className="dh-btn dh-btn-secondary">Hủy</button>
              <button onClick={saveItem} disabled={saving} className="dh-btn dh-btn-primary gap-2">
                {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PostsEditor() {
  const toast = useToast()
  const [items, setItems]           = useState<PostItem[]>([])
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)
  const [mode, setMode]             = useState<'auto' | 'manual'>('auto')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [limit, setLimit]           = useState(6)
  const [cfgLoading, setCfgLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/homepage/posts-config').then(r => r.json()),
    ]).then(([postsRes, cfgRes]) => {
      if (postsRes.data) setItems(postsRes.data)
      if (cfgRes.data) {
        setMode(cfgRes.data.mode ?? 'auto')
        setSelectedIds(new Set(cfgRes.data.selectedIds ?? []))
        setLimit(cfgRes.data.limit ?? 6)
      }
    }).finally(() => { setLoading(false); setCfgLoading(false) })
  }, [])

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function saveConfig() {
    setSaving(true)
    try {
      const res = await fetch('/api/homepage/posts-config', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, selectedIds: [...selectedIds], limit }),
      })
      const data = await res.json()
      if (res.ok) toast.success('Đã lưu cấu hình bài viết!')
      else toast.error(data?.error ?? `Lỗi lưu cấu hình (${res.status})`)
    } catch { toast.error('Không kết nối được server')
    } finally { setSaving(false) }
  }

  const displayedItems = mode === 'auto'
    ? items.filter(i => i.active).slice(0, limit)
    : items.filter(i => selectedIds.has(i._id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Bài viết trang chủ</h3>
          <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Chọn cách hiển thị bài viết trên trang chủ</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/admin/posts" target="_blank" rel="noreferrer" className="dh-btn dh-btn-secondary dh-btn-sm gap-2">
            <ExternalLinkIcon size={13} />Quản lý bài viết
          </a>
          <button onClick={saveConfig} disabled={saving || cfgLoading} className="dh-btn dh-btn-primary dh-btn-sm gap-2">
            {saving ? <Loader2Icon size={13} className="animate-spin" /> : <SaveIcon size={13} />}Lưu cấu hình
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { v: 'auto' as const, label: 'Tự động', desc: 'Tự động lấy N bài mới nhất đang kích hoạt để hiển thị', icon: ZapIcon },
          { v: 'manual' as const, label: 'Chọn danh sách', desc: 'Tự tay chọn từng bài viết muốn hiển thị trên trang chủ', icon: ListIcon },
        ].map(({ v, label, desc, icon: Icon }) => (
          <button key={v} onClick={() => setMode(v)} style={{
            position: 'relative', display: 'flex', flexDirection: 'column', gap: 8,
            borderRadius: 10, border: `2px solid ${mode === v ? 'var(--color-navy)' : 'var(--color-gray-border)'}`,
            padding: 16, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
            background: mode === v ? 'var(--color-navy-pale)' : 'white',
          }}>
            {mode === v && (
              <span style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: '50%', background: 'var(--color-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2Icon size={12} />
              </span>
            )}
            <div style={{ width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: mode === v ? 'var(--color-navy)' : 'var(--color-gray-light)', color: mode === v ? 'white' : 'var(--color-gray-text)' }}>
              <Icon size={18} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: mode === v ? 'var(--color-navy)' : 'var(--color-navy-deep)' }}>{label}</p>
              <p style={{ fontSize: 11, color: 'var(--color-gray-text)', marginTop: 2, lineHeight: 1.5 }}>{desc}</p>
            </div>
          </button>
        ))}
      </div>

      {mode === 'auto' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 10, background: 'white', border: '1px solid var(--color-gray-border)' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-navy-deep)' }}>Số bài hiển thị tối đa</p>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Hiển thị tối đa bao nhiêu bài trên trang chủ (1–20)</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => setLimit(l => Math.max(1, l - 1))}
              style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--color-gray-border)', background: 'white', color: 'var(--color-navy-deep)', fontWeight: 700, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <input type="number" min={1} max={20} value={limit}
              onChange={e => setLimit(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              style={{ width: 64, height: 36, textAlign: 'center', borderRadius: 8, border: '1px solid var(--color-gray-border)', background: 'white', color: 'var(--color-navy-deep)', fontWeight: 700, fontSize: 14, outline: 'none' }} />
            <button onClick={() => setLimit(l => Math.min(20, l + 1))}
              style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--color-gray-border)', background: 'white', color: 'var(--color-navy-deep)', fontWeight: 700, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', padding: '24px 0' }}>
          <Loader2Icon size={16} className="animate-spin" />Đang tải danh sách bài viết...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-gray-text)' }}>
              {mode === 'auto'
                ? `Sẽ hiển thị ${displayedItems.length} bài mới nhất (active) đầu tiên`
                : `Đã chọn ${selectedIds.size} / ${items.length} bài`}
            </p>
            {mode === 'manual' && items.length > 0 && (
              <button onClick={() => setSelectedIds(selectedIds.size === items.length ? new Set() : new Set(items.map(i => i._id)))}
                style={{ fontSize: 11, color: 'var(--color-navy)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                {selectedIds.size === items.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div style={{ borderRadius: 10, border: '2px dashed var(--color-gray-border)', padding: '40px 0', textAlign: 'center' }}>
              <FileTextIcon size={28} style={{ color: '#94a3b8', margin: '0 auto 8px', display: 'block' }} strokeWidth={1.5} />
              <p style={{ fontSize: 13, color: '#94a3b8' }}>Chưa có bài viết nào</p>
              <a href="/admin/posts" style={{ fontSize: 11, color: 'var(--color-navy)', marginTop: 4, display: 'inline-block' }}>→ Tạo bài viết mới</a>
            </div>
          ) : (
            <div style={{ borderRadius: 10, border: '1px solid var(--color-gray-border)', overflow: 'hidden' }}>
              {items.map((item, idx) => {
                const isSelected = selectedIds.has(item._id)
                const isAutoShown = item.showOnHomepage && item.active
                return (
                  <div key={item._id} onClick={() => mode === 'manual' && toggleSelect(item._id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                      transition: 'background 0.1s',
                      background: mode === 'manual' && isSelected ? 'var(--color-sky)' : 'white',
                      cursor: mode === 'manual' ? 'pointer' : 'default',
                      borderTop: idx > 0 ? '1px solid var(--color-gray-border)' : 'none',
                    }}>
                    <div style={{ flexShrink: 0 }}>
                      {mode === 'manual' ? (
                        isSelected
                          ? <CheckSquareIcon size={18} style={{ color: 'var(--color-navy)' }} />
                          : <SquareIcon size={18} style={{ color: '#CBD5E1' }} />
                      ) : (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: isAutoShown ? 'var(--color-navy)' : '#E2E8F0' }} />
                      )}
                    </div>
                    <div style={{ width: 44, height: 36, borderRadius: 8, overflow: 'hidden', background: 'var(--color-gray-light)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.thumbnail ? <img src={item.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={14} style={{ color: '#94a3b8' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-navy-deep)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title?.vi || '(Chưa có tiêu đề)'}
                      </p>
                      <p style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.slug} · {item.date}</p>
                    </div>
                    <span className={`dh-badge ${item.type === 'blog' ? 'dh-badge-indigo' : 'dh-badge-yellow'}`} style={{ flexShrink: 0 }}>
                      {item.type === 'blog' ? 'Blog' : 'Tuyển dụng'}
                    </span>
                    {mode === 'auto' && (
                      <span style={{ fontSize: 11, fontWeight: 500, flexShrink: 0, color: isAutoShown ? 'var(--color-teal-dark)' : '#94a3b8' }}>
                        {isAutoShown ? '✓ Hiển thị' : '— Ẩn'}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {!loading && displayedItems.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 10, background: 'var(--color-navy-pale)', border: '1px solid rgba(15,76,129,0.15)', fontSize: 13, color: 'var(--color-navy)' }}>
          <CheckCircle2Icon size={15} />
          <span>Trang chủ sẽ hiển thị <strong>{displayedItems.length}</strong> bài viết</span>
        </div>
      )}
    </div>
  )
}

function HomepageAdminInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = searchParams.get('tab') ?? 'hero'

  const TAB_ITEMS = [
    { value: 'hero',         label: 'Banner',    icon: LayoutIcon    },
    { value: 'services',     label: 'Dịch vụ',   icon: BriefcaseIcon },
    { value: 'achievements', label: 'Thành tựu', icon: TrophyIcon    },
    { value: 'partners',     label: 'Đối tác',   icon: UsersIcon     },
    { value: 'posts',        label: 'Bài viết',  icon: FileTextIcon  },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="dh-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-navy-pale)', color: 'var(--color-navy)' }}>
            <GlobeIcon size={20} />
          </div>
          <div>
            <h1 className="dh-page-title">Nội dung trang chủ</h1>
            <p className="dh-page-desc">Đa ngôn ngữ · VI / EN</p>
          </div>
        </div>
      </div>

      <div className="dh-card" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid var(--color-gray-border)' }}>
          {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
            <button key={value} onClick={() => router.push(`/admin/homepage?tab=${value}`)}
              style={{
                flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '14px 0', fontSize: 13, fontWeight: tab === value ? 600 : 500,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: 'transparent',
                color: tab === value ? 'var(--color-navy)' : 'var(--color-gray-text)',
                borderBottom: tab === value ? '3px solid var(--color-navy)' : '3px solid transparent',
              }}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>
        <div style={{ padding: 24 }}>
          {tab === 'hero'         && <HeroEditor />}
          {tab === 'services'     && <ServicesEditor />}
          {tab === 'achievements' && <AchievementsEditor />}
          {tab === 'partners'     && <PartnersEditor />}
          {tab === 'posts'        && <PostsEditor />}
        </div>
      </div>

      <style>{`
        .group:hover .group-hover-show { opacity: 1 !important; }
      `}</style>
    </div>
  )
}

export default function HomepageAdminPage() {
  return <Suspense><HomepageAdminInner /></Suspense>
}
