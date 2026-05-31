'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
                body: JSON.stringify({
                    email: fd.get('email'),
                    password: fd.get('password'),
                }),
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
        <div
            style={{
                minHeight: '100vh',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                fontFamily: 'var(--font-primary), system-ui, sans-serif',
            }}
        >
            {/* ─── Left panel: Form ─── */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '48px',
                    background: '#ffffff',
                }}
            >
                {/* Logo */}
                <div style={{ width: '100%', maxWidth: '400px', marginBottom: '40px' }}>
                    <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <span
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: 'var(--nic-g2)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '14px',
                            }}
                        >
                            W
                        </span>
                        <span style={{ color: '#111827', fontWeight: 700, fontSize: '15px' }}>WonMedia</span>
                    </a>
                </div>

                {/* Form card */}
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                        Welcome back!
                    </h1>
                    <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '28px', lineHeight: 1.5 }}>
                        Please enter your credentials to{' '}
                        <span style={{ color: 'var(--nic-indigo)', fontWeight: 500 }}>sign in!</span>
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Email */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label
                                htmlFor="email"
                                style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="admin@wonmedia.com"
                                style={{
                                    width: '100%',
                                    padding: '11px 14px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    color: '#111827',
                                    outline: 'none',
                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                    boxSizing: 'border-box',
                                    background: '#fff',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--nic-indigo)'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#E5E7EB'
                                    e.target.style.boxShadow = 'none'
                                }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label
                                htmlFor="password"
                                style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}
                            >
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%',
                                        padding: '11px 44px 11px 14px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        color: '#111827',
                                        outline: 'none',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        boxSizing: 'border-box',
                                        background: '#fff',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--nic-indigo)'
                                        e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#E5E7EB'
                                        e.target.style.boxShadow = 'none'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#9CA3AF',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '4px',
                                    }}
                                >
                                    {showPassword ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <a
                                href="/auth/forgot-password"
                                style={{
                                    fontSize: '13px',
                                    color: 'var(--nic-indigo)',
                                    textDecoration: 'none',
                                    alignSelf: 'flex-start',
                                    marginTop: '2px',
                                }}
                            >
                                Forgot password
                            </a>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                style={{
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    background: '#FEF2F2',
                                    border: '1px solid rgba(220,38,38,0.2)',
                                    color: '#B91C1C',
                                    fontSize: '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Sign In button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                background: loading
                                    ? '#9CA3AF'
                                    : 'linear-gradient(135deg, #6366F1, #4338CA)',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 600,
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'opacity 0.2s, transform 0.2s',
                                boxShadow: loading ? 'none' : '0 4px 14px -4px rgba(99,102,241,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                            }}
                        >
                            {loading ? (
                                <>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            margin: '20px 0',
                        }}
                    >
                        <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                        <span style={{ fontSize: '12px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                            or continue with
                        </span>
                        <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
                    </div>

                    {/* Social buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <button
                            type="button"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                background: '#fff',
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#374151',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#fff')}
                        >
                            {/* Google G icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>

                        <button
                            type="button"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                background: '#fff',
                                fontSize: '13px',
                                fontWeight: 500,
                                color: '#374151',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F9FAFB')}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#fff')}
                        >
                            {/* GitHub icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#111827" aria-hidden>
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            Github
                        </button>
                    </div>

                    {/* Sign up link */}
                    <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginTop: '20px' }}>
                        Don&apos;t have an account yet?{' '}
                        <a
                            href="/auth/register"
                            style={{ color: 'var(--nic-indigo)', fontWeight: 600, textDecoration: 'none' }}
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>

            {/* ─── Right panel: Showcase ─── */}
            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '64px 48px',
                    background: '#F3F4F6',
                    overflow: 'hidden',
                }}
            >
                {/* Dot pattern */}
                <svg
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.35,
                        pointerEvents: 'none',
                    }}
                >
                    <defs>
                        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="1" cy="1" r="1" fill="#9CA3AF" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>

                <div style={{ position: 'relative', maxWidth: '480px' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', lineHeight: 1.2, marginBottom: '16px' }}>
                        Your app,{' '}
                        <span
                            style={{
                                background: 'var(--nic-g2)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            supercharged.
                        </span>
                    </h2>
                    <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.7, marginBottom: '32px' }}>
                        From elegant UI components to thoughtful page designs, WonMedia gives you all the tools to build scalable, high-performance web experiences with ease.
                    </p>

                    {/* Mock dashboard preview */}
                    <div
                        style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
                            border: '1px solid #E5E7EB',
                            background: '#fff',
                        }}
                    >
                        {/* Window chrome */}
                        <div
                            style={{
                                padding: '10px 16px',
                                borderBottom: '1px solid #F3F4F6',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#FAFAFA',
                            }}
                        >
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FC8181' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F6AD55' }} />
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#68D391' }} />
                            <div
                                style={{
                                    flex: 1,
                                    height: '20px',
                                    borderRadius: '4px',
                                    background: '#E5E7EB',
                                    marginLeft: '8px',
                                }}
                            />
                        </div>

                        {/* Fake table rows */}
                        <div style={{ padding: '0' }}>
                            {/* Header */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                                    padding: '8px 14px',
                                    background: '#F9FAFB',
                                    borderBottom: '1px solid #F3F4F6',
                                    gap: '8px',
                                }}
                            >
                                {['Name', 'Email', 'Role', 'Status'].map((h) => (
                                    <div key={h} style={{ height: '8px', borderRadius: '4px', background: '#D1D5DB', width: h === 'Name' ? '60%' : '80%' }} />
                                ))}
                            </div>

                            {/* Rows */}
                            {[
                                ['#6366F1', '#34D4B8', '#FCD34D'],
                                ['#818CF8', '#6366F1', '#34D4B8'],
                                ['#34D4B8', '#FCD34D', '#6366F1'],
                                ['#FCD34D', '#818CF8', '#34D4B8'],
                            ].map((colors, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                                        padding: '9px 14px',
                                        borderBottom: '1px solid #F9FAFB',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: colors[0], flexShrink: 0 }} />
                                        <div style={{ height: '7px', borderRadius: '4px', background: '#E5E7EB', flex: 1 }} />
                                    </div>
                                    <div style={{ height: '7px', borderRadius: '4px', background: '#E5E7EB', width: '85%' }} />
                                    <div
                                        style={{
                                            height: '18px',
                                            borderRadius: '20px',
                                            background: `${colors[1]}22`,
                                            border: `1px solid ${colors[1]}44`,
                                            width: '64px',
                                        }}
                                    />
                                    <div style={{ height: '7px', borderRadius: '4px', background: '#E5E7EB', width: '70%' }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Feature bullets */}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap' }}>
                        {[
                            { icon: '⚡', text: 'Fast & Reliable' },
                            { icon: '🔒', text: 'Secure by default' },
                            { icon: '🌐', text: 'Multi-language' },
                        ].map((f) => (
                            <div
                                key={f.text}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    color: '#4B5563',
                                    fontWeight: 500,
                                }}
                            >
                                <span>{f.icon}</span>
                                {f.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Spinner keyframe */}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .login-grid { grid-template-columns: 1fr !important; }
                    .login-right { display: none !important; }
                }
            `}</style>
        </div>
    )
}
