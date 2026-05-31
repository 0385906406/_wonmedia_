'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import {
  LayoutIcon, BriefcaseIcon, TrophyIcon, UsersIcon, FileTextIcon,
  PlusIcon, PencilIcon, Trash2Icon, SaveIcon, UploadIcon, GlobeIcon,
  CheckCircle2Icon, AlertCircleIcon, Loader2Icon, ImageIcon,
  ZapIcon, ListIcon, CheckSquareIcon, SquareIcon, ExternalLinkIcon,
} from 'lucide-react'
import { LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'

// ─── Types ────────────────────────────────────────────────────────────────────
interface HeroData { _id?: string; title: MultiLang; title2: MultiLang; subtitle: MultiLang }
interface ServiceItem { _id: string; order: number; iconKey: string; title: MultiLang; desc: MultiLang; active: boolean }
interface AchievementItem { _id: string; order: number; value: number; label: MultiLang; active: boolean }
interface PartnerItem { _id: string; order: number; name: string; logo: string; active: boolean }
interface PostItem {
  _id: string; slug: string; type: 'blog' | 'tuyen-dung'; thumbnail: string; date: string
  showOnHomepage: boolean; category: MultiLang; title: MultiLang; excerpt: MultiLang; content: MultiLang; active: boolean
}

// ─── Sub-component: Language Tabs ─────────────────────────────────────────────
function LangTabs({ activeLang, onChange }: { activeLang: LocaleKey; onChange: (l: LocaleKey) => void }) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            activeLang === l ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {LOCALE_META[l].flag} {LOCALE_META[l].short}
        </button>
      ))}
    </div>
  )
}

// ─── Sub-component: Toast ────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`}>
      {type === 'success' ? <CheckCircle2Icon size={16} /> : <AlertCircleIcon size={16} />}
      {msg}
    </div>
  )
}

// ─── Sub-component: MultiLang Field ─────────────────────────────────────────
function MLField({
  label, value, onChange, multiline = false, lang,
}: {
  label: string
  value: MultiLang
  onChange: (v: MultiLang) => void
  multiline?: boolean
  lang: LocaleKey
}) {
  const handleChange = (v: string) => onChange({ ...value, [lang]: v })
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label} <span className="text-xs font-mono text-primary">({LOCALE_META[lang].flag} {LOCALE_META[lang].label})</span></Label>
      {multiline ? (
        <Textarea
          value={value[lang] ?? ''}
          onChange={(e) => handleChange(e.target.value)}
          rows={3}
          className="text-sm resize-none min-h-[92px] rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-[#6366F1] focus-visible:ring-2 focus-visible:ring-[#6366F1]/10"
          placeholder={`${label} (${LOCALE_META[lang].short})...`}
        />
      ) : (
        <Input
          value={value[lang] ?? ''}
          onChange={(e) => handleChange(e.target.value)}
          className="text-sm h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-[#6366F1] focus-visible:ring-2 focus-visible:ring-[#6366F1]/10"
          placeholder={`${label} (${LOCALE_META[lang].short})...`}
        />
      )}
    </div>
  )
}

// ─── Sub-component: Image Upload ─────────────────────────────────────────────
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
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-2 items-center">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL ảnh..." className="text-sm flex-1" />
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2Icon size={14} className="animate-spin" /> : <UploadIcon size={14} />}
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {value && (
        <div className="w-16 h-12 rounded border overflow-hidden bg-muted flex items-center justify-center">
          <img src={value} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
      )}
    </div>
  )
}

// ─── HERO EDITOR ─────────────────────────────────────────────────────────────
function HeroEditor({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
  const [data, setData] = useState<HeroData>({ title: emptyMultiLang(), title2: emptyMultiLang(), subtitle: emptyMultiLang() })
  const [lang, setLang] = useState<LocaleKey>('vi')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/homepage/hero').then(r => r.json()).then(r => { if (r.data) setData(r.data) }).finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    try {
      const res = await fetch('/api/homepage/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: data.title, title2: data.title2, subtitle: data.subtitle }) })
      if (res.ok) showToast('Đã lưu banner!', 'success')
      else showToast('Lỗi lưu banner', 'error')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center gap-2 text-muted-foreground p-8"><Loader2Icon size={16} className="animate-spin" />Đang tải...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Banner trang chủ</h3>
          <p className="text-sm text-muted-foreground">Chỉnh sửa nội dung hiển thị trên banner chính</p>
        </div>
        <Button onClick={save} disabled={saving} size="sm" className="gap-2">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}
          Lưu thay đổi
        </Button>
      </div>

      {/* Preview */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#1a2030] to-[#2f3441] p-8 text-center space-y-2">
        <p className="text-white font-black text-3xl tracking-tighter">{data.title[lang] || 'BRINGING MUSIC'}</p>
        <p className="font-black text-3xl tracking-tighter" style={{ background: 'linear-gradient(90deg,#ff6900,#ffaa44)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {data.title2[lang] || 'TO THE WORLD'}
        </p>
        <p className="text-white/70 text-sm max-w-md mx-auto">{data.subtitle[lang] || 'Subtitle...'}</p>
      </div>

      <LangTabs activeLang={lang} onChange={setLang} />

      <div className="grid gap-4">
        <MLField label="Tiêu đề dòng 1 (màu trắng)" value={data.title} onChange={(v) => setData(d => ({ ...d, title: v }))} lang={lang} />
        <MLField label="Tiêu đề dòng 2 (màu cam)" value={data.title2} onChange={(v) => setData(d => ({ ...d, title2: v }))} lang={lang} />
        <MLField label="Phụ đề" value={data.subtitle} onChange={(v) => setData(d => ({ ...d, subtitle: v }))} multiline lang={lang} />
      </div>
    </div>
  )
}

// ─── SERVICES EDITOR ─────────────────────────────────────────────────────────
function ServicesEditor({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
  const [items, setItems] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState<ServiceItem | null>(null)
  const [lang, setLang] = useState<LocaleKey>('vi')
  const [saving, setSaving] = useState(false)

  const ICON_KEYS = ['play', 'music', 'youtube', 'shield', 'star', 'globe']

  useEffect(() => { fetchItems() }, [])
  function fetchItems() {
    setLoading(true)
    fetch('/api/homepage/services').then(r => r.json()).then(r => { if (r.data) setItems(r.data) }).finally(() => setLoading(false))
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
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editItem) })
      if (res.ok) { showToast(isNew ? 'Đã thêm dịch vụ!' : 'Đã cập nhật!', 'success'); fetchItems(); setEditItem(null) }
      else showToast('Lỗi lưu dữ liệu', 'error')
    } finally { setSaving(false) }
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/homepage/services/${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Đã xóa!', 'success'); fetchItems() }
  }

  async function toggleActive(item: ServiceItem) {
    await fetch(`/api/homepage/services/${item._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !item.active }) })
    fetchItems()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Dịch vụ của chúng tôi</h3>
          <p className="text-sm text-muted-foreground">Quản lý các dịch vụ hiển thị trên trang chủ</p>
        </div>
        <Button onClick={openNew} size="sm" className="gap-2"><PlusIcon size={14} />Thêm dịch vụ</Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground p-4"><Loader2Icon size={16} className="animate-spin" />Đang tải...</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-mono text-primary">{item.order + 1}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.title.vi || '(Chưa có tiêu đề VI)'}</p>
                <p className="text-xs text-muted-foreground truncate">{item.title.en || '(Chưa có tiêu đề EN)'}</p>
              </div>
              <Badge variant={item.active ? 'default' : 'secondary'} className="text-xs">{item.active ? 'Hiện' : 'Ẩn'}</Badge>
              <Switch checked={item.active} onCheckedChange={() => toggleActive(item)} />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditItem(item); setLang('vi') }}>
                <PencilIcon size={14} />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2Icon size={14} /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Xóa dịch vụ?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteItem(item._id)}>Xóa</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Chưa có dịch vụ nào. Thêm dịch vụ đầu tiên!</p>}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-[#E5E8ED]">
          <DialogHeader><DialogTitle>{editItem?._id ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Icon</Label>
                  <select value={editItem.iconKey} onChange={(e) => setEditItem(i => i ? { ...i, iconKey: e.target.value } : i)}
                    className="w-full h-10 rounded-lg border border-[#E5E8ED] bg-white px-3 text-sm text-[#1A1F2E] focus-visible:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-colors">
                    {ICON_KEYS.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Thứ tự</Label>
                  <Input type="number" value={editItem.order} onChange={(e) => setEditItem(i => i ? { ...i, order: +e.target.value } : i)} className="text-sm h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-[#6366F1] focus-visible:ring-2 focus-visible:ring-[#6366F1]/10" />
                </div>
              </div>
              <LangTabs activeLang={lang} onChange={setLang} />
              <MLField label="Tên dịch vụ" value={editItem.title} onChange={(v) => setEditItem(i => i ? { ...i, title: v } : i)} lang={lang} />
              <MLField label="Mô tả" value={editItem.desc} onChange={(v) => setEditItem(i => i ? { ...i, desc: v } : i)} multiline lang={lang} />
              <div className="flex items-center gap-2">
                <Switch checked={editItem.active} onCheckedChange={(v) => setEditItem(i => i ? { ...i, active: v } : i)} />
                <Label className="text-sm h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-[#6366F1] focus-visible:ring-2 focus-visible:ring-[#6366F1]/10">Hiển thị</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Hủy</Button>
            <Button onClick={saveItem} disabled={saving} className="gap-2">
              {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── ACHIEVEMENTS EDITOR ─────────────────────────────────────────────────────
function AchievementsEditor({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
  const [items, setItems] = useState<AchievementItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState<AchievementItem | null>(null)
  const [lang, setLang] = useState<LocaleKey>('vi')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchItems() }, [])
  function fetchItems() {
    setLoading(true)
    fetch('/api/homepage/achievements').then(r => r.json()).then(r => { if (r.data) setItems(r.data) }).finally(() => setLoading(false))
  }

  async function saveItem() {
    if (!editItem) return
    setSaving(true)
    try {
      const isNew = !editItem._id
      const url = isNew ? '/api/homepage/achievements' : `/api/homepage/achievements/${editItem._id}`
      const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editItem) })
      if (res.ok) { showToast('Đã lưu!', 'success'); fetchItems(); setEditItem(null) }
      else showToast('Lỗi lưu dữ liệu', 'error')
    } finally { setSaving(false) }
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/homepage/achievements/${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Đã xóa!', 'success'); fetchItems() }
  }

  const TONES = ['wm-stat-orange', 'wm-stat-teal', 'wm-stat-indigo', 'wm-stat-navy']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Thành tựu</h3>
          <p className="text-sm text-muted-foreground">Quản lý các chỉ số thành tựu</p>
        </div>
        <Button onClick={() => setEditItem({ _id: '', order: items.length, value: 0, label: emptyMultiLang(), active: true })} size="sm" className="gap-2">
          <PlusIcon size={14} />Thêm
        </Button>
      </div>

      {loading ? <div className="flex items-center gap-2 text-muted-foreground p-4"><Loader2Icon size={16} className="animate-spin" />Đang tải...</div>
        : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map((item, i) => (
              <div key={item._id} className="relative border rounded-xl p-4 bg-card text-center space-y-2 group">
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${['bg-orange-500','bg-teal-500','bg-indigo-500','bg-blue-800'][i % 4]}`} />
                <p className="text-3xl font-bold font-mono text-foreground">{item.value}<span className="text-primary text-lg">+</span></p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{item.label.vi}</p>
                <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditItem(item); setLang('vi') }}><PencilIcon size={12} /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive"><Trash2Icon size={12} /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Xóa thành tựu?</AlertDialogTitle></AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteItem(item._id)}>Xóa</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border-[#E5E8ED]">
          <DialogHeader><DialogTitle>{editItem?._id ? 'Chỉnh sửa thành tựu' : 'Thêm thành tựu mới'}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Số liệu</Label>
                  <Input type="number" value={editItem.value} onChange={(e) => setEditItem(i => i ? { ...i, value: +e.target.value } : i)} className="text-sm h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-[#6366F1] focus-visible:ring-2 focus-visible:ring-[#6366F1]/10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Thứ tự</Label>
                  <Input type="number" value={editItem.order} onChange={(e) => setEditItem(i => i ? { ...i, order: +e.target.value } : i)} className="text-sm h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-[#6366F1] focus-visible:ring-2 focus-visible:ring-[#6366F1]/10" />
                </div>
              </div>
              <LangTabs activeLang={lang} onChange={setLang} />
              <MLField label="Nhãn" value={editItem.label} onChange={(v) => setEditItem(i => i ? { ...i, label: v } : i)} lang={lang} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Hủy</Button>
            <Button onClick={saveItem} disabled={saving} className="gap-2">
              {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── PARTNERS EDITOR ─────────────────────────────────────────────────────────
function PartnersEditor({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
  const [items, setItems] = useState<PartnerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState<PartnerItem | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchItems() }, [])
  function fetchItems() {
    setLoading(true)
    fetch('/api/homepage/partners').then(r => r.json()).then(r => { if (r.data) setItems(r.data) }).finally(() => setLoading(false))
  }

  async function saveItem() {
    if (!editItem) return
    setSaving(true)
    try {
      const isNew = !editItem._id
      const url = isNew ? '/api/homepage/partners' : `/api/homepage/partners/${editItem._id}`
      const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editItem) })
      if (res.ok) { showToast('Đã lưu!', 'success'); fetchItems(); setEditItem(null) }
      else showToast('Lỗi lưu dữ liệu', 'error')
    } finally { setSaving(false) }
  }

  async function deleteItem(id: string) {
    const res = await fetch(`/api/homepage/partners/${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Đã xóa!', 'success'); fetchItems() }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Đối tác của chúng tôi</h3>
          <p className="text-sm text-muted-foreground">Quản lý logo đối tác hiển thị trên trang chủ</p>
        </div>
        <Button onClick={() => setEditItem({ _id: '', order: items.length, name: '', logo: '', active: true })} size="sm" className="gap-2">
          <PlusIcon size={14} />Thêm đối tác
        </Button>
      </div>

      {loading ? <div className="flex items-center gap-2 text-muted-foreground p-4"><Loader2Icon size={16} className="animate-spin" />Đang tải...</div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {items.map((item) => (
            <div key={item._id} className="relative border rounded-xl p-3 bg-card flex flex-col items-center gap-2 group hover:shadow-md transition-shadow">
              {!item.active && <div className="absolute inset-0 bg-background/60 rounded-xl flex items-center justify-center"><Badge variant="secondary" className="text-xs">Ẩn</Badge></div>}
              <div className="w-16 h-10 flex items-center justify-center">
                {item.logo ? <img src={item.logo} alt={item.name} className="w-full h-full object-contain" /> : <ImageIcon size={24} className="text-muted-foreground" />}
              </div>
              <p className="text-xs text-center text-muted-foreground font-medium truncate w-full">{item.name || 'Chưa đặt tên'}</p>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditItem(item)}><PencilIcon size={12} /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive"><Trash2Icon size={12} /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Xóa đối tác "{item.name}"?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteItem(item._id)}>Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="sm:max-w-xl rounded-2xl shadow-2xl border-[#E5E8ED]">
          <DialogHeader><DialogTitle>{editItem?._id ? 'Chỉnh sửa đối tác' : 'Thêm đối tác mới'}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Tên đối tác</Label>
                <Input value={editItem.name} onChange={(e) => setEditItem(i => i ? { ...i, name: e.target.value } : i)} placeholder="YouTube, Facebook..." className="text-sm h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-[#6366F1] focus-visible:ring-2 focus-visible:ring-[#6366F1]/10" />
              </div>
              <ImageUpload value={editItem.logo} onChange={(url) => setEditItem(i => i ? { ...i, logo: url } : i)} label="Logo" />
              <div className="space-y-1.5">
                <Label className="text-xs">Thứ tự</Label>
                <Input type="number" value={editItem.order} onChange={(e) => setEditItem(i => i ? { ...i, order: +e.target.value } : i)} className="text-sm h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-[#6366F1] focus-visible:ring-2 focus-visible:ring-[#6366F1]/10" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editItem.active} onCheckedChange={(v) => setEditItem(i => i ? { ...i, active: v } : i)} />
                <Label className="text-sm h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-[#6366F1] focus-visible:ring-2 focus-visible:ring-[#6366F1]/10">Hiển thị</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Hủy</Button>
            <Button onClick={saveItem} disabled={saving} className="gap-2">
              {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── POSTS EDITOR ─────────────────────────────────────────────────────────────
function PostsEditor({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
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
      if (res.ok) showToast('Đã lưu cấu hình bài viết!', 'success')
      else showToast(data?.error ?? `Lỗi lưu cấu hình (${res.status})`, 'error')
    } catch (err) {
      showToast('Không kết nối được server: ' + String(err), 'error')
    } finally { setSaving(false) }
  }

  // Auto = N bài mới nhất đang active; Manual = các bài đã chọn
  const displayedItems = mode === 'auto'
    ? items.filter(i => i.active).slice(0, limit)
    : items.filter(i => selectedIds.has(i._id))

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-semibold text-[#0f172a]">Bài viết trang chủ</h3>
          <p className="text-sm text-[#64748b] mt-0.5">Chọn cách hiển thị bài viết trên trang chủ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 border-[#E5E8ED] text-[#64748b] hover:text-green-700" asChild>
            <a href="/admin/posts" target="_blank" rel="noreferrer">
              <ExternalLinkIcon size={13} />Quản lý bài viết
            </a>
          </Button>
          <Button onClick={saveConfig} disabled={saving || cfgLoading} size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white">
            {saving ? <Loader2Icon size={13} className="animate-spin" /> : <SaveIcon size={13} />}
            Lưu cấu hình
          </Button>
        </div>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-3">
        {/* Auto */}
        <button
          onClick={() => setMode('auto')}
          className={`relative flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all ${
            mode === 'auto'
              ? 'border-green-500 bg-green-50 shadow-sm'
              : 'border-[#E5E8ED] bg-white hover:border-green-300 hover:bg-green-50/40'
          }`}
        >
          {mode === 'auto' && (
            <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
              <CheckCircle2Icon size={12} />
            </span>
          )}
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${mode === 'auto' ? 'bg-green-500 text-white' : 'bg-[#F1F5F9] text-[#64748b]'}`}>
            <ZapIcon size={18} />
          </div>
          <div>
            <p className={`text-sm font-semibold ${mode === 'auto' ? 'text-green-700' : 'text-[#0f172a]'}`}>Tự động</p>
            <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">Tự động lấy <strong>N bài mới nhất</strong> đang kích hoạt để hiển thị</p>
          </div>
        </button>

        {/* Manual */}
        <button
          onClick={() => setMode('manual')}
          className={`relative flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all ${
            mode === 'manual'
              ? 'border-green-500 bg-green-50 shadow-sm'
              : 'border-[#E5E8ED] bg-white hover:border-green-300 hover:bg-green-50/40'
          }`}
        >
          {mode === 'manual' && (
            <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
              <CheckCircle2Icon size={12} />
            </span>
          )}
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${mode === 'manual' ? 'bg-green-500 text-white' : 'bg-[#F1F5F9] text-[#64748b]'}`}>
            <ListIcon size={18} />
          </div>
          <div>
            <p className={`text-sm font-semibold ${mode === 'manual' ? 'text-green-700' : 'text-[#0f172a]'}`}>Chọn danh sách</p>
            <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">Tự tay chọn từng bài viết muốn hiển thị trên trang chủ</p>
          </div>
        </button>
      </div>

      {/* Limit input — only in auto mode */}
      {mode === 'auto' && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#E5E8ED]">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#374151]">Số bài hiển thị tối đa</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">Hiển thị tối đa bao nhiêu bài trên trang chủ (1–20)</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLimit(l => Math.max(1, l - 1))}
              className="h-9 w-9 rounded-lg border border-[#E5E8ED] bg-white text-[#374151] font-bold text-lg hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center"
            >−</button>
            <input
              type="number" min={1} max={20}
              value={limit}
              onChange={e => setLimit(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              className="w-16 h-9 text-center rounded-lg border border-[#E5E8ED] bg-white text-[#0f172a] font-bold text-base focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
            />
            <button
              onClick={() => setLimit(l => Math.min(20, l + 1))}
              className="h-9 w-9 rounded-lg border border-[#E5E8ED] bg-white text-[#374151] font-bold text-lg hover:border-green-400 hover:text-green-600 transition-colors flex items-center justify-center"
            >+</button>
          </div>
        </div>
      )}

      {/* Post list */}
      {loading ? (
        <div className="flex items-center gap-2 text-[#94a3b8] py-6">
          <Loader2Icon size={16} className="animate-spin" />Đang tải danh sách bài viết...
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-[#64748b]">
              {mode === 'auto'
                ? `Sẽ hiển thị ${displayedItems.length} bài mới nhất (active) đầu tiên`
                : `Đã chọn ${selectedIds.size} / ${items.length} bài`}
            </p>
            {mode === 'manual' && items.length > 0 && (
              <button
                onClick={() => setSelectedIds(selectedIds.size === items.length ? new Set() : new Set(items.map(i => i._id)))}
                className="text-xs text-green-600 hover:underline"
              >
                {selectedIds.size === items.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E5E8ED] py-10 text-center">
              <FileTextIcon size={28} className="text-[#94a3b8] mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-sm text-[#94a3b8]">Chưa có bài viết nào</p>
              <a href="/admin/posts" className="text-xs text-green-600 hover:underline mt-1 inline-block">
                → Tạo bài viết mới
              </a>
            </div>
          ) : (
            <div className="rounded-xl border border-[#E5E8ED] overflow-hidden divide-y divide-[#F1F5F9]">
              {items.map(item => {
                const isSelected = selectedIds.has(item._id)
                const isAutoShown = item.showOnHomepage && item.active

                return (
                  <div
                    key={item._id}
                    onClick={() => mode === 'manual' && toggleSelect(item._id)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      mode === 'manual' ? 'cursor-pointer' : ''
                    } ${
                      mode === 'manual' && isSelected
                        ? 'bg-green-50'
                        : 'bg-white hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {/* Checkbox / status */}
                    <div className="flex-shrink-0">
                      {mode === 'manual' ? (
                        isSelected
                          ? <CheckSquareIcon size={18} className="text-green-500" />
                          : <SquareIcon size={18} className="text-[#CBD5E1]" />
                      ) : (
                        <div className={`h-2 w-2 rounded-full flex-shrink-0 ${isAutoShown ? 'bg-green-500' : 'bg-[#E2E8F0]'}`} />
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="w-11 h-9 rounded-lg overflow-hidden bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center">
                      {item.thumbnail
                        ? <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                        : <ImageIcon size={14} className="text-[#94a3b8]" />}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0f172a] truncate">
                        {item.title?.vi || '(Chưa có tiêu đề)'}
                      </p>
                      <p className="text-xs text-[#94a3b8] font-mono truncate">{item.slug} · {item.date}</p>
                    </div>

                    {/* Badge */}
                    <Badge
                      variant="outline"
                      className={`text-xs flex-shrink-0 ${item.type === 'blog' ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-orange-200 text-orange-600 bg-orange-50'}`}
                    >
                      {item.type === 'blog' ? 'Blog' : 'Tuyển dụng'}
                    </Badge>

                    {mode === 'auto' && (
                      <span className={`text-xs font-medium flex-shrink-0 ${isAutoShown ? 'text-green-600' : 'text-[#94a3b8]'}`}>
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

      {/* Preview count */}
      {!loading && displayedItems.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#F0FDF4] border border-green-100 text-sm text-green-700">
          <CheckCircle2Icon size={15} />
          <span>Trang chủ sẽ hiển thị <strong>{displayedItems.length}</strong> bài viết</span>
        </div>
      )}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function HomepageAdminInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = searchParams.get('tab') ?? 'hero'

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const TAB_ITEMS = [
    { value: 'hero',         label: 'Banner',    icon: LayoutIcon },
    { value: 'services',     label: 'Dịch vụ',   icon: BriefcaseIcon },
    { value: 'achievements', label: 'Thành tựu', icon: TrophyIcon },
    { value: 'partners',     label: 'Đối tác',   icon: UsersIcon },
    { value: 'posts',        label: 'Bài viết',  icon: FileTextIcon },
  ]

  return (
    <div className="p-6 max-w-12xl space-y-6">
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
          <GlobeIcon size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0f172a]">Nội dung trang chủ</h1>
          <p className="text-xs text-[#64748b] mt-0.5">Đa ngôn ngữ · VI / EN / KO / JA / ZH</p>
        </div>
      </div>

      {/* Tab card */}
      <div className="rounded-2xl bg-white border border-[#e5e8ed] shadow-sm overflow-hidden">

        {/* Tab bar — pure div, guaranteed full width */}
        <div className="flex w-full border-b border-[#e5e8ed]">
          {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => router.push(`/admin/homepage?tab=${value}`)}
              className={[
                'flex-1 relative flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors duration-150',
                'hover:text-green-700 hover:bg-green-50/60',
                tab === value
                  ? 'text-green-700 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-green-500 after:rounded-t-full'
                  : 'text-[#64748b]',
              ].join(' ')}
            >
              <Icon size={15} />{label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {tab === 'hero'         && <HeroEditor         showToast={showToast} />}
          {tab === 'services'     && <ServicesEditor     showToast={showToast} />}
          {tab === 'achievements' && <AchievementsEditor showToast={showToast} />}
          {tab === 'partners'     && <PartnersEditor     showToast={showToast} />}
          {tab === 'posts'        && <PostsEditor        showToast={showToast} />}
        </div>
      </div>
    </div>
  )
}

export default function HomepageAdminPage() {
  return (
    <Suspense>
      <HomepageAdminInner />
    </Suspense>
  )
}
