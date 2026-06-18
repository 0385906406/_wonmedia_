'use client'

import { useEffect, useState, useCallback } from 'react'
import { PlusIcon, Trash2Icon, PencilIcon, GlobeIcon } from 'lucide-react'
import { useToast } from '@/components/admin/toast-provider'
import { ADMIN_LOCALES, LOCALE_META, type LocaleKey } from '@/types/multilang'

interface Category {
  _id: string
  slug: string
  name: Record<string, string>
  forType: 'blog' | 'tuyen-dung' | 'all'
  active: boolean
  order: number
}

const TYPE_LABELS = { all: 'Tất cả', blog: 'Blog', 'tuyen-dung': 'Tuyển dụng' }
const EMPTY_NAME = { vi: '', en: '', ko: '', ja: '', zh: '' }

function slugify(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

export default function CategoriesPage() {
  const [cats, setCats]         = useState<Category[]>([])
  const { success: toastOk, error: toastErr } = useToast()

  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Category | null>(null)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [lang, setLang]         = useState<LocaleKey>('vi')
  
  // Form state
  const [slug, setSlug]         = useState('')
  const [name, setName]         = useState({ ...EMPTY_NAME })
  const [forType, setForType]   = useState<'all' | 'blog' | 'tuyen-dung'>('all')
  const [active, setActive]     = useState(true)
  const [order, setOrder]       = useState(0)
  const [slugLocked, setSlugLocked] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/categories-all')
    if (res.ok) {
      const d = await res.json()
      setCats(d.data ?? [])
    } else {
      toastErr('Không tải được danh mục')
    }
    setLoading(false)
  }, [toastErr])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditing(null); setSlug(''); setName({ ...EMPTY_NAME })
    setForType('all'); setActive(true); setOrder(0); setSlugLocked(false)
    setShowForm(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setSlug(cat.slug)
    setName({ vi: cat.name.vi||'', en: cat.name.en||'', ko: cat.name.ko||'', ja: cat.name.ja||'', zh: cat.name.zh||'' })
    setForType(cat.forType)
    setActive(cat.active)
    setOrder(cat.order ?? 0)
    setSlugLocked(true)
    setShowForm(true)
  }

  // Auto-slug from vi name when creating
  useEffect(() => {
    if (!editing && !slugLocked && name.vi) setSlug(slugify(name.vi))
  }, [name.vi, editing, slugLocked])

  async function save() {
    if (!name.vi.trim()) { toastErr('Tên tiếng Việt không được để trống'); return }
    if (!slug.trim())    { toastErr('Slug không được để trống'); return }
    setSaving(true)
    try {
      const url = editing ? `/api/categories/${editing._id}` : '/api/categories'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, forType, active, order }),
      })
      const d = await res.json()
      if (!res.ok) { toastErr(d.error ?? 'Lỗi lưu'); return }
      toastOk(editing ? 'Đã cập nhật danh mục' : 'Đã tạo danh mục')
      setShowForm(false)
      // Update local state
      if (editing) {
        setCats(prev => prev.map(c => c._id === editing._id ? d.data : c))
      } else {
        setCats(prev => [...prev, d.data])
      }
    } finally { setSaving(false) }
  }

  async function del(id: string, catName: string) {
    if (!confirm(`Xoá danh mục "${catName}"?`)) return
    setDeleting(id)
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      toastErr(d.error ?? 'Xoá thất bại')
    } else {
      setCats(prev => prev.filter(c => c._id !== id))
      toastOk('Đã xoá danh mục')
    }
    setDeleting(null)
  }

  async function toggleActive(cat: Category) {
    // Optimistic update
    setCats(prev => prev.map(c => c._id === cat._id ? { ...c, active: !c.active } : c))
    const res = await fetch(`/api/categories/${cat._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !cat.active }),
    })
    if (!res.ok) {
      // Rollback nếu thất bại
      setCats(prev => prev.map(c => c._id === cat._id ? { ...c, active: cat.active } : c))
      toastErr('Cập nhật thất bại')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Danh mục</h1>
          <p className="dh-page-desc">Quản lý danh mục bài viết đa ngôn ngữ</p>
        </div>
        <button onClick={openCreate} className="dh-btn dh-btn-primary" style={{ gap: 6 }}>
          <PlusIcon size={14} /> Thêm danh mục
        </button>
      </div>

      {/* Table */}
      <div className="dh-card">
        {loading ? (
          <div style={{ padding: 40 }}>
            {[1,2,3].map(i => <div key={i} className="dh-skeleton" style={{ height: 48, marginBottom: 8 }} />)}
          </div>
        ) : cats.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
            <GlobeIcon size={36} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
            <p style={{ fontSize: 14 }}>Chưa có danh mục nào. Tạo danh mục đầu tiên!</p>
          </div>
        ) : (
          <table className="dh-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>STT</th>
                <th>Tên danh mục</th>
                <th>Slug</th>
                <th>Loại bài</th>
                <th>Trạng thái</th>
                <th style={{ width: 100 }}></th>
              </tr>
            </thead>
            <tbody>
              {cats.map((cat, i) => (
                <tr key={cat._id}>
                  <td style={{ color: '#94a3b8', fontSize: 12 }}>{cat.order || i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#062340', fontSize: 14 }}>{cat.name.vi || '—'}</div>
                    {cat.name.en && <div style={{ fontSize: 11, color: '#94a3b8' }}>{cat.name.en}</div>}
                  </td>
                  <td><code style={{ fontSize: 12, color: '#6366F1', background: '#EEF0FE', padding: '2px 8px', borderRadius: 5 }}>{cat.slug}</code></td>
                  <td><span className={`dh-badge ${cat.forType === 'all' ? 'dh-badge-gray' : cat.forType === 'blog' ? 'dh-badge-green' : 'dh-badge-indigo'}`}>{TYPE_LABELS[cat.forType]}</span></td>
                  <td>
                    <button onClick={() => toggleActive(cat)}
                      className={`dh-toggle ${cat.active ? 'on' : 'off'}`}>
                      <span className="dh-toggle-knob" />
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(cat)} className="dh-btn-icon" title="Sửa"><PencilIcon size={13} /></button>
                      <button onClick={() => del(cat._id, cat.name.vi)} disabled={deleting === cat._id}
                        className="dh-btn-icon" style={{ color: '#ef4444', borderColor: '#FECACA' }} title="Xoá">
                        <Trash2Icon size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="dh-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="dh-modal" style={{ maxWidth: 560 }}>
            <div className="dh-modal-header">
              <h3 className="dh-modal-title">{editing ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
            </div>
            <div className="dh-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Lang tabs */}
              <div style={{ display: 'flex', gap: 2, padding: 3, background: 'var(--color-gray-light)', borderRadius: 10, width: 'fit-content' }}>
                {ADMIN_LOCALES.map(l => (
                  <button key={l} type="button" onClick={() => setLang(l)}
                    style={{ padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                      background: lang === l ? '#fff' : 'transparent',
                      color: lang === l ? 'var(--color-navy-deep)' : 'var(--color-gray-text)',
                      boxShadow: lang === l ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                    {LOCALE_META[l].flag} {LOCALE_META[l].short}
                    {name[l] && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-teal)', display: 'inline-block', marginLeft: 4 }} />}
                  </button>
                ))}
              </div>

              {/* Name */}
              <div>
                <label className="dh-label">Tên danh mục {lang === 'vi' && <span style={{ color: '#ef4444' }}>*</span>} <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>({LOCALE_META[lang].flag})</span></label>
                <input className="dh-input" value={name[lang] ?? ''} onChange={e => setName(n => ({ ...n, [lang]: e.target.value }))}
                  placeholder={`Tên danh mục (${LOCALE_META[lang].short})...`} />
              </div>

              {/* Slug */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label className="dh-label" style={{ margin: 0 }}>Slug <span style={{ color: '#ef4444' }}>*</span></label>
                  {!editing && (
                    <button type="button" onClick={() => setSlugLocked(l => !l)}
                      style={{ fontSize: 11, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                      {slugLocked ? '↺ Tự động' : '🔒 Khoá'}
                    </button>
                  )}
                </div>
                <input className="dh-input" value={slug} onChange={e => setSlug(e.target.value)}
                  placeholder="ten-danh-muc" style={{ fontFamily: 'monospace', fontSize: 13 }} readOnly={!!editing} />
                {editing && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>Không thể đổi slug sau khi tạo.</p>}
              </div>

              {/* Type + Active + Order */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 12 }}>
                <div>
                  <label className="dh-label">Loại bài viết</label>
                  <select className="dh-input" value={forType} onChange={e => setForType(e.target.value as typeof forType)}>
                    <option value="all">Tất cả</option>
                    <option value="blog">Chỉ Blog</option>
                    <option value="tuyen-dung">Chỉ Tuyển dụng</option>
                  </select>
                </div>
                <div>
                  <label className="dh-label">Trạng thái</label>
                  <select className="dh-input" value={active ? '1' : '0'} onChange={e => setActive(e.target.value === '1')}>
                    <option value="1">Kích hoạt</option>
                    <option value="0">Ẩn</option>
                  </select>
                </div>
                <div>
                  <label className="dh-label">Thứ tự</label>
                  <input className="dh-input" type="number" value={order} onChange={e => setOrder(+e.target.value)} />
                </div>
              </div>
            </div>
            <div className="dh-modal-footer">
              <button onClick={() => setShowForm(false)} className="dh-btn dh-btn-secondary">Huỷ</button>
              <button onClick={save} disabled={saving} className="dh-btn dh-btn-primary" style={{ gap: 6 }}>
                {saving ? 'Đang lưu...' : (editing ? 'Cập nhật' : 'Tạo danh mục')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
