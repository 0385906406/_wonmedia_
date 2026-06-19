'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  LayoutIcon, BriefcaseIcon, TrophyIcon, UsersIcon, FileTextIcon,
  PlusIcon, PencilIcon, Trash2Icon, SaveIcon, UploadIcon, GlobeIcon,
  CheckCircle2Icon, Loader2Icon, ImageIcon,
  ZapIcon, ListIcon, CheckSquareIcon, SquareIcon, ExternalLinkIcon,
} from 'lucide-react'
import { useToast } from '@/components/admin/toast-provider'
import { ADMIN_LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'

interface HeroData { _id?: string; title: MultiLang; title2: MultiLang; subtitle: MultiLang }
interface ServiceItem { _id: string; order: number; iconKey: string; title: MultiLang; desc: MultiLang; active: boolean }
interface AchievementItem { _id: string; order: number; value: number; label: MultiLang; active: boolean }
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

function HeroEditor() {
  const [data, setData] = useState<HeroData>({ title: emptyMultiLang(), title2: emptyMultiLang(), subtitle: emptyMultiLang() })
  const [lang, setLang] = useState<LocaleKey>('vi')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetch('/api/homepage/hero').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(r => { if (r.data) setData(r.data) }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/homepage/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: data.title, title2: data.title2, subtitle: data.subtitle }) })
      if (res.ok) toast.success('Đã lưu banner!')
      else toast.error('Lỗi lưu banner')
    } finally { setSaving(false) }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-gray-text)', padding: 32 }}>
      <Loader2Icon size={16} className="animate-spin" />Đang tải...
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Banner trang chủ</h3>
          <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Chỉnh sửa nội dung hiển thị trên banner chính</p>
        </div>
        <button onClick={save} disabled={saving} className="dh-btn dh-btn-primary dh-btn-sm gap-2">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu thay đổi
        </button>
      </div>
      <div style={{ borderRadius: 10, overflow: 'hidden', background: 'linear-gradient(135deg, #1a2030, #2f3441)', padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ color: 'white', fontWeight: 900, fontSize: 24, letterSpacing: '-0.03em' }}>{data.title[lang] || 'BRINGING MUSIC'}</p>
        <p style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-0.03em', background: 'linear-gradient(90deg,#ff6900,#ffaa44)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {data.title2[lang] || 'TO THE WORLD'}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, maxWidth: 400, margin: '0 auto' }}>{data.subtitle[lang] || 'Subtitle...'}</p>
      </div>
      <LangTabs activeLang={lang} onChange={setLang} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <MLField label="Tiêu đề dòng 1 (màu trắng)" value={data.title} onChange={(v) => setData(d => ({ ...d, title: v }))} lang={lang} />
        <MLField label="Tiêu đề dòng 2 (màu cam)" value={data.title2} onChange={(v) => setData(d => ({ ...d, title2: v }))} lang={lang} />
        <MLField label="Phụ đề" value={data.subtitle} onChange={(v) => setData(d => ({ ...d, subtitle: v }))} multiline lang={lang} />
      </div>
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

  const ICON_KEYS = ['play', 'music', 'youtube', 'shield', 'star', 'globe']

  useEffect(() => { fetchItems() }, [])
  function fetchItems() {
    setLoading(true)
    fetch('/api/homepage/services').then(r => r.ok ? r.json() : Promise.reject(r.status)).then(r => { if (r.data) setItems(r.data) }).catch(() => {}).finally(() => setLoading(false))
  }

  function openNew() {
    setEditItem({ _id: '', order: items.length, iconKey: 'play', title: emptyMultiLang(), desc: emptyMultiLang(), active: true })
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
              <button className="dh-btn-icon" onClick={() => { setEditItem(item); setLang('vi') }}><PencilIcon size={14} /></button>
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

  const BAR_COLORS = ['#f97316', '#00A98F', 'var(--color-indigo)', 'var(--color-navy)']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Thành tựu</h3>
          <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Quản lý các chỉ số thành tựu</p>
        </div>
        <button onClick={() => setEditItem({ _id: '', order: items.length, value: 0, label: emptyMultiLang(), active: true })} className="dh-btn dh-btn-primary dh-btn-sm gap-2">
          <PlusIcon size={14} />Thêm
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-gray-text)', padding: 16 }}>
          <Loader2Icon size={16} className="animate-spin" />Đang tải...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {items.map((item, i) => (
            <div key={item._id} style={{ position: 'relative', border: '1px solid var(--color-gray-border)', borderRadius: 10, padding: 16, background: 'white', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}
              className="group">
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, borderRadius: '10px 10px 0 0', background: BAR_COLORS[i % 4] }} />
              <p style={{ fontSize: 28, fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-navy-deep)' }}>{item.value}<span style={{ color: 'var(--color-navy)', fontSize: 16 }}>+</span></p>
              <p style={{ fontSize: 10, color: 'var(--color-gray-text)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{item.label.vi}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, opacity: 0, transition: 'opacity 0.15s' }} className="group-hover-show">
                <button className="dh-btn-icon" style={{ width: 24, height: 24 }} onClick={() => { setEditItem(item); setLang('vi') }}><PencilIcon size={12} /></button>
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

      {/* Mode selector */}
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

      {/* Limit input — auto mode only */}
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

      {/* Post list */}
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
