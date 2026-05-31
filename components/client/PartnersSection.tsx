'use client'

import { useState } from 'react'

const LOGO_SIZE = 60
const CW = 820
const CH = 440
const CX = CW / 2
const CY = CH / 2

// Scattered wide — spread across full width
const POSITIONS = [
  { x: -340, y:    5 },
  { x: -278, y: -148 },
  { x: -172, y:  158 },
  { x: -148, y: -165 },
  { x:  -55, y:  178 },
  { x:   62, y: -178 },
  { x:  132, y:  160 },
  { x:  165, y: -145 },
  { x:  265, y:  145 },
  { x:  295, y: -112 },
  { x:  342, y:   12 },
]

interface Partner { src: string; alt: string }
interface Props { heading: string; items: Partner[] }

function GlobeNode() {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '160px', height: '160px',
        zIndex: 10,
        cursor: 'default',
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
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.35s ease',
        }}
      />
      <div style={{
        position: 'absolute',
        top: '108%', left: '50%',
        background: 'rgba(6,35,64,0.92)',
        color: '#fff',
        padding: '6px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-vi)',
        pointerEvents: 'none',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(6px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        letterSpacing: '0.5px',
      }}>
        WON Media
      </div>
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
        boxShadow: hovered
          ? '0 10px 36px rgba(0,0,0,0.18)'
          : '0 4px 16px rgba(0,0,0,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '10px',
        boxSizing: 'border-box',
        border: '2px solid rgba(255,255,255,0.9)',
        transform: hovered ? 'scale(1.18)' : 'scale(1)',
        transition: 'transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s ease',
        cursor: 'default',
      }}>
        <img
          src={partner.src}
          alt={partner.alt}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Name tooltip */}
      <div style={{
        position: 'absolute',
        bottom: '115%', left: '50%',
        background: 'rgba(6,35,64,0.92)',
        color: '#fff',
        padding: '5px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-vi)',
        pointerEvents: 'none',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(4px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}>
        {partner.alt}
      </div>
    </div>
  )
}

export function PartnersSection({ heading, items }: Props) {
  const positions = POSITIONS.slice(0, items.length)

  return (
    <section style={{ background: '#f0f6ff', padding: '88px 24px', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{
            color: '#0b2a59',
            fontSize: 'clamp(26px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            margin: '0 0 20px',
            fontFamily: 'var(--font-vi)',
          }}>
            {heading}
          </h2>
          <div style={{
            width: '80px', height: '4px',
            margin: '0 auto', borderRadius: '2px',
            background: 'linear-gradient(90deg, var(--color-teal,#00A98F), var(--color-indigo,#6366F1))',
          }} />
        </div>

        {/* Solar system */}
        <div className="won-solar-wrap">
          <div style={{ position: 'relative', width: `${CW}px`, height: `${CH}px` }}>

            {/* Partner nodes */}
            {items.map((p, i) => (
              <PartnerNode
                key={p.alt + i}
                partner={p}
                pos={positions[i] ?? positions[i % positions.length]}
                delay={-(i * 0.45)}
              />
            ))}

            {/* Globe */}
            <GlobeNode />
          </div>
        </div>

      </div>

      <style>{`
        .won-solar-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          width: 100%;
        }
        @media (max-width: 860px) {
          .won-solar-wrap > div {
            transform: scale(0.75);
            margin-top: -55px;
            margin-bottom: -55px;
          }
        }
        @media (max-width: 600px) {
          .won-solar-wrap > div {
            transform: scale(0.50);
            margin-top: -110px;
            margin-bottom: -110px;
          }
        }
        @media (max-width: 420px) {
          .won-solar-wrap > div {
            transform: scale(0.36);
            margin-top: -141px;
            margin-bottom: -141px;
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
