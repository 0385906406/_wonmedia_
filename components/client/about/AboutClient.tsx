'use client'

import { motion, type Variants } from 'framer-motion'
import { useState } from 'react'
import {
  Rocket, Globe, Shield, PlayCircle, Users, Award,
  Share2, Music, Copyright, HardDrive,
  Lightbulb, Heart, Repeat, ChevronDown, ChevronUp,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AboutT {
  banner: { subtitle: string; title: string }
  about: {
    label: string; titleLine1: string; titleHighlight: string
    description1: { prefix: string; year: string; suffix: string }
    description2: string
    experience: { value: string; text: string }
    button: string
  }
  timeline: {
    heading: string
    milestones: { title: string; content: string[] }[]
  }
  whyUs: {
    heading: string
    reasons: { title: string; desc: string }[]
  }
  services: {
    heading: string
    items: { title: string; desc: string }[]
  }
}

const fadeInSide = (dir: 'left' | 'right'): Variants => ({
  hidden: { opacity: 0, x: dir === 'left' ? -80 : 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
})

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const VP = { once: false, amount: 0.25 }

// ─── Timeline data ─────────────────────────────────────────────────────────────
const TIMELINE_ICONS = [
  <Rocket key="r" className="w-6 h-6" />,
  <Users key="u" className="w-6 h-6" />,
  <Shield key="s" className="w-6 h-6" />,
  <Globe key="g" className="w-6 h-6" />,
  <PlayCircle key="y" className="w-6 h-6" />,
  <Award key="a" className="w-6 h-6" />,
]
const TIMELINE_YEARS  = ['2023', '2024', '2024', '2025', '2025', '2026']
const TIMELINE_COLORS = [
  'from-red-500 to-orange-500',
  'from-lime-500 to-green-500',
  'from-orange-500 to-yellow-500',
  'from-slate-700 to-slate-900',
  'from-rose-500 to-red-600',
  'from-indigo-500 to-purple-600',
]
const TIMELINE_SHADOWS = [
  'shadow-red-200','shadow-green-200','shadow-orange-200',
  'shadow-slate-300','shadow-rose-200','shadow-indigo-200',
]

// ─── Why Us icons ─────────────────────────────────────────────────────────────
const WHY_ICONS = [
  <Users className="w-10 h-10 text-blue-500" key="u" />,
  <Lightbulb className="w-10 h-10 text-yellow-500" key="l" />,
  <Heart className="w-10 h-10 text-red-500" key="h" />,
  <Repeat className="w-10 h-10 text-green-500" key="r" />,
]
const WHY_IMAGES = ['/team-pro.png', '/human-factor.png', '/unity.png', '/innovation.png']

// ─── Services assets ──────────────────────────────────────────────────────────
const SVC_ICONS = [
  <Share2 className="w-6 h-6" key="s" />,
  <Music className="w-6 h-6" key="m" />,
  <HardDrive className="w-6 h-6" key="h" />,
  <Copyright className="w-6 h-6" key="c" />,
]
const SVC_IMAGES = ['/services-5.png', '/services-7.png', '/services-6.png', '/services-8.png']

// ─── Section: Banner ──────────────────────────────────────────────────────────
function BannerSection({ t }: { t: AboutT['banner'] }) {
  return (
    <div className="relative w-full h-64 sm:h-[520px] overflow-hidden text-white select-none">
      <motion.div
        initial={{ scale: 1.12 }} whileInView={{ scale: 1 }} viewport={VP}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0"
        style={{ backgroundImage: "url('/banners/banner.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VP}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-black/60"
      />
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="w-10 h-[3px] bg-green-500" />
            <span className="text-lg text-gray-200">{t.subtitle}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={VP}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl font-bold uppercase leading-tight"
          >
            {t.title}
          </motion.h1>
        </div>
      </div>
    </div>
  )
}

// ─── Section: About ───────────────────────────────────────────────────────────
function AboutSection({ t }: { t: AboutT['about'] }) {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left image */}
          <motion.div
            className="lg:col-span-6 relative group"
            initial="hidden" whileInView="visible" viewport={VP}
            variants={fadeInSide('left')}
          >
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
            <div className="absolute -bottom-8 right-12 w-32 h-32 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
            <div className="relative z-10">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                <img src="/about-team.png" alt="WON Media Team" className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-900/10 to-transparent" />
              </div>
              <motion.div
                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl hidden md:block"
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={VP}
                transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-green-700">{t.experience.value}</span>
                  <div className="text-sm font-medium text-gray-500 leading-tight">{t.experience.text}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right content */}
          <motion.div
            className="lg:col-span-6"
            initial="hidden" whileInView="visible" viewport={VP}
            variants={fadeInSide('right')}
          >
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-[2px] w-8 bg-green-600" />
                <span className="text-sm font-bold tracking-[0.2em] text-green-700 uppercase">{t.label}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-8 leading-tight">
                {t.titleLine1} <br />
                <span className="text-green-700">{t.titleHighlight}</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p className="relative pl-6 border-l-4 border-green-500/30">
                  {t.description1.prefix} <span className="font-semibold text-slate-900">{t.description1.year}</span>,{t.description1.suffix}
                </p>
                <p>{t.description2}</p>
                <div className="pt-4 flex flex-wrap gap-3">
                  {['YouTube', 'Facebook', 'TikTok', 'Spotify'].map((p, i) => (
                    <motion.span
                      key={p}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
                      transition={{ delay: i * 0.1 }}
                      className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-500"
                    >
                      {p} Partner
                    </motion.span>
                  ))}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="mt-10 px-8 py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-green-200"
              >
                {t.button}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Section: Timeline ────────────────────────────────────────────────────────
function TimelineSection({ t }: { t: AboutT['timeline'] }) {
  return (
    <section className="py-16 bg-[#f6f9fe] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
            className="text-2xl md:text-4xl font-black text-[#0b2a59]"
          >
            {t.heading}
          </motion.h2>
          <div className="w-24 h-1.5 bg-green-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="relative pt-10">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-slate-200 to-transparent hidden md:block" />
          {t.milestones.map((m, idx) => {
            const isEven = idx % 2 === 0
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isEven ? 80 : -80, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }} viewport={VP}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex items-center justify-between mb-16 w-full ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}
              >
                {/* Desktop card */}
                <div className="hidden md:block w-[45%]">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 ${isEven ? 'text-left' : 'text-right'}`}
                  >
                    <h3 className={`text-xl font-extrabold mb-3 bg-gradient-to-r ${TIMELINE_COLORS[idx]} bg-clip-text text-transparent uppercase`}>
                      {m.title}
                    </h3>
                    <ul className="space-y-2">
                      {m.content.map((c, i) => (
                        <li key={i} className={`text-gray-500 text-sm flex items-start gap-2 ${isEven ? 'justify-start' : 'justify-end'}`}>
                          <span className={isEven ? 'order-2' : 'order-1'}>{c}</span>
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-gradient-to-r ${TIMELINE_COLORS[idx]} ${isEven ? 'order-1' : 'order-2'}`} />
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Center icon */}
                <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }} whileInView={{ scale: 1, rotate: 0 }} viewport={VP}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${TIMELINE_COLORS[idx]} p-1 ${TIMELINE_SHADOWS[idx]} shadow-2xl z-20 flex items-center justify-center text-white flex-col`}
                  >
                    <span className="text-xs opacity-80">{TIMELINE_ICONS[idx]}</span>
                    <span className="font-black text-sm md:text-base leading-none mt-1">{TIMELINE_YEARS[idx]}</span>
                  </motion.div>
                </div>

                {/* Mobile card */}
                <div className="w-full md:w-[45%] pl-20 md:pl-0">
                  <div className="md:hidden bg-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="font-bold mb-2 text-green-700">{m.title}</h3>
                    {m.content.map((c, i) => <p key={i} className="text-xs text-gray-500">- {c}</p>)}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Why Us ──────────────────────────────────────────────────────────
function ExpandText({ text }: { text: string }) {
  const [exp, setExp] = useState(false)
  const max = 150
  const long = text.length > max
  return (
    <div className="space-y-2">
      <p className="text-slate-600 leading-relaxed text-sm md:text-base">
        {exp ? text : `${text.slice(0, max)}${long ? '...' : ''}`}
      </p>
      {long && (
        <button onClick={() => setExp(!exp)}
          className="flex items-center gap-1 text-xs font-bold text-green-700 uppercase tracking-wider hover:text-green-800">
          {exp ? <><ChevronUp size={14} /> Thu gọn</> : <><ChevronDown size={14} /> Xem thêm</>}
        </button>
      )}
    </div>
  )
}

function WhyUsSection({ t }: { t: AboutT['whyUs'] }) {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'url("/world-map.png")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
      />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-4xl font-black text-center text-[#0b2a59] uppercase mb-20 tracking-tight">
          {t.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
          {t.reasons.map((r, i) => {
            const isEven = i % 2 !== 0
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isEven ? 60 : -60, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }} viewport={VP}
                transition={{ duration: 0.7, delay: (i % 2) * 0.2, ease: 'easeOut' }}
                className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 group`}
              >
                <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-2xl shadow-slate-200">
                  <motion.img
                    whileHover={{ scale: 1.08 }} transition={{ duration: 0.4 }}
                    src={WHY_IMAGES[i]} alt={r.title} className="w-full h-auto object-cover"
                  />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="p-3 bg-slate-50 rounded-2xl inline-block shadow-inner group-hover:bg-white group-hover:shadow-md transition-all">
                    {WHY_ICONS[i]}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 uppercase leading-tight">{r.title}</h3>
                  <ExpandText text={r.desc} />
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300 group-hover:w-24" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Section: Services ────────────────────────────────────────────────────────
function ServicesSection({ t }: { t: AboutT['services'] }) {
  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={VP} variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-black text-[#0b2a59] uppercase tracking-tight">
            {t.heading}
          </h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {t.items.map((svc, i) => {
            const isEven = i % 2 === 0
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isEven ? -70 : 70, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }} viewport={VP}
                transition={{ duration: 0.8, delay: (i % 2) * 0.1, ease: [0.21, 1, 0.36, 1] }}
                whileHover={{ y: -12 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/60 group border border-slate-100"
              >
                <div className="h-48 sm:h-64 overflow-hidden relative">
                  <img
                    src={SVC_IMAGES[i]} alt={svc.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg text-blue-600 transform group-hover:rotate-12 transition-transform">
                    {SVC_ICONS[i]}
                  </div>
                </div>
                <div className="p-10 text-center">
                  <h3 className="text-2xl font-black mb-4 uppercase group-hover:text-blue-600 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base px-2">{svc.desc}</p>
                  <div className="w-0 h-1 bg-blue-600 mx-auto mt-6 rounded-full group-hover:w-24 transition-all duration-500" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export function AboutClient({ t }: { t: AboutT }) {
  return (
    <>
      <BannerSection t={t.banner} />
      <AboutSection t={t.about} />
      <TimelineSection t={t.timeline} />
      <WhyUsSection t={t.whyUs} />
      <ServicesSection t={t.services} />
    </>
  )
}
