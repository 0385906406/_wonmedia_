'use client'

import { useEffect, useRef, useState, useCallback, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  SaveIcon, ArrowLeftIcon, UploadIcon, Loader2Icon, SparklesIcon,
  CheckCircle2Icon, AlertCircleIcon, ImageIcon, GlobeIcon,
} from 'lucide-react'
import { LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'

// ─── Types ───────────────────────────────────────────────────────────────────
interface PostForm {
  slug: string; type: 'blog' | 'tuyen-dung'; thumbnail: string; date: string
  showOnHomepage: boolean; active: boolean
  category: MultiLang; title: MultiLang; excerpt: MultiLang; content: MultiLang
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function slugify(str: string) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').trim()
}

// ─── Shared input className ───────────────────────────────────────────────────
const IC = 'h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/10 text-sm'
const TA = 'rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/10 text-sm resize-none'

// ─── Sub: Toast ───────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-in slide-in-from-bottom-2 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {type === 'success' ? <CheckCircle2Icon size={16} /> : <AlertCircleIcon size={16} />}
      {msg}
    </div>
  )
}

// ─── Sub: LangTabs ───────────────────────────────────────────────────────────
function LangTabs({ active, onChange }: { active: LocaleKey; onChange: (l: LocaleKey) => void }) {
  return (
    <div className="flex gap-1 p-1 bg-[#F1F5F9] rounded-lg w-fit">
      {LOCALES.map(l => (
        <button key={l} onClick={() => onChange(l)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            active === l ? 'bg-white shadow text-[#0f172a]' : 'text-[#64748b] hover:text-[#0f172a]'
          }`}
        >
          {LOCALE_META[l].flag} {LOCALE_META[l].short}
        </button>
      ))}
    </div>
  )
}

// ─── Sub: Image Upload ────────────────────────────────────────────────────────
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const r = await fetch('/api/homepage/upload', { method: 'POST', body: fd })
      const d = await r.json()
      if (d.url) onChange(d.url)
    } finally { setUploading(false) }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group rounded-xl overflow-hidden bg-[#F1F5F9] aspect-video w-full max-w-xs">
          <img src={value} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button type="button" size="sm" variant="secondary" onClick={() => ref.current?.click()} disabled={uploading}>
              {uploading ? <Loader2Icon size={14} className="animate-spin" /> : <UploadIcon size={14} />}
              &nbsp;Thay ảnh
            </Button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          className="w-full max-w-xs aspect-video rounded-xl border-2 border-dashed border-[#E5E8ED] flex flex-col items-center justify-center gap-2 text-[#94a3b8] hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-colors"
        >
          {uploading ? <Loader2Icon size={24} className="animate-spin" /> : <ImageIcon size={24} strokeWidth={1.5} />}
          <span className="text-xs font-medium">{uploading ? 'Đang tải lên...' : 'Chọn thumbnail'}</span>
        </button>
      )}
      <div className="flex gap-2 items-center">
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder="Hoặc nhập URL ảnh..." className={IC + ' flex-1'} />
        <Button type="button" variant="outline" size="icon" className="h-10 w-10 border-[#E5E8ED]" onClick={() => ref.current?.click()} disabled={uploading}>
          <UploadIcon size={14} />
        </Button>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
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
  })
  const [lang, setLang]         = useState<LocaleKey>('vi')
  const [loading, setLoading]   = useState(!isNew)
  const [saving, setSaving]     = useState(false)
  const [translating, setTrans] = useState(false)
  const [slugLocked, setSlugLocked] = useState(!isNew)
  const [toast, setToast]       = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500)
  }, [])

  // Load existing post
  useEffect(() => {
    if (isNew) return
    fetch(`/api/posts/${id}`).then(r => r.json()).then(r => {
      if (r.data) setForm(r.data)
    }).finally(() => setLoading(false))
  }, [id, isNew])

  // Auto-slug from VI title when creating
  useEffect(() => {
    if (!isNew || slugLocked) return
    setForm(f => ({ ...f, slug: slugify(f.title.vi) }))
  }, [form.title.vi, isNew, slugLocked])

  function setField<K extends keyof PostForm>(key: K, value: PostForm[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }
  function setML(key: 'title' | 'excerpt' | 'content' | 'category', value: string) {
    setForm(f => ({ ...f, [key]: { ...f[key], [lang]: value } }))
  }

  // AI Translate
  async function translate() {
    if (!form.title.vi && !form.excerpt.vi && !form.content.vi) {
      showToast('Hãy nhập nội dung tiếng Việt trước khi dịch.', 'error'); return
    }
    setTrans(true)
    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: { title: form.title.vi, excerpt: form.excerpt.vi, content: form.content.vi },
          targetLocales: ['en', 'ko', 'ja', 'zh'],
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) { showToast(data.error ?? 'Lỗi dịch AI', 'error'); return }
      const t = data.translations as Record<string, { title: string; excerpt: string; content: string }>
      setForm(f => ({
        ...f,
        title:   { ...f.title,   ...(Object.fromEntries(Object.entries(t).map(([lc, v]) => [lc, v.title]))) },
        excerpt: { ...f.excerpt, ...(Object.fromEntries(Object.entries(t).map(([lc, v]) => [lc, v.excerpt]))) },
        content: { ...f.content, ...(Object.fromEntries(Object.entries(t).map(([lc, v]) => [lc, v.content]))) },
      }))
      showToast('Đã dịch sang EN · KO · JA · ZH ✓', 'success')
    } catch {
      showToast('Không kết nối được dịch vụ AI.', 'error')
    } finally { setTrans(false) }
  }

  // Save
  async function save() {
    if (!form.slug) { showToast('Slug không được để trống.', 'error'); return }
    if (!form.title.vi) { showToast('Tiêu đề tiếng Việt không được để trống.', 'error'); return }
    setSaving(true)
    try {
      const url    = isNew ? '/api/posts' : `/api/posts/${id}`
      const method = isNew ? 'POST'       : 'PUT'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data   = await res.json()
      if (!res.ok) { showToast(data.error ?? 'Lỗi lưu bài viết', 'error'); return }
      showToast(isNew ? 'Đã tạo bài viết!' : 'Đã lưu thay đổi!', 'success')
      if (isNew) setTimeout(() => router.push(`/admin/posts/${data.data._id}`), 800)
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-[#64748b]">
        <Loader2Icon size={20} className="animate-spin" />Đang tải bài viết...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-12xl">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg border border-[#E5E8ED]" onClick={() => router.push('/admin/posts')}>
            <ArrowLeftIcon size={16} />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0f172a]">
              {isNew ? 'Tạo bài viết mới' : 'Chỉnh sửa bài viết'}
            </h1>
            {!isNew && <p className="text-xs text-[#94a3b8] font-mono mt-0.5">/{form.slug}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline" onClick={translate} disabled={translating || saving}
            className="gap-2 border-[#E5E8ED] text-[#6366F1] hover:bg-indigo-50 hover:border-indigo-300"
          >
            {translating ? <Loader2Icon size={14} className="animate-spin" /> : <SparklesIcon size={14} />}
            {translating ? 'Đang dịch...' : 'AI Dịch đa ngôn ngữ'}
          </Button>
          <Button onClick={save} disabled={saving || translating} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
            {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}
            {saving ? 'Đang lưu...' : isNew ? 'Tạo bài viết' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* LEFT: Content */}
        <div className="space-y-5">

          {/* AI translate info */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
            <GlobeIcon size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 leading-relaxed">
              Nhập nội dung <strong>tiếng Việt</strong>, sau đó nhấn <strong>AI Dịch đa ngôn ngữ</strong> để tự động dịch sang EN · KO · JA · ZH. Cần cấu hình <strong>Gemini API Key</strong> trong Cài đặt.
            </p>
          </div>

          {/* Lang tabs */}
          <div className="flex items-center gap-3 flex-wrap">
            <LangTabs active={lang} onChange={setLang} />
            {lang !== 'vi' && (
              <Badge variant="outline" className="text-xs border-indigo-200 text-indigo-600 bg-indigo-50 gap-1">
                <SparklesIcon size={9} />AI dịch
              </Badge>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#374151]">
              Danh mục <span className="font-mono text-xs text-[#94a3b8]">({LOCALE_META[lang].flag} {LOCALE_META[lang].short})</span>
            </Label>
            <Input
              value={form.category[lang] ?? ''}
              onChange={e => setML('category', e.target.value)}
              placeholder={`VD: Sự kiện, Âm nhạc, Tuyển dụng... (${LOCALE_META[lang].short})`}
              className={IC}
            />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#374151]">
              Tiêu đề <span className="font-mono text-xs text-[#94a3b8]">({LOCALE_META[lang].flag} {LOCALE_META[lang].short})</span>
              {lang === 'vi' && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              value={form.title[lang] ?? ''}
              onChange={e => setML('title', e.target.value)}
              placeholder={`Tiêu đề bài viết (${LOCALE_META[lang].short})...`}
              className={IC + ' text-base font-medium'}
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-[#374151]">
              Tóm tắt <span className="font-mono text-xs text-[#94a3b8]">({LOCALE_META[lang].flag} {LOCALE_META[lang].short})</span>
            </Label>
            <Textarea
              value={form.excerpt[lang] ?? ''}
              onChange={e => setML('excerpt', e.target.value)}
              placeholder={`Mô tả ngắn hiển thị trong danh sách (${LOCALE_META[lang].short})...`}
              rows={3} className={TA + ' min-h-[88px]'}
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-[#374151]">
                Nội dung (HTML) <span className="font-mono text-xs text-[#94a3b8]">({LOCALE_META[lang].flag} {LOCALE_META[lang].short})</span>
              </Label>
              {form.content[lang] && (
                <span className="text-xs text-[#94a3b8]">{form.content[lang].length} ký tự</span>
              )}
            </div>
            <Textarea
              value={form.content[lang] ?? ''}
              onChange={e => setML('content', e.target.value)}
              placeholder={`<p>Nội dung HTML... (${LOCALE_META[lang].short})</p>`}
              rows={16} className={TA + ' min-h-[360px] font-mono text-xs leading-relaxed'}
            />
          </div>
        </div>

        {/* RIGHT: Meta */}
        <div className="space-y-5">

          {/* Publish status */}
          <div className="rounded-xl bg-white border border-[#E5E8ED] p-4 space-y-4">
            <h3 className="text-sm font-semibold text-[#374151]">Xuất bản</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#64748b]">Kích hoạt</Label>
                <Switch checked={form.active} onCheckedChange={v => setField('active', v)} className="data-[state=checked]:bg-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#64748b]">Hiện trang chủ</Label>
                <Switch checked={form.showOnHomepage} onCheckedChange={v => setField('showOnHomepage', v)} className="data-[state=checked]:bg-green-600" />
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="rounded-xl bg-white border border-[#E5E8ED] p-4 space-y-4">
            <h3 className="text-sm font-semibold text-[#374151]">Thông tin</h3>

            {/* Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-[#64748b]">Slug (URL) <span className="text-red-500">*</span></Label>
                {isNew && (
                  <button
                    type="button"
                    onClick={() => setSlugLocked(l => !l)}
                    className="text-xs text-indigo-500 hover:underline"
                  >
                    {slugLocked ? 'Tự động' : 'Khoá'}
                  </button>
                )}
              </div>
              <Input
                value={form.slug}
                onChange={e => setField('slug', e.target.value)}
                placeholder="ten-bai-viet-viet-thuong"
                className={IC + ' font-mono text-xs'}
              />
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <Label className="text-sm text-[#64748b]">Loại bài</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['blog', 'tuyen-dung'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setField('type', t)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      form.type === t
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-[#64748b] border-[#E5E8ED] hover:border-green-300'
                    }`}
                  >
                    {t === 'blog' ? '📝 Blog' : '💼 Tuyển dụng'}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label className="text-sm text-[#64748b]">Ngày đăng</Label>
              <Input
                value={form.date}
                onChange={e => setField('date', e.target.value)}
                placeholder="DD/MM/YYYY"
                className={IC}
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="rounded-xl bg-white border border-[#E5E8ED] p-4 space-y-3">
            <h3 className="text-sm font-semibold text-[#374151]">Thumbnail</h3>
            <ImageUpload value={form.thumbnail} onChange={v => setField('thumbnail', v)} />
          </div>

          {/* Translation status */}
          <div className="rounded-xl bg-white border border-[#E5E8ED] p-4 space-y-3">
            <h3 className="text-sm font-semibold text-[#374151]">Trạng thái dịch</h3>
            <div className="space-y-2">
              {LOCALES.map(l => {
                const done = !!(form.title[l] || form.content[l])
                return (
                  <div key={l} className="flex items-center justify-between text-xs">
                    <span className="text-[#64748b]">{LOCALE_META[l].flag} {LOCALE_META[l].label}</span>
                    <span className={`font-medium ${done ? 'text-green-600' : 'text-[#94a3b8]'}`}>
                      {done ? '✓ Có nội dung' : '— Chưa có'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PostEditorPage() {
  return <Suspense><PostEditorInner /></Suspense>
}
