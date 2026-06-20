'use client'

import { useEffect, useState } from 'react'
import {
    GlobeIcon, LayoutIcon, DatabaseIcon, LockIcon, StarIcon,
    MoreVerticalIcon, PencilIcon, Trash2Icon, FootprintsIcon,
    SaveIcon, Loader2Icon, SettingsIcon, PhoneIcon, MailIcon,
    MapPinIcon, HashIcon, TypeIcon, ListIcon, NavigationIcon,
    UploadIcon, ImageIcon, CheckIcon, Share2Icon, LinkIcon,
} from 'lucide-react'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ADMIN_LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'
import {
    CollectionTable, RenameDialog, PasswordModal, CreateCollectionDialog,
    type Collection,
} from './collections-tab'
import { useToast } from '@/components/admin/toast-provider'

interface SettingsData { general: Record<string, string>; header: Record<string, string> }

interface FooterForm {
    companyName: MultiLang; brandDesc: MultiLang; copyright: MultiLang
    navAbout: MultiLang; navServices: MultiLang; navCareers: MultiLang; navBlog: MultiLang; navContact: MultiLang
    servicesHeading: MultiLang; service1: MultiLang; service2: MultiLang; service3: MultiLang; service4: MultiLang
    locationHeading: MultiLang; locationCity: MultiLang
    phone: string; hotline: string; email: string; zalo: string
    facebookUrl: string; youtubeUrl: string; tiktokUrl: string
}
function emptyFooter(): FooterForm {
    return {
        companyName: emptyMultiLang(), brandDesc: emptyMultiLang(), copyright: emptyMultiLang(),
        navAbout: emptyMultiLang(), navServices: emptyMultiLang(), navCareers: emptyMultiLang(),
        navBlog: emptyMultiLang(), navContact: emptyMultiLang(),
        servicesHeading: emptyMultiLang(), service1: emptyMultiLang(), service2: emptyMultiLang(),
        service3: emptyMultiLang(), service4: emptyMultiLang(),
        locationHeading: emptyMultiLang(), locationCity: emptyMultiLang(),
        phone: '', hotline: '', email: '', zalo: '',
        facebookUrl: '', youtubeUrl: '', tiktokUrl: '',
    }
}

const FIXED_IDS = ['general', 'header', 'footer']

export default function SettingsPage() {
    const toast = useToast()
    const [activeTab, setActiveTab]     = useState<string>('general')
    const [settingsData, setSettingsData] = useState<SettingsData>({ general: {}, header: {} })
    const [settingsSaving, setSettingsSaving] = useState(false)
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading]         = useState(true)

    const [footerForm, setFooterForm]     = useState<FooterForm>(emptyFooter)
    const [footerLang, setFooterLang]     = useState<LocaleKey>('vi')
    const [footerTab, setFooterTab]       = useState<string>('brand')
    const [footerSaving, setFooterSaving] = useState(false)

    const [createOpen, setCreateOpen]   = useState(false)
    const [renameCol, setRenameCol]     = useState<Collection | null>(null)
    const [pwModal, setPwModal]         = useState<{ col: Collection; onSuccess: () => void } | null>(null)
    const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        Promise.all([
            fetch('/api/settings').then(r => r.json()),
            fetch('/api/collections').then(r => r.json()),
            fetch('/api/footer').then(r => r.json()),
        ]).then(([sRes, cRes, fRes]) => {
            if (sRes.data) setSettingsData({ general: sRes.data.general ?? {}, header: sRes.data.header ?? {} })
            if (cRes.data) setCollections(cRes.data)
            if (fRes.data) setFooterForm(f => ({ ...f, ...fRes.data }))
        }).finally(() => setLoading(false))
    }, [])

    async function saveSettings(group: 'general' | 'header', overrides?: Record<string, string>) {
        setSettingsSaving(true)
        try {
            const data = overrides ? { ...settingsData[group], ...overrides } : settingsData[group]
            const res = await fetch('/api/settings', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [group]: data }),
            })
            if ((await res.json()).success) toast.success('Đã lưu!')
            else toast.error('Lưu thất bại')
        } finally { setSettingsSaving(false) }
    }

    async function saveFooter() {
        setFooterSaving(true)
        try {
            const res = await fetch('/api/footer', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(footerForm) })
            if (res.ok) toast.success('Đã lưu Footer!')
            else toast.error('Lỗi lưu Footer')
        } finally { setFooterSaving(false) }
    }

    function requirePassword(col: Collection, onSuccess: () => void) {
        if (!col.important || unlockedIds.has(col._id)) { onSuccess(); return }
        setPwModal({ col, onSuccess })
    }
    function unlockAndRun(col: Collection, action: () => void) {
        setUnlockedIds(s => new Set([...s, col._id]))
        action(); setPwModal(null)
    }
    async function toggleImportant(col: Collection) {
        const next = !col.important
        const res  = await fetch(`/api/collections/${col._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ important: next }) })
        if ((await res.json()).success) {
            setCollections(p => p.map(c => c._id === col._id ? { ...c, important: next } : c))
            if (next) setUnlockedIds(s => { const n = new Set(s); n.delete(col._id); return n })
        }
    }
    async function deleteCollection(col: Collection) {
        requirePassword(col, async () => {
            if (!confirm(`Xóa danh mục "${col.name}"? Tất cả dữ liệu sẽ bị xóa.`)) return
            await fetch(`/api/collections/${col._id}`, { method: 'DELETE' })
            setCollections(p => {
                const next = p.filter(c => c._id !== col._id)
                if (activeTab === col._id) setActiveTab(next[0]?._id ?? 'general')
                return next
            })
        })
    }

    const activeCol   = collections.find(c => c._id === activeTab) ?? null
    const isFixed     = FIXED_IDS.includes(activeTab)

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

                {/* ── Sidebar ── */}
                <aside className="s-sidebar">
                    <p className="s-sidebar-label">Hệ thống</p>
                    <SideItem icon={GlobeIcon}      label="Thông tin cơ bản" active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
                    <SideItem icon={LayoutIcon}     label="Header & Logo"    active={activeTab === 'header'}  onClick={() => setActiveTab('header')} />
                    <SideItem icon={FootprintsIcon} label="Footer"           active={activeTab === 'footer'}  onClick={() => setActiveTab('footer')} />

                    <>
                        <div className="s-divider" />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px 2px' }}>
                            <p className="s-sidebar-label" style={{ padding: 0, margin: 0 }}>Danh mục</p>
                            <button onClick={() => setCreateOpen(true)} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', color: 'rgba(255,255,255,0.75)', borderRadius: 6, padding: '3px 8px', fontSize: 18, lineHeight: 1, cursor: 'pointer' }} title="Thêm danh mục">+</button>
                        </div>
                        {collections.map(col => (
                                <div key={col._id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <SideItem
                                        icon={col.important ? LockIcon : DatabaseIcon}
                                        label={col.name}
                                        active={activeTab === col._id}
                                        onClick={() => setActiveTab(col._id)}
                                        warning={col.important}
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button onClick={e => e.stopPropagation()} className="s-col-btn">
                                                <MoreVerticalIcon size={12} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem onClick={() => requirePassword(col, () => setRenameCol(col))}>
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
                </aside>

                {/* ── Content ── */}
                <div className="s-content">

                    {/* General */}
                    {activeTab === 'general' && (
                        <SettingsCard
                            icon={<GlobeIcon size={15} style={{ color: 'var(--color-indigo)' }} />}
                            title="Thông tin cơ bản"
                            desc="Cấu hình tên, domain và email hệ thống"
                            action={
                                <button onClick={() => saveSettings('general')} disabled={settingsSaving} className="dh-btn dh-btn-sm dh-btn-primary">
                                    {settingsSaving ? <Loader2Icon size={12} className="animate-spin" /> : <SaveIcon size={12} />}
                                    Lưu
                                </button>
                            }
                        >
                            <div className="s-form-grid">
                                <FormField label="Tên portal" hint="Hiển thị trong tab trình duyệt">
                                    <input className="dh-input" value={settingsData.general.portalName ?? ''} onChange={e => setSettingsData(d => ({ ...d, general: { ...d.general, portalName: e.target.value } }))} placeholder="WON Media" />
                                </FormField>
                                <FormField label="Tagline" hint="Dòng mô tả ngắn bên dưới tên">
                                    <input className="dh-input" value={settingsData.general.tagline ?? ''} onChange={e => setSettingsData(d => ({ ...d, general: { ...d.general, tagline: e.target.value } }))} placeholder="Đơn vị phát hành âm nhạc số..." />
                                </FormField>
                                <FormField label="Domain public" hint="URL đầy đủ, bao gồm https://">
                                    <input className="dh-input" value={settingsData.general.publicDomain ?? ''} onChange={e => setSettingsData(d => ({ ...d, general: { ...d.general, publicDomain: e.target.value } }))} placeholder="https://wonmedia.vn" />
                                </FormField>
                                <FormField label="Email hệ thống" hint="Địa chỉ gửi email thông báo tự động">
                                    <input className="dh-input" type="email" value={settingsData.general.systemEmail ?? ''} onChange={e => setSettingsData(d => ({ ...d, general: { ...d.general, systemEmail: e.target.value } }))} placeholder="no-reply@wonmedia.vn" />
                                </FormField>
                            </div>
                        </SettingsCard>
                    )}

                    {/* Header */}
                    {activeTab === 'header' && (
                        <SettingsCard
                            icon={<LayoutIcon size={15} style={{ color: 'var(--color-indigo)' }} />}
                            title="Header & Logo"
                            desc="Logo, favicon và tên hiển thị trên thanh điều hướng"
                            action={
                                <button onClick={() => saveSettings('header')} disabled={settingsSaving} className="dh-btn dh-btn-sm dh-btn-primary">
                                    {settingsSaving ? <Loader2Icon size={12} className="animate-spin" /> : <SaveIcon size={12} />}
                                    Lưu
                                </button>
                            }
                        >
                            <div className="s-form-grid">
                                <FormField label="Tên hiển thị trên nav">
                                    <input className="dh-input" value={settingsData.header.navDisplayName ?? ''} onChange={e => setSettingsData(d => ({ ...d, header: { ...d.header, navDisplayName: e.target.value } }))} placeholder="WON Media" />
                                </FormField>
                                <FormField label="Logo dòng tiếng Anh">
                                    <input className="dh-input" value={settingsData.header.logoEn ?? ''} onChange={e => setSettingsData(d => ({ ...d, header: { ...d.header, logoEn: e.target.value } }))} placeholder="WON Media" />
                                </FormField>
                                <FormField label="Logo dòng tiếng Việt">
                                    <input className="dh-input" value={settingsData.header.logoVi ?? ''} onChange={e => setSettingsData(d => ({ ...d, header: { ...d.header, logoVi: e.target.value } }))} placeholder="Truyền thông WON" />
                                </FormField>
                            </div>

                            <div style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: 20, marginTop: 4 }}>
                                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-navy-deep)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>Hình ảnh</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <ImageUploadField
                                        label="Logo hình ảnh"
                                        hint="PNG / SVG / WebP, nền trong suốt. Tối đa 2MB."
                                        value={settingsData.header.logoImageUrl ?? ''}
                                        accept=".png,.svg,.jpg,.jpeg,.webp"
                                        uploadField="logoImageUrl"
                                        onChange={v => setSettingsData(d => ({ ...d, header: { ...d.header, logoImageUrl: v } }))}
                                        onAutoSave={url => saveSettings('header', { logoImageUrl: url })}
                                    />
                                    <ImageUploadField
                                        label="Favicon"
                                        hint="ICO / PNG / SVG — 32×32px"
                                        value={settingsData.header.faviconUrl ?? ''}
                                        accept=".ico,.png,.svg"
                                        uploadField="faviconUrl"
                                        onChange={v => setSettingsData(d => ({ ...d, header: { ...d.header, faviconUrl: v } }))}
                                        onAutoSave={url => saveSettings('header', { faviconUrl: url })}
                                    />
                                </div>
                            </div>
                        </SettingsCard>
                    )}

                    {/* Footer */}
                    {activeTab === 'footer' && (
                        <SettingsCard
                            icon={<FootprintsIcon size={15} style={{ color: 'var(--color-indigo)' }} />}
                            title="Footer"
                            desc="Nội dung hiển thị ở cuối tất cả các trang"
                            action={
                                <button onClick={saveFooter} disabled={footerSaving} className="dh-btn dh-btn-sm dh-btn-primary">
                                    {footerSaving ? <Loader2Icon size={12} className="animate-spin" /> : <SaveIcon size={12} />}
                                    Lưu Footer
                                </button>
                            }
                        >
                            {/* Lang + Sub-tab bar */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid var(--color-gray-border)', paddingBottom: 14, marginBottom: 20 }}>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {FOOTER_TABS.map(ft => (
                                        <button key={ft.id} onClick={() => setFooterTab(ft.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 6,
                                                padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
                                                fontWeight: footerTab === ft.id ? 700 : 500,
                                                background: footerTab === ft.id ? 'var(--color-navy-deep)' : 'var(--color-gray-light)',
                                                color: footerTab === ft.id ? '#fff' : 'var(--color-gray-text)',
                                                transition: 'all 0.15s',
                                            }}>
                                            <ft.icon size={13} />
                                            {ft.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="dh-lang-tabs" style={{ marginBottom: 0 }}>
                                    {ADMIN_LOCALES.map(l => (
                                        <button key={l} type="button" onClick={() => setFooterLang(l)} className={`dh-lang-tab${footerLang === l ? ' active' : ''}`}>
                                            <span>{LOCALE_META[l].flag}</span>
                                            {LOCALE_META[l].label}
                                            {footerLang === l && <span className="dh-lang-dot" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Footer sub-tab content */}
                            {footerTab === 'brand' && (
                                <div className="s-form-grid">
                                    <MLField label="Tên công ty" fKey="companyName" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    <MLField label="Bản quyền (Copyright)" fKey="copyright" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <MLField label="Mô tả dưới logo" fKey="brandDesc" multi form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    </div>
                                </div>
                            )}

                            {footerTab === 'nav' && (
                                <div className="s-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))' }}>
                                    <MLField label="Giới thiệu"  fKey="navAbout"    form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    <MLField label="Dịch vụ"     fKey="navServices" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    <MLField label="Tuyển dụng"  fKey="navCareers"  form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    <MLField label="Blog"        fKey="navBlog"     form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    <MLField label="Liên hệ"     fKey="navContact"  form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                </div>
                            )}

                            {footerTab === 'services' && (
                                <div className="s-form-grid">
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <MLField label="Tiêu đề cột dịch vụ" fKey="servicesHeading" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    </div>
                                    <MLField label="Dịch vụ 1" fKey="service1" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    <MLField label="Dịch vụ 2" fKey="service2" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    <MLField label="Dịch vụ 3" fKey="service3" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    <MLField label="Dịch vụ 4" fKey="service4" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                </div>
                            )}

                            {footerTab === 'location' && (
                                <div className="s-form-grid">
                                    <MLField label="Nhãn trụ sở" fKey="locationHeading" form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                    <MLField label="Thành phố"   fKey="locationCity"    form={footerForm} setForm={setFooterForm} lang={footerLang} />
                                </div>
                            )}

                            {footerTab === 'contact' && (
                                <div className="s-form-grid">
                                    {([
                                        { key: 'phone',   label: 'Số điện thoại', icon: PhoneIcon, placeholder: '+84 28 1234 5678' },
                                        { key: 'hotline', label: 'Hotline',        icon: PhoneIcon, placeholder: '1800 1234' },
                                        { key: 'email',   label: 'Email',          icon: MailIcon,  placeholder: 'contact@wonmedia.vn' },
                                        { key: 'zalo',    label: 'Zalo',           icon: HashIcon,  placeholder: '0901234567' },
                                    ] as const).map(({ key, label, icon: Ic, placeholder }) => (
                                        <FormField key={key} label={label} icon={<Ic size={12} style={{ color: 'var(--color-indigo)', opacity: 0.7 }} />}>
                                            <input
                                                className="dh-input"
                                                value={footerForm[key]}
                                                onChange={e => setFooterForm(f => ({ ...f, [key]: e.target.value }))}
                                                placeholder={placeholder}
                                            />
                                        </FormField>
                                    ))}
                                    <p style={{ gridColumn: '1 / -1', fontSize: 12, color: 'var(--color-gray-text)', background: 'var(--color-gray-light)', borderRadius: 8, padding: '10px 14px', margin: 0 }}>
                                        Các trường này dùng chung cho mọi ngôn ngữ.
                                    </p>
                                </div>
                            )}

                            {footerTab === 'social' && (
                                <div className="s-form-grid">
                                    {([
                                        { key: 'facebookUrl', label: 'Facebook URL', placeholder: 'https://www.facebook.com/wonmediavn' },
                                        { key: 'youtubeUrl',  label: 'YouTube URL',  placeholder: 'https://www.youtube.com/@wonmedia' },
                                        { key: 'tiktokUrl',   label: 'TikTok URL',   placeholder: 'https://www.tiktok.com/@wonmedia' },
                                    ] as const).map(({ key, label, placeholder }) => (
                                        <FormField key={key} label={label} icon={<LinkIcon size={12} style={{ color: 'var(--color-indigo)', opacity: 0.7 }} />}>
                                            <input
                                                className="dh-input"
                                                type="url"
                                                value={footerForm[key]}
                                                onChange={e => setFooterForm(f => ({ ...f, [key]: e.target.value }))}
                                                placeholder={placeholder}
                                            />
                                        </FormField>
                                    ))}
                                    <p style={{ gridColumn: '1 / -1', fontSize: 12, color: 'var(--color-gray-text)', background: 'var(--color-gray-light)', borderRadius: 8, padding: '10px 14px', margin: 0 }}>
                                        Để trống để ẩn icon mạng xã hội tương ứng. URL phải bắt đầu bằng https://.
                                    </p>
                                </div>
                            )}
                        </SettingsCard>
                    )}

                    {/* Collections */}
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
                                        {activeCol.description && <p style={{ fontSize: 12, color: 'var(--color-gray-text)', margin: '2px 0 0', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{activeCol.description}</p>}
                                    </div>
                                </div>
                                <button onClick={() => requirePassword(activeCol, () => setRenameCol(activeCol))} className="dh-btn dh-btn-sm dh-btn-secondary">
                                    <PencilIcon size={13} />Sửa danh mục
                                </button>
                            </div>
                            <div className="dh-card-body">
                                <CollectionTable col={activeCol} isUnlocked={unlockedIds.has(activeCol._id)} onRequirePassword={onSuccess => requirePassword(activeCol, onSuccess)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CreateCollectionDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={col => { setCollections(p => [...p, col]); setActiveTab(col._id) }}
            />
            {renameCol && (
                <RenameDialog col={renameCol} open={!!renameCol}
                    onOpenChange={v => { if (!v) setRenameCol(null) }}
                    onRenamed={updated => setCollections(p => p.map(c => c._id === updated._id ? updated : c))} />
            )}
            {pwModal && (
                <PasswordModal open={!!pwModal} onOpenChange={v => { if (!v) setPwModal(null) }}
                    collectionName={pwModal.col.name}
                    onSuccess={() => unlockAndRun(pwModal.col, pwModal.onSuccess)} />
            )}

            <style>{`
                .s-layout { display: grid; grid-template-columns: 210px 1fr; gap: 20px; align-items: start; }
                .s-sidebar {
                    background: var(--gradient-g3);
                    border-radius: var(--dh-radius-card);
                    padding: 10px 8px 14px;
                    box-shadow: 0 4px 20px -6px rgba(6,35,64,0.3);
                    position: sticky; top: 76px;
                }
                .s-sidebar-label { font-size: 9px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.35); padding: 10px 10px 4px; margin: 0; font-family: var(--dh-font-mono-sans); }
                .s-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 8px 10px; }
                .s-side-item { display: flex; align-items: center; gap: 9px; width: 100%; padding: 8px 10px; border-radius: 8px; border: none; cursor: pointer; text-align: left; font-size: 13px; transition: all 0.15s; border-left: 3px solid transparent; }
                .s-side-item.active { background: rgba(255,255,255,0.12); color: #fff; font-weight: 700; border-left-color: var(--color-teal-light); }
                .s-side-item:not(.active) { background: transparent; color: rgba(255,255,255,0.65); font-weight: 500; }
                .s-side-item:not(.active):hover { background: rgba(255,255,255,0.08); color: #fff; }
                .s-col-btn { position: absolute; right: 6px; padding: 4px; border-radius: 5px; border: none; background: transparent; cursor: pointer; color: rgba(255,255,255,0.5); opacity: 0; transition: opacity 0.15s; }
                .s-sidebar:hover .s-col-btn { opacity: 0.5; }
                .s-col-btn:hover { opacity: 1 !important; background: rgba(255,255,255,0.1); }
                .s-content { display: flex; flex-direction: column; gap: 0; }
                .s-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .s-form-label { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: var(--color-navy-deep); margin-bottom: 6px; }
                .s-form-hint { font-size: 11px; color: var(--color-gray-text); margin: 3px 0 0; }
                @media (max-width: 900px) {
                    .s-layout { grid-template-columns: 1fr; }
                    .s-sidebar { position: static; display: flex; flex-wrap: wrap; gap: 4px; padding: 8px; }
                    .s-form-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 560px) { .s-form-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </div>
    )
}

const FOOTER_TABS = [
    { id: 'brand',    label: 'Thương hiệu',  icon: TypeIcon },
    { id: 'nav',      label: 'Điều hướng',   icon: NavigationIcon },
    { id: 'services', label: 'Dịch vụ',      icon: ListIcon },
    { id: 'location', label: 'Địa điểm',     icon: MapPinIcon },
    { id: 'contact',  label: 'Liên hệ',      icon: PhoneIcon },
    { id: 'social',   label: 'Mạng xã hội',  icon: Share2Icon },
]

function SideItem({ icon: Icon, label, active, onClick, warning }: {
    icon: React.ElementType; label: string; active: boolean; onClick: () => void; warning?: boolean
}) {
    return (
        <button onClick={onClick} className={`s-side-item${active ? ' active' : ''}`}>
            <Icon size={14} style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
            {warning && <LockIcon size={11} style={{ color: '#fcd34d', flexShrink: 0 }} />}
        </button>
    )
}

function SettingsCard({ icon, title, desc, action, children }: {
    icon: React.ReactNode; title: string; desc: string; action?: React.ReactNode; children: React.ReactNode
}) {
    return (
        <div className="dh-card">
            <div className="dh-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-indigo-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {icon}
                    </div>
                    <div>
                        <h2 className="dh-card-title">{title}</h2>
                        <p style={{ fontSize: 12, color: 'var(--color-gray-text)', margin: '2px 0 0', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{desc}</p>
                    </div>
                </div>
                {action}
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {children}
            </div>
        </div>
    )
}

function FormField({ label, hint, icon, children }: {
    label: string; hint?: string; icon?: React.ReactNode; children: React.ReactNode
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="s-form-label">
                {icon}{label}
            </label>
            {children}
            {hint && <p className="s-form-hint">{hint}</p>}
        </div>
    )
}

function MLField({ label, fKey, multi = false, form, setForm, lang }: {
    label: string; fKey: keyof FooterForm; multi?: boolean
    form: FooterForm; setForm: React.Dispatch<React.SetStateAction<FooterForm>>; lang: LocaleKey
}) {
    const val = form[fKey] as MultiLang
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="s-form-label">
                {label}
                <span style={{ fontFamily: 'var(--dh-font-mono-sans)', fontSize: 10, color: 'var(--color-gray-text)', marginLeft: 4, opacity: 0.55 }}>
                    {LOCALE_META[lang].flag} {LOCALE_META[lang].short}
                </span>
            </label>
            {multi
                ? <textarea value={val[lang] ?? ''} rows={3} className="dh-textarea" style={{ resize: 'none' }}
                    onChange={e => setForm(f => ({ ...f, [fKey]: { ...val, [lang]: e.target.value } }))} />
                : <input value={val[lang] ?? ''} className="dh-input"
                    onChange={e => setForm(f => ({ ...f, [fKey]: { ...val, [lang]: e.target.value } }))} />}
        </div>
    )
}

function ImageUploadField({ label, hint, value, accept, uploadField, onChange, onAutoSave }: {
    label: string; hint: string; value: string; accept: string; uploadField: string
    onChange: (v: string) => void
    onAutoSave?: (url: string) => Promise<void>
}) {
    const toast = useToast()
    const [uploading, setUploading] = useState(false)
    const [saved, setSaved]         = useState(false)

    async function handleFile(file: File) {
        setUploading(true)
        const form = new FormData(); form.append('file', file)
        try {
            const res  = await fetch(`/api/settings/upload?field=${uploadField}`, { method: 'POST', body: form })
            const json = await res.json()
            if (json.url) {
                onChange(json.url)
                await onAutoSave?.(json.url)
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
            } else {
                toast.error(json.error || 'Tải lên thất bại')
            }
        } catch {
            toast.error('Lỗi kết nối, thử lại')
        } finally { setUploading(false) }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label className="s-form-label">{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px dashed var(--color-gray-border)', background: 'var(--color-gray-light)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, border: '1px solid var(--color-gray-border)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {value
                        ? <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                        : <ImageIcon size={20} style={{ color: '#cbd5e1' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {value && <p style={{ fontSize: 11, color: 'var(--color-gray-text)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>{value}</p>}
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, border: '1px solid var(--color-gray-border)', background: '#fff', cursor: uploading ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--color-navy-deep)', opacity: uploading ? 0.6 : 1, transition: 'all 0.15s' }}>
                        {saved ? <CheckIcon size={13} style={{ color: 'var(--color-teal-dark)' }} /> : <UploadIcon size={13} />}
                        {uploading ? 'Đang tải...' : saved ? 'Đã lưu' : value ? 'Thay đổi' : 'Tải lên'}
                        <input type="file" accept={accept} className="hidden" disabled={uploading} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
                    </label>
                </div>
            </div>
            <p className="s-form-hint">{hint}</p>
        </div>
    )
}
