'use client'

import { useState } from 'react'

const LOGO_SIZE = 84
const CW = 820
const CH = 440
const CX = CW / 2
const CY = CH / 2

// 6 vị trí đều nhau trên vòng tròn bán kính 185, bắt đầu từ đỉnh
const R = 185
const COUNT = 6
const POSITIONS = Array.from({ length: COUNT }, (_, i) => {
  const angle = (-Math.PI / 2) + (i * 2 * Math.PI) / COUNT
  return {
    x: Math.round(R * Math.cos(angle)),
    y: Math.round(R * Math.sin(angle)),
  }
})

interface Partner { src: string; alt: string }
interface Props { heading: string; subheading: string; items: Partner[] }

function GlobeNode() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '120px', height: '120px',
        zIndex: 10,
      }}
    >
      <img
        src="/traiDatLogo%20.png"
        alt="WON Media"
        style={{
          width: '100%', height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 8px 32px rgba(0,100,200,0.28))',
          animation: 'wonGlobeFloat 4s ease-in-out infinite',
        }}
      />
    </div>
  )
}

function PartnerNode({ partner, pos, delay }: { partner: Partner; pos: { x: number; y: number }; delay: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: `${CX + pos.x - LOGO_SIZE / 2}px`,
        top:  `${CY + pos.y - LOGO_SIZE / 2}px`,
        width: `${LOGO_SIZE}px`,
        height: `${LOGO_SIZE}px`,
        zIndex: hovered ? 20 : 5,
        animation: 'wonLogoFloat 3.2s ease-in-out infinite',
        animationDelay: `${delay}s`,
      }}
    >
      <div style={{
        width: '100%', height: '100%',
        borderRadius: '50%',
        background: '#fff',
        boxShadow: hovered ? '0 10px 36px rgba(0,0,0,0.18)' : '0 4px 16px rgba(0,0,0,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '10px',
        boxSizing: 'border-box',
        border: '2px solid rgba(255,255,255,0.9)',
        transform: hovered ? 'scale(1.18)' : 'scale(1)',
        transition: 'transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s ease',
        cursor: 'default',
      }}>
        <img src={partner.src} alt={partner.alt} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      {/* Tooltip: hiện bên dưới nếu logo ở nửa trên vòng tròn (pos.y < 0) */}
      <div style={{
        position: 'absolute',
        ...(pos.y < 0
          ? { top: '115%', bottom: 'auto' }
          : { bottom: '115%', top: 'auto' }),
        left: '50%',
        background: 'rgba(6,35,64,0.92)',
        color: '#fff',
        padding: '5px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-primary)',
        pointerEvents: 'none',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateX(-50%) translateY(0)' : `translateX(-50%) translateY(${pos.y < 0 ? '-' : ''}4px)`,
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        zIndex: 30,
      }}>
        {partner.alt}
      </div>
    </div>
  )
}

function PartnerCard({ partner }: { partner: Partner }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
      }}
    >
      <div style={{
        width: '72px', height: '72px',
        borderRadius: '50%',
        background: '#fff',
        boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 3px 12px rgba(0,0,0,0.09)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '12px', boxSizing: 'border-box',
        border: '2px solid rgba(255,255,255,0.95)',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}>
        <img src={partner.src} alt={partner.alt} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <span style={{
        fontSize: '11px', fontWeight: 600, color: 'var(--color-navy)',
        fontFamily: 'var(--font-primary)', textAlign: 'center',
        letterSpacing: '0.3px',
      }}>
        {partner.alt}
      </span>
    </div>
  )
}

export function PartnersSection({ heading, subheading, items }: Props) {
  const positions = POSITIONS.slice(0, items.length)

  return (
    <section style={{
      position: 'relative',
      padding: 'var(--space-20) 24px',
      overflow: 'hidden',
    }}>
      {/* Background image full width */}
      <img
        src="/partner-bg.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Heading */}
        <div className="qp-sechead" style={{ justifyContent: 'start' }}>
          <div className="qp-sechead__titles" style={{ alignItems: 'start', textAlign: 'start' }}>
            <span className="qp-sechead__eyebrow type-tag" style={{ fontSize: '15px', letterSpacing: '1.5px' }}>{heading}</span>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0 }}>{subheading}</h2>
          </div>
        </div>

        {/* Desktop: solar system */}
        <div className="won-solar-desktop">
          <div className="won-solar-wrap">
            <div style={{ position: 'relative', width: `${CW}px`, height: `${CH}px` }}>
              {items.map((p, i) => (
                <PartnerNode
                  key={p.alt + i}
                  partner={p}
                  pos={positions[i] ?? positions[i % positions.length]}
                  delay={-(i * 0.45)}
                />
              ))}
              <GlobeNode />
            </div>
          </div>
        </div>

        {/* Mobile: grid */}
        <div className="won-partners-grid">
          {/* Globe center */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <img
              src="/traiDatLogo%20.png"
              alt="WON Media"
              style={{
                width: '100px', height: '100px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 6px 20px rgba(0,100,200,0.22))',
                animation: 'wonGlobeFloat 4s ease-in-out infinite',
              }}
            />
          </div>
          <div className="won-partners-grid__items">
            {items.map((p, i) => (
              <PartnerCard key={p.alt + i} partner={p} />
            ))}
          </div>
        </div>

      </div>

      <style>{`
        /* Desktop: show solar, hide grid */
        .won-solar-desktop { display: block; }
        .won-partners-grid  { display: none; }

        .won-solar-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          overflow: visible;
        }

        /* Tablet */
        @media (max-width: 860px) {
          .won-solar-wrap > div {
            transform: scale(0.75);
            margin-top: -55px;
            margin-bottom: -55px;
          }
        }

        /* Mobile: hide solar, show grid */
        @media (max-width: 640px) {
          .won-solar-desktop { display: none; }
          .won-partners-grid  { display: block; }
          .won-partners-grid__items {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px 12px;
          }
        }

        @media (max-width: 360px) {
          .won-partners-grid__items {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @keyframes wonGlobeFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-10px) scale(1.04); }
        }
        @keyframes wonLogoFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
      `}</style>
    </section>
  )
}
