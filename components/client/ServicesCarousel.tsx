'use client'

import { useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

interface ServiceItem {
  title: string
  desc: string
}

interface Props {
  items: ServiceItem[]
  heading: string
}

const SERVICE_ICONS = [
  <svg key="play" viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M8 5v14l11-7z" />
  </svg>,
  <svg key="music" viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
  </svg>,
  <svg key="youtube" viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088C19.78 3.68 12 3.68 12 3.68s-7.78 0-9.407.437A3.007 3.007 0 0 0 .505 6.205 31.247 31.247 0 0 0 .064 12a31.247 31.247 0 0 0 .441 5.795 3.007 3.007 0 0 0 2.088 2.088C4.22 20.32 12 20.32 12 20.32s7.78 0 9.407-.437a3.007 3.007 0 0 0 2.088-2.088A31.247 31.247 0 0 0 23.936 12a31.247 31.247 0 0 0-.441-5.795zM9.75 15.02V8.98l6.28 3.02-6.28 3.02z"/>
  </svg>,
  <svg key="shield" viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
  </svg>,
]

export function ServicesCarousel({ items, heading }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const id = setInterval(() => emblaApi.scrollNext(), 5000)
    return () => clearInterval(id)
  }, [emblaApi])

  return (
    <section
      style={{
        background: 'var(--wm-mid)',
        padding: '88px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 15% 50%, rgba(0,169,143,0.07) 0%, transparent 55%), radial-gradient(ellipse at 85% 50%, rgba(99,102,241,0.06) 0%, transparent 55%)',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
        {/* Heading */}
        <div className="wm-animate" style={{ textAlign: 'center', marginBottom: '60px' }}>  
          <h2 style={{
            color: '#fff',
            fontSize: 'clamp(26px, 4vw, 44px)',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            margin: '0 0 20px',
            fontFamily: 'var(--font-vi)',
          }}>
            {heading}
          </h2>
          <div style={{
            width: '80px', height: '4px', margin: '0 auto', borderRadius: '2px',
            background: 'linear-gradient(90deg, var(--color-teal), var(--color-indigo))',
          }} />
        </div>

        {/* Carousel wrapper */}
        <div style={{ position: 'relative' }}>
          {/* Prev */}
          <button onClick={scrollPrev} className="wm-carousel-btn wm-carousel-btn--prev" aria-label="Prev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          {/* Embla viewport */}
          <div ref={emblaRef} style={{ overflow: 'hidden', padding: '8px 4px 16px' }}>
            <div className="wm-carousel-track">
              {items.map((item, i) => (
                <div
                  key={i}
                  className={`wm-carousel-slide wm-service-slide-4`}
                >
                  <div className="wm-mesh-card">
                    {/* Animated gradient border */}
                    <span className="wm-mesh-border" />

                    <div className="wm-mesh-content">
                      {/* Icon */}
                      <div style={{
                        width: '52px', height: '52px', borderRadius: '12px',
                        background: 'rgba(0,169,143,0.12)',
                        border: '1px solid rgba(0,169,143,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-teal-light)',
                        flexShrink: 0,
                        transition: 'background 0.4s ease, transform 0.4s ease',
                      }}>
                        {SERVICE_ICONS[i]}
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontSize: '18px', fontWeight: 700,
                        color: '#fff', margin: 0, lineHeight: 1.3,
                        letterSpacing: '-0.3px',
                        fontFamily: 'var(--font-vi)',
                      }}>
                        {item.title}
                      </h3>

                      {/* Desc */}
                      <p style={{
                        fontSize: '13.5px', lineHeight: 1.7,
                        color: 'rgba(255,255,255,0.7)', margin: 0,
                        fontFamily: 'var(--font-vi)',
                        flex: 1,
                      }}>
                        {item.desc}
                      </p>

                      {/* Arrow link */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        color: 'var(--color-teal-light)', fontSize: '13px', fontWeight: 600,
                        marginTop: '4px', fontFamily: 'var(--font-vi)',
                      }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next */}
          <button onClick={scrollNext} className="wm-carousel-btn wm-carousel-btn--next" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
