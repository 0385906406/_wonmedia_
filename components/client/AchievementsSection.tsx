'use client'

import { useEffect, useRef, useState } from 'react'

interface AchievementItem {
  value: number
  label: string
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
      const elapsed = now - startRef.current
      const duration = 1800
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.round(eased * target))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [running, target])

  return <>{count}</>
}

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
          setRunning(false)
          setTimeout(() => {
            setRunning(true)
            setAnimKey(k => k + 1)
          }, 150)
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
    <section style={{ background: 'var(--color-gray-light)', paddingBlock: 'var(--space-20)' }}>
      <div className="container">
        <div className="qp-sechead">
          <div className="qp-sechead__titles">
            <span className="qp-sechead__eyebrow type-tag" style={{ fontSize: '15px', letterSpacing: '1.5px' }}>{heading}</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0 }}>{subheading}</h2>
          </div>
        </div>
      </div>

      <div
        className="qp-kpi-strip"
        ref={sectionRef}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          display: 'block',
        }}
      >
        <div className="qp-kpi-grid container">
          {items.map((item, i) => (
            <div className="qp-kpi" key={`${animKey}-${i}`}>
              <div className="qp-kpi__value">
                <span className="num">
                  <CountUp target={item.value} running={running} />
                </span>
                <span className="unit">+</span>
              </div>
              <p className="qp-kpi__label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
