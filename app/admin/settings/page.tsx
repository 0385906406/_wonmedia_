'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    GlobeIcon, LayoutIcon, KeyRoundIcon, PlusIcon, DatabaseIcon,
    XIcon, LockIcon, StarIcon, MoreVerticalIcon, PencilIcon, Trash2Icon,
    FootprintsIcon, SaveIcon, Loader2Icon, SparklesIcon,
} from 'lucide-react'
import { LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'
import {
    CollectionTable, CreateCollectionDialog, RenameDialog, PasswordModal,
    SettingsTable, type Collection, type SettingsRow,
} from './collections-tab'
import { useToast } from '@/components/admin/toast-provider'

// ─── Settings row definitions ─────────────────────────────────────────────────

const GENERAL_ROWS: SettingsRow[] = [
    { key: 'portalName',  label: 'Tên portal',       type: 'text',  group: 'general', hint: 'Hiển thị trong tab trình duyệt' },
    { key: 'tagline',     label: 'Tagline',           type: 'text',  group: 'general', hint: 'Dòng mô tả ngắn bên dưới tên portal' },
    { key: 'publicDomain',label: 'Domain public',     type: 'url',   group: 'general', hint: 'URL đầy đủ, bao gồm https://' },
    { key: 'systemEmail', label: 'Email hệ thống',    type: 'email', group: 'general', hint: 'Địa chỉ gửi email thông báo tự động' },
]

const HEADER_ROWS: SettingsRow[] = [
    { key: 'navDisplayName', label: 'Tên hiển thị trên nav',  type: 'text',  group: 'header' },
    { key: 'logoEn',         label: 'Logo (dòng tiếng Anh)',  type: 'text',  group: 'header' },
    { key: 'logoVi',         label: 'Logo (dòng tiếng Việt)', type: 'text',  group: 'header' },
    {
        key: 'faviconUrl', label: 'Favicon', type: 'image', group: 'header',
        hint: 'ICO / PNG / SVG — 32×32px hoặc 64×64px. Để trống để dùng mặc định.',
        imageAccept: '.ico,.png,.svg',
    },
    {
        key: 'logoImageUrl', label: 'Logo hình ảnh', type: 'image', group: 'header',
        hint: 'PNG / SVG / WebP, nên dùng nền trong suốt. Tối đa 2MB.',
        imageAccept: '.png,.svg,.jpg,.jpeg,.webp',
    },
]

const INTEGRATIONS_ROWS: SettingsRow[] = [
    { key: 'geminiApiKey', label: 'Gemini API Key', type: 'password', group: 'integrations', hint: 'Lấy tại aistudio.google.com' },
    {
        key: 'geminiModel', label: 'Gemini Model', type: 'select', group: 'integrations',
        options: [
            { value: 'gemini-2.5-pro',   label: 'Gemini 2.5 Pro' },
            { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
            { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
            { value: 'gemini-1.5-pro',   label: 'Gemini 1.5 Pro' },
            { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
        ],
    },
    { key: 'newsApiKey', label: 'News API Key', type: 'password', group: 'integrations' },
    { key: 'newsApiUrl', label: 'News API URL', type: 'url',      group: 'integrations', hint: 'Endpoint lấy danh sách tin tức' },
]

const FIXED_TABS = [
    { id: 'general',      label: 'Thông tin cơ bản', icon: GlobeIcon,       rows: GENERAL_ROWS },
    { id: 'header',       label: 'Header & Logo',     icon: LayoutIcon,      rows: HEADER_ROWS },
    { id: 'integrations', label: 'Tích hợp & API',    icon: KeyRoundIcon,    rows: INTEGRATIONS_ROWS },
] as const

const FOOTER_TAB = { id: 'footer', label: 'Footer', icon: FootprintsIcon }

type FixedId = typeof FIXED_TABS[number]['id']
const FIXED_IDS = [...FIXED_TABS.map((t) => t.id), 'footer'] as string[]

// ─── Footer form types ─────────────────────────────────────────────────────────
interface FooterForm {
    companyName: MultiLang
    navAbout: MultiLang; navServices: MultiLang; navCareers: MultiLang; navBlog: MultiLang; navContact: MultiLang
    servicesHeading: MultiLang; service1: MultiLang; service2: MultiLang; service3: MultiLang; service4: MultiLang
    locationHeading: MultiLang; locationCity: MultiLang
    phoneLabel: MultiLang; emailLabel: MultiLang; legalRepLabel: MultiLang
    copyright: MultiLang
}
function emptyFooter(): FooterForm {
    return {
        companyName: emptyMultiLang(),
        navAbout: emptyMultiLang(), navServices: emptyMultiLang(), navCareers: emptyMultiLang(), navBlog: emptyMultiLang(), navContact: emptyMultiLang(),
        servicesHeading: emptyMultiLang(), service1: emptyMultiLang(), service2: emptyMultiLang(), service3: emptyMultiLang(), service4: emptyMultiLang(),
        locationHeading: emptyMultiLang(), locationCity: emptyMultiLang(),
        phoneLabel: emptyMultiLang(), emailLabel: emptyMultiLang(), legalRepLabel: emptyMultiLang(),
        copyright: emptyMultiLang(),
    }
}

interface SettingsData {
    general:      Record<string, string>
    header:       Record<string, string>
    integrations: Record<string, string>
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const toast = useToast()
    const [activeTab, setActiveTab]   = useState<string>('general')
    const [data, setData]             = useState<SettingsData>({ general: {}, header: {}, integrations: {} })
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading]       = useState(true)

    // Footer
    const [footerForm, setFooterForm] = useState<FooterForm>(emptyFooter)
    const [footerLang, setFooterLang] = useState<LocaleKey>('vi')
    const [footerSaving, setFooterSaving] = useState(false)

    // Dialogs
    const [showCreate, setShowCreate] = useState(false)
    const [renameCol, setRenameCol]   = useState<Collection | null>(null)

    // Password protection
    const [pwModal, setPwModal]       = useState<{ col: Collection; onSuccess: () => void } | null>(null)
    const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())

    const tabClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Load
    useEffect(() => {
        Promise.all([
            fetch('/api/settings').then((r) => r.json()),
            fetch('/api/collections').then((r) => r.json()),
            fetch('/api/footer').then((r) => r.json()),
        ]).then(([sRes, cRes, fRes]) => {
            if (sRes.data) {
                setData({
                    general:      sRes.data.general      ?? {},
                    header:       sRes.data.header       ?? {},
                    integrations: sRes.data.integrations ?? {},
                })
            }
            if (cRes.data) setCollections(cRes.data)
            if (fRes.data) setFooterForm(f => ({ ...f, ...fRes.data }))
        }).finally(() => setLoading(false))
    }, [])

    function handleRowSaved(group: FixedId, key: string, value: string) {
        setData((d) => ({ ...d, [group]: { ...d[group], [key]: value } }))
        toast.success('Đã lưu')
    }

    // ── Collection tab interactions ──

    function handleColTabClick(id: string) {
        if (tabClickTimer.current) clearTimeout(tabClickTimer.current)
        tabClickTimer.current = setTimeout(() => setActiveTab(id), 220)
    }
    function handleColTabDblClick(col: Collection) {
        if (tabClickTimer.current) clearTimeout(tabClickTimer.current)
        requirePassword(col, () => setRenameCol(col))
    }

    function requirePassword(col: Collection, onSuccess: () => void) {
        if (!col.important || unlockedIds.has(col._id)) { onSuccess(); return }
        setPwModal({ col, onSuccess })
    }

    function unlockAndRun(col: Collection, action: () => void) {
        setUnlockedIds((s) => new Set([...s, col._id]))
        action()
        setPwModal(null)
    }

    async function toggleImportant(col: Collection) {
        const next = !col.important
        const res  = await fetch(`/api/collections/${col._id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ important: next }),
        })
        const json = await res.json()
        if (json.success) {
            setCollections((p) => p.map((c) => c._id === col._id ? { ...c, important: next } : c))
            // Remove from unlocked if marked important again
            if (next) setUnlockedIds((s) => { const n = new Set(s); n.delete(col._id); return n })
        }
    }

    async function deleteCollection(col: Collection, e: React.MouseEvent) {
        e.stopPropagation()
        requirePassword(col, async () => {
            if (!confirm(`Xóa danh mục "${col.name}"? Tất cả dữ liệu sẽ bị xóa.`)) return
            await fetch(`/api/collections/${col._id}`, { method: 'DELETE' })
            setCollections((p) => {
                const next = p.filter((c) => c._id !== col._id)
                if (activeTab === col._id) setActiveTab(next[0]?._id ?? 'general')
                return next
            })
        })
    }

    const activeCol   = collections.find((c) => c._id === activeTab) ?? null
    const isFixed     = FIXED_IDS.includes(activeTab)
    const activeFixed = FIXED_TABS.find((t) => t.id === activeTab)

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[400px]">
            <p className="text-sm text-gray-400">Đang tải cài đặt...</p>
        </div>
    )

    return (
        <div className="p-6 w-full">
            <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--nic-text)' }}>Cài đặt</h1>

            {/* ── Unified tab bar ── */}
            <div className="flex items-end gap-0 border-b border-gray-200 mb-8 overflow-x-auto">

                {/* Fixed tabs */}
                {FIXED_TABS.map(({ id, label, icon: Icon }) => {
                    const active = activeTab === id
                    return (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className="relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                            style={{ color: active ? 'var(--nic-indigo)' : 'var(--nic-gray-text)' }}>
                            <Icon className="size-4" />
                            {label}
                            {active && <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full" style={{ background: 'var(--nic-indigo)' }} />}
                        </button>
                    )
                })}

                {/* Footer tab */}
                {(() => {
                    const active = activeTab === FOOTER_TAB.id
                    return (
                        <button key={FOOTER_TAB.id} onClick={() => setActiveTab(FOOTER_TAB.id)}
                            className="relative flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0"
                            style={{ color: active ? 'var(--nic-indigo)' : 'var(--nic-gray-text)' }}>
                            <FootprintsIcon className="size-4" />
                            {FOOTER_TAB.label}
                            {active && <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full" style={{ background: 'var(--nic-indigo)' }} />}
                        </button>
                    )
                })()}

                {/* Separator */}
                {collections.length > 0 && <div className="self-center h-5 w-px bg-gray-200 mx-3 flex-shrink-0" />}

                {/* Collection tabs */}
                {collections.map((col) => {
                    const active = activeTab === col._id
                    return (
                        <div key={col._id} className="relative flex items-center group flex-shrink-0">
                            {/* Tab button */}
                            <button
                                className="flex items-center gap-1.5 pl-3 pr-1 py-3 text-sm font-medium transition-colors whitespace-nowrap"
                                style={{ color: active ? 'var(--nic-indigo)' : 'var(--nic-gray-text)' }}
                                onClick={() => handleColTabClick(col._id)}
                                onDoubleClick={() => handleColTabDblClick(col)}
                                title="Nhấp đúp để đổi tên">
                                {col.important
                                    ? <LockIcon className="size-3.5 flex-shrink-0 text-amber-500" />
                                    : <DatabaseIcon className="size-3.5 flex-shrink-0" />
                                }
                                {col.name}
                            </button>

                            {/* 3-dot menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="p-1 mx-0.5 rounded text-gray-300 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                                        title="Tùy chọn"
                                        onClick={(e) => e.stopPropagation()}>
                                        <MoreVerticalIcon className="size-3.5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-52">
                                    <DropdownMenuItem onClick={() => {
                                        handleColTabClick(col._id)
                                        requirePassword(col, () => setRenameCol(col))
                                    }}>
                                        <PencilIcon className="size-4 mr-2" />
                                        Đổi tên
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => toggleImportant(col)}>
                                        {col.important
                                            ? <><LockIcon className="size-4 mr-2 text-amber-500" /><span>Bỏ quan trọng</span></>
                                            : <><StarIcon className="size-4 mr-2" /><span>Đánh dấu quan trọng</span></>
                                        }
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                        onClick={(e) => deleteCollection(col, e)}>
                                        <Trash2Icon className="size-4 mr-2" />
                                        Xóa danh mục
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Active underline */}
                            {active && <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full" style={{ background: 'var(--nic-indigo)' }} />}
                        </div>
                    )
                })}

                {/* Add collection button */}
                <button onClick={() => setShowCreate(true)}
                    className="flex items-center gap-1.5 px-3 py-3 text-sm font-medium transition-colors rounded-t-lg flex-shrink-0 ml-1 whitespace-nowrap hover:bg-muted"
                    style={{ color: 'var(--nic-indigo)' }}>
                    <PlusIcon className="size-4" />
                    Thêm danh mục
                </button>
            </div>

            {/* ── Fixed tab content: SettingsTable ── */}
            {isFixed && activeFixed && (
                <div>
                    <div className="mb-4">
                        <h2 className="text-base font-semibold" style={{ color: 'var(--nic-text)' }}>{activeFixed.label}</h2>
                        <p className="text-sm mt-0.5 text-xs" style={{ color: 'var(--nic-gray-text)' }}>
                            Nhấp đúp vào một hàng để chỉnh sửa trực tiếp.
                        </p>
                    </div>
                    <SettingsTable
                        rows={activeFixed.rows}
                        values={data[activeFixed.id as FixedId]}
                        onRowSaved={(key, val) => handleRowSaved(activeFixed.id as FixedId, key, val)}
                    />
                </div>
            )}

            {/* ── Footer tab content ── */}
            {activeTab === 'footer' && (() => {
                const IC = 'w-full h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'
                const TA = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 resize-none'
                const FF = footerForm
                const setFF = setFooterForm

                function MLInput({ label, fKey, multi = false }: { label: string; fKey: keyof FooterForm; multi?: boolean }) {
                    const val = FF[fKey] as MultiLang
                    return (
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500">
                                {label} <span className="font-mono text-gray-400">({LOCALE_META[footerLang].flag} {LOCALE_META[footerLang].short})</span>
                            </label>
                            {multi
                                ? <textarea value={val[footerLang] ?? ''} rows={2} className={TA}
                                    onChange={e => setFF(f => ({ ...f, [fKey]: { ...val, [footerLang]: e.target.value } }))} />
                                : <input value={val[footerLang] ?? ''} className={IC}
                                    onChange={e => setFF(f => ({ ...f, [fKey]: { ...val, [footerLang]: e.target.value } }))} />}
                        </div>
                    )
                }

                async function saveFooter() {
                    setFooterSaving(true)
                    try {
                        const res = await fetch('/api/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(FF) })
                        if (res.ok) toast.success('Đã lưu Footer!')
                        else toast.error('Lỗi lưu Footer')
                    } finally { setFooterSaving(false) }
                }

                async function aiTranslate() {
                    setFooterSaving(true)
                    try {
                        const res = await fetch('/api/ai/translate', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                fields: { title: FF.companyName.vi, excerpt: FF.copyright.vi },
                                targetLocales: ['en', 'ko', 'ja', 'zh'],
                            })
                        })
                        const data = await res.json()
                        if (res.ok && data.translations) {
                            const t = data.translations as Record<string, { title?: string; excerpt?: string }>
                            setFF(f => ({
                                ...f,
                                companyName: { ...f.companyName, ...Object.fromEntries(Object.entries(t).map(([lc, v]) => [lc, v.title ?? ''])) },
                                copyright:   { ...f.copyright,   ...Object.fromEntries(Object.entries(t).map(([lc, v]) => [lc, v.excerpt ?? ''])) },
                            }))
                            toast.success('Đã dịch tên công ty & copyright!')
                        }
                    } catch { toast.error('Lỗi AI') } finally { setFooterSaving(false) }
                }

                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <h2 className="text-base font-semibold" style={{ color: 'var(--nic-text)' }}>Quản lý Footer</h2>
                                <p className="text-xs mt-0.5" style={{ color: 'var(--nic-gray-text)' }}>Chỉnh sửa nội dung footer hiển thị trên tất cả trang</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={aiTranslate} disabled={footerSaving}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors">
                                    {footerSaving ? <Loader2Icon size={12} className="animate-spin" /> : <SparklesIcon size={12} />}AI Dịch
                                </button>
                                <button onClick={saveFooter} disabled={footerSaving}
                                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                                    {footerSaving ? <Loader2Icon size={12} className="animate-spin" /> : <SaveIcon size={12} />}Lưu Footer
                                </button>
                            </div>
                        </div>

                        {/* Lang tabs */}
                        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
                            {LOCALES.map(l => (
                                <button key={l} onClick={() => setFooterLang(l)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${footerLang === l ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                                    {LOCALE_META[l].flag} {LOCALE_META[l].short}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Brand */}
                            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50 space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Thương hiệu</p>
                                <MLInput label="Tên công ty" fKey="companyName" />
                                <MLInput label="Bản quyền (Copyright)" fKey="copyright" />
                            </div>

                            {/* Navigation */}
                            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50 space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Nhãn điều hướng</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <MLInput label="Giới thiệu"  fKey="navAbout"    />
                                    <MLInput label="Dịch vụ"     fKey="navServices" />
                                    <MLInput label="Tuyển dụng"  fKey="navCareers"  />
                                    <MLInput label="Blog"        fKey="navBlog"     />
                                    <MLInput label="Liên hệ"     fKey="navContact"  />
                                </div>
                            </div>

                            {/* Services */}
                            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50 space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Dịch vụ</p>
                                <MLInput label="Tiêu đề cột dịch vụ" fKey="servicesHeading" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <MLInput label="Dịch vụ 1" fKey="service1" />
                                    <MLInput label="Dịch vụ 2" fKey="service2" />
                                    <MLInput label="Dịch vụ 3" fKey="service3" />
                                    <MLInput label="Dịch vụ 4" fKey="service4" />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50 space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Địa điểm & Nhãn liên hệ</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <MLInput label="Nhãn trụ sở (VD: Trụ sở:)" fKey="locationHeading" />
                                    <MLInput label="Thành phố (VD: HÀ NỘI, VIỆT NAM)" fKey="locationCity" />
                                    <MLInput label="Nhãn Điện thoại" fKey="phoneLabel" />
                                    <MLInput label="Nhãn Email" fKey="emailLabel" />
                                    <MLInput label="Nhãn Người đại diện" fKey="legalRepLabel" />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })()}

            {/* ── Collection tab content ── */}
            {activeCol && (
                <div>
                    <div className="mb-4 flex items-center gap-3">
                        <div>
                            <h2 className="text-base font-semibold flex items-center gap-2" style={{ color: 'var(--nic-text)' }}>
                                {activeCol.important && <LockIcon className="size-4 text-amber-500" />}
                                {activeCol.name}
                                {activeCol.important && (
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                                        Quan trọng
                                    </span>
                                )}
                            </h2>
                            {activeCol.description && (
                                <p className="text-sm mt-0.5" style={{ color: 'var(--nic-gray-text)' }}>{activeCol.description}</p>
                            )}
                        </div>
                    </div>
                    <CollectionTable
                        col={activeCol}
                        isUnlocked={unlockedIds.has(activeCol._id)}
                        onRequirePassword={(onSuccess) => requirePassword(activeCol, onSuccess)}
                    />
                </div>
            )}

            {/* Dialogs */}
            <CreateCollectionDialog open={showCreate} onOpenChange={setShowCreate}
                onCreated={(col) => { setCollections((p) => [...p, col]); setActiveTab(col._id) }} />

            {renameCol && (
                <RenameDialog col={renameCol} open={!!renameCol}
                    onOpenChange={(v) => { if (!v) setRenameCol(null) }}
                    onRenamed={(updated) => setCollections((p) => p.map((c) => c._id === updated._id ? updated : c))} />
            )}

            {pwModal && (
                <PasswordModal
                    open={!!pwModal}
                    onOpenChange={(v) => { if (!v) setPwModal(null) }}
                    collectionName={pwModal.col.name}
                    onSuccess={() => unlockAndRun(pwModal.col, pwModal.onSuccess)}
                />
            )}

        </div>
    )
}
