'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  ImageIcon, InfoIcon, ClockIcon, HeartIcon, BriefcaseIcon,
  SaveIcon, Loader2Icon, SparklesIcon,
} from 'lucide-react'
import { useToast } from '@/components/admin/toast-provider'
import { LOCALES, LOCALE_META, type LocaleKey, type MultiLang, emptyMultiLang } from '@/types/multilang'

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── Defaults ─────────────────────────────────────────────────────────────────
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

// ─── Shared input className ───────────────────────────────────────────────────
const IC = 'h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/10 text-sm'
const TA = 'rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/10 text-sm resize-none'

// ─── Sub: Toast ───────────────────────────────────────────────────────────────

// ─── Sub: LangTabs ────────────────────────────────────────────────────────────
function LangTabs({ active, onChange }: { active: LocaleKey; onChange: (l: LocaleKey) => void }) {
  return (
    <div className="flex gap-1 p-1 bg-[#F1F5F9] rounded-lg w-fit flex-wrap">
      {LOCALES.map(l => (
        <button key={l} onClick={() => onChange(l)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${active === l ? 'bg-white shadow text-[#0f172a]' : 'text-[#64748b] hover:text-[#0f172a]'}`}
        >
          {LOCALE_META[l].flag} {LOCALE_META[l].short}
        </button>
      ))}
    </div>
  )
}

// ─── Sub: Field components ────────────────────────────────────────────────────
function Field({ label, value, onChange, lang, multi, rows = 3 }: {
  label: string; value: ML; onChange: (v: ML) => void
  lang: LocaleKey; multi?: boolean; rows?: number
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-[#374151]">
        {label} <span className="font-mono text-xs text-[#94a3b8]">({LOCALE_META[lang].flag} {LOCALE_META[lang].short})</span>
      </Label>
      {multi ? (
        <Textarea value={value[lang] ?? ''} onChange={e => onChange({ ...value, [lang]: e.target.value })}
          rows={rows} className={TA + ' min-h-[80px]'} placeholder={`${label} (${LOCALE_META[lang].short})...`} />
      ) : (
        <Input value={value[lang] ?? ''} onChange={e => onChange({ ...value, [lang]: e.target.value })}
          className={IC} placeholder={`${label} (${LOCALE_META[lang].short})...`} />
      )}
    </div>
  )
}

// ─── Sub: Section header ──────────────────────────────────────────────────────
function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-[#0f172a]">{title}</h3>
      <p className="text-sm text-[#64748b] mt-0.5">{desc}</p>
    </div>
  )
}

// ─── Sub: AI translate helper ─────────────────────────────────────────────────
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

// ─── TAB: Banner ─────────────────────────────────────────────────────────────
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
    <div className="space-y-5">
      <SectionHeader title="Banner trang giới thiệu" desc="Ảnh nền + tiêu đề hiển thị trên cùng trang" />
      <div className="flex items-center gap-3 flex-wrap">
        <LangTabs active={lang} onChange={setLang} />
        <Button variant="outline" size="sm" onClick={translate} disabled={tring}
          className="gap-2 border-[#E5E8ED] text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300">
          {tring ? <Loader2Icon size={13} className="animate-spin" /> : <SparklesIcon size={13} />}AI Dịch
        </Button>
      </div>
      <Field label="Dòng phụ (subtitle)" value={form.bannerSubtitle} onChange={v => setForm(f => ({ ...f, bannerSubtitle: v }))} lang={lang} />
      <Field label="Tiêu đề chính (title)" value={form.bannerTitle} onChange={v => setForm(f => ({ ...f, bannerTitle: v }))} lang={lang} />

      {/* Preview */}
      <div className="rounded-xl overflow-hidden relative h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-end p-6 mt-2">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url('/banners/banner.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10">
          <p className="text-green-400 text-sm">{form.bannerSubtitle[lang] || 'Dòng phụ...'}</p>
          <h1 className="text-white text-2xl font-bold uppercase">{form.bannerTitle[lang] || 'Tiêu đề...'}</h1>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu Banner
        </Button>
      </div>
    </div>
  )
}

// ─── TAB: About section ───────────────────────────────────────────────────────
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
        aboutDesc2:    applyAI(f.aboutDesc2, t, 'content'),
        aboutDesc1Suffix: applyAI(f.aboutDesc1Suffix, t, 'excerpt'),
      }))
      onAI('Đã dịch phần Giới thiệu!', 'success')
    } catch (e) { onAI(String(e), 'error') } finally { setTring(false) }
  }
  return (
    <div className="space-y-5">
      <SectionHeader title="Phần giới thiệu công ty" desc="Layout 2 cột: ảnh team + nội dung mô tả" />
      <div className="flex items-center gap-3 flex-wrap">
        <LangTabs active={lang} onChange={setLang} />
        <Button variant="outline" size="sm" onClick={translate} disabled={tring}
          className="gap-2 border-[#E5E8ED] text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300">
          {tring ? <Loader2Icon size={13} className="animate-spin" /> : <SparklesIcon size={13} />}AI Dịch
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nhãn section" value={form.aboutLabel} onChange={v => setForm(f => ({ ...f, aboutLabel: v }))} lang={lang} />
        <Field label="Tiêu đề dòng 1" value={form.aboutTitleLine1} onChange={v => setForm(f => ({ ...f, aboutTitleLine1: v }))} lang={lang} />
        <Field label="Tiêu đề highlight (xanh)" value={form.aboutTitleHighlight} onChange={v => setForm(f => ({ ...f, aboutTitleHighlight: v }))} lang={lang} />
      </div>
      <div className="rounded-xl border border-[#E5E8ED] p-4 space-y-3 bg-[#F8FAFC]">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">Đoạn mô tả 1</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Tiền tố" value={form.aboutDesc1Prefix} onChange={v => setForm(f => ({ ...f, aboutDesc1Prefix: v }))} lang={lang} />
          <Field label="Năm" value={form.aboutDesc1Year} onChange={v => setForm(f => ({ ...f, aboutDesc1Year: v }))} lang={lang} />
          <Field label="Hậu tố" value={form.aboutDesc1Suffix} onChange={v => setForm(f => ({ ...f, aboutDesc1Suffix: v }))} lang={lang} />
        </div>
      </div>
      <Field label="Đoạn mô tả 2" value={form.aboutDesc2} onChange={v => setForm(f => ({ ...f, aboutDesc2: v }))} lang={lang} multi rows={3} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Số năm kinh nghiệm (VD: 03+)" value={form.aboutExpValue} onChange={v => setForm(f => ({ ...f, aboutExpValue: v }))} lang={lang} />
        <Field label="Mô tả kinh nghiệm" value={form.aboutExpText} onChange={v => setForm(f => ({ ...f, aboutExpText: v }))} lang={lang} />
        <Field label="Text nút CTA" value={form.aboutButton} onChange={v => setForm(f => ({ ...f, aboutButton: v }))} lang={lang} />
      </div>
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu phần Giới thiệu
        </Button>
      </div>
    </div>
  )
}

// ─── TAB: Timeline ────────────────────────────────────────────────────────────
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
    <div className="space-y-5">
      <SectionHeader title="Chặng đường phát triển" desc="6 mốc thời gian hiển thị theo dạng timeline xen kẽ" />
      <div className="flex items-center gap-3">
        <LangTabs active={lang} onChange={setLang} />
      </div>
      <Field label="Tiêu đề section" value={form.timelineHeading} onChange={v => setForm(f => ({ ...f, timelineHeading: v }))} lang={lang} />

      <div className="space-y-4">
        {form.timelineMilestones.map((m, i) => (
          <div key={i} className="rounded-xl border border-[#E5E8ED] p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748b] uppercase tracking-wide">Mốc {i + 1}</span>
              <Button variant="outline" size="sm" onClick={() => translateMilestone(i)} disabled={tring === i}
                className="gap-1.5 border-[#E5E8ED] text-indigo-600 hover:bg-indigo-50 text-xs h-7">
                {tring === i ? <Loader2Icon size={11} className="animate-spin" /> : <SparklesIcon size={11} />}AI Dịch
              </Button>
            </div>
            <Field label="Tiêu đề mốc" value={m.title} onChange={v => updateMilestone(i, 'title', v)} lang={lang} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Nội dung dòng 1" value={m.line1} onChange={v => updateMilestone(i, 'line1', v)} lang={lang} />
              <Field label="Nội dung dòng 2" value={m.line2} onChange={v => updateMilestone(i, 'line2', v)} lang={lang} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu Timeline
        </Button>
      </div>
    </div>
  )
}

// ─── TAB: Why Us ──────────────────────────────────────────────────────────────
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
    <div className="space-y-5">
      <SectionHeader title="Tại sao chọn chúng tôi" desc="4 lý do hiển thị dạng grid xen kẽ với hình ảnh" />
      <LangTabs active={lang} onChange={setLang} />
      <Field label="Tiêu đề section" value={form.whyUsHeading} onChange={v => setForm(f => ({ ...f, whyUsHeading: v }))} lang={lang} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {form.whyUsReasons.map((r, i) => (
          <div key={i} className="rounded-xl border border-[#E5E8ED] p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748b] uppercase tracking-wide">#{i + 1} · {LABELS[i]}</span>
              <Button variant="outline" size="sm" onClick={() => translateReason(i)} disabled={tring === i}
                className="gap-1.5 border-[#E5E8ED] text-indigo-600 hover:bg-indigo-50 text-xs h-7">
                {tring === i ? <Loader2Icon size={11} className="animate-spin" /> : <SparklesIcon size={11} />}AI Dịch
              </Button>
            </div>
            <Field label="Tiêu đề" value={r.title} onChange={v => updateReason(i, 'title', v)} lang={lang} />
            <Field label="Mô tả" value={r.desc} onChange={v => updateReason(i, 'desc', v)} lang={lang} multi rows={4} />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu "Tại sao chọn"
        </Button>
      </div>
    </div>
  )
}

// ─── TAB: Services ────────────────────────────────────────────────────────────
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
    <div className="space-y-5">
      <SectionHeader title="Dịch vụ của chúng tôi" desc="4 dịch vụ hiển thị dạng card 2 cột với hình ảnh" />
      <LangTabs active={lang} onChange={setLang} />
      <Field label="Tiêu đề section" value={form.servicesHeading} onChange={v => setForm(f => ({ ...f, servicesHeading: v }))} lang={lang} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {form.servicesItems.map((s, i) => (
          <div key={i} className="rounded-xl border border-[#E5E8ED] p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748b] uppercase tracking-wide">Dịch vụ {i + 1}</span>
              <Button variant="outline" size="sm" onClick={() => translateService(i)} disabled={tring === i}
                className="gap-1.5 border-[#E5E8ED] text-indigo-600 hover:bg-indigo-50 text-xs h-7">
                {tring === i ? <Loader2Icon size={11} className="animate-spin" /> : <SparklesIcon size={11} />}AI Dịch
              </Button>
            </div>
            <Field label="Tên dịch vụ" value={s.title} onChange={v => updateService(i, 'title', v)} lang={lang} />
            <Field label="Mô tả" value={s.desc} onChange={v => updateService(i, 'desc', v)} lang={lang} multi rows={4} />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={saving} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          {saving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}Lưu Dịch vụ
        </Button>
      </div>
    </div>
  )
}

// ─── Tab props type ───────────────────────────────────────────────────────────
interface TabProps {
  form: AboutForm
  setForm: React.Dispatch<React.SetStateAction<AboutForm>>
  lang: LocaleKey
  setLang: (l: LocaleKey) => void
  saving: boolean
  onSave: () => void
  onAI: (msg: string, type: 'success' | 'error') => void
}

// ─── Main page ────────────────────────────────────────────────────────────────
const TABS = [
  { value: 'banner',    label: 'Banner',       icon: ImageIcon    },
  { value: 'about',     label: 'Giới thiệu',   icon: InfoIcon     },
  { value: 'timeline',  label: 'Lịch sử',      icon: ClockIcon    },
  { value: 'whyus',     label: 'Tại sao chọn', icon: HeartIcon    },
  { value: 'services',  label: 'Dịch vụ',      icon: BriefcaseIcon},
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
    <div className="flex items-center justify-center h-64 gap-2 text-[#64748b]">
      <Loader2Icon size={20} className="animate-spin" />Đang tải dữ liệu...
    </div>
  )

  return (
    <div className="p-6 max-w-12xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
          <InfoIcon size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#0f172a]">Trang Giới thiệu</h1>
          <p className="text-xs text-[#64748b] mt-0.5">Chỉnh sửa nội dung · Đa ngôn ngữ VI / EN / KO / JA / ZH</p>
        </div>
      </div>

      {/* Tab card */}
      <div className="rounded-2xl bg-white border border-[#e5e8ed] shadow-sm overflow-hidden">

        {/* Tab bar — pure div, guaranteed full width */}
        <div className="flex w-full border-b border-[#e5e8ed]">
          {TABS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => router.push(`/admin/gioi-thieu?tab=${value}`)}
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
