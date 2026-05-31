'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface AchievementItem {
  value: number
  label: string
}

interface Props {
  heading: string
  items: AchievementItem[]
}

// ─── Icon SVGs ────────────────────────────────────────────────────────────────
const ICONS = [
  /* Partners – handshake */
  <svg key="h" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
  </svg>,
  /* Gold Button – award */
  <svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>,
  /* Silver YouTube – play circle */
  <svg key="p" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
  </svg>,
  /* Channels – layers */
  <svg key="l" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>,
]

// Light-bg variant: white cards, coloured accents
const ACCENT_COLORS = [
  { mesh1: 'rgba(255,105,0,0.08)',  mesh2: 'rgba(22,163,74,0.06)',   icon: '#ff6900', num: '#062340', tag: '#ff6900',  border: 'rgba(255,105,0,0.5)',   glow: 'rgba(255,105,0,0.18)'  },
  { mesh1: 'rgba(0,169,143,0.08)',  mesh2: 'rgba(99,102,241,0.06)',  icon: '#00A98F', num: '#062340', tag: '#007D69',  border: 'rgba(0,169,143,0.5)',   glow: 'rgba(0,169,143,0.18)'  },
  { mesh1: 'rgba(99,102,241,0.08)', mesh2: 'rgba(0,169,143,0.06)',   icon: '#6366F1', num: '#062340', tag: '#4338CA',  border: 'rgba(99,102,241,0.5)',  glow: 'rgba(99,102,241,0.18)' },
  { mesh1: 'rgba(15,76,129,0.08)',  mesh2: 'rgba(52,212,184,0.06)',  icon: '#0F4C81', num: '#062340', tag: '#0F4C81',  border: 'rgba(15,76,129,0.5)',   glow: 'rgba(15,76,129,0.15)'  },
]

const TAG_LABELS = ['→ ĐỐI TÁC', '→ NÚT VÀNG', '→ YOUTUBE', '→ KÊNH']

// ─── Count-Up ────────────────────────────────────────────────────────────────
function CountUp({ target, running, onDone }: { target: number; running: boolean; onDone?: () => void }) {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (!running) {
      setCount(0)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      return
    }

    startRef.current = null

    function tick(now: number) {
      if (!startRef.current) startRef.current = now
      const elapsed = now - startRef.current
      const duration = 1800
      const progress = Math.min(elapsed / duration, 1)
      // ease-out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.round(eased * target))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        onDone?.()
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [running, target])

  return <>{count}</>
}

// ─── Single Card ─────────────────────────────────────────────────────────────
function AchCard({
  item,
  index,
  running,
  visible,
}: {
  item: AchievementItem
  index: number
  running: boolean
  visible: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: '#fff',
        border: hovered ? '1px solid transparent' : '1px solid #E5E8ED',
        borderRadius: '20px',
        padding: '36px 28px 32px',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'transform 0.5s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.5s ease',
        transform: hovered
          ? 'translateY(-10px) scale(1.02)'
          : visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.96)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.08}s`,
        boxShadow: hovered
          ? `0 24px 56px -12px ${accent.glow}, 0 8px 20px -8px rgba(0,0,0,0.08)`
          : '0 2px 12px rgba(15,76,129,0.06)',
      }}
    >
      {/* ── Gradient border sweep ── */}
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '20px', padding: '1.5px',
        background: `linear-gradient(120deg, transparent 0%, ${accent.icon} 20%, var(--color-indigo,#6366F1) 50%, ${accent.icon} 80%, transparent 100%)`,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* ── Radial mesh tint ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(at 0% 0%, ${accent.mesh1} 0%, transparent 55%), radial-gradient(at 100% 100%, ${accent.mesh2} 0%, transparent 55%)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.5s ease',
        zIndex: 0,
      }} />

      {/* ── Yellow indicator dot ── */}
      <div style={{
        position: 'absolute', top: '14px', right: '14px',
        width: '8px', height: '8px', borderRadius: '50%',
        background: '#FCD34D',
        boxShadow: '0 0 12px rgba(252,211,77,0.75)',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'scale(1)' : 'scale(0.3)',
        transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.5,0,0.5,2)',
        zIndex: 3,
      }} />

      {/* ── Top accent bar ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${accent.icon}, transparent)`,
        borderRadius: '20px 20px 0 0',
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity 0.4s ease',
      }} />

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Icon */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: hovered ? accent.icon + '18' : accent.icon + '12',
          border: `1px solid ${accent.icon}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accent.icon,
          marginBottom: '22px',
          transition: 'transform 0.45s cubic-bezier(0.2,0.8,0.2,1), background 0.4s ease',
          transform: hovered ? 'scale(1.18) rotate(8deg)' : 'scale(1) rotate(0deg)',
          boxShadow: hovered ? `0 6px 20px -4px ${accent.glow}` : 'none',
        }}>
          {ICONS[index % ICONS.length]}
        </div>

        {/* Tag */}
        <p style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
          textTransform: 'uppercase', color: accent.tag,
          fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))',
          margin: '0 0 8px',
          transition: 'transform 0.4s ease',
          transform: hovered ? 'translateY(-2px)' : 'none',
        }}>
          {TAG_LABELS[index % TAG_LABELS.length]}
        </p>

        {/* Number */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: '2px',
          marginBottom: '14px',
          transition: 'transform 0.4s ease',
          transform: hovered ? 'translateY(-3px)' : 'none',
        }}>
          <span style={{
            fontSize: 'clamp(44px, 5vw, 60px)',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-2px',
            fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))',
            color: accent.num,
          }}>
            <CountUp target={item.value} running={running} />
          </span>
          <span style={{
            fontSize: '26px', fontWeight: 800,
            color: 'var(--wm-orange,#ff6900)', lineHeight: 1,
            fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))',
          }}>+</span>
        </div>

        {/* Label */}
        <p style={{
          fontSize: '11px', fontWeight: 700,
          letterSpacing: '2.5px', textTransform: 'uppercase',
          color: hovered ? '#475569' : '#94a3b8',
          fontFamily: 'var(--nic-font-mono-sans, var(--font-vi))',
          margin: 0,
          transition: 'color 0.3s ease',
        }}>
          {item.label}
        </p>

        {/* Bottom sweep line */}
        <div style={{
          position: 'absolute', bottom: '-32px', left: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${accent.icon}, transparent)`,
          width: hovered ? '75%' : '0%',
          transition: 'width 0.65s ease',
          borderRadius: '1px',
        }} />
      </div>
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function AchievementsSection({ heading, items }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible]   = useState(false)
  const [running, setRunning]   = useState(false)
  const [animKey, setAnimKey]   = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          setRunning(false)
          // Small delay so CSS enter animation starts first
          setTimeout(() => {
            setRunning(true)
            setAnimKey(k => k + 1)
          }, 180)
        } else {
          // Reset: numbers go back to 0, cards fade out
          setVisible(false)
          setRunning(false)
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 32px',
        backgroundImage: 'url(/partner-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>

        {/* ── Heading ── */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '72px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 900,
            letterSpacing: '-1px',
            color: '#062340',
            margin: '0 0 20px',
            fontFamily: 'var(--font-vi)',
          }}>
            {heading}
          </h2>

          {/* Animated underline */}
          <div style={{
            width: visible ? '80px' : '0px',
            height: '4px',
            margin: '0 auto',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #22c55e, #16a34a)',
            transition: 'width 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.3s',
          }} />
        </div>

        {/* ── Cards grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}
          className="wm-ach-grid"
        >
          {items.map((item, i) => (
            <AchCard
              key={`${animKey}-${i}`}
              item={item}
              index={i}
              running={running}
              visible={visible}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .wm-ach-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; } }
        @media (max-width: 480px) { .wm-ach-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
