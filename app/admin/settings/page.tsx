'use client'

import { useEffect, useRef, useState } from 'react'
import {
    GlobeIcon, LayoutIcon, PlusIcon, DatabaseIcon,
    LockIcon, StarIcon, MoreVerticalIcon, PencilIcon, Trash2Icon,
    FootprintsIcon, SaveIcon, Loader2Icon, SettingsIcon,
} from 'lucide-react'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ADMIN_LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'
import {
    CollectionTable, CreateCollectionDialog, RenameDialog, PasswordModal,
    SettingsTable, type Collection, type SettingsRow,
} from './collections-tab'
import { useToast } from '@/components/admin/toast-provider'

// ─── Settings row definitions ─────────────────────────────────────────────────

const GENERAL_ROWS: SettingsRow[] = [
    { key: 'portalName',   label: 'Tên portal',      type: 'text',  group: 'general',      hint: 'Hiển thị trong tab trình duyệt' },
    { key: 'tagline',      label: 'Tagline',          type: 'text',  group: 'general',      hint: 'Dòng mô tả ngắn bên dưới tên portal' },
    { key: 'publicDomain', label: 'Domain public',    type: 'url',   group: 'general',      hint: 'URL đầy đủ, bao gồm https://' },
    { key: 'systemEmail',  label: 'Email hệ thống',   type: 'email', group: 'general',      hint: 'Địa chỉ gửi email thông báo tự động' },
]

const HEADER_ROWS: SettingsRow[] = [
    { key: 'navDisplayName', label: 'Tên hiển thị trên nav',  type: 'text',  group: 'header' },
    { key: 'logoEn',         label: 'Logo (dòng tiếng Anh)',  type: 'text',  group: 'header' },
    { key: 'logoVi',         label: 'Logo (dòng tiếng Việt)', type: 'text',  group: 'header' },
    { key: 'faviconUrl',     label: 'Favicon',                type: 'image', group: 'header', hint: 'ICO / PNG / SVG — 32×32px', imageAccept: '.ico,.png,.svg' },
    { key: 'logoImageUrl',   label: 'Logo hình ảnh',          type: 'image', group: 'header', hint: 'PNG / SVG / WebP, nền trong suốt. Tối đa 2MB.', imageAccept: '.png,.svg,.jpg,.jpeg,.webp' },
]

const FIXED_TABS = [
    { id: 'general', label: 'Thông tin cơ bản', icon: GlobeIcon,  rows: GENERAL_ROWS, desc: 'Cấu hình cơ bản của hệ thống' },
    { id: 'header',  label: 'Header & Logo',    icon: LayoutIcon, rows: HEADER_ROWS,  desc: 'Logo, favicon và tên hiển thị trên nav' },
] as const

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
        navAbout: emptyMultiLang(), navServices: emptyMultiLang(), navCareers: emptyMultiLang(),
        navBlog: emptyMultiLang(), navContact: emptyMultiLang(),
        servicesHeading: emptyMultiLang(), service1: emptyMultiLang(), service2: emptyMultiLang(),
        service3: emptyMultiLang(), service4: emptyMultiLang(),
        locationHeading: emptyMultiLang(), locationCity: emptyMultiLang(),
        phoneLabel: emptyMultiLang(), emailLabel: emptyMultiLang(), legalRepLabel: emptyMultiLang(),
        copyright: emptyMultiLang(),
    }
}

interface SettingsData { general: Record<string, string>; header: Record<string, string> }

// ─── Nav item component ───────────────────────────────────────────────────────

function NavGroup({ title }: { title: string }) {
    return (
        <div style={{ padding: '16px 16px 6px', fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-gray-text)', opacity: 0.6 }}>
            {title}
        </div>
    )
}

function NavItem({
    label, icon: Icon, active, onClick, badge, warning, extra,
}: {
    label: string; icon?: React.ElementType; active: boolean; onClick: () => void
    badge?: string; warning?: boolean; extra?: React.ReactNode
}) {
    return (
        <button onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', padding: '9px 14px', borderRadius: 8,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 13, fontWeight: active ? 600 : 500,
                background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: active ? 'var(--color-indigo)' : 'var(--color-gray-text)',
                transition: 'all 0.15s',
                borderLeft: `3px solid ${active ? 'var(--color-indigo)' : 'transparent'}`,
            }}
            className="settings-nav-item"
        >
            {Icon && <Icon size={15} style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }} />}
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
            {warning && <LockIcon size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />}
            {badge && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 100, background: active ? 'var(--color-indigo-pale)' : 'var(--color-gray-light)', color: active ? 'var(--color-indigo)' : 'var(--color-gray-text)' }}>
                    {badge}
                </span>
            )}
            {extra}
        </button>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const toast = useToast()
    const [activeTab, setActiveTab]   = useState<string>('general')
    const [data, setData]             = useState<SettingsData>({ general: {}, header: {} })
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading]       = useState(true)

    // Footer
    const [footerForm, setFooterForm] = useState<FooterForm>(emptyFooter)
    const [footerLang, setFooterLang] = useState<LocaleKey>('vi')
    const [footerSaving, setFooterSaving] = useState(false)

    // Dialogs
    const [showCreate, setShowCreate] = useState(false)
    const [renameCol, setRenameCol]   = useState<Collection | null>(null)
    const [pwModal, setPwModal]       = useState<{ col: Collection; onSuccess: () => void } | null>(null)
    const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())

    const tabClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        Promise.all([
            fetch('/api/settings').then((r) => r.json()),
            fetch('/api/collections').then((r) => r.json()),
            fetch('/api/footer').then((r) => r.json()),
        ]).then(([sRes, cRes, fRes]) => {
            if (sRes.data) setData({ general: sRes.data.general ?? {}, header: sRes.data.header ?? {} })
            if (cRes.data) setCollections(cRes.data)
            if (fRes.data) setFooterForm(f => ({ ...f, ...fRes.data }))
        }).finally(() => setLoading(false))
    }, [])

    function handleRowSaved(group: FixedId, key: string, value: string) {
        setData((d) => ({ ...d, [group]: { ...d[group], [key]: value } }))
        toast.success('Đã lưu')
    }

    function handleColTabClick(id: string) {
        if (tabClickTimer.current) clearTimeout(tabClickTimer.current)
        tabClickTimer.current = setTimeout(() => setActiveTab(id), 200)
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
        action(); setPwModal(null)
    }
    async function toggleImportant(col: Collection) {
        const next = !col.important
        const res  = await fetch(`/api/collections/${col._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ important: next }) })
        const json = await res.json()
        if (json.success) {
            setCollections((p) => p.map((c) => c._id === col._id ? { ...c, important: next } : c))
            if (next) setUnlockedIds((s) => { const n = new Set(s); n.delete(col._id); return n })
        }
    }
    async function deleteCollection(col: Collection) {
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

    // ── Footer save / AI translate ──
    async function saveFooter() {
        setFooterSaving(true)
        try {
            const res = await fetch('/api/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(footerForm) })
            if (res.ok) toast.success('Đã lưu Footer!')
            else toast.error('Lỗi lưu Footer')
        } finally { setFooterSaving(false) }
    }
    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 10, color: 'var(--color-gray-text)' }}>
            <Loader2Icon size={18} className="animate-spin" />
            <span style={{ fontSize: 14 }}>Đang tải cài đặt...</span>
        </div>
    )

    return (
        <div style={{ padding: '28px 24px' }}>

            {/* Page header */}
            <div className="dh-page-header" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--color-indigo-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <SettingsIcon size={19} style={{ color: 'var(--color-indigo)' }} />
                    </div>
                    <div>
                        <h1 className="dh-page-title">Cài đặt</h1>
                        <p className="dh-page-desc">Quản lý cấu hình hệ thống và tích hợp</p>
                    </div>
                </div>
            </div>

            {/* Main grid: left nav + right content */}
            <div className="settings-layout">

                {/* ── Left navigation panel ── */}
                <div className="dh-card settings-nav-panel">

                    <NavGroup title="Hệ thống" />
                    {FIXED_TABS.map(({ id, label, icon }) => (
                        <NavItem key={id} label={label} icon={icon} active={activeTab === id} onClick={() => setActiveTab(id)} />
                    ))}
                    <NavItem label="Footer" icon={FootprintsIcon} active={activeTab === 'footer'} onClick={() => setActiveTab('footer')} />

                    {collections.length > 0 && (
                        <>
                            <div style={{ margin: '8px 14px', borderTop: '1px solid var(--color-gray-border)' }} />
                            <NavGroup title="Danh mục" />
                            {collections.map((col) => (
                                <div key={col._id} style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingRight: 4 }}>
                                    <NavItem
                                        label={col.name}
                                        icon={col.important ? LockIcon : DatabaseIcon}
                                        active={activeTab === col._id}
                                        onClick={() => handleColTabClick(col._id)}
                                        warning={col.important}
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ position: 'absolute', right: 8, padding: 4, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-gray-text)', opacity: 0, transition: 'opacity 0.15s' }}
                                                className="col-menu-btn"
                                            >
                                                <MoreVerticalIcon size={13} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem onClick={() => { handleColTabClick(col._id); requirePassword(col, () => setRenameCol(col)) }}>
                                                <PencilIcon className="size-4 mr-2" />Đổi tên
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => toggleImportant(col)}>
                                                {col.important
                                                    ? <><LockIcon className="size-4 mr-2 text-amber-500" />Bỏ bảo vệ</>
                                                    : <><StarIcon className="size-4 mr-2" />Đánh dấu quan trọng</>}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => deleteCollection(col)}>
                                                <Trash2Icon className="size-4 mr-2" />Xóa danh mục
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </>
                    )}

                    <div style={{ margin: '8px 14px 12px', borderTop: '1px solid var(--color-gray-border)' }} />
                    <div style={{ padding: '0 10px 12px' }}>
                        <button onClick={() => setShowCreate(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 12px', borderRadius: 8, border: '1.5px dashed var(--color-gray-border)', background: 'transparent', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--color-indigo)', transition: 'all 0.15s' }}
                            className="add-col-btn">
                            <PlusIcon size={14} />Thêm danh mục
                        </button>
                    </div>
                </div>

                {/* ── Right content panel ── */}
                <div className="settings-content">

                    {/* Fixed settings tabs */}
                    {isFixed && activeFixed && (
                        <div className="dh-card">
                            <div className="dh-card-header">
                                <div>
                                    <h2 className="dh-card-title">{activeFixed.label}</h2>
                                    <p style={{ fontSize: 12, color: 'var(--color-gray-text)', margin: '2px 0 0', fontWeight: 400 }}>{activeFixed.desc}</p>
                                </div>
                                <span style={{ fontSize: 11, color: 'var(--color-gray-text)', display: 'flex', alignItems: 'center', gap: 4, opacity: 0.6 }}>
                                    Nhấp đúp để chỉnh sửa
                                </span>
                            </div>
                            <SettingsTable
                                rows={activeFixed.rows}
                                values={data[activeFixed.id as FixedId]}
                                onRowSaved={(key, val) => handleRowSaved(activeFixed.id as FixedId, key, val)}
                            />
                        </div>
                    )}

                    {/* Footer tab */}
                    {activeTab === 'footer' && (() => {
                        const IC = 'w-full h-9 rounded-lg border border-[#E5E8ED] bg-white px-3 text-sm focus:outline-none focus:border-[var(--color-indigo)] focus:ring-2 focus:ring-[var(--color-indigo)]/10'
                        const FF = footerForm
                        const setFF = setFooterForm

                        function MLInput({ label, fKey, multi = false }: { label: string; fKey: keyof FooterForm; multi?: boolean }) {
                            const val = FF[fKey] as MultiLang
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                    <label className="dh-label" style={{ fontSize: 12 }}>
                                        {label}
                                        <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--color-gray-text)', marginLeft: 6, opacity: 0.6 }}>
                                            {LOCALE_META[footerLang].flag} {LOCALE_META[footerLang].short}
                                        </span>
                                    </label>
                                    {multi
                                        ? <textarea value={val[footerLang] ?? ''} rows={2}
                                            className={IC.replace('h-9', '') + ' py-2 resize-none'}
                                            onChange={e => setFF(f => ({ ...f, [fKey]: { ...val, [footerLang]: e.target.value } }))} />
                                        : <input value={val[footerLang] ?? ''} className={IC}
                                            onChange={e => setFF(f => ({ ...f, [fKey]: { ...val, [footerLang]: e.target.value } }))} />}
                                </div>
                            )
                        }

                        return (
                            <div className="dh-card">
                                {/* Card header */}
                                <div className="dh-card-header">
                                    <div>
                                        <h2 className="dh-card-title">Footer</h2>
                                        <p style={{ fontSize: 12, color: 'var(--color-gray-text)', margin: '2px 0 0', fontWeight: 400 }}>Nội dung footer hiển thị trên tất cả trang</p>
                                    </div>
                                    <button onClick={saveFooter} disabled={footerSaving} className="dh-btn dh-btn-sm dh-btn-primary">
                                        {footerSaving ? <Loader2Icon size={12} className="animate-spin" /> : <SaveIcon size={12} />}Lưu Footer
                                    </button>
                                </div>

                                <div className="dh-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    {/* Lang tabs */}
                                    <div style={{ display: 'flex', gap: 3, padding: 4, background: 'var(--color-gray-light)', borderRadius: 10, width: 'fit-content' }}>
                                        {ADMIN_LOCALES.map(l => (
                                            <button key={l} type="button" onClick={() => setFooterLang(l)}
                                                style={{
                                                    padding: '5px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
                                                    fontSize: 12, fontWeight: 700,
                                                    background: footerLang === l ? '#fff' : 'transparent',
                                                    color: footerLang === l ? 'var(--color-navy-deep)' : 'var(--color-gray-text)',
                                                    boxShadow: footerLang === l ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                                    transition: 'all 0.12s',
                                                }}>
                                                {LOCALE_META[l].flag} {LOCALE_META[l].short}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Sections */}
                                    <FooterSection title="Thương hiệu">
                                        <MLInput label="Tên công ty" fKey="companyName" />
                                        <MLInput label="Bản quyền (Copyright)" fKey="copyright" />
                                    </FooterSection>

                                    <FooterSection title="Nhãn điều hướng">
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
                                            <MLInput label="Giới thiệu"  fKey="navAbout"    />
                                            <MLInput label="Dịch vụ"     fKey="navServices" />
                                            <MLInput label="Tuyển dụng"  fKey="navCareers"  />
                                            <MLInput label="Blog"        fKey="navBlog"     />
                                            <MLInput label="Liên hệ"     fKey="navContact"  />
                                        </div>
                                    </FooterSection>

                                    <FooterSection title="Dịch vụ">
                                        <MLInput label="Tiêu đề cột dịch vụ" fKey="servicesHeading" />
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                            <MLInput label="Dịch vụ 1" fKey="service1" />
                                            <MLInput label="Dịch vụ 2" fKey="service2" />
                                            <MLInput label="Dịch vụ 3" fKey="service3" />
                                            <MLInput label="Dịch vụ 4" fKey="service4" />
                                        </div>
                                    </FooterSection>

                                    <FooterSection title="Địa điểm & Nhãn liên hệ">
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                                            <MLInput label="Nhãn trụ sở"          fKey="locationHeading" />
                                            <MLInput label="Thành phố"             fKey="locationCity"    />
                                            <MLInput label="Nhãn Điện thoại"       fKey="phoneLabel"      />
                                            <MLInput label="Nhãn Email"            fKey="emailLabel"      />
                                            <MLInput label="Nhãn Người đại diện"   fKey="legalRepLabel"   />
                                        </div>
                                    </FooterSection>
                                </div>
                            </div>
                        )
                    })()}

                    {/* Collection tab */}
                    {activeCol && (
                        <div className="dh-card">
                            <div className="dh-card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    {activeCol.important
                                        ? <LockIcon size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
                                        : <DatabaseIcon size={16} style={{ color: 'var(--color-indigo)', flexShrink: 0 }} />}
                                    <div>
                                        <h2 className="dh-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {activeCol.name}
                                            {activeCol.important && (
                                                <span className="dh-badge dh-badge-yellow" style={{ fontSize: 10 }}>Quan trọng</span>
                                            )}
                                        </h2>
                                        {activeCol.description && (
                                            <p style={{ fontSize: 12, color: 'var(--color-gray-text)', margin: '2px 0 0', fontWeight: 400 }}>{activeCol.description}</p>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => requirePassword(activeCol, () => setRenameCol(activeCol))} className="dh-btn dh-btn-sm dh-btn-secondary">
                                    <PencilIcon size={13} />Sửa danh mục
                                </button>
                            </div>
                            <div className="dh-card-body">
                                <CollectionTable
                                    col={activeCol}
                                    isUnlocked={unlockedIds.has(activeCol._id)}
                                    onRequirePassword={(onSuccess) => requirePassword(activeCol, onSuccess)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Dialogs */}
            <CreateCollectionDialog open={showCreate} onOpenChange={setShowCreate}
                onCreated={(col) => { setCollections((p) => [...p, col]); setActiveTab(col._id) }} />
            {renameCol && (
                <RenameDialog col={renameCol} open={!!renameCol}
                    onOpenChange={(v) => { if (!v) setRenameCol(null) }}
                    onRenamed={(updated) => setCollections((p) => p.map((c) => c._id === updated._id ? updated : c))} />
            )}
            {pwModal && (
                <PasswordModal open={!!pwModal} onOpenChange={(v) => { if (!v) setPwModal(null) }}
                    collectionName={pwModal.col.name}
                    onSuccess={() => unlockAndRun(pwModal.col, pwModal.onSuccess)} />
            )}

            <style>{`
                .settings-layout { display: grid; grid-template-columns: 220px 1fr; gap: 20px; align-items: start; }
                .settings-nav-panel { padding: 10px 6px; }
                .settings-nav-item:hover { background: var(--color-gray-light) !important; color: var(--color-navy-deep) !important; }
                .col-menu-btn { position: absolute; right: 8px; }
                .settings-nav-panel:hover .col-menu-btn { opacity: 0.5 !important; }
                .col-menu-btn:hover { opacity: 1 !important; background: var(--color-gray-light); }
                .add-col-btn:hover { border-color: var(--color-indigo) !important; background: var(--color-indigo-pale) !important; }
                @media (max-width: 860px) { .settings-layout { grid-template-columns: 1fr; } .settings-nav-panel { display: flex; flex-wrap: wrap; gap: 4px; padding: 8px; } }
            `}</style>
        </div>
    )
}

// ─── Footer section wrapper ────────────────────────────────────────────────────

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ borderRadius: 10, border: '1px solid var(--color-gray-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-gray-light)', borderBottom: '1px solid var(--color-gray-border)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gray-text)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>{title}</p>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {children}
            </div>
        </div>
    )
}
