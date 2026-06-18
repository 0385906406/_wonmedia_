'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ImageIcon, InfoIcon, ClockIcon, HeartIcon, BriefcaseIcon,
  SaveIcon, Loader2Icon, SparklesIcon,
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
  servicesItems: { title: ML; desc: ML }[]
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
  { title: emptyMultiLang(), desc: emptyMultiLang() },
  { title: emptyMultiLang(), desc: emptyMultiLang() },
  { title: emptyMultiLang(), desc: emptyMultiLang() },
  { title: emptyMultiLang(), desc: emptyMultiLang() },
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

async function aiTranslate(fields: { title?: string; excerpt?: string; content?: string }) {
  const res = await fetch('/api/ai/translate', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields, targetLocales: ['en', 'ko', 'ja', 'zh'] }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Lỗi AI')
  return data.translations as Record<string, { title: string; excerpt: string; content: string }>
}

function applyAI(base: ML, translations: Record<string, { title?: string; excerpt?: string; content?: string }>, field: 'title' | 'excerpt' | 'content'): ML {
  const result = { ...base }
  for (const [lc, t] of Object.entries(translations)) {
    if (t[field]) result[lc as LocaleKey] = t[field]!
  }
  return result
}

interface TabProps {
  form: AboutForm
  setForm: React.Dispatch<React.SetStateAction<AboutForm>>
  lang: LocaleKey; setLang: (l: LocaleKey) => void
  saving: boolean; onSave: () => void
  onAI: (msg: string, type: 'success' | 'error') => void
}

function BannerTab({ form, setForm, lang, setLang, saving, onSave, onAI }: TabProps) {
  const [tring, setTring] = useState(false)
  async function translate() {
    setTring(true)
    try {
      const t = await aiTranslate({ title: form.bannerTitle.vi, excerpt: form.bannerSubtitle.vi })
      setForm(f => ({
        ...f,
        bannerTitle:    applyAI(f.bannerTitle,    t, 'title'),
        bannerSubtitle: applyAI(f.bannerSubtitle,  t, 'excerpt'),
      }))
      onAI('Đã dịch Banner!', 'success')
    } catch (e) { onAI(String(e), 'error') } finally { setTring(false) }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ marginBottom: 4 }}>
        <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Banner trang giới thiệu</h3>
        <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Ảnh nền + tiêu đề hiển thị trên cùng trang</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <LangTabs active={lang} onChange={setLang} />
        <button onClick={translate} disabled={tring} className="dh-btn dh-btn-secondary dh-btn-sm gap-2">
          {tring ? <Loader2Icon size={13} className="animate-spin" /> : <SparklesIcon size={13} />}AI Dịch
        </button>
      </div>
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

function AboutTab({ form, setForm, lang, setLang, saving, onSave, onAI }: TabProps) {
  const [tring, setTring] = useState(false)
  async function translate() {
    setTring(true)
    try {
      const t = await aiTranslate({
        title: `${form.aboutTitleLine1.vi} ${form.aboutTitleHighlight.vi}`,
        excerpt: `${form.aboutDesc1Prefix.vi} ${form.aboutDesc1Year.vi} ${form.aboutDesc1Suffix.vi}`,
        content: form.aboutDesc2.vi,
      })
      setForm(f => ({
        ...f,
        aboutDesc2:       applyAI(f.aboutDesc2,       t, 'content'),
        aboutDesc1Suffix: applyAI(f.aboutDesc1Suffix, t, 'excerpt'),
      }))
      onAI('Đã dịch phần Giới thiệu!', 'success')
    } catch (e) { onAI(String(e), 'error') } finally { setTring(false) }
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Phần giới thiệu công ty</h3>
        <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>Layout 2 cột: ảnh team + nội dung mô tả</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <LangTabs active={lang} onChange={setLang} />
        <button onClick={translate} disabled={tring} className="dh-btn dh-btn-secondary dh-btn-sm gap-2">
          {tring ? <Loader2Icon size={13} className="animate-spin" /> : <SparklesIcon size={13} />}AI Dịch
        </button>
      </div>
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

function TimelineTab({ form, setForm, lang, setLang, saving, onSave, onAI }: TabProps) {
  const [tring, setTring] = useState<number | null>(null)

  async function translateMilestone(idx: number) {
    setTring(idx)
    try {
      const m = form.timelineMilestones[idx]
      const t = await aiTranslate({ title: m.title.vi, excerpt: m.line1.vi, content: m.line2.vi })
      setForm(f => {
        const ms = [...f.timelineMilestones]
        ms[idx] = {
          title: applyAI(ms[idx].title, t, 'title'),
          line1: applyAI(ms[idx].line1, t, 'excerpt'),
          line2: applyAI(ms[idx].line2, t, 'content'),
        }
        return { ...f, timelineMilestones: ms }
      })
      onAI(`Đã dịch mốc ${idx + 1}!`, 'success')
    } catch (e) { onAI(String(e), 'error') } finally { setTring(null) }
  }

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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gray-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mốc {i + 1}</span>
              <button onClick={() => translateMilestone(i)} disabled={tring === i} className="dh-btn dh-btn-secondary dh-btn-sm gap-2" style={{ height: 28, fontSize: 11 }}>
                {tring === i ? <Loader2Icon size={11} className="animate-spin" /> : <SparklesIcon size={11} />}AI Dịch
              </button>
            </div>
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

function WhyUsTab({ form, setForm, lang, setLang, saving, onSave, onAI }: TabProps) {
  const [tring, setTring] = useState<number | null>(null)

  async function translateReason(idx: number) {
    setTring(idx)
    try {
      const r = form.whyUsReasons[idx]
      const t = await aiTranslate({ title: r.title.vi, content: r.desc.vi })
      setForm(f => {
        const rs = [...f.whyUsReasons]
        rs[idx] = { title: applyAI(rs[idx].title, t, 'title'), desc: applyAI(rs[idx].desc, t, 'content') }
        return { ...f, whyUsReasons: rs }
      })
      onAI(`Đã dịch lý do ${idx + 1}!`, 'success')
    } catch (e) { onAI(String(e), 'error') } finally { setTring(null) }
  }

  function updateReason(idx: number, field: 'title' | 'desc', v: ML) {
    setForm(f => {
      const rs = [...f.whyUsReasons]
      rs[idx] = { ...rs[idx], [field]: v }
      return { ...f, whyUsReasons: rs }
    })
  }

  const LABELS = ['Đội ngũ chuyên nghiệp', 'Con người là yếu tố quyết định', 'Tập thể thống nhất', 'Không ngừng thay đổi']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Tại sao chọn chúng tôi</h3>
        <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>4 lý do hiển thị dạng grid xen kẽ với hình ảnh</p>
      </div>
      <LangTabs active={lang} onChange={setLang} />
      <Field label="Tiêu đề section" value={form.whyUsHeading} onChange={v => setForm(f => ({ ...f, whyUsHeading: v }))} lang={lang} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {form.whyUsReasons.map((r, i) => (
          <div key={i} style={{ borderRadius: 10, border: '1px solid var(--color-gray-border)', padding: 16, background: 'white', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gray-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>#{i + 1} · {LABELS[i]}</span>
              <button onClick={() => translateReason(i)} disabled={tring === i} className="dh-btn dh-btn-secondary dh-btn-sm gap-2" style={{ height: 28, fontSize: 11 }}>
                {tring === i ? <Loader2Icon size={11} className="animate-spin" /> : <SparklesIcon size={11} />}AI Dịch
              </button>
            </div>
            <Field label="Tiêu đề" value={r.title} onChange={v => updateReason(i, 'title', v)} lang={lang} />
            <Field label="Mô tả" value={r.desc} onChange={v => updateReason(i, 'desc', v)} lang={lang} multi rows={4} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onSave} disabled={saving} className="dh-btn dh-btn-primary gap-2">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu &ldquo;Tại sao chọn&rdquo;
        </button>
      </div>
    </div>
  )
}

function ServicesTab({ form, setForm, lang, setLang, saving, onSave, onAI }: TabProps) {
  const [tring, setTring] = useState<number | null>(null)

  async function translateService(idx: number) {
    setTring(idx)
    try {
      const s = form.servicesItems[idx]
      const t = await aiTranslate({ title: s.title.vi, content: s.desc.vi })
      setForm(f => {
        const ss = [...f.servicesItems]
        ss[idx] = { title: applyAI(ss[idx].title, t, 'title'), desc: applyAI(ss[idx].desc, t, 'content') }
        return { ...f, servicesItems: ss }
      })
      onAI(`Đã dịch dịch vụ ${idx + 1}!`, 'success')
    } catch (e) { onAI(String(e), 'error') } finally { setTring(null) }
  }

  function updateService(idx: number, field: 'title' | 'desc', v: ML) {
    setForm(f => {
      const ss = [...f.servicesItems]
      ss[idx] = { ...ss[idx], [field]: v }
      return { ...f, servicesItems: ss }
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h3 style={{ fontWeight: 600, color: 'var(--color-navy-deep)', fontSize: 14 }}>Dịch vụ của chúng tôi</h3>
        <p style={{ fontSize: 12, color: 'var(--color-gray-text)', marginTop: 2 }}>4 dịch vụ hiển thị dạng card 2 cột với hình ảnh</p>
      </div>
      <LangTabs active={lang} onChange={setLang} />
      <Field label="Tiêu đề section" value={form.servicesHeading} onChange={v => setForm(f => ({ ...f, servicesHeading: v }))} lang={lang} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {form.servicesItems.map((s, i) => (
          <div key={i} style={{ borderRadius: 10, border: '1px solid var(--color-gray-border)', padding: 16, background: 'white', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-gray-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dịch vụ {i + 1}</span>
              <button onClick={() => translateService(i)} disabled={tring === i} className="dh-btn dh-btn-secondary dh-btn-sm gap-2" style={{ height: 28, fontSize: 11 }}>
                {tring === i ? <Loader2Icon size={11} className="animate-spin" /> : <SparklesIcon size={11} />}AI Dịch
              </button>
            </div>
            <Field label="Tên dịch vụ" value={s.title} onChange={v => updateService(i, 'title', v)} lang={lang} />
            <Field label="Mô tả" value={s.desc} onChange={v => updateService(i, 'desc', v)} lang={lang} multi rows={4} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onSave} disabled={saving} className="dh-btn dh-btn-primary gap-2">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu Dịch vụ
        </button>
      </div>
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
  const { success: toastOk, error: toastErr } = useToast()
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
            whyUsReasons: r.data.whyUsReasons?.length === 4
              ? r.data.whyUsReasons
              : DEFAULT_WHY.map((def: typeof DEFAULT_WHY[0], i: number) => r.data.whyUsReasons?.[i] ?? def),
            servicesItems: r.data.servicesItems?.length === 4
              ? r.data.servicesItems
              : DEFAULT_SERVICES.map((def: typeof DEFAULT_SERVICES[0], i: number) => r.data.servicesItems?.[i] ?? def),
          }))
        }
      })
      .catch(() => toastErr('Không tải được nội dung trang Giới thiệu'))
      .finally(() => setLoading(false))
  }, [toastErr])

  async function save() {
    setSaving(true)
    try {
      const res  = await fetch('/api/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) toastOk('Đã lưu trang Giới thiệu!')
      else toastErr(data.error ?? 'Lỗi lưu dữ liệu')
    } catch { toastErr('Lỗi kết nối')
    } finally { setSaving(false) }
  }

  const tabProps: TabProps = { form, setForm, lang, setLang, saving, onSave: save, onAI: (m, t) => t === 'success' ? toastOk(m) : toastErr(m) }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256, gap: 8, color: 'var(--color-gray-text)' }}>
      <Loader2Icon size={20} className="animate-spin" />Đang tải dữ liệu...
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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

      {/* Tab card */}
      <div className="dh-card" style={{ overflow: 'hidden', padding: 0 }}>
        {/* Tab bar */}
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
