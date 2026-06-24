'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ImageIcon, InfoIcon, ClockIcon, HeartIcon, BriefcaseIcon,
  SaveIcon, Loader2Icon, PlusIcon, Trash2Icon, Link2Icon, CheckCircle2Icon, PencilIcon,
} from 'lucide-react'
import { useToast } from '@/components/admin/toast-provider'
import { ADMIN_LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'

type ML = MultiLang

interface AboutForm {
  bannerSubtitle: ML; bannerTitle: ML
  aboutLabel: ML; aboutTitleLine1: ML; aboutTitleHighlight: ML
  aboutDesc1Prefix: ML; aboutDesc1Year: ML; aboutDesc1Suffix: ML
  aboutDesc2: ML; aboutExpValue: ML; aboutExpText: ML; aboutButton: ML
  timelineHeading: ML
  timelineMilestones: { title: ML; line1: ML; line2: ML }[]
  whyUsHeading: ML
  whyUsReasons: { title: ML; desc: ML }[]
  servicesHeading: ML
  servicesItems: { title: ML; desc: ML; link: string }[]
}

const DEFAULT_MILESTONES = [
  { title: { vi:'THÀNH LẬP CÔNG TY', en:'COMPANY ESTABLISHMENT', ko:'회사 설립', ja:'会社設立', zh:'公司成立' }, line1: emptyMultiLang(), line2: emptyMultiLang() },
  { title: { vi:'MỞ RỘNG HỆ THỐNG',  en:'SYSTEM EXPANSION',      ko:'시스템 확장', ja:'システム拡大', zh:'系统扩展'  }, line1: emptyMultiLang(), line2: emptyMultiLang() },
  { title: { vi:'BẢO VỆ BẢN QUYỀN',  en:'COPYRIGHT PROTECTION',  ko:'저작권 보호', ja:'著作権保護', zh:'版权保护'  }, line1: emptyMultiLang(), line2: emptyMultiLang() },
  { title: { vi:'MỞ RỘNG QUỐC TẾ',   en:'INTERNATIONAL EXPANSION', ko:'국제 확장', ja:'国際展開', zh:'国际拓展' }, line1: emptyMultiLang(), line2: emptyMultiLang() },
  { title: { vi:'MỤC TIÊU YOUTUBE',   en:'YOUTUBE GOALS',         ko:'YouTube 목표', ja:'YouTube目標', zh:'YouTube目标' }, line1: emptyMultiLang(), line2: emptyMultiLang() },
  { title: { vi:'ĐỊNH VỊ THƯƠNG HIỆU', en:'BRAND POSITIONING',    ko:'브랜드 포지셔닝', ja:'ブランド定位', zh:'品牌定位' }, line1: emptyMultiLang(), line2: emptyMultiLang() },
]

const DEFAULT_WHY = [
  { title: emptyMultiLang(), desc: emptyMultiLang() },
  { title: emptyMultiLang(), desc: emptyMultiLang() },
  { title: emptyMultiLang(), desc: emptyMultiLang() },
  { title: emptyMultiLang(), desc: emptyMultiLang() },
]

const DEFAULT_SERVICES = [
  { title: emptyMultiLang(), desc: emptyMultiLang(), link: '' },
  { title: emptyMultiLang(), desc: emptyMultiLang(), link: '' },
  { title: emptyMultiLang(), desc: emptyMultiLang(), link: '' },
  { title: emptyMultiLang(), desc: emptyMultiLang(), link: '' },
]

function defaultForm(): AboutForm {
  return {
    bannerSubtitle: emptyMultiLang(), bannerTitle: emptyMultiLang(),
    aboutLabel: emptyMultiLang(), aboutTitleLine1: emptyMultiLang(), aboutTitleHighlight: emptyMultiLang(),
    aboutDesc1Prefix: emptyMultiLang(), aboutDesc1Year: emptyMultiLang(), aboutDesc1Suffix: emptyMultiLang(),
    aboutDesc2: emptyMultiLang(), aboutExpValue: emptyMultiLang(), aboutExpText: emptyMultiLang(), aboutButton: emptyMultiLang(),
    timelineHeading: emptyMultiLang(),
    timelineMilestones: DEFAULT_MILESTONES.map(m => ({ ...m })),
    whyUsHeading: emptyMultiLang(),
    whyUsReasons: DEFAULT_WHY.map(r => ({ ...r })),
    servicesHeading: emptyMultiLang(),
    servicesItems: DEFAULT_SERVICES.map(s => ({ ...s })),
  }
}

function LangTabs({ active, onChange }: { active: LocaleKey; onChange: (l: LocaleKey) => void }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--color-gray-light)', borderRadius: 8, width: 'fit-content', flexWrap: 'wrap' }}>
      {ADMIN_LOCALES.map(l => (
        <button key={l} onClick={() => onChange(l)} style={{
          padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
          border: 'none', cursor: 'pointer', transition: 'all 0.15s',
          background: active === l ? 'white' : 'transparent',
          color: active === l ? 'var(--color-navy-deep)' : 'var(--color-gray-text)',
          boxShadow: active === l ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        }}>
          {LOCALE_META[l].flag} {LOCALE_META[l].short}
        </button>
      ))}
    </div>
  )
}

function Field({ label, value, onChange, lang, multi, rows = 3 }: {
  label: string; value: ML; onChange: (v: ML) => void
  lang: LocaleKey; multi?: boolean; rows?: number
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label className="dh-label">
        {label} <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94a3b8' }}>({LOCALE_META[lang].flag} {LOCALE_META[lang].short})</span>
      </label>
      {multi ? (
        <textarea value={value[lang] ?? ''} onChange={e => onChange({ ...value, [lang]: e.target.value })}
          rows={rows} className="dh-input" style={{ minHeight: 80, resize: 'none' }}
          placeholder={`${label} (${LOCALE_META[lang].short})...`} />
      ) : (
        <input value={value[lang] ?? ''} onChange={e => onChange({ ...value, [lang]: e.target.value })}
          className="dh-input" placeholder={`${label} (${LOCALE_META[lang].short})...`} />
      )}
    </div>
  )
}

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 10, border: '1px solid var(--color-gray-border)', padding: 16, background: 'var(--color-gray-light)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gray-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</p>
      {children}
    </div>
  )
}

interface TabProps {
  form: AboutForm
  setForm: React.Dispatch<React.SetStateAction<AboutForm>>
  lang: LocaleKey; setLang: (l: LocaleKey) => void
  saving: boolean; onSave: () => void
}

function BannerTab({ form, setForm, lang, setLang, saving, onSave }: TabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ marginBottom: 4 }}>
        <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Banner trang giới thiệu</h3>
        <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Ảnh nền + tiêu đề hiển thị trên cùng trang</p>
      </div>
      <LangTabs active={lang} onChange={setLang} />
      <Field label="Dòng phụ (subtitle)" value={form.bannerSubtitle} onChange={v => setForm(f => ({ ...f, bannerSubtitle: v }))} lang={lang} />
      <Field label="Tiêu đề chính (title)" value={form.bannerTitle} onChange={v => setForm(f => ({ ...f, bannerTitle: v }))} lang={lang} />
      <div style={{ borderRadius: 10, overflow: 'hidden', position: 'relative', height: 160, background: 'linear-gradient(135deg, #1e293b, #0f172a)', display: 'flex', alignItems: 'flex-end', padding: 24, marginTop: 4 }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, backgroundImage: "url('/banners/banner.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'var(--color-teal)', fontSize: 13 }}>{form.bannerSubtitle[lang] || 'Dòng phụ...'}</p>
          <h1 style={{ color: 'white', fontSize: 22, fontWeight: 700, textTransform: 'uppercase' }}>{form.bannerTitle[lang] || 'Tiêu đề...'}</h1>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onSave} disabled={saving} className="dh-btn dh-btn-primary gap-2">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu Banner
        </button>
      </div>
    </div>
  )
}

function AboutTab({ form, setForm, lang, setLang, saving, onSave }: TabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Phần giới thiệu công ty</h3>
        <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Layout 2 cột: ảnh team + nội dung mô tả</p>
      </div>
      <LangTabs active={lang} onChange={setLang} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Nhãn section" value={form.aboutLabel} onChange={v => setForm(f => ({ ...f, aboutLabel: v }))} lang={lang} />
        <Field label="Tiêu đề dòng 1" value={form.aboutTitleLine1} onChange={v => setForm(f => ({ ...f, aboutTitleLine1: v }))} lang={lang} />
        <Field label="Tiêu đề highlight (xanh)" value={form.aboutTitleHighlight} onChange={v => setForm(f => ({ ...f, aboutTitleHighlight: v }))} lang={lang} />
      </div>
      <SectionBox title="Đoạn mô tả 1">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Field label="Tiền tố" value={form.aboutDesc1Prefix} onChange={v => setForm(f => ({ ...f, aboutDesc1Prefix: v }))} lang={lang} />
          <Field label="Năm" value={form.aboutDesc1Year} onChange={v => setForm(f => ({ ...f, aboutDesc1Year: v }))} lang={lang} />
          <Field label="Hậu tố" value={form.aboutDesc1Suffix} onChange={v => setForm(f => ({ ...f, aboutDesc1Suffix: v }))} lang={lang} />
        </div>
      </SectionBox>
      <Field label="Đoạn mô tả 2" value={form.aboutDesc2} onChange={v => setForm(f => ({ ...f, aboutDesc2: v }))} lang={lang} multi rows={3} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Số năm kinh nghiệm (VD: 03+)" value={form.aboutExpValue} onChange={v => setForm(f => ({ ...f, aboutExpValue: v }))} lang={lang} />
        <Field label="Mô tả kinh nghiệm" value={form.aboutExpText} onChange={v => setForm(f => ({ ...f, aboutExpText: v }))} lang={lang} />
        <Field label="Text nút CTA" value={form.aboutButton} onChange={v => setForm(f => ({ ...f, aboutButton: v }))} lang={lang} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onSave} disabled={saving} className="dh-btn dh-btn-primary gap-2">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu phần Giới thiệu
        </button>
      </div>
    </div>
  )
}

function TimelineTab({ form, setForm, lang, setLang, saving, onSave }: TabProps) {
  function updateMilestone(idx: number, field: 'title' | 'line1' | 'line2', v: ML) {
    setForm(f => {
      const ms = [...f.timelineMilestones]
      ms[idx] = { ...ms[idx], [field]: v }
      return { ...f, timelineMilestones: ms }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Chặng đường phát triển</h3>
        <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>6 mốc thời gian hiển thị theo dạng timeline xen kẽ</p>
      </div>
      <LangTabs active={lang} onChange={setLang} />
      <Field label="Tiêu đề section" value={form.timelineHeading} onChange={v => setForm(f => ({ ...f, timelineHeading: v }))} lang={lang} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {form.timelineMilestones.map((m, i) => (
          <div key={i} style={{ borderRadius: 10, border: '1px solid var(--color-gray-border)', padding: 16, background: 'white', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gray-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mốc {i + 1}</span>
            <Field label="Tiêu đề mốc" value={m.title} onChange={v => updateMilestone(i, 'title', v)} lang={lang} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Nội dung dòng 1" value={m.line1} onChange={v => updateMilestone(i, 'line1', v)} lang={lang} />
              <Field label="Nội dung dòng 2" value={m.line2} onChange={v => updateMilestone(i, 'line2', v)} lang={lang} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onSave} disabled={saving} className="dh-btn dh-btn-primary gap-2">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu Timeline
        </button>
      </div>
    </div>
  )
}

function WhyUsTab({ form, setForm, lang, setLang, saving, onSave }: TabProps) {
  function updateReason(idx: number, field: 'title' | 'desc', v: ML) {
    setForm(f => {
      const rs = [...f.whyUsReasons]
      rs[idx] = { ...rs[idx], [field]: v }
      return { ...f, whyUsReasons: rs }
    })
  }

  function addReason() {
    setForm(f => ({ ...f, whyUsReasons: [...f.whyUsReasons, { title: emptyMultiLang(), desc: emptyMultiLang() }] }))
  }

  function removeReason(idx: number) {
    setForm(f => ({ ...f, whyUsReasons: f.whyUsReasons.filter((_, i) => i !== idx) }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Tại sao chọn chúng tôi</h3>
          <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Hiển thị dạng grid — {form.whyUsReasons.length} lý do</p>
        </div>
        <button onClick={addReason} className="dh-btn dh-btn-secondary dh-btn-sm gap-2" style={{ flexShrink: 0 }}>
          <PlusIcon size={13} />Thêm lý do
        </button>
      </div>
      <LangTabs active={lang} onChange={setLang} />
      <Field label="Tiêu đề section" value={form.whyUsHeading} onChange={v => setForm(f => ({ ...f, whyUsHeading: v }))} lang={lang} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {form.whyUsReasons.map((r, i) => (
          <div key={i} style={{ borderRadius: 10, border: '1px solid var(--color-gray-border)', padding: 16, background: 'white', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gray-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Lý do #{i + 1}</span>
              {form.whyUsReasons.length > 1 && (
                <button onClick={() => removeReason(i)} className="dh-btn dh-btn-sm gap-1" style={{ height: 28, fontSize: 11, background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '0 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Trash2Icon size={11} />
                </button>
              )}
            </div>
            <Field label="Tiêu đề" value={r.title} onChange={v => updateReason(i, 'title', v)} lang={lang} />
            <Field label="Mô tả" value={r.desc} onChange={v => updateReason(i, 'desc', v)} lang={lang} multi rows={4} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={addReason} className="dh-btn dh-btn-secondary dh-btn-sm gap-2">
          <PlusIcon size={13} />Thêm lý do
        </button>
        <button onClick={onSave} disabled={saving} className="dh-btn dh-btn-primary gap-2">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu &ldquo;Tại sao chọn&rdquo;
        </button>
      </div>
    </div>
  )
}

function ServicesTab({ form, setForm, lang, setLang, saving, onSave }: TabProps) {
  type Draft = { title: ML; desc: ML; link: string }
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [linkMode, setLinkMode] = useState<'post' | 'external'>('external')
  const [posts, setPosts] = useState<{ _id: string; slug: string; type: string; title: MultiLang }[]>([])
  const [postsLoaded, setPostsLoaded] = useState(false)
  const [postSearch, setPostSearch] = useState('')

  async function loadPosts() {
    if (postsLoaded) return
    const res = await fetch('/api/posts')
    const data = await res.json()
    if (data.data) setPosts(data.data)
    setPostsLoaded(true)
  }

  function openEdit(idx: number) {
    const s = form.servicesItems[idx]
    setEditIdx(idx); setIsNew(false)
    setDraft({ title: { ...s.title }, desc: { ...s.desc }, link: s.link || '' })
    const lk = s.link || ''
    setLinkMode(lk && !lk.startsWith('http') ? 'post' : 'external')
    if (lk && !lk.startsWith('http')) loadPosts()
  }

  function openNew() {
    setEditIdx(form.servicesItems.length); setIsNew(true)
    setDraft({ title: emptyMultiLang(), desc: emptyMultiLang(), link: '' })
    setLinkMode('external')
    setPostSearch('')
  }

  function closeModal() { setEditIdx(null); setDraft(null) }

  function applyDraft() {
    if (!draft || editIdx === null) return
    setForm(f => {
      const ss = [...f.servicesItems]
      if (isNew) ss.push({ title: draft.title, desc: draft.desc, link: draft.link })
      else ss[editIdx] = { title: draft.title, desc: draft.desc, link: draft.link }
      return { ...f, servicesItems: ss }
    })
    closeModal()
  }

  function removeService(idx: number) {
    if (!confirm('Xóa dịch vụ này?')) return
    setForm(f => ({ ...f, servicesItems: f.servicesItems.filter((_, i) => i !== idx) }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Dịch vụ của chúng tôi</h3>
          <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Hiển thị dạng card có hình ảnh · {form.servicesItems.length} dịch vụ</p>
        </div>
        <button onClick={openNew} className="dh-btn dh-btn-primary dh-btn-sm gap-2"><PlusIcon size={14} />Thêm dịch vụ</button>
      </div>

      <LangTabs active={lang} onChange={setLang} />
      <Field label="Tiêu đề section" value={form.servicesHeading} onChange={v => setForm(f => ({ ...f, servicesHeading: v }))} lang={lang} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {form.servicesItems.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: '1px solid var(--color-gray-border)', borderRadius: 10, background: 'white' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-navy-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'monospace', color: 'var(--color-navy)', fontWeight: 700 }}>{i + 1}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-navy-deep)', margin: 0 }}>{s.title.vi || '(Chưa có tiêu đề)'}</p>
              <p style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{s.title.en || s.desc.vi || ''}</p>
            </div>
            {s.link && <Link2Icon size={13} style={{ color: 'var(--color-teal-dark)', flexShrink: 0 }} />}
            <button className="dh-btn-icon" onClick={() => openEdit(i)}><PencilIcon size={14} /></button>
            <button className="dh-btn-icon" onClick={() => removeService(i)} style={{ color: '#ef4444' }}><Trash2Icon size={14} /></button>
          </div>
        ))}
        {form.servicesItems.length === 0 && (
          <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '32px 0' }}>Chưa có dịch vụ nào. Nhấn &ldquo;Thêm dịch vụ&rdquo; để bắt đầu.</p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onSave} disabled={saving} className="dh-btn dh-btn-primary gap-2">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu Dịch vụ
        </button>
      </div>

      {draft && editIdx !== null && (
        <div className="dh-modal-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div className="dh-modal" style={{ maxWidth: 600 }}>
            <div className="dh-modal-header">
              <h3 className="dh-modal-title">{isNew ? 'Thêm dịch vụ mới' : `Chỉnh sửa dịch vụ #${editIdx + 1}`}</h3>
            </div>
            <div className="dh-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '70vh', overflowY: 'auto' }}>
              <LangTabs active={lang} onChange={setLang} />
              <Field label="Tên dịch vụ" value={draft.title} onChange={v => setDraft(d => d ? { ...d, title: v } : d)} lang={lang} />
              <Field label="Mô tả" value={draft.desc} onChange={v => setDraft(d => d ? { ...d, desc: v } : d)} lang={lang} multi rows={4} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label className="dh-label">Link khi bấm vào (tùy chọn)</label>
                <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--color-gray-light)', borderRadius: 8, width: 'fit-content' }}>
                  {([['post', 'Bài viết'], ['external', 'Link ngoài']] as const).map(([mode, label]) => (
                    <button key={mode} type="button"
                      onClick={() => { setLinkMode(mode); setDraft(d => d ? { ...d, link: '' } : d); if (mode === 'post') loadPosts() }}
                      style={{ padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: linkMode === mode ? 'white' : 'transparent', color: linkMode === mode ? 'var(--color-navy-deep)' : 'var(--color-gray-text)', boxShadow: linkMode === mode ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>{label}
                    </button>
                  ))}
                </div>

                {linkMode === 'post' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input value={postSearch} onChange={e => setPostSearch(e.target.value)} placeholder="Tìm kiếm bài viết..." className="dh-input" />
                    <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--color-gray-border)', borderRadius: 8, background: 'white' }}>
                      {posts.filter(p => { const q = postSearch.toLowerCase(); return !q || (p.title.vi || '').toLowerCase().includes(q) || p.slug.includes(q) }).map(p => {
                        const linkVal = `bai-viet/${p.slug}`
                        const selected = draft.link === linkVal
                        return (
                          <div key={p._id} onClick={() => setDraft(d => d ? { ...d, link: linkVal } : d)}
                            style={{ padding: '9px 14px', cursor: 'pointer', fontSize: 13, borderBottom: '1px solid var(--color-gray-border)', background: selected ? 'var(--color-navy-pale)' : 'white', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.1s' }}>
                            <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600, flexShrink: 0, background: p.type === 'blog' ? 'var(--color-indigo-pale)' : 'var(--color-yellow-light)', color: p.type === 'blog' ? 'var(--color-indigo-dark)' : 'var(--color-yellow-dark)' }}>{p.type === 'blog' ? 'Blog' : 'Tuyển dụng'}</span>
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title.vi || p.slug}</span>
                            {selected && <CheckCircle2Icon size={14} style={{ color: 'var(--color-navy)', flexShrink: 0 }} />}
                          </div>
                        )
                      })}
                      {posts.length === 0 && <p style={{ padding: 16, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>{postsLoaded ? 'Không có bài viết nào' : 'Đang tải...'}</p>}
                    </div>
                    {draft.link && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--color-teal-dark)' }}>
                        <Link2Icon size={12} /><span style={{ fontFamily: 'monospace' }}>/{draft.link}</span>
                        <button type="button" onClick={() => setDraft(d => d ? { ...d, link: '' } : d)} style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>✕ Xóa</button>
                      </div>
                    )}
                  </div>
                )}

                {linkMode === 'external' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input value={draft.link || ''} onChange={e => setDraft(d => d ? { ...d, link: e.target.value } : d)} placeholder="https://..." className="dh-input" style={{ flex: 1 }} />
                      {draft.link && <button type="button" onClick={() => setDraft(d => d ? { ...d, link: '' } : d)} style={{ fontSize: 12, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>✕</button>}
                    </div>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Link mở trong tab mới. Để trống nếu không cần link.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="dh-modal-footer">
              <button onClick={closeModal} className="dh-btn dh-btn-secondary">Hủy</button>
              <button onClick={applyDraft} className="dh-btn dh-btn-primary gap-2"><SaveIcon size={14} />Áp dụng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const TABS = [
  { value: 'banner',    label: 'Banner',       icon: ImageIcon     },
  { value: 'about',     label: 'Giới thiệu',   icon: InfoIcon      },
  { value: 'timeline',  label: 'Lịch sử',      icon: ClockIcon     },
  { value: 'whyus',     label: 'Tại sao chọn', icon: HeartIcon     },
  { value: 'services',  label: 'Dịch vụ',      icon: BriefcaseIcon },
]

function GioiThieuAdminInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const tab          = searchParams.get('tab') ?? 'banner'

  const [form, setForm]   = useState<AboutForm>(defaultForm)
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [lang, setLang]       = useState<LocaleKey>('vi')

  useEffect(() => {
    fetch('/api/about')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(r => {
        if (r.data) {
          setForm(prev => ({
            ...prev,
            ...r.data,
            timelineMilestones: r.data.timelineMilestones?.length === 6
              ? r.data.timelineMilestones
              : DEFAULT_MILESTONES.map((def: typeof DEFAULT_MILESTONES[0], i: number) => r.data.timelineMilestones?.[i] ?? def),
            whyUsReasons: r.data.whyUsReasons?.length > 0
              ? r.data.whyUsReasons
              : DEFAULT_WHY.map((def: typeof DEFAULT_WHY[0]) => ({ ...def })),
            servicesItems: r.data.servicesItems?.length === 4
              ? r.data.servicesItems.map((s: typeof DEFAULT_SERVICES[0]) => ({ ...DEFAULT_SERVICES[0], ...s }))
              : DEFAULT_SERVICES.map((def: typeof DEFAULT_SERVICES[0], i: number) => ({ ...def, ...(r.data.servicesItems?.[i] ?? {}) })),
          }))
        }
      })
      .catch(() => toast.error('Không tải được nội dung trang Giới thiệu'))
      .finally(() => setLoading(false))
  }, [toast.error])

  async function save() {
    setSaving(true)
    try {
      const res  = await fetch('/api/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) toast.success('Đã lưu trang Giới thiệu!')
      else toast.error(data.error ?? 'Lỗi lưu dữ liệu')
    } catch { toast.error('Lỗi kết nối')
    } finally { setSaving(false) }
  }

  const tabProps: TabProps = { form, setForm, lang, setLang, saving, onSave: save }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256, gap: 8, color: 'var(--color-gray-text)' }}>
      <Loader2Icon size={20} className="animate-spin" />Đang tải dữ liệu...
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="dh-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-navy-pale)', color: 'var(--color-navy)' }}>
            <InfoIcon size={20} />
          </div>
          <div>
            <h1 className="dh-page-title">Trang Giới thiệu</h1>
            <p className="dh-page-desc">Chỉnh sửa nội dung · Đa ngôn ngữ VI / EN</p>
          </div>
        </div>
      </div>

      <div className="dh-card" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid var(--color-gray-border)' }}>
          {TABS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => router.push(`/admin/gioi-thieu?tab=${value}`)}
              style={{
                flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '14px 0', fontSize: 13, fontWeight: tab === value ? 600 : 500,
                border: 'none', cursor: 'pointer', transition: 'all 0.15s', background: 'transparent',
                color: tab === value ? 'var(--color-navy)' : 'var(--color-gray-text)',
                borderBottom: tab === value ? '3px solid var(--color-navy)' : '3px solid transparent',
              }}
            >
              <Icon size={15} />{label}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {tab === 'banner'   && <BannerTab   {...tabProps} />}
          {tab === 'about'    && <AboutTab    {...tabProps} />}
          {tab === 'timeline' && <TimelineTab {...tabProps} />}
          {tab === 'whyus'    && <WhyUsTab    {...tabProps} />}
          {tab === 'services' && <ServicesTab {...tabProps} />}
        </div>
      </div>
    </div>
  )
}

export default function GioiThieuAdminPage() {
  return <Suspense><GioiThieuAdminInner /></Suspense>
}
