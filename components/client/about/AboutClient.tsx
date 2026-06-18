'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

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

const VP = { once: true, amount: 0.2 }
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}
const fadeLeft = {
  hidden:  { opacity: 0, x: -56 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.8, ease: EASE } },
}
const fadeRight = {
  hidden:  { opacity: 0, x: 56 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.8, ease: EASE } },
}

// ─── Icons SVG ────────────────────────────────────────────────────────────────
const TIMELINE_ICONS = [
  <svg key="r" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  <svg key="u" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="s" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>,
  <svg key="g" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  <svg key="p" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>,
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
]

const TIMELINE_COLORS = [
  { from: '#ef4444', to: '#f97316' },
  { from: '#84cc16', to: '#22c55e' },
  { from: '#f97316', to: '#eab308' },
  { from: '#334155', to: '#0f172a' },
  { from: '#f43f5e', to: '#dc2626' },
  { from: '#6366f1', to: '#9333ea' },
]
const TIMELINE_YEARS = ['2023', '2024', '2024', '2025', '2025', '2026']

const WHY_ICONS = [
  <svg key="u" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  <svg key="l" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><circle cx="12" cy="11" r="5"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  <svg key="h" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  <svg key="r" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  <svg key="m" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="32" height="32"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.09-1.09a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
]
const WHY_COLORS  = ['var(--color-navy)', 'var(--color-teal-dark)', '#e11d48', 'var(--color-indigo)', '#059669', '#b45309']

const SVC_ICONS = [
  <svg key="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  <svg key="m" viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>,
  <svg key="h" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  <svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><circle cx="12" cy="12" r="10"/><path d="M14.83 14.83A4 4 0 1 1 9.17 9.17"/></svg>,
]
const SVC_IMAGES  = ['/services-5.png', '/services-7.png', '/services-6.png', '/services-8.png']
const SVC_COLORS  = [
  { bg: 'rgba(0,169,143,0.1)',  icon: 'var(--color-teal)',   line: 'var(--color-teal)'   },
  { bg: 'rgba(99,102,241,0.1)', icon: 'var(--color-indigo)', line: 'var(--color-indigo)' },
  { bg: 'rgba(15,76,129,0.1)',  icon: 'var(--color-navy)',   line: 'var(--color-navy)'   },
  { bg: 'rgba(252,211,77,0.15)',icon: '#b45309',             line: '#d97706'             },
]

// ─── Banner ───────────────────────────────────────────────────────────────────
function BannerSection({ t }: { t: AboutT['banner'] }) {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 240, overflow: 'hidden', display: 'flex', alignItems: 'center', color: '#fff' }}>
      <motion.div
        initial={{ scale: 1.1 }} whileInView={{ scale: 1 }} viewport={VP}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: 0, backgroundImage: "url('/banners/banner.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(6,35,64,0.82) 0%, rgba(0,169,143,0.3) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 0)', backgroundSize: '4px 4px' }} />

      <div className="container won-about-banner-inner" style={{ position: 'relative', zIndex: 10, paddingBlock: '52px' }}>
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP} transition={{ duration: 0.7, delay: 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <span style={{ width: 40, height: 3, background: 'var(--color-teal)', borderRadius: 2, display: 'block' }} />
          <span className="type-tag" style={{ color: '#00A98F', letterSpacing: '2px' }}>{t.subtitle}</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={VP}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          style={{ fontSize: 'clamp(24px, 3.5vw, 42px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px', fontFamily: 'var(--font-primary)', color: '#fff', textShadow: '0 4px 32px rgba(0,0,0,0.3)', margin: 0 }}
        >
          {t.title}
        </motion.h1>
      </div>
    </div>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection({ t, lang }: { t: AboutT['about']; lang: string }) {
  return (
    <section style={{ background: '#fff', paddingBlock: 'var(--space-20)', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-16)', alignItems: 'center' }}>

          {/* Image */}
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeLeft}
            className="won-about-img-col" style={{ position: 'relative' }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 64px rgba(6,35,64,0.14)', position: 'relative' }}>
              <img src="/about-team.png" alt="WON Media Team" style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,169,143,0.08) 0%, transparent 60%)' }} />
            </div>
            {/* Experience badge */}
            <motion.div
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={VP}
              transition={{ delay: 0.5, type: 'spring', stiffness: 160 }}
              style={{ position: 'absolute', bottom: -20, right: -16, background: '#fff', borderRadius: 16, padding: '18px 24px', boxShadow: '0 12px 36px rgba(6,35,64,0.14)', display: 'flex', alignItems: 'center', gap: 12, border: '1.5px solid var(--color-gray-border)' }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: 'var(--color-navy)', fontFamily: 'var(--font-primary)', lineHeight: 1 }}>{t.experience.value}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-gray-text)', lineHeight: 1.4, maxWidth: 80, fontFamily: 'var(--font-primary)' }}>{t.experience.text}</span>
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeRight}
            style={{ paddingBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ height: 2, width: 32, background: 'var(--color-teal)', borderRadius: 2, display: 'block' }} />
              <span className="type-tag" style={{ color: 'var(--color-teal-dark)', letterSpacing: '2px' }}>{t.label}</span>
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: 'var(--color-navy-deep)', lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 28, fontFamily: 'var(--font-primary)' }}>
              {t.titleLine1}<br />
              <span style={{ color: 'var(--color-teal-dark)' }}>{t.titleHighlight}</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ borderLeft: '3px solid var(--color-teal)', paddingLeft: 16, color: 'var(--color-gray-text)', lineHeight: 1.8, fontSize: 15, fontFamily: 'var(--font-primary)' }}>
                {t.description1.prefix} <strong style={{ color: 'var(--color-navy-deep)' }}>{t.description1.year}</strong>{t.description1.suffix}
              </p>
              <p style={{ color: 'var(--color-gray-text)', lineHeight: 1.8, fontSize: 15, fontFamily: 'var(--font-primary)' }}>{t.description2}</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24, marginBottom: 32 }}>
              {['YouTube', 'Facebook', 'TikTok', 'Spotify'].map(p => (
                <span key={p} style={{ padding: '6px 14px', border: '1.5px solid var(--color-gray-border)', borderRadius: 100, fontSize: 12, fontWeight: 600, color: 'var(--color-gray-text)', fontFamily: 'var(--font-primary)' }}>{p} Partner</span>
              ))}
            </div>
            <motion.a href={`/${lang}/lien-he`} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="qp-btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
              {t.button}
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────
function TimelineSection({ t, eyebrow }: { t: AboutT['timeline']; eyebrow: string }) {
  if (!t.milestones.length) return null
  return (
    <section style={{ background: 'var(--color-gray-light)', paddingBlock: 'var(--space-20)', overflow: 'hidden' }}>
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeUp}
          className="qp-sechead" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
          <div className="qp-sechead__titles" style={{ alignItems: 'flex-start' }}>
            <span className="qp-sechead__eyebrow type-tag" style={{ fontSize: 15, letterSpacing: '1.5px' }}>{eyebrow}</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>{t.heading}</h2>
          </div>
        </motion.div>

        <div style={{ position: 'relative', marginTop: 48 }}>
          {/* Center line desktop */}
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, transparent, var(--color-gray-border) 10%, var(--color-gray-border) 90%, transparent)', transform: 'translateX(-50%)' }} className="won-timeline-line" />

          {t.milestones.map((m, i) => {
            const col = TIMELINE_COLORS[i % TIMELINE_COLORS.length]
            const isEven = i % 2 === 0
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: isEven ? -60 : 60 }} whileInView={{ opacity: 1, x: 0 }} viewport={VP}
                transition={{ duration: 0.7, delay: 0.05 * i, ease: EASE }}
                style={{ display: 'flex', justifyContent: isEven ? 'flex-start' : 'flex-end', marginBottom: 40, position: 'relative' }}
                className="won-timeline-row"
              >
                {/* Card */}
                <div style={{
                  width: '45%', background: '#fff',
                  borderRadius: 18, padding: '22px 24px',
                  boxShadow: '0 4px 24px rgba(6,35,64,0.08)',
                  border: '1px solid var(--color-gray-border)',
                  position: 'relative',
                }} className="won-timeline-card">
                  <h3 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10, fontFamily: 'var(--font-primary)', background: `linear-gradient(135deg, ${col.from}, ${col.to})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{m.title}</h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {m.content.filter(Boolean).map((c, ci) => (
                      <li key={ci} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--color-gray-text)', fontFamily: 'var(--font-primary)', lineHeight: 1.6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: col.from, flexShrink: 0, marginTop: 5 }} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Center icon */}
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }} className="won-timeline-icon">
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${col.from}, ${col.to})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: `0 6px 20px ${col.from}55`, flexShrink: 0 }}>
                    {TIMELINE_ICONS[i % TIMELINE_ICONS.length]}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: col.from, fontFamily: 'var(--font-primary)' }}>{TIMELINE_YEARS[i % TIMELINE_YEARS.length]}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .won-timeline-line { display: none; }
          .won-timeline-row  { justify-content: flex-end !important; padding-left: 68px; }
          .won-timeline-card { width: 100% !important; }
          .won-timeline-icon { left: 0 !important; top: 20px !important; transform: none !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Why Us ───────────────────────────────────────────────────────────────────
function WhyUsSection({ t, eyebrow }: { t: AboutT['whyUs']; eyebrow: string }) {
  if (!t.reasons.length) return null
  return (
    <section style={{ background: '#fff', paddingBlock: 'var(--space-20)', overflow: 'hidden' }}>
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeUp}
          className="qp-sechead" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
          <div className="qp-sechead__titles" style={{ alignItems: 'flex-start' }}>
            <span className="qp-sechead__eyebrow type-tag" style={{ fontSize: 15, letterSpacing: '1.5px' }}>{eyebrow}</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>{t.heading}</h2>
          </div>
        </motion.div>

        <div className="won-why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>
          {t.reasons.map((r, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              style={{ background: '#fff', borderRadius: 20, border: '1.5px solid var(--color-gray-border)', padding: '28px 24px', boxShadow: '0 2px 12px rgba(6,35,64,0.05)', overflow: 'hidden', position: 'relative', cursor: 'default' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${WHY_COLORS[i % WHY_COLORS.length]}, transparent)`, borderRadius: '20px 20px 0 0' }} />
              <div style={{ width: 56, height: 56, borderRadius: 14, background: `${WHY_COLORS[i % WHY_COLORS.length]}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: WHY_COLORS[i % WHY_COLORS.length], marginBottom: 18 }}>
                {WHY_ICONS[i % WHY_ICONS.length]}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-navy-deep)', marginBottom: 10, letterSpacing: '-0.2px', fontFamily: 'var(--font-primary)', textTransform: 'uppercase' }}>{r.title}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--color-gray-text)', lineHeight: 1.75, fontFamily: 'var(--font-primary)', margin: 0 }}>{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .won-why-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .won-why-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────
function ServicesSection({ t, eyebrow }: { t: AboutT['services']; eyebrow: string }) {
  if (!t.items.length) return null
  return (
    <section style={{ background: 'var(--color-gray-light)', paddingBlock: 'var(--space-20)' }}>
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={VP} variants={fadeUp}
          className="qp-sechead" style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
          <div className="qp-sechead__titles" style={{ alignItems: 'flex-start' }}>
            <span className="qp-sechead__eyebrow type-tag" style={{ fontSize: 15, letterSpacing: '1.5px' }}>{eyebrow}</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>{t.heading}</h2>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 48 }}>
          {t.items.map((svc, i) => {
            const sc = SVC_COLORS[i % SVC_COLORS.length]
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={VP}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 20px rgba(6,35,64,0.07)', border: '1px solid var(--color-gray-border)', cursor: 'default' }}>
                {/* Image */}
                <div style={{ height: 180, overflow: 'hidden', position: 'relative', background: sc.bg }}>
                  <motion.img whileHover={{ scale: 1.06 }} transition={{ duration: 0.5 }}
                    src={SVC_IMAGES[i % SVC_IMAGES.length]} alt={svc.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', top: 16, right: 16, width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sc.icon, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {SVC_ICONS[i % SVC_ICONS.length]}
                  </div>
                </div>
                {/* Content */}
                <div style={{ padding: '22px 22px 26px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3px', color: 'var(--color-navy-deep)', marginBottom: 10, fontFamily: 'var(--font-primary)' }}>{svc.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--color-gray-text)', lineHeight: 1.75, fontFamily: 'var(--font-primary)', margin: '0 0 16px' }}>{svc.desc}</p>
                  <div style={{ width: 32, height: 3, background: sc.line, borderRadius: 2, margin: '0 auto', transition: 'width 0.3s ease' }} className="won-svc-line" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const EYEBROW: Record<string, { timeline: string; whyUs: string; services: string }> = {
  vi: { timeline: 'Lịch sử',    whyUs: 'Điểm mạnh',  services: 'Dịch vụ'   },
  en: { timeline: 'History',    whyUs: 'Strengths',   services: 'Services'  },
}
function ey(lang: string) { return EYEBROW[lang] ?? EYEBROW.vi }

// ─── Root ─────────────────────────────────────────────────────────────────────
export function AboutClient({ t, lang = 'vi' }: { t: AboutT; lang?: string }) {
  const e = ey(lang)
  return (
    <>
      <style>{`
        /* Banner */
        @media (max-width: 640px) {
          .won-about-banner-inner { padding-block: 36px !important; }
          .won-about-banner-inner h1 { font-size: clamp(20px, 6vw, 28px) !important; letter-spacing: -0.5px !important; }
        }

        /* About — image col: thêm padding-bottom để badge không bị tràn */
        .won-about-img-col { padding-bottom: 28px; }
        @media (max-width: 640px) {
          .won-about-img-col { margin-bottom: 16px; }
        }

        /* Why Us grid đã có media query riêng trong WhyUsSection */
      `}</style>
      <BannerSection   t={t.banner}   />
      <AboutSection    t={t.about}    lang={lang} />
      <TimelineSection t={t.timeline} eyebrow={e.timeline} />
      <WhyUsSection    t={t.whyUs}    eyebrow={e.whyUs}    />
      <ServicesSection t={t.services} eyebrow={e.services} />
    </>
  )
}
