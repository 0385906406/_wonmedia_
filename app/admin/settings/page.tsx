'use client'

import { useEffect, useRef, useState } from 'react'
import {
    GlobeIcon, LayoutIcon, DatabaseIcon,
    LockIcon, StarIcon, MoreVerticalIcon, PencilIcon, Trash2Icon,
    FootprintsIcon, SaveIcon, Loader2Icon, SettingsIcon,
    PhoneIcon, MailIcon, MapPinIcon, HashIcon,
    TypeIcon, LinkIcon, AlignLeftIcon, ListIcon, NavigationIcon,
} from 'lucide-react'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ADMIN_LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'
import {
    CollectionTable, RenameDialog, PasswordModal,
    SettingsTable, type Collection, type SettingsRow,
} from './collections-tab'
import { useToast } from '@/components/admin/toast-provider'

const GENERAL_ROWS: SettingsRow[] = [
    { key: 'portalName',   label: 'Tên portal',      type: 'text',  group: 'general', hint: 'Hiển thị trong tab trình duyệt' },
    { key: 'tagline',      label: 'Tagline',          type: 'text',  group: 'general', hint: 'Dòng mô tả ngắn bên dưới tên portal' },
    { key: 'publicDomain', label: 'Domain public',    type: 'url',   group: 'general', hint: 'URL đầy đủ, bao gồm https://' },
    { key: 'systemEmail',  label: 'Email hệ thống',   type: 'email', group: 'general', hint: 'Địa chỉ gửi email thông báo tự động' },
]

const HEADER_ROWS: SettingsRow[] = [
    { key: 'navDisplayName', label: 'Tên hiển thị trên nav',  type: 'text',  group: 'header' },
    { key: 'logoEn',         label: 'Logo (dòng tiếng Anh)',  type: 'text',  group: 'header' },
    { key: 'logoVi',         label: 'Logo (dòng tiếng Việt)', type: 'text',  group: 'header' },
    { key: 'faviconUrl',     label: 'Favicon',                type: 'image', group: 'header', hint: 'ICO / PNG / SVG — 32×32px', imageAccept: '.ico,.png,.svg' },
    { key: 'logoImageUrl',   label: 'Logo hình ảnh',          type: 'image', group: 'header', hint: 'PNG / SVG / WebP, nền trong suốt. Tối đa 2MB.', imageAccept: '.png,.svg,.jpg,.jpeg,.webp' },
]

const FIXED_TABS = [
    { id: 'general', label: 'Thông tin cơ bản', icon: GlobeIcon,      rows: GENERAL_ROWS, desc: 'Cấu hình cơ bản của hệ thống' },
    { id: 'header',  label: 'Header & Logo',    icon: LayoutIcon,     rows: HEADER_ROWS,  desc: 'Logo, favicon và tên hiển thị trên nav' },
] as const

type FixedId = typeof FIXED_TABS[number]['id']
const FIXED_IDS = [...FIXED_TABS.map((t) => t.id), 'footer'] as string[]

interface FooterForm {
    companyName: MultiLang; brandDesc: MultiLang
    navAbout: MultiLang; navServices: MultiLang; navCareers: MultiLang; navBlog: MultiLang; navContact: MultiLang
    servicesHeading: MultiLang; service1: MultiLang; service2: MultiLang; service3: MultiLang; service4: MultiLang
    locationHeading: MultiLang; locationCity: MultiLang
    phone: string; hotline: string; email: string; zalo: string
    copyright: MultiLang
}
function emptyFooter(): FooterForm {
    return {
        companyName: emptyMultiLang(), brandDesc: emptyMultiLang(),
        navAbout: emptyMultiLang(), navServices: emptyMultiLang(), navCareers: emptyMultiLang(),
        navBlog: emptyMultiLang(), navContact: emptyMultiLang(),
        servicesHeading: emptyMultiLang(), service1: emptyMultiLang(), service2: emptyMultiLang(),
        service3: emptyMultiLang(), service4: emptyMultiLang(),
        locationHeading: emptyMultiLang(), locationCity: emptyMultiLang(),
        phone: '', hotline: '', email: '', zalo: '',
        copyright: emptyMultiLang(),
    }
}

interface SettingsData { general: Record<string, string>; header: Record<string, string> }

function NavDivider({ label }: { label: string }) {
    return (
        <div style={{ padding: '20px 14px 6px', fontSize: 9, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--dh-font-mono-sans)' }}>
            {label}
        </div>
    )
}

function NavItem({
    label, icon: Icon, active, onClick, warning, badge, extra,
}: {
    label: string; icon?: React.ElementType; active: boolean; onClick: () => void
    warning?: boolean; badge?: string; extra?: React.ReactNode
}) {
    return (
        <button onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: 9, width: '100%',
                padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                textAlign: 'left', fontSize: 13,
                fontWeight: active ? 700 : 500,
                background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                borderLeft: `3px solid ${active ? 'var(--color-teal-light)' : 'transparent'}`,
                transition: 'all 0.15s',
            }}
            className="s-nav-item"
        >
            {Icon && <Icon size={14} style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }} />}
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
            {warning && <LockIcon size={11} style={{ color: '#fcd34d', flexShrink: 0 }} />}
            {badge && (
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 100, background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)', color: active ? '#fff' : 'rgba(255,255,255,0.5)', letterSpacing: '0.5px' }}>
                    {badge}
                </span>
            )}
            {extra}
        </button>
    )
}

export default function SettingsPage() {
    const toast = useToast()
    const [activeTab, setActiveTab]     = useState<string>('general')
    const [data, setData]               = useState<SettingsData>({ general: {}, header: {} })
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading]         = useState(true)

    const [footerForm, setFooterForm]     = useState<FooterForm>(emptyFooter)
    const [footerLang, setFooterLang]     = useState<LocaleKey>('vi')
    const [footerSaving, setFooterSaving] = useState(false)

    const [renameCol, setRenameCol]     = useState<Collection | null>(null)
    const [pwModal, setPwModal]         = useState<{ col: Collection; onSuccess: () => void } | null>(null)
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

            <div className="dh-page-header" style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gradient-g3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px -4px rgba(6,35,64,0.35)' }}>
                        <SettingsIcon size={20} style={{ color: '#fff' }} />
                    </div>
                    <div>
                        <h1 className="dh-page-title">Cài đặt</h1>
                        <p className="dh-page-desc">Quản lý cấu hình hệ thống và giao diện</p>
                    </div>
                </div>
            </div>

            <div className="s-layout">

                <div className="s-nav-panel">
                    <NavDivider label="Hệ thống" />
                    {FIXED_TABS.map(({ id, label, icon }) => (
                        <NavItem key={id} label={label} icon={icon} active={activeTab === id} onClick={() => setActiveTab(id)} />
                    ))}
                    <NavItem label="Footer" icon={FootprintsIcon} active={activeTab === 'footer'} onClick={() => setActiveTab('footer')} />

                    {collections.length > 0 && (
                        <>
                            <div style={{ margin: '10px 10px', height: 1, background: 'rgba(255,255,255,0.08)' }} />
                            <NavDivider label="Danh mục" />
                            {collections.map((col) => (
                                <div key={col._id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <NavItem
                                        label={col.name}
                                        icon={col.important ? LockIcon : DatabaseIcon}
                                        active={activeTab === col._id}
                                        onClick={() => handleColTabClick(col._id)}
                                        warning={col.important}
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button onClick={(e) => e.stopPropagation()}
                                                style={{ position: 'absolute', right: 6, padding: 4, borderRadius: 5, border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', opacity: 0, transition: 'opacity 0.15s' }}
                                                className="s-col-menu">
                                                <MoreVerticalIcon size={12} />
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
                </div>

                <div className="s-content">

                    {isFixed && activeFixed && (
                        <div className="dh-card">
                            <div className="dh-card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-indigo-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <activeFixed.icon size={15} style={{ color: 'var(--color-indigo)' }} />
                                    </div>
                                    <div>
                                        <h2 className="dh-card-title">{activeFixed.label}</h2>
                                        <p style={{ fontSize: 12, color: 'var(--color-gray-text)', margin: '2px 0 0', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{activeFixed.desc}</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: 11, color: 'var(--color-gray-text)', opacity: 0.5, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    Nhấp đúp để chỉnh
                                </span>
                            </div>
                            <SettingsTable
                                rows={activeFixed.rows}
                                values={data[activeFixed.id as FixedId]}
                                onRowSaved={(key, val) => handleRowSaved(activeFixed.id as FixedId, key, val)}
                            />
                        </div>
                    )}

                    {activeTab === 'footer' && (
                        <div className="dh-card">
                            <div className="dh-card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-indigo-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <FootprintsIcon size={15} style={{ color: 'var(--color-indigo)' }} />
                                    </div>
                                    <div>
                                        <h2 className="dh-card-title">Footer</h2>
                                        <p style={{ fontSize: 12, color: 'var(--color-gray-text)', margin: '2px 0 0', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>Nội dung hiển thị ở cuối tất cả các trang</p>
                                    </div>
                                </div>
                                <button onClick={saveFooter} disabled={footerSaving} className="dh-btn dh-btn-sm dh-btn-primary">
                                    {footerSaving ? <Loader2Icon size={12} className="animate-spin" /> : <SaveIcon size={12} />}
                                    {footerSaving ? 'Đang lưu...' : 'Lưu Footer'}
                                </button>
                            </div>

                            <div className="dh-lang-tabs">
                                {ADMIN_LOCALES.map(l => (
                                    <button key={l} type="button" onClick={() => setFooterLang(l)} className={`dh-lang-tab${footerLang === l ? ' active' : ''}`}>
                                        <span>{LOCALE_META[l].flag}</span>
                                        {LOCALE_META[l].label}
                                        {footerLang === l && <span className="dh-lang-dot" />}
                                    </button>
                                ))}
                            </div>

                            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                                <FSection icon={<TypeIcon size={14} />} color="indigo" title="Thương hiệu" desc="Tên cty, mô tả logo và dòng bản quyền">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <MLInput label="Tên công ty" fKey="companyName" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                        <MLInput label="Bản quyền (Copyright)" fKey="copyright" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    </div>
                                    <MLInput label="Mô tả dưới logo" fKey="brandDesc" multi form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                </FSection>

                                <FSection icon={<NavigationIcon size={14} />} color="teal" title="Điều hướng" desc="Nhãn các liên kết trong cột Khám phá">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10 }}>
                                        <MLInput label="Giới thiệu"  fKey="navAbout"    form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                        <MLInput label="Dịch vụ"     fKey="navServices" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                        <MLInput label="Tuyển dụng"  fKey="navCareers"  form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                        <MLInput label="Blog"        fKey="navBlog"     form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                        <MLInput label="Liên hệ"     fKey="navContact"  form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    </div>
                                </FSection>

                                <FSection icon={<ListIcon size={14} />} color="navy" title="Dịch vụ" desc="Cột dịch vụ hiển thị trong footer">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <MLInput label="Tiêu đề cột" fKey="servicesHeading" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                        <div />
                                        <MLInput label="Dịch vụ 1" fKey="service1" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                        <MLInput label="Dịch vụ 2" fKey="service2" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                        <MLInput label="Dịch vụ 3" fKey="service3" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                        <MLInput label="Dịch vụ 4" fKey="service4" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    </div>
                                </FSection>

                                <FSection icon={<MapPinIcon size={14} />} color="teal" title="Địa điểm" desc="Nhãn trụ sở / thành phố">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        <MLInput label="Nhãn trụ sở" fKey="locationHeading" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                        <MLInput label="Thành phố"   fKey="locationCity"    form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    </div>
                                </FSection>

                                <FSection icon={<PhoneIcon size={14} />} color="indigo" title="Thông tin liên hệ" desc="Các trường này dùng chung cho mọi ngôn ngữ">
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                        {([
                                            { key: 'phone',   label: 'Số điện thoại', icon: PhoneIcon,   placeholder: '+84 28 1234 5678' },
                                            { key: 'hotline', label: 'Hotline',        icon: PhoneIcon,   placeholder: '1800 1234' },
                                            { key: 'email',   label: 'Email',          icon: MailIcon,    placeholder: 'contact@wonmedia.vn' },
                                            { key: 'zalo',    label: 'Zalo',           icon: HashIcon,    placeholder: '0901234567' },
                                        ] as const).map(({ key, label, icon: Ic, placeholder }) => (
                                            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                                <label className="dh-label" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                    <Ic size={11} style={{ color: 'var(--color-indigo)', opacity: 0.7 }} />
                                                    {label}
                                                </label>
                                                <input
                                                    value={footerForm[key]}
                                                    onChange={e => setFooterForm(f => ({ ...f, [key]: e.target.value }))}
                                                    placeholder={placeholder}
                                                    className="dh-input"
                                                    style={{ height: 36 }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </FSection>

                            </div>
                        </div>
                    )}

                    {activeCol && (
                        <div className="dh-card">
                            <div className="dh-card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: activeCol.important ? 'var(--color-yellow-light)' : 'var(--color-indigo-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {activeCol.important
                                            ? <LockIcon size={15} style={{ color: '#b45309' }} />
                                            : <DatabaseIcon size={15} style={{ color: 'var(--color-indigo)' }} />}
                                    </div>
                                    <div>
                                        <h2 className="dh-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {activeCol.name}
                                            {activeCol.important && <span className="dh-badge dh-badge-yellow" style={{ fontSize: 10 }}>Quan trọng</span>}
                                        </h2>
                                        {activeCol.description && (
                                            <p style={{ fontSize: 12, color: 'var(--color-gray-text)', margin: '2px 0 0', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{activeCol.description}</p>
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
                .s-layout { display: grid; grid-template-columns: 230px 1fr; gap: 20px; align-items: start; }
                .s-nav-panel {
                    background: var(--gradient-g3);
                    border-radius: var(--dh-radius-card);
                    padding: 8px 6px 12px;
                    box-shadow: 0 4px 20px -6px rgba(6,35,64,0.3);
                    position: sticky; top: 76px;
                }
                .s-content { display: flex; flex-direction: column; gap: 0; }
                .s-nav-item:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
                .s-nav-panel:hover .s-col-menu { opacity: 0.5 !important; }
                .s-col-menu:hover { opacity: 1 !important; background: rgba(255,255,255,0.1); }
                @media (max-width: 860px) {
                    .s-layout { grid-template-columns: 1fr; }
                    .s-nav-panel { position: static; display: flex; flex-wrap: wrap; gap: 4px; padding: 8px; }
                }
            `}</style>
        </div>
    )
}

const SECTION_COLORS = {
    indigo: { bg: 'var(--color-indigo-pale)', fg: 'var(--color-indigo)', bar: 'var(--color-indigo)' },
    teal:   { bg: 'var(--color-teal-pale)',   fg: 'var(--color-teal-dark)', bar: 'var(--color-teal)' },
    navy:   { bg: 'var(--color-navy-pale)',   fg: 'var(--color-navy)',      bar: 'var(--color-navy)' },
}

function FSection({ icon, color, title, desc, children }: {
    icon: React.ReactNode; color: keyof typeof SECTION_COLORS
    title: string; desc?: string; children: React.ReactNode
}) {
    const c = SECTION_COLORS[color]
    return (
        <div style={{ borderRadius: 10, border: '1px solid var(--color-gray-border)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'var(--color-gray-light)', borderBottom: '1px solid var(--color-gray-border)', borderLeft: `3px solid ${c.bar}` }}>
                <span style={{ width: 26, height: 26, borderRadius: 7, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: c.fg }}>
                    {icon}
                </span>
                <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{title}</p>
                    {desc && <p style={{ margin: 0, fontSize: 11, color: 'var(--color-gray-text)', marginTop: 1 }}>{desc}</p>}
                </div>
            </div>
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {children}
            </div>
        </div>
    )
}

function MLInput({ label, fKey, multi = false, form, setForm, lang }: {
    label: string; fKey: keyof FooterForm; multi?: boolean
    form: FooterForm; setForm: React.Dispatch<React.SetStateAction<FooterForm>>; lang: LocaleKey
}) {
    const val = form[fKey] as MultiLang
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label className="dh-label" style={{ fontSize: 12 }}>
                {label}
                <span style={{ fontFamily: 'var(--dh-font-mono-sans)', fontSize: 10, color: 'var(--color-gray-text)', marginLeft: 6, opacity: 0.55 }}>
                    {LOCALE_META[lang].flag} {LOCALE_META[lang].short}
                </span>
            </label>
            {multi
                ? <textarea value={val[lang] ?? ''} rows={2} className="dh-textarea" style={{ resize: 'none' }}
                    onChange={e => setForm(f => ({ ...f, [fKey]: { ...val, [lang]: e.target.value } }))} />
                : <input value={val[lang] ?? ''} className="dh-input" style={{ height: 36 }}
                    onChange={e => setForm(f => ({ ...f, [fKey]: { ...val, [lang]: e.target.value } }))} />}
        </div>
    )
}
