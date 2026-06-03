'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)
        const fd = new FormData(e.currentTarget)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }),
            })
            if (res.ok) {
                router.push('/admin')
                router.refresh()
            } else {
                const data = await res.json()
                setError(data.error || 'Đăng nhập thất bại')
            }
        } catch {
            setError('Lỗi kết nối máy chủ')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes cardIn {
                    from { opacity:0; transform:translateY(22px) scale(.97); }
                    to   { opacity:1; transform:none; }
                }
                @keyframes windSway {
                    0%,100% { transform: rotate(-32deg) translate(-55px,-38px); }
                    25%     { transform: rotate(-30.6deg) translate(-53px,-36px) skewX(.35deg); }
                    50%     { transform: rotate(-33.2deg) translate(-57px,-41px) skewX(-.25deg); }
                    75%     { transform: rotate(-31.2deg) translate(-54px,-37px) skewX(.18deg); }
                }
                @keyframes sheenMove {
                    0%,100% { opacity:0; transform:translateX(-140px); }
                    28%     { opacity:1; transform:translateX(20px); }
                    55%     { opacity:.5; transform:translateX(160px); }
                    75%     { opacity:0; transform:translateX(280px); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .vm  { stroke-dasharray:650; stroke-dashoffset:650; animation:dv 2s ease forwards; }
                .vp  { stroke-dasharray:220; stroke-dashoffset:220; animation:dv 1.3s ease forwards; }
                .vs  { stroke-dasharray:130; stroke-dashoffset:130; animation:dv 1s ease forwards; }
                .vt  { stroke-dasharray:80;  stroke-dashoffset:80;  animation:dv .8s ease forwards; }
                @keyframes dv { to { stroke-dashoffset:0; } }
                .d0{animation-delay:.3s}.d1{animation-delay:.5s}.d2{animation-delay:.65s}
                .d3{animation-delay:.75s}.d4{animation-delay:.85s}.d5{animation-delay:.95s}
                .d6{animation-delay:1.05s}.d7{animation-delay:1.12s}.d8{animation-delay:1.18s}
                .d9{animation-delay:1.24s}.d10{animation-delay:1.30s}.d11{animation-delay:1.36s}
                .d12{animation-delay:1.42s}.d13{animation-delay:1.48s}.d14{animation-delay:1.54s}

                .leaf-text-group {
                    opacity: 0;
                    animation: textFadeIn 1s ease forwards;
                    animation-delay: 1.2s;
                }
                @keyframes textFadeIn {
                    from { opacity:0; transform: translateY(6px); }
                    to   { opacity:1; transform: translateY(0); }
                }

                .lf-input {
                    width:100%; padding:10px 12px 10px 40px;
                    border:1.5px solid #d8eede; border-radius:10px;
                    font-family:'DM Sans',sans-serif; font-size:.88rem; color:#1a3d28;
                    background:rgba(240,250,244,.7); outline:none;
                    transition:border-color .2s, box-shadow .2s, background .2s;
                }
                .lf-input:focus {
                    border-color:#3fa85e; background:#fff;
                    box-shadow:0 0 0 3px rgba(63,168,94,.13);
                }
                .lf-input-pw { padding-right: 40px; }
                .ico-left {
                    position:absolute; left:13px; top:50%; transform:translateY(-50%);
                    width:15px; height:15px; color:#b0cebb; pointer-events:none;
                    transition:color .2s;
                }
                .input-wrap:focus-within .ico-left { color:#3fa85e; }

                .btn-login {
                    width:100%; padding:12px;
                    background:linear-gradient(135deg,#1a4d2e 0%,#3fa85e 100%);
                    color:#fff; border:none; border-radius:10px;
                    font-family:'DM Sans',sans-serif; font-size:.92rem; font-weight:500;
                    letter-spacing:.05em; cursor:pointer; position:relative; overflow:hidden;
                    box-shadow:0 6px 22px rgba(30,80,50,.28);
                    transition:transform .15s, box-shadow .2s;
                    display:flex; align-items:center; justify-content:center; gap:8px;
                }
                .btn-login:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 30px rgba(30,80,50,.36); }
                .btn-login:active:not(:disabled) { transform:translateY(0); }
                .btn-login:disabled { opacity:.75; cursor:not-allowed; }
                .btn-login::after { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.18) 0%,transparent 60%);pointer-events:none; }
            `}</style>

            <div style={{
                fontFamily: "'DM Sans', sans-serif",
                background: 'radial-gradient(ellipse at 30% 50%, #d8f0e2 0%, #edf7f1 60%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '20px',
            }}>
                {/* ── Card ── */}
                <div style={{
                    position: 'relative',
                    width: '940px',
                    height: '590px',
                    background: '#fff',
                    borderRadius: '30px',
                    boxShadow: '0 40px 100px rgba(30,80,50,0.15), 0 8px 24px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    animation: 'cardIn .9s cubic-bezier(.22,1,.36,1) both',
                }}>

                    {/* ── Leaf SVG ── */}
                    <svg
                        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'visible', width: '100%', height: '100%' }}
                        viewBox="0 0 940 590"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="lbg" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%"   stopColor="#12381f"/>
                                <stop offset="30%"  stopColor="#2d7a45"/>
                                <stop offset="65%"  stopColor="#3fa85e"/>
                                <stop offset="100%" stopColor="#60cc7c"/>
                            </linearGradient>
                            <linearGradient id="lhl" x1="0%" y1="0%" x2="80%" y2="100%">
                                <stop offset="0%"   stopColor="#80e89c" stopOpacity=".22"/>
                                <stop offset="100%" stopColor="#1a4d2e" stopOpacity="0"/>
                            </linearGradient>
                            <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%"   stopColor="white" stopOpacity="0"/>
                                <stop offset="42%"  stopColor="white" stopOpacity=".2"/>
                                <stop offset="58%"  stopColor="white" stopOpacity=".24"/>
                                <stop offset="100%" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                            <filter id="leafShadow" x="-15%" y="-10%" width="140%" height="130%">
                                <feDropShadow dx="8" dy="14" stdDeviation="20" floodColor="#0f3020" floodOpacity=".22"/>
                            </filter>
                            <clipPath id="lclip">
                                <path d="M210 8 C295 55,415 185,420 330 C425 470,355 625,272 705 C248 728,228 742,210 746 C192 742,172 728,148 705 C65 625,-5 470,0 330 C5 185,125 55,210 8 Z"/>
                            </clipPath>
                        </defs>

                        <g
                            filter="url(#leafShadow)"
                            style={{
                                transformOrigin: '155px 72px',
                                transform: 'rotate(-32deg) translate(-55px, -38px)',
                                animation: 'windSway 7s ease-in-out infinite',
                            }}
                        >
                            <g clipPath="url(#lclip)">
                                <rect x="-25" y="0" width="480" height="760" fill="url(#lbg)"/>
                                <rect x="-25" y="0" width="480" height="760" fill="url(#lhl)"/>

                                <g fill="none" strokeLinecap="round">
                                    {/* Midrib */}
                                    <path className="vm d0" d="M210 16 C210 220,210 520,210 742" stroke="rgba(255,255,255,.48)" strokeWidth="2.8"/>
                                    {/* Primary L */}
                                    <path className="vp d1" d="M210 118 C174 138,132 157,62 182"  stroke="rgba(255,255,255,.30)" strokeWidth="1.7"/>
                                    <path className="vp d2" d="M210 188 C168 212,122 234,46 265"  stroke="rgba(255,255,255,.28)" strokeWidth="1.6"/>
                                    <path className="vp d3" d="M210 262 C166 288,118 310,38 345"  stroke="rgba(255,255,255,.26)" strokeWidth="1.5"/>
                                    <path className="vp d4" d="M210 336 C168 362,126 380,50 412"  stroke="rgba(255,255,255,.24)" strokeWidth="1.4"/>
                                    <path className="vp d5" d="M210 405 C176 426,142 443,82 468"  stroke="rgba(255,255,255,.22)" strokeWidth="1.3"/>
                                    <path className="vp d6" d="M210 468 C186 482,160 496,116 514" stroke="rgba(255,255,255,.19)" strokeWidth="1.1"/>
                                    <path className="vp d7" d="M210 524 C194 534,174 544,144 555" stroke="rgba(255,255,255,.15)" strokeWidth=".9"/>
                                    {/* Primary R */}
                                    <path className="vp d1" d="M210 118 C246 138,288 157,358 182"  stroke="rgba(255,255,255,.30)" strokeWidth="1.7"/>
                                    <path className="vp d2" d="M210 188 C252 212,298 234,374 265"  stroke="rgba(255,255,255,.28)" strokeWidth="1.6"/>
                                    <path className="vp d3" d="M210 262 C254 288,302 310,382 345"  stroke="rgba(255,255,255,.26)" strokeWidth="1.5"/>
                                    <path className="vp d4" d="M210 336 C252 362,294 380,370 412"  stroke="rgba(255,255,255,.24)" strokeWidth="1.4"/>
                                    <path className="vp d5" d="M210 405 C244 426,278 443,338 468"  stroke="rgba(255,255,255,.22)" strokeWidth="1.3"/>
                                    <path className="vp d6" d="M210 468 C234 482,260 496,304 514" stroke="rgba(255,255,255,.19)" strokeWidth="1.1"/>
                                    <path className="vp d7" d="M210 524 C226 534,246 544,276 555" stroke="rgba(255,255,255,.15)" strokeWidth=".9"/>
                                    {/* Secondary L */}
                                    <path className="vs d8"  d="M174 140 C154 152,132 163,104 175" stroke="rgba(255,255,255,.19)" strokeWidth=".85"/>
                                    <path className="vs d8"  d="M148 162 C128 175,104 187,74  200" stroke="rgba(255,255,255,.16)" strokeWidth=".75"/>
                                    <path className="vs d9"  d="M168 216 C145 231,118 246,84  263" stroke="rgba(255,255,255,.19)" strokeWidth=".85"/>
                                    <path className="vs d9"  d="M140 238 C118 254,92  268,58  284" stroke="rgba(255,255,255,.16)" strokeWidth=".75"/>
                                    <path className="vs d10" d="M165 293 C140 310,112 325,72  345" stroke="rgba(255,255,255,.18)" strokeWidth=".8"/>
                                    <path className="vs d10" d="M140 315 C116 333,88  348,52  365" stroke="rgba(255,255,255,.15)" strokeWidth=".7"/>
                                    <path className="vs d11" d="M164 366 C140 384,114 398,78  415" stroke="rgba(255,255,255,.17)" strokeWidth=".78"/>
                                    <path className="vs d11" d="M142 387 C120 404,96  418,64  432" stroke="rgba(255,255,255,.14)" strokeWidth=".68"/>
                                    <path className="vs d12" d="M166 432 C146 448,124 460,94  473" stroke="rgba(255,255,255,.16)" strokeWidth=".72"/>
                                    <path className="vs d12" d="M148 450 C130 464,110 475,84  486" stroke="rgba(255,255,255,.13)" strokeWidth=".62"/>
                                    {/* Secondary R */}
                                    <path className="vs d8"  d="M246 140 C266 152,288 163,316 175" stroke="rgba(255,255,255,.19)" strokeWidth=".85"/>
                                    <path className="vs d8"  d="M272 162 C292 175,316 187,346 200" stroke="rgba(255,255,255,.16)" strokeWidth=".75"/>
                                    <path className="vs d9"  d="M252 216 C275 231,302 246,336 263" stroke="rgba(255,255,255,.19)" strokeWidth=".85"/>
                                    <path className="vs d9"  d="M280 238 C302 254,328 268,362 284" stroke="rgba(255,255,255,.16)" strokeWidth=".75"/>
                                    <path className="vs d10" d="M255 293 C280 310,308 325,348 345" stroke="rgba(255,255,255,.18)" strokeWidth=".8"/>
                                    <path className="vs d10" d="M280 315 C304 333,332 348,368 365" stroke="rgba(255,255,255,.15)" strokeWidth=".7"/>
                                    <path className="vs d11" d="M256 366 C280 384,306 398,342 415" stroke="rgba(255,255,255,.17)" strokeWidth=".78"/>
                                    <path className="vs d11" d="M278 387 C300 404,324 418,356 432" stroke="rgba(255,255,255,.14)" strokeWidth=".68"/>
                                    <path className="vs d12" d="M254 432 C274 448,296 460,326 473" stroke="rgba(255,255,255,.16)" strokeWidth=".72"/>
                                    <path className="vs d12" d="M272 450 C290 464,310 475,336 486" stroke="rgba(255,255,255,.13)" strokeWidth=".62"/>
                                    {/* Tertiary */}
                                    <path className="vt d13" d="M108 178 C96 187,82 196,66 205"    stroke="rgba(255,255,255,.13)" strokeWidth=".55"/>
                                    <path className="vt d13" d="M88  266 C74 277,58 287,42 296"    stroke="rgba(255,255,255,.12)" strokeWidth=".5"/>
                                    <path className="vt d14" d="M74  348 C60 360,46 370,30 380"    stroke="rgba(255,255,255,.11)" strokeWidth=".5"/>
                                    <path className="vt d14" d="M80  418 C66 430,52 440,36 450"    stroke="rgba(255,255,255,.1)"  strokeWidth=".45"/>
                                    <path className="vt d13" d="M312 178 C324 187,338 196,354 205" stroke="rgba(255,255,255,.13)" strokeWidth=".55"/>
                                    <path className="vt d13" d="M332 266 C346 277,362 287,378 296" stroke="rgba(255,255,255,.12)" strokeWidth=".5"/>
                                    <path className="vt d14" d="M346 348 C360 360,374 370,390 380" stroke="rgba(255,255,255,.11)" strokeWidth=".5"/>
                                    <path className="vt d14" d="M340 418 C354 430,368 440,384 450" stroke="rgba(255,255,255,.1)"  strokeWidth=".45"/>
                                </g>

                                {/* Sheen sweep */}
                                <rect
                                    x="-80" y="0" width="300" height="760"
                                    fill="url(#sheen)"
                                    style={{ animation: 'sheenMove 5.5s ease-in-out infinite' }}
                                />

                                {/* Rim highlight */}
                                <path
                                    d="M210 8 C295 55,415 185,420 330 C425 470,355 625,272 705 C248 728,228 742,210 746 C192 742,172 728,148 705 C65 625,-5 470,0 330 C5 185,125 55,210 8 Z"
                                    fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10"
                                />
                            </g>

                            {/* Stem */}
                            <path d="M210 744 C206 768,204 790,210 806"
                                stroke="#12381f" strokeWidth="4.5" fill="none" strokeLinecap="round" opacity=".55"/>

                            {/* Text on leaf */}
                            <g className="leaf-text-group" transform="translate(210, 370)">
                                <line x1="-55" y1="-130" x2="55" y2="-130"
                                    stroke="rgba(255,255,255,.35)" strokeWidth="1" strokeLinecap="round"/>
                                <g transform="translate(0,-108)">
                                    <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.3)" strokeWidth="1.2"/>
                                    <path d="M-9 -6 L-5 8 L0 -2 L5 8 L9 -6"
                                        stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                </g>
                                <text x="0" y="-60" fontFamily="Cormorant Garamond, serif"
                                    fontSize="28" fontWeight="700" fill="white"
                                    textAnchor="middle" letterSpacing="3">
                                    WON MEDIA
                                </text>
                                <text x="0" y="-32" fontFamily="Cormorant Garamond, serif"
                                    fontSize="12" fontStyle="italic"
                                    fill="rgba(255,255,255,.78)" textAnchor="middle" letterSpacing="1.5">
                                    Stories that grow from the ground up
                                </text>
                                <g fill="rgba(255,255,255,.4)">
                                    <circle cx="-38" cy="-14" r="1.8"/>
                                    <circle cx="0"   cy="-14" r="1.8"/>
                                    <circle cx="38"  cy="-14" r="1.8"/>
                                </g>
                                <text x="0" y="14" fontFamily="Cormorant Garamond, serif"
                                    fontSize="13.5" fontWeight="600"
                                    fill="rgba(255,255,255,.92)" textAnchor="middle" letterSpacing=".5">
                                    Từ những hạt mầm nhỏ bé,
                                </text>
                                <text x="0" y="34" fontFamily="Cormorant Garamond, serif"
                                    fontSize="13.5" fontWeight="600"
                                    fill="rgba(255,255,255,.92)" textAnchor="middle" letterSpacing=".5">
                                    những câu chuyện lớn nảy sinh.
                                </text>
                                <line x1="-40" y1="52" x2="40" y2="52"
                                    stroke="rgba(255,255,255,.3)" strokeWidth="1" strokeLinecap="round"/>
                                <text x="0" y="70" fontFamily="DM Sans, sans-serif"
                                    fontSize="9" fontWeight="300"
                                    fill="rgba(255,255,255,.45)" textAnchor="middle" letterSpacing="2">
                                    WONMEDIA.COM
                                </text>
                            </g>
                        </g>
                    </svg>

                    {/* ── Brand corner ── */}
                    <div style={{ position: 'absolute', top: '28px', right: '38px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 20 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', fontWeight: 700, color: '#1a4d2e', letterSpacing: '.02em' }}>
                            Won Media
                        </span>
                    </div>

                    {/* ── Form panel ── */}
                    <div style={{
                        position: 'relative', zIndex: 10,
                        marginLeft: 'auto',
                        width: '400px', height: '100%',
                        padding: '50px 48px 44px 36px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    }}>
                        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.95rem', fontWeight: 700, color: '#1a4d2e', marginBottom: '4px', lineHeight: 1.1 }}>
                            Chào mừng<br/>trở lại 👋
                        </div>
                        <div style={{ fontSize: '.8rem', color: '#7a9e87', marginBottom: '26px', fontWeight: 300 }}>
                            Đăng nhập để tiếp tục trải nghiệm Won Media
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div style={{ marginBottom: '15px' }}>
                                <label htmlFor="email" style={{ display: 'block', fontSize: '.7rem', fontWeight: 500, color: '#2d7a45', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '5px' }}>
                                    Email
                                </label>
                                <div className="input-wrap" style={{ position: 'relative' }}>
                                    <input type="email" id="email" name="email" placeholder="ten@wonmedia.com" required autoComplete="email" className="lf-input"/>
                                    <svg className="ico-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <rect x="2" y="4" width="20" height="16" rx="3"/>
                                        <path d="M2 7l10 7 10-7"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ marginBottom: '0' }}>
                                <label htmlFor="password" style={{ display: 'block', fontSize: '.7rem', fontWeight: 500, color: '#2d7a45', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '5px' }}>
                                    Mật khẩu
                                </label>
                                <div className="input-wrap" style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password" name="password"
                                        placeholder="••••••••" required
                                        autoComplete="current-password"
                                        className="lf-input lf-input-pw"
                                    />
                                    <svg className="ico-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        style={{ position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#b0cebb', display: 'flex', alignItems: 'center', padding: '2px' }}
                                    >
                                        {showPassword ? (
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#b91c1c', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '7px', marginTop: '12px' }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Remember + forgot */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 18px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '.78rem', color: '#5a8068', cursor: 'pointer', userSelect: 'none' }}>
                                    <input type="checkbox" style={{ width: '14px', height: '14px', accentColor: '#2d7a45', padding: 0, border: 'none', background: 'none', boxShadow: 'none' }}/>
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>

                            <button type="submit" disabled={loading} className="btn-login">
                                {loading ? (
                                    <>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                        </svg>
                                        Đang đăng nhập...
                                    </>
                                ) : 'Đăng nhập'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0 14px' }}>
                            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e0ede6' }}/>
                            <span style={{ fontSize: '.72rem', color: '#a8c4b0', whiteSpace: 'nowrap' }}>hoặc</span>
                            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e0ede6' }}/>
                        </div>

                        <div style={{ textAlign: 'center', fontSize: '.78rem', color: '#7a9e87' }}>
                            © {new Date().getFullYear()} WonMedia · Hệ thống quản lý nội dung nội bộ
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
