import { notFound } from 'next/navigation'
import { hasLocale } from '../dictionaries'
import { AboutClient, type AboutT } from '@/components/client/about/AboutClient'
import type { LocaleKey } from '@/types/multilang'
import { connectDB } from '@/lib/mongodb'
import AboutConfig from '@/models/AboutConfig'

type Cfg = Record<string, unknown>

function ml(cfg: Cfg, key: string, lang: string): string {
  const field = cfg[key] as Record<string, string> | undefined
  return field?.[lang] || field?.['vi'] || ''
}

function mlArr<T>(cfg: Cfg, key: string): T[] {
  const v = cfg[key]
  return Array.isArray(v) && v.length > 0 ? (v as T[]) : []
}

async function loadAbout(lang: LocaleKey): Promise<AboutT> {
  await connectDB()
  const raw = await AboutConfig.findOne({ key: 'global' }).lean()
  const c = (raw ?? {}) as Cfg

  type MilestoneRaw = { title: Record<string,string>; line1: Record<string,string>; line2: Record<string,string> }
  type ReasonRaw    = { title: Record<string,string>; desc:  Record<string,string> }

  const milestones = mlArr<MilestoneRaw>(c, 'timelineMilestones').map(m => ({
    title:   m.title?.[lang]   || m.title?.vi   || '',
    content: [
      m.line1?.[lang] || m.line1?.vi || '',
      m.line2?.[lang] || m.line2?.vi || '',
    ] as [string, string],
  }))

  const reasons = mlArr<ReasonRaw>(c, 'whyUsReasons').map(r => ({
    title: r.title?.[lang] || r.title?.vi || '',
    desc:  r.desc?.[lang]  || r.desc?.vi  || '',
  }))

  const services = mlArr<ReasonRaw>(c, 'servicesItems').map(s => ({
    title: s.title?.[lang] || s.title?.vi || '',
    desc:  s.desc?.[lang]  || s.desc?.vi  || '',
  }))

  return {
    banner: {
      subtitle: ml(c, 'bannerSubtitle', lang),
      title:    ml(c, 'bannerTitle',    lang),
    },
    about: {
      label:          ml(c, 'aboutLabel',          lang),
      titleLine1:     ml(c, 'aboutTitleLine1',     lang),
      titleHighlight: ml(c, 'aboutTitleHighlight', lang),
      description1: {
        prefix: ml(c, 'aboutDesc1Prefix', lang),
        year:   ml(c, 'aboutDesc1Year',   lang),
        suffix: ml(c, 'aboutDesc1Suffix', lang),
      },
      description2: ml(c, 'aboutDesc2',   lang),
      experience: {
        value: ml(c, 'aboutExpValue', lang),
        text:  ml(c, 'aboutExpText',  lang),
      },
      button: ml(c, 'aboutButton', lang),
    },
    timeline: { heading: ml(c, 'timelineHeading', lang), milestones },
    whyUs:    { heading: ml(c, 'whyUsHeading',    lang), reasons   },
    services: { heading: ml(c, 'servicesHeading', lang), items: services },
  }
}

export default async function GioiThieuPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = await loadAbout(lang as LocaleKey)
  return <AboutClient t={t} />
}
