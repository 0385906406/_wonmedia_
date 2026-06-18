'use client'

import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  SaveIcon, ArrowLeftIcon, UploadIcon, Loader2Icon, SparklesIcon,
  ImageIcon, GlobeIcon, FileTextIcon, SearchIcon, EyeIcon, ExternalLinkIcon,
} from 'lucide-react'
import { FocalPointPicker } from '@/components/admin/FocalPointPicker'
import { useToast } from '@/components/admin/toast-provider'
import { ADMIN_LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'

const RichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditor').then(m => m.RichTextEditor),
  { ssr: false, loading: () => <div className="dh-skeleton" style={{ height: 360, borderRadius: 12 }} /> }
)

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category { _id: string; slug: string; name: Record<string, string>; forType: string }

interface PostForm {
  slug: string; type: 'blog' | 'tuyen-dung'; thumbnail: string; date: string
  showOnHomepage: boolean; active: boolean
  categoryId: string
  category: MultiLang; title: MultiLang; excerpt: MultiLang; content: MultiLang
  seoTitle: MultiLang; seoDescription: MultiLang; seoKeywords: MultiLang
  ogImage: string
  thumbnailPosition: string
  // Job-specific
  urgent: boolean
  deadline: string
  jobType: string
  location: string
  salary: string
}

type TabId = 'content' | 'seo'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

const IC = 'h-9 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-indigo-400 focus-visible:ring-1 focus-visible:ring-indigo-400/20 text-sm'
const TA = 'rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-indigo-400 focus-visible:ring-1 focus-visible:ring-indigo-400/20 text-sm resize-none'

// ─── LangTabs ─────────────────────────────────────────────────────────────────
function LangTabs({ active, onChange, form }: { active: LocaleKey; onChange: (l: LocaleKey) => void; form?: PostForm }) {
  return (
    <div style={{ display: 'flex', gap: 3, padding: 4, background: 'var(--color-gray-light, #F8F9FB)', borderRadius: 10, width: 'fit-content' }}>
      {ADMIN_LOCALES.map(l => {
        const hasContent = form ? !!(form.title[l] && form.content[l]) : false
        const isActive = active === l
        return (
          <button key={l} type="button" onClick={() => onChange(l)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700,
              background: isActive ? '#fff' : 'transparent',
              color: isActive ? 'var(--color-navy-deep, #062340)' : 'var(--color-gray-text, #334155)',
              boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.12s',
            }}>
            {LOCALE_META[l].flag}
            <span>{LOCALE_META[l].short}</span>
            {form && hasContent && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-teal, #00A98F)', flexShrink: 0 }} />
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── ImageUpload ──────────────────────────────────────────────────────────────
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    // Reset input để có thể chọn lại cùng file
    e.target.value = ''
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const r = await fetch('/api/admin/media/upload', { method: 'POST', body: fd })
      const d = await r.json()
      const url = d.data?.url
      if (!r.ok || !url) {
        alert(d.error ?? 'Upload thất bại. Vui lòng thử lại.')
        return
      }
      onChange(url)
    } catch {
      alert('Không thể upload ảnh. Kiểm tra kết nối mạng.')
    } finally { setUploading(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {value ? (
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9', background: '#F1F5F9' }}
          onMouseEnter={e => { const ov = e.currentTarget.querySelector('.thumb-overlay') as HTMLElement; if (ov) ov.style.opacity = '1' }}
          onMouseLeave={e => { const ov = e.currentTarget.querySelector('.thumb-overlay') as HTMLElement; if (ov) ov.style.opacity = '0' }}>
          <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <div className="thumb-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}>
            <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
              style={{ padding: '6px 14px', borderRadius: 8, background: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              {uploading ? <Loader2Icon size={12} className="animate-spin" /> : <UploadIcon size={12} />}
              Thay ảnh
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          style={{ aspectRatio: '16/9', borderRadius: 10, border: '2px dashed #E5E8ED', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#94a3b8', cursor: 'pointer', transition: 'all 0.15s', background: 'transparent' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6366F1'; (e.currentTarget as HTMLElement).style.color = '#6366F1'; (e.currentTarget as HTMLElement).style.background = '#EEF0FE' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E8ED'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
          {uploading ? <Loader2Icon size={22} className="animate-spin" /> : <ImageIcon size={22} strokeWidth={1.5} />}
          <span style={{ fontSize: 11, fontWeight: 600 }}>{uploading ? 'Đang tải...' : 'Chọn thumbnail'}</span>
        </button>
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="Hoặc dán URL ảnh..." className={IC + ' flex-1 h-8 text-xs'} />
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E5E8ED', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', flexShrink: 0 }}>
          <UploadIcon size={13} />
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}

// ─── Preview Modal ────────────────────────────────────────────────────────────
function PreviewModal({ form, lang, onClose }: { form: PostForm; lang: LocaleKey; onClose: () => void }) {
  const [previewLang, setPreviewLang] = useState<LocaleKey>(lang)
  const ml = (f: MultiLang) => f[previewLang] || f.vi || ''
  const isBlog = form.type === 'blog'

  // Đóng bằng Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Khoá scroll body
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column' }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 48, flexShrink: 0,
        background: 'rgba(6,35,64,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Xem trước</span>
          <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.12)' }} />
          <div style={{ display: 'flex', gap: 2, padding: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 8 }}>
            {ADMIN_LOCALES.map(l => (
              <button key={l} type="button" onClick={() => setPreviewLang(l)}
                style={{
                  padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700, transition: 'all 0.12s',
                  background: previewLang === l ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: previewLang === l ? '#fff' : 'rgba(255,255,255,0.4)',
                }}>
                {LOCALE_META[l].flag} {LOCALE_META[l].short}
              </button>
            ))}
          </div>
        </div>
        <button type="button" onClick={onClose}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 13px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Đóng (Esc)
        </button>
      </div>

      {/* Page scroll */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--wm-dark, #191B24)' }}>

        {/* ══ HERO ══ — giống hệt PostDetail */}
        <section style={{ position: 'relative', width: '100%', minHeight: 420, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          {form.thumbnail ? (
            <img src={form.thumbnail} alt={ml(form.title)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: form.thumbnailPosition || 'center center', filter: 'brightness(0.55) contrast(1.05) saturate(0.9)' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #191B24, #0F4C81)' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 30%, rgba(25,27,36,0.7) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.45, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1px, transparent 0)', backgroundSize: '3px 3px' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, background: 'linear-gradient(to bottom, transparent, var(--wm-dark, #191B24))' }} />

          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1280, margin: '0 auto', padding: 'clamp(80px,10vw,100px) clamp(16px,4vw,32px) 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 100, background: isBlog ? '#dcfce7' : '#dbeafe', color: isBlog ? '#15803d' : '#1d4ed8' }}>
                {ml(form.category) || (isBlog ? 'Blog' : 'Tuyển dụng')}
              </span>
              {form.date && <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'monospace' }}>{form.date}</span>}
            </div>
            <h1 style={{ fontFamily: 'var(--font-primary, inherit)', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, color: '#fff', margin: '0 0 18px', textShadow: '0 4px 40px rgba(0,0,0,0.4)' }}>
              {ml(form.title) || <span style={{ opacity: 0.4 }}>Tiêu đề bài viết...</span>}
            </h1>
            {ml(form.excerpt) && (
              <p style={{ fontFamily: 'var(--font-primary, inherit)', fontSize: 'clamp(14px, 2vw, 17px)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, margin: 0, maxWidth: 720 }}>
                {ml(form.excerpt)}
              </p>
            )}
          </div>
        </section>

        {/* ══ CONTENT — giống hệt PostDetail ══ */}
        <div style={{ background: '#F8F9FB' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(32px,6vw,64px) clamp(16px,4vw,32px) clamp(48px,6vw,80px)' }}>

            {/* Thumbnail featured */}
            {form.thumbnail && (
              <div style={{ marginBottom: 52, borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 40px rgba(15,76,129,0.12)' }}>
                <img src={form.thumbnail} alt={ml(form.title)} style={{ width: '100%', aspectRatio: '16/8', objectFit: 'cover', objectPosition: form.thumbnailPosition || 'center center', display: 'block' }} />
              </div>
            )}

            {/* Article body */}
            {ml(form.content) ? (
              <article className="wm-article-body" dangerouslySetInnerHTML={{ __html: ml(form.content) }} />
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 0', color: '#94a3b8' }}>
                <EyeIcon size={40} style={{ margin: '0 auto 14px', opacity: 0.2 }} />
                <p style={{ fontSize: 14, margin: 0 }}>Chưa có nội dung. Nhập nội dung ở tab Nội dung.</p>
              </div>
            )}

            {/* Divider + back — giống client */}
            {ml(form.content) && (
              <>
                <div style={{ height: 1, background: '#E5E8ED', margin: '56px 0 40px' }} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 10, border: '1.5px solid #0b2a59', color: '#0b2a59', fontSize: 14, fontWeight: 700, cursor: 'default' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Quay lại
                </span>
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Sidebar Card ─────────────────────────────────────────────────────────────
function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--color-gray-border,#E5E8ED)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', background: '#FAFBFC' }}>
        <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function PostEditorInner() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const isNew  = id === 'new-post'

  const [form, setForm] = useState<PostForm>({
    slug: '', type: 'blog', thumbnail: '', date: '',
    showOnHomepage: false, active: true,
    category: emptyMultiLang(), title: emptyMultiLang(),
    excerpt: emptyMultiLang(), content: emptyMultiLang(),
    categoryId: '',
    seoTitle: emptyMultiLang(), seoDescription: emptyMultiLang(),
    seoKeywords: emptyMultiLang(), ogImage: '',
    thumbnailPosition: 'center center',
    urgent: false, deadline: '', jobType: '', location: '', salary: '',
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [tab,        setTab]        = useState<TabId>('content')
  const [lang,       setLang]       = useState<LocaleKey>('vi')
  const [preview,    setPreview]    = useState(false)
  const [loading,    setLoading]    = useState(!isNew)
  const [saving,     setSaving]     = useState(false)
  const [translating, setTrans]     = useState(false)
  const [slugLocked, setSlugLocked] = useState(!isNew)
  const { success: toastOk, error: toastErr } = useToast()
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error') => {
    type === 'success' ? toastOk(msg) : toastErr(msg)
  }, [toastOk, toastErr])

  // Load categories
  useEffect(() => {
    fetch('/api/admin/categories-all')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => setCategories(d.data ?? []))
      .catch(() => toastErr('Không tải được danh mục'))
  }, [toastErr])

  // Chọn category → tự điền multilang
  function selectCategory(catId: string) {
    setField('categoryId', catId)
    if (!catId) return
    const cat = categories.find(c => c._id === catId)
    if (cat) setForm(f => ({ ...f, categoryId: catId, category: { vi: cat.name.vi||'', en: cat.name.en||'', ko: cat.name.ko||'', ja: cat.name.ja||'', zh: cat.name.zh||'' } }))
  }

  useEffect(() => {
    if (isNew) return
    fetch(`/api/posts/${id}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(r => {
        if (r.data) setForm(prev => ({
          ...prev, ...r.data,
          seoTitle:          r.data.seoTitle          ?? emptyMultiLang(),
          seoDescription:    r.data.seoDescription    ?? emptyMultiLang(),
          seoKeywords:       r.data.seoKeywords       ?? emptyMultiLang(),
          categoryId:        r.data.categoryId        ?? '',
          ogImage:           r.data.ogImage           ?? '',
          thumbnailPosition: r.data.thumbnailPosition ?? 'center center',
          urgent:            r.data.urgent            ?? false,
          deadline:          r.data.deadline          ?? '',
          jobType:           r.data.jobType           ?? '',
          location:          r.data.location          ?? '',
          salary:            r.data.salary            ?? '',
        }))
      })
      .catch(() => toastErr('Không tải được bài viết'))
      .finally(() => setLoading(false))
  }, [id, isNew, toastErr])

  useEffect(() => {
    if (!isNew || slugLocked) return
    setForm(f => ({ ...f, slug: slugify(f.title.vi) }))
  }, [form.title.vi, isNew, slugLocked])

  // Dọn navigation timer khi unmount
  useEffect(() => {
    return () => { if (navTimerRef.current) clearTimeout(navTimerRef.current) }
  }, [])

  function setField<K extends keyof PostForm>(key: K, value: PostForm[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }
  function setML(key: 'title'|'excerpt'|'content'|'category'|'seoTitle'|'seoDescription'|'seoKeywords', value: string) {
    setForm(f => ({ ...f, [key]: { ...f[key], [lang]: value } }))
  }

  async function translate() {
    if (!form.title.vi && !form.content.vi) { showToast('Nhập nội dung tiếng Việt trước.', 'error'); return }
    setTrans(true)
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: { title: form.title.vi, excerpt: form.excerpt.vi, content: form.content.vi }, targetLocales: ['en','ko','ja','zh'] }),
      })
      const data = await res.json()
      if (!res.ok || data.error) { showToast(data.error ?? 'Lỗi dịch AI', 'error'); return }
      const t = data.translations as Record<string, { title: string; excerpt: string; content: string }>
      setForm(f => ({
        ...f,
        title:   { ...f.title,   ...Object.fromEntries(Object.entries(t).map(([lc, v]) => [lc, v.title])) },
        excerpt: { ...f.excerpt, ...Object.fromEntries(Object.entries(t).map(([lc, v]) => [lc, v.excerpt])) },
        content: { ...f.content, ...Object.fromEntries(Object.entries(t).map(([lc, v]) => [lc, v.content])) },
      }))
      showToast('Đã dịch sang EN · KO · JA · ZH ✓', 'success')
    } catch { showToast('Không kết nối được AI.', 'error') }
    finally { setTrans(false) }
  }

  async function save() {
    if (!form.slug)     { showToast('Slug không được để trống.', 'error'); return }
    if (!form.title.vi) { showToast('Tiêu đề tiếng Việt không được để trống.', 'error'); return }
    setSaving(true)
    try {
      const url    = isNew ? '/api/posts' : `/api/posts/${id}`
      const method = isNew ? 'POST' : 'PUT'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data   = await res.json()
      if (!res.ok) { showToast(data.error ?? 'Lỗi lưu', 'error'); return }
      showToast(isNew ? 'Đã tạo bài viết!' : 'Đã lưu thay đổi!', 'success')
      if (isNew) {
        navTimerRef.current = setTimeout(() => router.push(`/admin/posts/${data.data._id}`), 800)
      }
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240, gap: 8, color: '#64748b' }}>
        <Loader2Icon size={20} className="animate-spin" /> Đang tải bài viết...
      </div>
    )
  }

  const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'content', label: 'Nội dung', icon: <FileTextIcon size={14} /> },
    { id: 'seo',     label: 'SEO',       icon: <SearchIcon size={14} /> },
  ]

  return (
    <div>
      {preview && <PreviewModal form={form} lang={lang} onClose={() => setPreview(false)} />}

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button type="button" onClick={() => router.push('/admin/posts')}
            style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #E5E8ED', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151', flexShrink: 0 }}>
            <ArrowLeftIcon size={15} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--color-navy-deep,#062340)', letterSpacing: '-0.3px' }}>
              {isNew ? 'Tạo bài viết mới' : 'Chỉnh sửa bài viết'}
            </h1>
            {!isNew && <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginTop: 1 }}>/{form.slug}</p>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          <Button variant="outline" type="button" onClick={() => setPreview(true)}
            className="gap-2 border-[#E5E8ED] h-9 text-sm">
            <EyeIcon size={13} /> Xem trước
          </Button>
          <Button variant="outline" onClick={translate} disabled={translating || saving}
            className="gap-2 border-[#E5E8ED] text-[#6366F1] hover:bg-indigo-50 hover:border-indigo-300 h-9 text-sm">
            {translating ? <Loader2Icon size={13} className="animate-spin" /> : <SparklesIcon size={13} />}
            {translating ? 'Đang dịch...' : 'AI Dịch'}
          </Button>
          {!isNew && (
            <a href={`/vi/${form.type === 'blog' ? 'tin-tuc' : 'tuyen-dung'}/${form.slug}`} target="_blank" rel="noreferrer">
              <Button variant="outline" type="button" className="gap-2 border-[#E5E8ED] h-9 text-sm">
                <ExternalLinkIcon size={13} /> Xem trang
              </Button>
            </a>
          )}
          <Button onClick={save} disabled={saving || translating}
            style={{ background: 'var(--color-indigo,#6366F1)', color: '#fff', height: 36, fontSize: 13, fontWeight: 600, gap: 6, paddingLeft: 16, paddingRight: 16, border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {saving ? <Loader2Icon size={13} className="animate-spin" /> : <SaveIcon size={13} />}
            {saving ? 'Đang lưu...' : isNew ? 'Tạo bài viết' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      {/* 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 20, alignItems: 'start' }}>

        {/* ── LEFT: Tabs ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Tab nav */}
          <div style={{ display: 'flex', background: '#fff', border: '1px solid #E5E8ED', borderBottom: 'none', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
            {TABS.map(t => (
              <button key={t.id} type="button" onClick={() => setTab(t.id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '11px 14px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  background: tab === t.id ? '#fff' : 'var(--color-gray-light,#F8F9FB)',
                  color: tab === t.id ? 'var(--color-indigo,#6366F1)' : '#64748b',
                  borderBottom: tab === t.id ? '2px solid var(--color-indigo,#6366F1)' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}>
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab body */}
          <div style={{ background: '#fff', border: '1px solid #E5E8ED', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: 24 }}>

            {/* ── Nội dung ── */}
            {tab === 'content' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* AI hint */}
                <div style={{ display: 'flex', gap: 9, padding: '10px 14px', background: '#EEF0FE', borderRadius: 9, border: '1px solid #C7D2FE' }}>
                  <GlobeIcon size={14} style={{ color: '#6366F1', flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, fontSize: 12, color: '#4338CA', lineHeight: 1.6 }}>
                    Nhập <strong>tiếng Việt</strong> trước → nhấn <strong>AI Dịch</strong> để dịch sang EN · KO · JA · ZH tự động.
                  </p>
                </div>

                <LangTabs active={lang} onChange={setLang} form={form} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Category */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)' }}>Danh mục</label>
                      <a href="/admin/categories" target="_blank"
                        style={{ fontSize: 11, color: '#6366F1', textDecoration: 'none', fontWeight: 600 }}>
                        + Quản lý danh mục ↗
                      </a>
                    </div>
                    <select className="dh-input" style={{ fontSize: 13 }}
                      value={form.categoryId ?? ''} onChange={e => selectCategory(e.target.value)}>
                      <option value="">— Chọn danh mục —</option>
                      {categories
                        .filter(c => c.forType === 'all' || c.forType === form.type)
                        .map(c => (
                          <option key={c._id} value={c._id}>
                            {c.name.vi || c.slug}
                            {c.forType !== 'all' ? ` (${c.forType === 'blog' ? 'Blog' : 'Tuyển dụng'})` : ''}
                          </option>
                        ))}
                    </select>
                    {form.categoryId && form.category[lang] && (
                      <p style={{ margin: '4px 0 0', fontSize: 11, color: '#00A98F', fontWeight: 600 }}>
                        ✓ {LOCALE_META[lang].flag} {form.category[lang]}
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)', marginBottom: 6 }}>
                      Tiêu đề {lang === 'vi' && <span style={{ color: '#ef4444' }}>*</span>}
                      <span style={{ fontFamily: 'monospace', fontWeight: 400, color: '#94a3b8', marginLeft: 5 }}>({LOCALE_META[lang].flag})</span>
                    </label>
                    <input className="dh-input" style={{ fontSize: 15, fontWeight: 600 }}
                      value={form.title[lang] ?? ''} onChange={e => setML('title', e.target.value)}
                      placeholder={`Tiêu đề bài viết (${LOCALE_META[lang].short})...`} />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)', marginBottom: 6 }}>
                      Tóm tắt <span style={{ fontFamily: 'monospace', fontWeight: 400, color: '#94a3b8' }}>({LOCALE_META[lang].flag})</span>
                    </label>
                    <Textarea value={form.excerpt[lang] ?? ''} onChange={e => setML('excerpt', e.target.value)}
                      placeholder={`Mô tả ngắn hiển thị trong danh sách... (${LOCALE_META[lang].short})`}
                      rows={3} className={TA} />
                  </div>

                  {/* Content */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)', marginBottom: 6 }}>
                      Nội dung <span style={{ fontFamily: 'monospace', fontWeight: 400, color: '#94a3b8' }}>({LOCALE_META[lang].flag})</span>
                    </label>
                    <RichTextEditor
                      value={form.content[lang] ?? ''}
                      onChange={v => setML('content', v)}
                      placeholder={`Nhập nội dung bài viết (${LOCALE_META[lang].short})...`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── SEO ── */}
            {tab === 'seo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', gap: 9, padding: '10px 14px', background: '#F0FDF4', borderRadius: 9, border: '1px solid #BBF7D0' }}>
                  <SearchIcon size={14} style={{ color: '#00A98F', flexShrink: 0, marginTop: 1 }} />
                  <p style={{ margin: 0, fontSize: 12, color: '#007D69', lineHeight: 1.6 }}>
                    Cấu hình riêng cho từng ngôn ngữ. Để trống → tự động dùng tiêu đề và tóm tắt bài viết.
                  </p>
                </div>

                <LangTabs active={lang} onChange={setLang} form={form} />

                {/* Meta Title */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)' }}>
                      Meta Title <span style={{ fontFamily: 'monospace', fontWeight: 400, color: '#94a3b8' }}>({LOCALE_META[lang].flag})</span>
                    </label>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: (form.seoTitle[lang]??'').length > 60 ? '#ef4444' : (form.seoTitle[lang]??'').length > 50 ? '#f59e0b' : '#94a3b8' }}>
                      {(form.seoTitle[lang]??'').length}/60
                    </span>
                  </div>
                  <input className="dh-input" style={{ fontSize: 13 }}
                    value={form.seoTitle[lang] ?? ''} onChange={e => setML('seoTitle', e.target.value)}
                    placeholder={form.title[lang] || `Tiêu đề hiển thị trên Google...`} maxLength={80} />
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>Để trống → dùng tiêu đề bài. Nên 50–60 ký tự.</p>
                </div>

                {/* Meta Description */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)' }}>
                      Meta Description <span style={{ fontFamily: 'monospace', fontWeight: 400, color: '#94a3b8' }}>({LOCALE_META[lang].flag})</span>
                    </label>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: (form.seoDescription[lang]??'').length > 160 ? '#ef4444' : (form.seoDescription[lang]??'').length > 140 ? '#f59e0b' : '#94a3b8' }}>
                      {(form.seoDescription[lang]??'').length}/160
                    </span>
                  </div>
                  <Textarea value={form.seoDescription[lang] ?? ''} onChange={e => setML('seoDescription', e.target.value)}
                    placeholder={form.excerpt[lang] || `Mô tả hiển thị trên Google...`}
                    rows={3} className={TA} maxLength={200} />
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>Để trống → dùng tóm tắt. Nên 140–160 ký tự.</p>
                </div>

                {/* Keywords */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)', marginBottom: 6 }}>
                    Keywords <span style={{ fontFamily: 'monospace', fontWeight: 400, color: '#94a3b8' }}>({LOCALE_META[lang].flag})</span>
                  </label>
                  <input className="dh-input" style={{ fontSize: 13 }}
                    value={form.seoKeywords[lang] ?? ''} onChange={e => setML('seoKeywords', e.target.value)}
                    placeholder="wonmedia, âm nhạc, phát hành, ..." />
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>Phân cách bằng dấu phẩy.</p>
                </div>

                {/* OG Image */}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)', marginBottom: 6 }}>
                    OG Image <span style={{ fontSize: 11, fontWeight: 400, color: '#94a3b8' }}>(dùng chung mọi ngôn ngữ)</span>
                  </label>
                  <input className="dh-input" style={{ fontSize: 13 }}
                    value={form.ogImage ?? ''} onChange={e => setField('ogImage', e.target.value)}
                    placeholder="Để trống → dùng thumbnail" />
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94a3b8' }}>Ảnh khi chia sẻ Facebook/Zalo. Khuyến nghị 1200×630px.</p>
                </div>

                <div style={{ height: 1, background: '#E5E8ED' }} />

                {/* Google SERP preview */}
                <div>
                  <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Google Preview — {LOCALE_META[lang].flag} {LOCALE_META[lang].label}
                  </p>
                  <div style={{ padding: '16px 20px', background: '#fff', borderRadius: 10, border: '1px solid #E5E8ED' }}>
                    <p style={{ margin: '0 0 3px', fontSize: 12, color: '#006621' }}>
                      wonmedia.vn › {form.type === 'blog' ? 'tin-tuc' : 'tuyen-dung'} › <span style={{ color: '#5f6368' }}>{form.slug || 'slug'}</span>
                    </p>
                    <p style={{ margin: '0 0 3px', fontSize: 17, color: '#1558d6', fontWeight: 400, lineHeight: 1.3 }}>
                      {(form.seoTitle[lang] || form.title[lang]) || <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 14 }}>Tiêu đề chưa có</span>}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: '#4d5156', lineHeight: 1.55 }}>
                      {(form.seoDescription[lang] || form.excerpt[lang]) || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Mô tả chưa có...</span>}
                    </p>
                  </div>
                </div>

                {/* OG card preview */}
                <div>
                  <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Facebook / Zalo Preview
                  </p>
                  <div style={{ maxWidth: 460, border: '1px solid #ddd', borderRadius: 4, overflow: 'hidden', fontFamily: 'Helvetica,sans-serif' }}>
                    <div style={{ background: '#F0F2F5', aspectRatio: '1.91/1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {(form.ogImage || form.thumbnail)
                        ? <img src={form.ogImage || form.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <ImageIcon size={28} style={{ color: '#BCC0C4', opacity: 0.4 }} />}
                    </div>
                    <div style={{ padding: '9px 11px', borderTop: '1px solid #E5E8ED', background: '#F0F2F5' }}>
                      <p style={{ margin: '0 0 2px', fontSize: 11, color: '#606770', textTransform: 'uppercase', letterSpacing: '0.02em' }}>WONMEDIA.VN</p>
                      <p style={{ margin: '0 0 3px', fontSize: 13, fontWeight: 700, color: '#1D2129', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {(form.seoTitle[lang] || form.title[lang]) || 'Tiêu đề bài viết'}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: '#606770', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {(form.seoDescription[lang] || form.excerpt[lang]) || 'Mô tả bài viết...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 16 }}>

          {/* Xuất bản */}
          <SidebarCard title="Xuất bản">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block' }}>Kích hoạt</Label>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>Hiển thị trên website</p>
              </div>
              <Switch checked={form.active} onCheckedChange={v => setField('active', v)} className="data-[state=checked]:bg-[#00A98F]" />
            </div>
            <div style={{ height: 1, background: '#F1F5F9' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block' }}>Hiện trang chủ</Label>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>Đưa vào section bài viết</p>
              </div>
              <Switch checked={form.showOnHomepage} onCheckedChange={v => setField('showOnHomepage', v)} className="data-[state=checked]:bg-[#00A98F]" />
            </div>
          </SidebarCard>

          {/* Thông tin */}
          <SidebarCard title="Thông tin">
            {/* Slug */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Slug (URL) <span style={{ color: '#ef4444' }}>*</span></label>
                {isNew && (
                  <button type="button" onClick={() => setSlugLocked(l => !l)}
                    style={{ fontSize: 10, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                    {slugLocked ? '↺ Tự động' : '🔒 Khoá'}
                  </button>
                )}
              </div>
              <Input value={form.slug} onChange={e => setField('slug', e.target.value)}
                placeholder="ten-bai-viet" className={IC + ' font-mono text-xs'} />
              {form.slug && (
                <p style={{ margin: '4px 0 0', fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>
                  /vi/{form.type === 'blog' ? 'tin-tuc' : 'tuyen-dung'}/{form.slug}
                </p>
              )}
            </div>

            {/* Loại bài */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Loại bài viết</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {(['blog', 'tuyen-dung'] as const).map(t => (
                  <button key={t} type="button" onClick={() => setField('type', t)}
                    style={{
                      padding: '8px 6px', borderRadius: 8, border: '2px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.12s',
                      background: form.type === t ? 'var(--color-indigo-pale,#EEF0FE)' : '#fff',
                      borderColor: form.type === t ? 'var(--color-indigo,#6366F1)' : '#E5E8ED',
                      color: form.type === t ? 'var(--color-indigo,#6366F1)' : '#64748b',
                    }}>
                    {t === 'blog' ? '📝 Blog' : '💼 Tuyển dụng'}
                  </button>
                ))}
              </div>
            </div>

            {/* Ngày */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Ngày đăng</label>
              <Input value={form.date} onChange={e => setField('date', e.target.value)}
                placeholder="DD/MM/YYYY" className={IC} />
            </div>
          </SidebarCard>

          {/* Thumbnail */}
          <SidebarCard title="Thumbnail">
            <ImageUpload value={form.thumbnail} onChange={v => setField('thumbnail', v)} />
            {form.thumbnail && (
              <>
                <div style={{ height: 1, background: '#F1F5F9' }} />
                <div>
                  <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep,#062340)' }}>
                    Focal Point
                  </p>
                  <FocalPointPicker
                    thumbnail={form.thumbnail}
                    value={form.thumbnailPosition}
                    onChange={v => setField('thumbnailPosition', v)}
                  />
                </div>
              </>
            )}
          </SidebarCard>

          {/* Thông tin tuyển dụng */}
          {form.type === 'tuyen-dung' && (
            <SidebarCard title="Tuyển dụng">
              {/* Tuyển gấp */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block' }}>
                    🔥 Tuyển gấp
                  </Label>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>Hiển thị badge "Gấp" trên bài</p>
                </div>
                <Switch checked={form.urgent} onCheckedChange={v => setField('urgent', v)} className="data-[state=checked]:bg-[#ef4444]" />
              </div>

              <div style={{ height: 1, background: '#F1F5F9' }} />

              {/* Hạn nộp hồ sơ */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                  📅 Hạn nộp hồ sơ
                </label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={e => setField('deadline', e.target.value)}
                  className={IC}
                />
                {form.deadline && (
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: new Date(form.deadline) < new Date() ? '#ef4444' : '#00A98F', fontWeight: 600 }}>
                    {new Date(form.deadline) < new Date() ? '⚠ Đã hết hạn' : `✓ Còn hạn đến ${new Date(form.deadline).toLocaleDateString('vi-VN')}`}
                  </p>
                )}
              </div>

              {/* Hình thức */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  💼 Hình thức làm việc
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {[
                    { v: 'full-time',  label: 'Full-time' },
                    { v: 'part-time',  label: 'Part-time' },
                    { v: 'remote',     label: 'Remote' },
                    { v: 'hybrid',     label: 'Hybrid' },
                    { v: 'internship', label: 'Thực tập' },
                    { v: 'freelance',  label: 'Freelance' },
                  ].map(opt => (
                    <button key={opt.v} type="button" onClick={() => setField('jobType', form.jobType === opt.v ? '' : opt.v)}
                      style={{
                        padding: '7px 6px', borderRadius: 7, border: '1.5px solid', cursor: 'pointer',
                        fontSize: 11, fontWeight: 600, transition: 'all 0.12s',
                        background: form.jobType === opt.v ? '#EEF0FE' : '#fff',
                        borderColor: form.jobType === opt.v ? '#6366F1' : '#E5E8ED',
                        color: form.jobType === opt.v ? '#6366F1' : '#64748b',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Địa điểm */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                  📍 Địa điểm
                </label>
                <Input
                  value={form.location}
                  onChange={e => setField('location', e.target.value)}
                  placeholder="Hà Nội / TP.HCM / Remote..."
                  className={IC}
                />
              </div>

              {/* Mức lương */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                  💰 Mức lương
                </label>
                <Input
                  value={form.salary}
                  onChange={e => setField('salary', e.target.value)}
                  placeholder="Thỏa thuận / 10–15 triệu..."
                  className={IC}
                />
              </div>
            </SidebarCard>
          )}

          {/* Trạng thái dịch */}
          <SidebarCard title="Trạng thái dịch">
            {ADMIN_LOCALES.map(l => {
              const done = !!(form.title[l] && form.content[l])
              const hasTitle = !!form.title[l]
              return (
                <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', borderRadius: 8, background: done ? '#F0FDF4' : '#F8F9FB', border: `1px solid ${done ? '#BBF7D0' : '#E5E8ED'}` }}>
                  <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{LOCALE_META[l].flag} {LOCALE_META[l].label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: done ? '#00A98F' : hasTitle ? '#f59e0b' : '#94a3b8' }}>
                    {done ? '✓ Đầy đủ' : hasTitle ? '~ Thiếu nội dung' : '— Chưa có'}
                  </span>
                </div>
              )
            })}
          </SidebarCard>

        </div>
      </div>
    </div>
  )
}

export default function PostEditorPage() {
  return <Suspense><PostEditorInner /></Suspense>
}
