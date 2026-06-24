'use client'

import { useEffect, useRef, useState } from 'react'
import {
  TrophyIcon, UsersIcon, MusicIcon, StarIcon, GlobeIcon,
  HeartIcon, ZapIcon, AwardIcon, MicIcon, TrendingUpIcon,
  PlayCircleIcon, HeadphonesIcon, RadioIcon, BadgeCheckIcon, ThumbsUpIcon,
} from 'lucide-react'

const ACHIEVEMENT_ICONS: Record<string, React.ElementType> = {
  trophy:        TrophyIcon,
  users:         UsersIcon,
  music:         MusicIcon,
  star:          StarIcon,
  globe:         GlobeIcon,
  heart:         HeartIcon,
  zap:           ZapIcon,
  award:         AwardIcon,
  mic:           MicIcon,
  'trending-up': TrendingUpIcon,
  'play-circle': PlayCircleIcon,
  headphones:    HeadphonesIcon,
  radio:         RadioIcon,
  'badge-check': BadgeCheckIcon,
  'thumbs-up':   ThumbsUpIcon,
}

interface AchievementItem {
  value: number
  label: string
  iconKey?: string
  color?: string
}

interface Props {
  heading: string
  subheading: string
  items: AchievementItem[]
}

function CountUp({ target, running }: { target: number; running: boolean }) {
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
      const progress = Math.min((now - startRef.current) / 1800, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.round(eased * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [running, target])

  return <>{count}</>
}

const ACCENTS = ['#f97316', '#00A98F', '#6366F1', '#38bdf8']

export function AchievementsSection({ heading, subheading, items }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [running, setRunning] = useState(false)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          setTimeout(() => { setRunning(true); setAnimKey(k => k + 1) }, 120)
        } else {
          setVisible(false)
          setRunning(false)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--color-gray-light)',
        paddingBlock: 'var(--space-20)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >

      <div className="container" style={{ position: 'relative' }}>

        {/* Heading */}
        <div className="qp-sechead" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          <div className="qp-sechead__titles">
            <span
              className="qp-sechead__eyebrow type-tag"
              style={{ fontSize: 15, letterSpacing: '1.5px' }}
            >
              {heading}
            </span>
            <h2 style={{
              fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800,
              letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0,
              color: 'var(--color-navy-deep)',
            }}>
              {subheading}
            </h2>
          </div>
        </div>

        {/* Cards grid */}
        <div className="ach-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 'clamp(10px, 1.6vw, 16px)',
          marginTop: 28,
        }}>
          {items.map((item, i) => {
            const IconComp = item.iconKey ? ACHIEVEMENT_ICONS[item.iconKey] : null
            const accent = item.color || ACCENTS[i % ACCENTS.length]
            const delay = `${i * 0.1}s`
            return (
              <div
                key={`${animKey}-${i}`}
                className="ach-card"
                style={{
                  position: 'relative', overflow: 'hidden',
                  display: 'flex', flexDirection: 'row',
                  alignItems: 'center', gap: 14,
                  padding: '18px 20px',
                  background: '#fff',
                  border: '1px solid var(--color-gray-border)',
                  borderRadius: 14,
                  cursor: 'default',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(28px)',
                  transition: `opacity 0.55s cubic-bezier(.16,1,.3,1) ${delay}, transform 0.55s cubic-bezier(.16,1,.3,1) ${delay}, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease`,
                  ['--accent' as string]: accent,
                }}
              >
                {/* Left accent bar */}
                <div style={{
                  position: 'absolute', top: '20%', bottom: '20%', left: 0, width: 3, borderRadius: 3,
                  background: accent,
                  boxShadow: `0 0 8px ${accent}80`,
                }} />

                {/* Icon */}
                {IconComp && (
                  <div className="ach-icon" style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: `${accent}18`,
                    border: `1px solid ${accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IconComp size={18} style={{ color: accent }} />
                  </div>
                )}

                {/* Text */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, lineHeight: 1 }}>
                    <span style={{
                      fontSize: 28, fontWeight: 700,
                      letterSpacing: '-1px', color: 'var(--color-navy-deep)',
                      fontFamily: 'var(--font-mono-sans)',
                    }}>
                      <CountUp target={item.value} running={running} />
                    </span>
                    <span style={{
                      fontSize: 16, fontWeight: 700,
                      color: accent,
                      fontFamily: 'var(--font-mono-sans)',
                    }}>+</span>
                  </div>
                  <p style={{
                    margin: '5px 0 0', fontSize: 11,
                    fontWeight: 500, letterSpacing: '0.06em',
                    color: 'var(--color-gray-text)',
                    fontFamily: 'var(--font-primary)',
                    lineHeight: 1.4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{item.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .ach-card:hover {
          background: var(--color-navy-pale, #EAF1F8) !important;
          border-color: var(--accent, #e2e8f0) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
        }
        .ach-card:hover .ach-icon {
          transform: scale(1.1);
        }
        .ach-icon {
          transition: transform 0.22s ease;
        }
        @media (max-width: 767px) {
          .ach-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
      `}</style>
    </section>
  )
}
