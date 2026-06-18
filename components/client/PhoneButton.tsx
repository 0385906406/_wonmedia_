'use client'

import { useState } from 'react'

interface Props {
  phone: string
  lang: string
}

export function PhoneButton({ phone, lang }: Props) {
  const [hovered, setHovered] = useState(false)

  if (!phone) return null

  return (
    <>
      <a
        href={`tel:${phone.replace(/\s/g, '')}`}
        title="Gọi ngay"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed', bottom: 16, left: 16,
          zIndex: 9999, cursor: 'pointer',
          display: 'flex', alignItems: 'center',
          textDecoration: 'none',
        }}
      >
        {/* Ping waves */}
        <span style={{
          position: 'absolute',
          width: 44, height: 44, borderRadius: '50%',
          border: '2px solid #22c55e',
          animation: 'wm-phone-ping 1.8s ease-out infinite',
          opacity: 0.5,
        }} />
        <span style={{
          position: 'absolute',
          width: 44, height: 44, borderRadius: '50%',
          border: '2px solid #22c55e',
          animation: 'wm-phone-ping 1.8s ease-out 0.5s infinite',
          opacity: 0.3,
        }} />

        {/* Main pill */}
        <div style={{
          position: 'relative',
          display: 'flex', alignItems: 'center',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          borderRadius: '100px',
          boxShadow: '0 6px 18px rgba(34,197,94,0.4)',
          padding: '3px 3px',
          paddingRight: hovered ? '14px' : '3px',
          transition: 'padding-right 0.35s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s ease',
        }}>
          {/* Phone icon circle */}
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            animation: 'wm-phone-shake 2s ease-in-out infinite',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#16a34a">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
          </div>

          {/* Phone number */}
          <span style={{
            color: '#fff', fontWeight: 700, fontSize: 13,
            whiteSpace: 'nowrap', overflow: 'hidden',
            fontFamily: 'var(--font-vi)',
            maxWidth: hovered ? 140 : 0,
            opacity: hovered ? 1 : 0,
            marginLeft: hovered ? 8 : 0,
            transition: 'max-width 0.35s cubic-bezier(0.2,0.8,0.2,1), opacity 0.3s ease, margin-left 0.35s ease',
          }}>
            {phone}
          </span>
        </div>
      </a>

      <style>{`
        @keyframes wm-phone-ping {
          0%   { transform: scale(1); opacity: 0.5; }
          75%  { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes wm-phone-shake {
          0%, 100% { transform: rotate(0deg); }
          10%       { transform: rotate(-15deg); }
          20%       { transform: rotate(15deg); }
          30%       { transform: rotate(-10deg); }
          40%       { transform: rotate(10deg); }
          50%       { transform: rotate(0deg); }
        }
      `}</style>
    </>
  )
}
