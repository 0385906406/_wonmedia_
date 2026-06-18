'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useToast } from '@/components/admin/toast-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from '@/components/ui/dialog'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    PlusIcon, Trash2Icon, CheckIcon, XIcon, DatabaseIcon, AlertCircleIcon,
    LockIcon, StarIcon, MoreVerticalIcon, PencilIcon, EyeIcon, EyeOffIcon,
    ShieldAlertIcon, UploadIcon, ImageIcon, LinkIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColField {
    key: string; label: string
    type: 'text' | 'number' | 'email' | 'url' | 'textarea' | 'boolean'; required: boolean
}
export interface Collection {
    _id: string; name: string; slug: string; description: string
    important: boolean; fields: ColField[]
}
export interface ColItem { _id: string; data: Record<string, string>; createdAt: string }

const FIELD_TYPES = [
    { value: 'text', label: 'Văn bản' }, { value: 'number', label: 'Số' },
    { value: 'email', label: 'Email' },  { value: 'url', label: 'URL' },
    { value: 'textarea', label: 'Đoạn văn' }, { value: 'boolean', label: 'Có/Không' },
]

function slugify(s: string) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ─── Password Modal ───────────────────────────────────────────────────────────

export function PasswordModal({
    open, onOpenChange, onSuccess, collectionName,
}: {
    open: boolean; onOpenChange: (v: boolean) => void
    onSuccess: () => void; collectionName: string
}) {
    const [pw, setPw] = useState('')
    const [show, setShow] = useState(false)
    const [error, setError] = useState('')
    const [checking, setChecking] = useState(false)

    async function verify() {
        if (!pw) { setError('Vui lòng nhập mật khẩu'); return }
        setChecking(true); setError('')
        try {
            const res  = await fetch('/api/auth/verify-password', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pw }),
            })
            const json = await res.json()
            if (json.success) { onSuccess(); onOpenChange(false); setPw('') }
            else setError('Mật khẩu không đúng. Vui lòng thử lại.')
        } catch { setError('Lỗi kết nối') }
        finally   { setChecking(false) }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) { setPw(''); setError('') } onOpenChange(v) }}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
                            <ShieldAlertIcon className="size-5 text-amber-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-base">Danh mục được bảo vệ</DialogTitle>
                            <p className="text-xs text-gray-400 mt-0.5">"{collectionName}"</p>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-3 py-1">
                    <p className="text-sm text-gray-600">Nhập mật khẩu admin để tiếp tục thao tác này.</p>
                    <div className="relative">
                        <Input
                            type={show ? 'text' : 'password'}
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            placeholder="Mật khẩu admin..."
                            className="pr-9"
                            autoFocus
                            onKeyDown={(e) => { if (e.key === 'Enter') verify() }}
                        />
                        <button type="button" onClick={() => setShow((s) => !s)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                        </button>
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            <AlertCircleIcon className="size-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={() => setPw('')}>Hủy</Button>
                    </DialogClose>
                    <Button onClick={verify} disabled={checking}
                        className="bg-amber-600 hover:bg-amber-700 text-white">
                        <LockIcon className="size-3.5" />
                        {checking ? 'Đang kiểm tra...' : 'Xác nhận'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Create Collection Dialog ─────────────────────────────────────────────────

export function CreateCollectionDialog({
    open, onOpenChange, onCreated,
}: {
    open: boolean; onOpenChange: (v: boolean) => void; onCreated: (col: Collection) => void
}) {
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [desc, setDesc] = useState('')
    const [fields, setFields] = useState<ColField[]>([{ key: 'name', label: 'Tên', type: 'text', required: true }])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    function handleNameChange(v: string) { setName(v); setSlug(slugify(v)) }
    function addField() { setFields((f) => [...f, { key: '', label: '', type: 'text', required: false }]) }
    function removeField(i: number) { setFields((f) => f.filter((_, j) => j !== i)) }
    function updateField(i: number, p: Partial<ColField>) { setFields((f) => f.map((fi, j) => j === i ? { ...fi, ...p } : fi)) }

    async function submit() {
        setError('')
        if (!name.trim()) { setError('Tên danh mục không được để trống'); return }
        if (!slug)        { setError('Slug không hợp lệ'); return }
        for (const f of fields) {
            if (!f.key.trim() || !f.label.trim()) { setError('Tên và nhãn các trường không được để trống'); return }
        }
        setSaving(true)
        try {
            const res  = await fetch('/api/collections', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, slug, description: desc, fields }),
            })
            const json = await res.json()
            if (json.success) {
                onCreated(json.data); onOpenChange(false)
                setName(''); setSlug(''); setDesc('')
                setFields([{ key: 'name', label: 'Tên', type: 'text', required: true }])
            } else setError(json.error ?? 'Tạo thất bại')
        } catch { setError('Lỗi kết nối') }
        finally   { setSaving(false) }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Tạo danh mục mới</DialogTitle></DialogHeader>
                <div className="space-y-5 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Tên danh mục <span className="text-red-500">*</span></label>
                            <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Ví dụ: Đối tác" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Slug <span className="text-red-500">*</span></label>
                            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="doi-tac" className="font-mono" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Mô tả</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Mô tả ngắn..." />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">Các trường dữ liệu</p>
                            <Button type="button" variant="outline" size="sm" onClick={addField}><PlusIcon className="size-3.5" />Thêm trường</Button>
                        </div>
                        <div className="grid grid-cols-[1fr_1fr_120px_40px_28px] gap-2 items-center px-1">
                            {['Key', 'Nhãn hiển thị', 'Kiểu', 'Bắt buộc', ''].map((h) => (
                                <span key={h} className="text-xs font-medium text-gray-400 uppercase tracking-wide">{h}</span>
                            ))}
                        </div>
                        <div className="space-y-2">
                            {fields.map((f, i) => (
                                <div key={i} className="grid grid-cols-[1fr_1fr_120px_40px_28px] gap-2 items-center">
                                    <Input value={f.key} onChange={(e) => updateField(i, { key: e.target.value.replace(/\s/g, '_').toLowerCase() })} placeholder="vd: name" className="font-mono text-xs h-8" />
                                    <Input value={f.label} onChange={(e) => updateField(i, { label: e.target.value })} placeholder="vd: Tên" className="text-sm h-8" />
                                    <select value={f.type} onChange={(e) => updateField(i, { type: e.target.value as ColField['type'] })}
                                        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
                                        {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                    <div className="flex justify-center">
                                        <input type="checkbox" checked={f.required} onChange={(e) => updateField(i, { required: e.target.checked })} className="h-4 w-4 rounded accent-indigo-600" />
                                    </div>
                                    <button type="button" onClick={() => removeField(i)} disabled={fields.length === 1}
                                        className="flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                        <XIcon className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            <AlertCircleIcon className="size-4 flex-shrink-0" />{error}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
                    <Button onClick={submit} disabled={saving} style={{ background: 'var(--color-indigo)', color: '#fff' }} className="hover:opacity-90">
                        {saving ? 'Đang tạo...' : 'Tạo danh mục'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Rename Dialog ────────────────────────────────────────────────────────────

export function RenameDialog({
    col, open, onOpenChange, onRenamed,
}: {
    col: Collection; open: boolean; onOpenChange: (v: boolean) => void; onRenamed: (c: Collection) => void
}) {
    const [name, setName] = useState(col.name)
    const [desc, setDesc] = useState(col.description)
    const [saving, setSaving] = useState(false)

    useEffect(() => { setName(col.name); setDesc(col.description) }, [col])

    async function save() {
        setSaving(true)
        const res  = await fetch(`/api/collections/${col._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description: desc }) })
        const json = await res.json()
        if (json.success) { onRenamed(json.data); onOpenChange(false) }
        setSaving(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Chỉnh sửa danh mục</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Tên hiển thị</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Mô tả</label>
                        <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Mô tả ngắn..." />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Hủy</Button></DialogClose>
                    <Button onClick={save} disabled={saving} style={{ background: 'var(--color-indigo)', color: '#fff' }} className="hover:opacity-90">
                        {saving ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Collection Table (with lock support) ─────────────────────────────────────

export function CollectionTable({
    col, isUnlocked, onRequirePassword,
}: {
    col: Collection
    isUnlocked: boolean
    onRequirePassword: (onSuccess: () => void) => void
}) {
    const [items, setItems]     = useState<ColItem[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editData, setEditData]   = useState<Record<string, string>>({})
    const [addingNew, setAddingNew] = useState(false)
    const [newData, setNewData]     = useState<Record<string, string>>({})
    const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const fetchItems = useCallback(async () => {
        setLoading(true)
        const res  = await fetch(`/api/collections/${col._id}/items`)
        const json = await res.json()
        if (json.success) setItems(json.data)
        setLoading(false)
    }, [col._id])

    useEffect(() => { fetchItems() }, [fetchItems])

    function guard(action: () => void) {
        if (!col.important || isUnlocked) { action(); return }
        onRequirePassword(action)
    }

    function handleRowDblClick(item: ColItem) {
        if (clickTimer.current) clearTimeout(clickTimer.current)
        guard(() => {
            const d: Record<string, string> = {}
            col.fields.forEach((f) => { d[f.key] = String(item.data[f.key] ?? '') })
            setEditData(d); setEditingId(item._id)
        })
    }

    function handleRowClick(id: string) {
        if (editingId === id) return
        if (clickTimer.current) clearTimeout(clickTimer.current)
        clickTimer.current = setTimeout(() => {/* single click — noop */}, 220)
    }

    async function saveEdit(item: ColItem) {
        const res  = await fetch(`/api/collections/${col._id}/items/${item._id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: editData }),
        })
        const json = await res.json()
        if (json.success) {
            setItems((p) => p.map((it) => it._id === item._id ? { ...it, data: editData } : it))
            setEditingId(null)
        }
    }

    function startDelete(id: string) {
        guard(async () => {
            if (!confirm('Xóa mục này?')) return
            await fetch(`/api/collections/${col._id}/items/${id}`, { method: 'DELETE' })
            setItems((p) => p.filter((it) => it._id !== id))
        })
    }

    function startAdd() {
        guard(() => {
            const d: Record<string, string> = {}
            col.fields.forEach((f) => { d[f.key] = '' })
            setNewData(d); setAddingNew(true)
        })
    }

    async function confirmAdd() {
        const res  = await fetch(`/api/collections/${col._id}/items`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: newData }),
        })
        const json = await res.json()
        if (json.success) { setItems((p) => [json.data, ...p]); setAddingNew(false) }
    }

    const td = 'px-4 py-2.5 text-sm border-b border-[var(--color-gray-border)] align-middle'

    if (col.fields.length === 0) {
        return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '48px 24px', color: 'var(--color-gray-text)' }}><DatabaseIcon size={36} style={{ opacity: 0.25 }} /><p style={{ fontSize: 13 }}>Danh mục chưa có trường nào.</p></div>
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 12, color: 'var(--color-gray-text)' }}>{loading ? 'Đang tải...' : `${items.length} mục`}</p>
                <button onClick={startAdd} disabled={addingNew} className="dh-btn dh-btn-sm dh-btn-primary">
                    <PlusIcon size={13} />Thêm mục
                </button>
            </div>
            <div className="overflow-x-auto" style={{ borderRadius: 10, border: '1px solid var(--color-gray-border)', overflow: 'hidden' }}>
                <table className="dh-table w-full">
                    <thead>
                        <tr>
                            {col.fields.map((f) => (
                                <th key={f.key}>
                                    {f.label}{f.required && <span style={{ marginLeft: 2, color: '#ef4444' }}>*</span>}
                                </th>
                            ))}
                            <th style={{ width: 56 }} />
                        </tr>
                    </thead>
                    <tbody>
                        {addingNew && (
                            <tr style={{ background: 'var(--color-indigo-pale)' }}>
                                {col.fields.map((f) => (
                                    <td key={f.key} className={td}>
                                        <Input autoFocus={col.fields[0].key === f.key} value={newData[f.key] ?? ''}
                                            onChange={(e) => setNewData((d) => ({ ...d, [f.key]: e.target.value }))}
                                            type={f.type === 'email' ? 'email' : f.type === 'number' ? 'number' : 'text'}
                                            placeholder={f.label} className="h-7 text-xs"
                                            onKeyDown={(e) => { if (e.key === 'Enter') confirmAdd(); if (e.key === 'Escape') setAddingNew(false) }} />
                                    </td>
                                ))}
                                <td className={`${td} whitespace-nowrap`}>
                                    <div className="flex gap-1">
                                        <button onClick={confirmAdd} className="p-1 rounded" style={{ color: 'var(--color-teal-dark)' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-teal-pale)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}><CheckIcon className="size-4" /></button>
                                        <button onClick={() => setAddingNew(false)} className="p-1 rounded text-gray-400 hover:bg-gray-100"><XIcon className="size-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!loading && items.length === 0 && !addingNew && (
                            <tr><td colSpan={col.fields.length + 1} className="px-4 py-12 text-center text-sm text-gray-400">
                                Chưa có dữ liệu. Nhấn <strong>Thêm mục</strong> để bắt đầu.
                            </td></tr>
                        )}
                        {items.map((item) => {
                            const isEditing = editingId === item._id
                            return (
                                <tr key={item._id} onClick={() => handleRowClick(item._id)} onDoubleClick={() => handleRowDblClick(item)}
                                    style={{ background: isEditing ? 'var(--color-indigo-pale)' : undefined, cursor: isEditing ? 'default' : 'pointer' }}
                                    className="group transition-colors"
                                    title={isEditing ? '' : 'Nhấp đúp để chỉnh sửa'}>
                                    {col.fields.map((f) => (
                                        <td key={f.key} className={td}>
                                            {isEditing ? (
                                                <Input autoFocus={col.fields[0].key === f.key} value={editData[f.key] ?? ''}
                                                    onChange={(e) => setEditData((d) => ({ ...d, [f.key]: e.target.value }))}
                                                    type={f.type === 'email' ? 'email' : f.type === 'number' ? 'number' : 'text'}
                                                    className="h-7 text-xs"
                                                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(item); if (e.key === 'Escape') setEditingId(null) }} />
                                            ) : (
                                                <span className="block truncate max-w-[200px]" title={String(item.data[f.key] ?? '')}>
                                                    {String(item.data[f.key] ?? '') || <span className="text-gray-300 italic">—</span>}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                    <td className={`${td} whitespace-nowrap`}>
                                        {isEditing ? (
                                            <div className="flex gap-1">
                                                <button onClick={() => saveEdit(item)} className="p-1 rounded" style={{ color: 'var(--color-teal-dark)' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-teal-pale)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')} title="Lưu (Enter)"><CheckIcon className="size-4" /></button>
                                                <button onClick={() => setEditingId(null)} className="p-1 rounded text-gray-400 hover:bg-gray-100" title="Hủy (Esc)"><XIcon className="size-4" /></button>
                                            </div>
                                        ) : (
                                            <button onClick={(e) => { e.stopPropagation(); startDelete(item._id) }}
                                                className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all" title="Xóa">
                                                <Trash2Icon className="size-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-gray-text)', opacity: 0.6 }}>
                Nhấp đúp để chỉnh sửa · <kbd style={{ padding: '1px 5px', borderRadius: 4, border: '1px solid var(--color-gray-border)', fontFamily: 'monospace', fontSize: 10 }}>Enter</kbd> lưu · <kbd style={{ padding: '1px 5px', borderRadius: 4, border: '1px solid var(--color-gray-border)', fontFamily: 'monospace', fontSize: 10 }}>Esc</kbd> hủy
            </p>
        </div>
    )
}

// ─── Settings Table (cho fixed tabs — thay form) ──────────────────────────────

export interface SettingsRow {
    key: string
    label: string
    type: 'text' | 'email' | 'url' | 'password' | 'select' | 'image'
    group: 'general' | 'header' | 'integrations'
    options?: { value: string; label: string }[]
    hint?: string
    imageAccept?: string   // e.g. ".ico,.png,.svg"
}

export function SettingsTable({
    rows, values, onRowSaved,
}: {
    rows: SettingsRow[]
    values: Record<string, string>
    onRowSaved: (key: string, value: string) => void
}) {
    const toast = useToast()
    const [editingKey, setEditingKey] = useState<string | null>(null)
    const [editVal, setEditVal]       = useState('')
    const [saving, setSaving]         = useState(false)
    const [showPw, setShowPw]         = useState(false)
    const [uploading, setUploading]   = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const activeRowRef = useRef<SettingsRow | null>(null)
    const clickTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)

    function handleRowClick(key: string) {
        if (editingKey === key) return
        if (clickTimer.current) clearTimeout(clickTimer.current)
        clickTimer.current = setTimeout(() => {/* noop */}, 220)
    }

    function handleRowDblClick(row: SettingsRow) {
        if (clickTimer.current) clearTimeout(clickTimer.current)
        setEditVal(values[row.key] ?? '')
        setEditingKey(row.key)
        setShowPw(false)
        activeRowRef.current = row
    }

    function handleEditClick(row: SettingsRow) {
        setEditVal(values[row.key] ?? '')
        setEditingKey(row.key)
        setShowPw(false)
        activeRowRef.current = row
    }

    async function saveRow(row: SettingsRow) {
        setSaving(true)
        try {
            const res  = await fetch('/api/settings', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [row.group]: { [row.key]: editVal } }),
            })
            const json = await res.json()
            if (json.success) {
                onRowSaved(row.key, editVal)
                setEditingKey(null)
                toast.success('Đã lưu', row.label)
            } else {
                toast.error('Lưu thất bại', json.error)
            }
        } catch {
            toast.error('Lỗi kết nối')
        } finally { setSaving(false) }
    }

    async function handleFileUpload(file: File, row: SettingsRow) {
        setUploading(true)
        const form = new FormData(); form.append('file', file)
        try {
            const res  = await fetch(`/api/settings/upload?field=${row.key}`, { method: 'POST', body: form })
            const json = await res.json()
            if (json.url) setEditVal(json.url)
        } finally { setUploading(false) }
    }

    const td = 'px-4 py-3.5 text-sm border-b border-[var(--color-gray-border)] align-middle'

    return (
        <div className="overflow-x-auto">
            <input ref={fileInputRef} type="file" className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f && activeRowRef.current) handleFileUpload(f, activeRowRef.current)
                    e.target.value = ''
                }} />

            <table className="dh-table w-full">
                <thead>
                    <tr>
                        <th style={{ width: 220 }}>Cài đặt</th>
                        <th>Giá trị</th>
                        <th style={{ width: 80 }} />
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => {
                        const isEditing = editingKey === row.key
                        const val       = values[row.key] ?? ''
                        const masked    = row.type === 'password' && val ? '••••••••••••' : null
                        const isImage   = row.type === 'image'

                        return (
                            <tr key={row.key}
                                onClick={() => handleRowClick(row.key)}
                                onDoubleClick={() => !isImage && handleRowDblClick(row)}
                                style={{ background: isEditing ? 'var(--color-indigo-pale)' : undefined, cursor: isEditing || isImage ? 'default' : 'pointer' }}
                                title={isEditing || isImage ? '' : 'Nhấp đúp để chỉnh sửa'}>

                                {/* Label column */}
                                <td className={`${td} font-medium`} style={{ color: 'var(--color-navy-deep)' }}>
                                    <div>{row.label}</div>
                                    {row.hint && <div style={{ fontSize: 11, color: 'var(--color-gray-text)', fontWeight: 400, marginTop: 2, opacity: 0.7 }}>{row.hint}</div>}
                                </td>

                                {/* Value column */}
                                <td className={td}>
                                    {/* ── Image type ── */}
                                    {isImage && (
                                        <div className="flex flex-col gap-2">
                                            {/* Preview + upload row */}
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                                                    {(isEditing ? editVal : val)
                                                        ? <img src={isEditing ? editVal : val} alt="" className="h-full w-full object-contain"
                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                                        : <ImageIcon className="size-4 text-gray-300" />
                                                    }
                                                </div>
                                                {isEditing ? (
                                                    <button type="button"
                                                        onClick={() => {
                                                            activeRowRef.current = row
                                                            if (fileInputRef.current) {
                                                                fileInputRef.current.accept = row.imageAccept ?? '.ico,.png,.svg,.jpg,.jpeg,.webp'
                                                                fileInputRef.current.click()
                                                            }
                                                        }}
                                                        disabled={uploading}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
                                                        <UploadIcon className="size-3.5" />
                                                        {uploading ? 'Đang tải...' : 'Chọn ảnh'}
                                                    </button>
                                                ) : (
                                                    <button type="button" onClick={() => handleEditClick(row)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                                                        <UploadIcon className="size-3.5" />
                                                        {val ? 'Thay đổi' : 'Tải lên'}
                                                    </button>
                                                )}
                                            </div>

                                            {/* URL input row */}
                                            {isEditing && (
                                                <div className="flex items-center gap-2 max-w-xl">
                                                    <LinkIcon className="size-3.5 text-gray-400 flex-shrink-0" />
                                                    <Input
                                                        autoFocus
                                                        value={editVal}
                                                        onChange={(e) => setEditVal(e.target.value)}
                                                        placeholder="Hoặc dán URL ảnh vào đây..."
                                                        className="h-7 text-xs flex-1"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') saveRow(row)
                                                            if (e.key === 'Escape') { setEditingKey(null); setEditVal('') }
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Current URL (view mode) */}
                                            {!isEditing && val && (
                                                <p className="text-xs text-gray-400 font-mono truncate max-w-sm">{val}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* ── Other types ── */}
                                    {!isImage && (
                                        isEditing ? (
                                            <div className="relative max-w-xl">
                                                {row.type === 'select' && row.options ? (
                                                    <select value={editVal} onChange={(e) => setEditVal(e.target.value)} autoFocus
                                                        className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
                                                        {row.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                    </select>
                                                ) : (
                                                    <>
                                                        <Input autoFocus
                                                            type={row.type === 'password' && !showPw ? 'password' : row.type === 'email' ? 'email' : 'text'}
                                                            value={editVal} onChange={(e) => setEditVal(e.target.value)}
                                                            className={`h-8 ${row.type === 'password' ? 'pr-9 font-mono' : ''}`}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') saveRow(row)
                                                                if (e.key === 'Escape') setEditingKey(null)
                                                            }} />
                                                        {row.type === 'password' && (
                                                            <button type="button" onClick={() => setShowPw((s) => !s)}
                                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                                {showPw ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <span className={`block truncate max-w-xl ${masked ? 'font-mono text-gray-400' : ''} ${!val ? 'text-gray-300 italic' : ''}`}>
                                                {masked ?? (val || '—')}
                                            </span>
                                        )
                                    )}
                                </td>

                                {/* Action column */}
                                <td className={`${td} whitespace-nowrap`}>
                                    {isEditing ? (
                                        <div className="flex gap-1">
                                            <button onClick={() => saveRow(row)} disabled={saving}
                                                style={{ color: 'var(--color-teal-dark)' }} className="p-1 rounded" onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-teal-pale)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')} title="Lưu (Enter)">
                                                <CheckIcon className="size-4" />
                                            </button>
                                            <button onClick={() => { setEditingKey(null); setEditVal('') }}
                                                className="p-1 rounded text-gray-400 hover:bg-gray-100" title="Hủy (Esc)">
                                                <XIcon className="size-4" />
                                            </button>
                                        </div>
                                    ) : !isImage ? (
                                        <button onClick={() => handleEditClick(row)}
                                            className="p-1 rounded text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-all" title="Chỉnh sửa">
                                            <PencilIcon className="size-3.5" />
                                        </button>
                                    ) : null}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
