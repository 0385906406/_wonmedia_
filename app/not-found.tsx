'use client'

import Link from 'next/link'

export default function NotFound() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

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

                @keyframes leafDrift1 {
                    0%   { transform: translate(0,0) rotate(20deg); opacity:.18; }
                    30%  { transform: translate(28px, 60px) rotate(38deg); opacity:.22; }
                    60%  { transform: translate(12px, 130px) rotate(25deg); opacity:.15; }
                    100% { transform: translate(40px, 220px) rotate(45deg); opacity:0; }
                }
                @keyframes leafDrift2 {
                    0%   { transform: translate(0,0) rotate(-15deg); opacity:.14; }
                    40%  { transform: translate(-22px, 80px) rotate(-30deg); opacity:.2; }
                    100% { transform: translate(-10px, 200px) rotate(-20deg); opacity:0; }
                }
                @keyframes leafDrift3 {
                    0%   { transform: translate(0,0) rotate(5deg) scale(1); opacity:.16; }
                    50%  { transform: translate(18px, 100px) rotate(-10deg) scale(.95); opacity:.2; }
                    100% { transform: translate(30px, 230px) rotate(15deg) scale(.9); opacity:0; }
                }
                @keyframes leafDrift4 {
                    0%   { transform: translate(0,0) rotate(-25deg); opacity:.12; }
                    35%  { transform: translate(-30px, 70px) rotate(-10deg); opacity:.18; }
                    100% { transform: translate(-15px, 190px) rotate(-35deg); opacity:0; }
                }
                @keyframes pageIn {
                    from { opacity:0; transform:translateY(18px); }
                    to   { opacity:1; transform:none; }
                }
                @keyframes numIn {
                    from { opacity:0; transform:scale(.9) translateY(10px); }
                    to   { opacity:1; transform:none; }
                }
                @keyframes textFadeIn {
                    from { opacity:0; transform: translateY(6px); }
                    to   { opacity:1; transform: translateY(0); }
                }

                .leaf-text-group {
                    opacity: 0;
                    animation: textFadeIn 1s ease forwards;
                    animation-delay: 1.2s;
                }

                .fl1 { animation: leafDrift1 9s ease-in-out infinite; }
                .fl2 { animation: leafDrift2 11s ease-in-out infinite; animation-delay: 1.5s; }
                .fl3 { animation: leafDrift3 8s ease-in-out infinite; animation-delay: 3s; }
                .fl4 { animation: leafDrift4 13s ease-in-out infinite; animation-delay: 0.8s; }

                .nf-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 13px 28px;
                    background: linear-gradient(135deg,#1a4d2e 0%,#3fa85e 100%);
                    color: #fff; border: none; border-radius: 12px;
                    font-family: 'DM Sans', sans-serif; font-size: .92rem; font-weight: 500;
                    letter-spacing: .04em; text-decoration: none; cursor: pointer;
                    position: relative; overflow: hidden;
                    box-shadow: 0 6px 22px rgba(30,80,50,.28);
                    transition: transform .15s, box-shadow .2s;
                }
                .nf-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(30,80,50,.36); }
                .nf-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,.18) 0%,transparent 60%); pointer-events:none; }
            `}</style>

            <div style={{
                fontFamily: "'DM Sans', sans-serif",
                background: 'radial-gradient(ellipse at 30% 50%, #d8f0e2 0%, #edf7f1 60%)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
            }}>

                {/* ── Floating leaves (background) ── */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>

                    {/* Leaf 1 — top left */}
                    <div className="fl1" style={{ position: 'absolute', top: '8%', left: '12%', width: '70px', height: '112px' }}>
                        <svg viewBox="0 0 420 750" width="70" height="112">
                            <defs>
                                <linearGradient id="flbg1" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#12381f"/><stop offset="100%" stopColor="#3fa85e"/>
                                </linearGradient>
                            </defs>
                            <path d="M210 8 C295 55,415 185,420 330 C425 470,355 625,272 705 C248 728,228 742,210 746 C192 742,172 728,148 705 C65 625,-5 470,0 330 C5 185,125 55,210 8 Z" fill="url(#flbg1)"/>
                        </svg>
                    </div>

                    {/* Leaf 2 — top right */}
                    <div className="fl2" style={{ position: 'absolute', top: '5%', right: '15%', width: '50px', height: '80px' }}>
                        <svg viewBox="0 0 420 750" width="50" height="80">
                            <defs>
                                <linearGradient id="flbg2" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#2d7a45"/><stop offset="100%" stopColor="#60cc7c"/>
                                </linearGradient>
                            </defs>
                            <path d="M210 8 C295 55,415 185,420 330 C425 470,355 625,272 705 C248 728,228 742,210 746 C192 742,172 728,148 705 C65 625,-5 470,0 330 C5 185,125 55,210 8 Z" fill="url(#flbg2)"/>
                        </svg>
                    </div>

                    {/* Leaf 3 — middle right */}
                    <div className="fl3" style={{ position: 'absolute', top: '25%', right: '6%', width: '90px', height: '144px' }}>
                        <svg viewBox="0 0 420 750" width="90" height="144">
                            <defs>
                                <linearGradient id="flbg3" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1a4d2e"/><stop offset="100%" stopColor="#4ebe6f"/>
                                </linearGradient>
                            </defs>
                            <path d="M210 8 C295 55,415 185,420 330 C425 470,355 625,272 705 C248 728,228 742,210 746 C192 742,172 728,148 705 C65 625,-5 470,0 330 C5 185,125 55,210 8 Z" fill="url(#flbg3)"/>
                        </svg>
                    </div>

                    {/* Leaf 4 — bottom left */}
                    <div className="fl4" style={{ position: 'absolute', bottom: '10%', left: '8%', width: '60px', height: '96px' }}>
                        <svg viewBox="0 0 420 750" width="60" height="96">
                            <defs>
                                <linearGradient id="flbg4" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#0e2e1a"/><stop offset="100%" stopColor="#3fa85e"/>
                                </linearGradient>
                            </defs>
                            <path d="M210 8 C295 55,415 185,420 330 C425 470,355 625,272 705 C248 728,228 742,210 746 C192 742,172 728,148 705 C65 625,-5 470,0 330 C5 185,125 55,210 8 Z" fill="url(#flbg4)"/>
                        </svg>
                    </div>
                </div>

                {/* ── Card ── */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    width: '900px', height: '520px',
                    background: '#fff',
                    borderRadius: '30px',
                    boxShadow: '0 40px 100px rgba(30,80,50,0.15), 0 8px 24px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    display: 'flex',
                    animation: 'pageIn .9s cubic-bezier(.22,1,.36,1) both',
                }}>

                    {/* ── Leaf SVG (left, full height) ── */}
                    <svg
                        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'visible', width: '100%', height: '100%' }}
                        viewBox="0 0 900 520"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="lbg404" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%"   stopColor="#12381f"/>
                                <stop offset="30%"  stopColor="#2d7a45"/>
                                <stop offset="65%"  stopColor="#3fa85e"/>
                                <stop offset="100%" stopColor="#60cc7c"/>
                            </linearGradient>
                            <linearGradient id="lhl404" x1="0%" y1="0%" x2="80%" y2="100%">
                                <stop offset="0%"   stopColor="#80e89c" stopOpacity=".22"/>
                                <stop offset="100%" stopColor="#1a4d2e" stopOpacity="0"/>
                            </linearGradient>
                            <linearGradient id="sheen404" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%"   stopColor="white" stopOpacity="0"/>
                                <stop offset="42%"  stopColor="white" stopOpacity=".2"/>
                                <stop offset="58%"  stopColor="white" stopOpacity=".24"/>
                                <stop offset="100%" stopColor="white" stopOpacity="0"/>
                            </linearGradient>
                            <filter id="leafShadow404" x="-15%" y="-10%" width="140%" height="130%">
                                <feDropShadow dx="8" dy="14" stdDeviation="20" floodColor="#0f3020" floodOpacity=".22"/>
                            </filter>
                            <clipPath id="lclip404">
                                <path d="M210 8 C295 55,415 185,420 330 C425 470,355 625,272 705 C248 728,228 742,210 746 C192 742,172 728,148 705 C65 625,-5 470,0 330 C5 185,125 55,210 8 Z"/>
                            </clipPath>
                        </defs>

                        <g
                            filter="url(#leafShadow404)"
                            style={{
                                transformOrigin: '155px 72px',
                                transform: 'rotate(-32deg) translate(-55px, -38px)',
                                animation: 'windSway 7s ease-in-out infinite',
                            }}
                        >
                            <g clipPath="url(#lclip404)">
                                <rect x="-25" y="0" width="480" height="760" fill="url(#lbg404)"/>
                                <rect x="-25" y="0" width="480" height="760" fill="url(#lhl404)"/>
                                <g fill="none" strokeLinecap="round">
                                    <path className="vm d0" d="M210 16 C210 220,210 520,210 742" stroke="rgba(255,255,255,.48)" strokeWidth="2.8"/>
                                    <path className="vp d1" d="M210 118 C174 138,132 157,62 182"  stroke="rgba(255,255,255,.30)" strokeWidth="1.7"/>
                                    <path className="vp d2" d="M210 188 C168 212,122 234,46 265"  stroke="rgba(255,255,255,.28)" strokeWidth="1.6"/>
                                    <path className="vp d3" d="M210 262 C166 288,118 310,38 345"  stroke="rgba(255,255,255,.26)" strokeWidth="1.5"/>
                                    <path className="vp d4" d="M210 336 C168 362,126 380,50 412"  stroke="rgba(255,255,255,.24)" strokeWidth="1.4"/>
                                    <path className="vp d5" d="M210 405 C176 426,142 443,82 468"  stroke="rgba(255,255,255,.22)" strokeWidth="1.3"/>
                                    <path className="vp d6" d="M210 468 C186 482,160 496,116 514" stroke="rgba(255,255,255,.19)" strokeWidth="1.1"/>
                                    <path className="vp d1" d="M210 118 C246 138,288 157,358 182"  stroke="rgba(255,255,255,.30)" strokeWidth="1.7"/>
                                    <path className="vp d2" d="M210 188 C252 212,298 234,374 265"  stroke="rgba(255,255,255,.28)" strokeWidth="1.6"/>
                                    <path className="vp d3" d="M210 262 C254 288,302 310,382 345"  stroke="rgba(255,255,255,.26)" strokeWidth="1.5"/>
                                    <path className="vp d4" d="M210 336 C252 362,294 380,370 412"  stroke="rgba(255,255,255,.24)" strokeWidth="1.4"/>
                                    <path className="vp d5" d="M210 405 C244 426,278 443,338 468"  stroke="rgba(255,255,255,.22)" strokeWidth="1.3"/>
                                    <path className="vp d6" d="M210 468 C234 482,260 496,304 514" stroke="rgba(255,255,255,.19)" strokeWidth="1.1"/>
                                    <path className="vs d8"  d="M174 140 C154 152,132 163,104 175" stroke="rgba(255,255,255,.19)" strokeWidth=".85"/>
                                    <path className="vs d9"  d="M168 216 C145 231,118 246,84  263" stroke="rgba(255,255,255,.19)" strokeWidth=".85"/>
                                    <path className="vs d10" d="M165 293 C140 310,112 325,72  345" stroke="rgba(255,255,255,.18)" strokeWidth=".8"/>
                                    <path className="vs d11" d="M164 366 C140 384,114 398,78  415" stroke="rgba(255,255,255,.17)" strokeWidth=".78"/>
                                    <path className="vs d8"  d="M246 140 C266 152,288 163,316 175" stroke="rgba(255,255,255,.19)" strokeWidth=".85"/>
                                    <path className="vs d9"  d="M252 216 C275 231,302 246,336 263" stroke="rgba(255,255,255,.19)" strokeWidth=".85"/>
                                    <path className="vs d10" d="M255 293 C280 310,308 325,348 345" stroke="rgba(255,255,255,.18)" strokeWidth=".8"/>
                                    <path className="vs d11" d="M256 366 C280 384,306 398,342 415" stroke="rgba(255,255,255,.17)" strokeWidth=".78"/>
                                </g>
                                <rect x="-80" y="0" width="300" height="760" fill="url(#sheen404)"
                                    style={{ animation: 'sheenMove 5.5s ease-in-out infinite' }}/>
                                <path d="M210 8 C295 55,415 185,420 330 C425 470,355 625,272 705 C248 728,228 742,210 746 C192 742,172 728,148 705 C65 625,-5 470,0 330 C5 185,125 55,210 8 Z"
                                    fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10"/>
                            </g>
                            <path d="M210 744 C206 768,204 790,210 806" stroke="#12381f" strokeWidth="4.5" fill="none" strokeLinecap="round" opacity=".55"/>

                            {/* Text on leaf */}
                            <g className="leaf-text-group" transform="translate(210, 330)">
                                <line x1="-50" y1="-100" x2="50" y2="-100" stroke="rgba(255,255,255,.35)" strokeWidth="1" strokeLinecap="round"/>
                                <g transform="translate(0,-80)">
                                    <circle cx="0" cy="0" r="18" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.3)" strokeWidth="1.2"/>
                                    <path d="M-7 -5 L-4 7 L0 -2 L4 7 L7 -5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                                </g>
                                <text x="0" y="-38" fontFamily="Cormorant Garamond, serif" fontSize="24" fontWeight="700" fill="white" textAnchor="middle" letterSpacing="3">
                                    WON MEDIA
                                </text>
                                <text x="0" y="-16" fontFamily="Cormorant Garamond, serif" fontSize="11" fontStyle="italic" fill="rgba(255,255,255,.72)" textAnchor="middle" letterSpacing="1.5">
                                    Stories that grow from the ground up
                                </text>
                                <g fill="rgba(255,255,255,.4)">
                                    <circle cx="-30" cy="-2" r="1.5"/><circle cx="0" cy="-2" r="1.5"/><circle cx="30" cy="-2" r="1.5"/>
                                </g>
                                <text x="0" y="18" fontFamily="Cormorant Garamond, serif" fontSize="12" fontWeight="600" fill="rgba(255,255,255,.85)" textAnchor="middle" letterSpacing=".5">
                                    Mỗi trang là một hành trình.
                                </text>
                                <text x="0" y="36" fontFamily="Cormorant Garamond, serif" fontSize="12" fontWeight="600" fill="rgba(255,255,255,.85)" textAnchor="middle" letterSpacing=".5">
                                    Trang này chưa tìm thấy.
                                </text>
                                <line x1="-35" y1="50" x2="35" y2="50" stroke="rgba(255,255,255,.3)" strokeWidth="1" strokeLinecap="round"/>
                                <text x="0" y="66" fontFamily="DM Sans, sans-serif" fontSize="8" fontWeight="300" fill="rgba(255,255,255,.4)" textAnchor="middle" letterSpacing="2">
                                    WONMEDIA.COM
                                </text>
                            </g>
                        </g>
                    </svg>

                    {/* ── Right: 404 content ── */}
                    <div style={{
                        position: 'relative', zIndex: 10,
                        marginLeft: 'auto',
                        width: '460px', height: '100%',
                        padding: '0 56px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        animation: 'pageIn 1s cubic-bezier(.22,1,.36,1) .2s both',
                    }}>

                        {/* 404 number */}
                        <div style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '9rem', fontWeight: 700, lineHeight: 1,
                            color: '#1a4d2e', letterSpacing: '-4px',
                            animation: 'numIn 1s cubic-bezier(.22,1,.36,1) .3s both',
                            opacity: 0,
                        }}>
                            404
                        </div>

                        {/* Decorative line */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0 20px' }}>
                            <div style={{ width: '32px', height: '2px', background: 'linear-gradient(90deg,#3fa85e,transparent)' }}/>
                            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontStyle: 'italic', color: '#7a9e87', letterSpacing: '.05em' }}>
                                Trang không tìm thấy
                            </span>
                        </div>

                        <p style={{ fontSize: '.85rem', color: '#000000', lineHeight: 1.75, marginBottom: '32px', fontWeight: 300 }}>
                            Có thể đường dẫn đã thay đổi, nội dung bị xoá,<br/>
                            hoặc bạn đang lạc vào khu rừng chưa được khai phá.
                        </p>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <Link href="/" className="nf-btn">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                    <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                                Về trang chủ
                            </Link>
                            <Link href="/admin" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '13px 24px',
                                background: 'transparent',
                                color: '#2d7a45', border: '1.5px solid #b8dfc5', borderRadius: '12px',
                                fontFamily: "'DM Sans', sans-serif", fontSize: '.9rem', fontWeight: 500,
                                textDecoration: 'none', transition: 'background .2s, border-color .2s',
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(63,168,94,.08)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#3fa85e'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#b8dfc5'; }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                                </svg>
                                Vào Admin
                            </Link>
                        </div>

                        {/* Footer */}
                        <div style={{ position: 'absolute', bottom: '28px', left: '56px', fontSize: '.75rem', color: '#000000', fontWeight: 300 }}>
                            © {new Date().getFullYear()} WonMedia CMS
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
