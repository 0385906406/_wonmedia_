'use client'

import {
    createContext, useCallback, useContext, useEffect, useRef, useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
    CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon, XIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
    id: string
    type: ToastType
    message: string
    description?: string
    duration: number
    leaving: boolean
}

interface ToastCtx {
    success: (msg: string, desc?: string, dur?: number) => void
    error:   (msg: string, desc?: string, dur?: number) => void
    warning: (msg: string, desc?: string, dur?: number) => void
    info:    (msg: string, desc?: string, dur?: number) => void
    dismiss: (id: string) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastCtx | null>(null)

export function useToast(): ToastCtx {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
    return ctx
}

// ─── Config per type ──────────────────────────────────────────────────────────

const CONFIG: Record<ToastType, { color: string; bg: string; Icon: React.ElementType }> = {
    success: {
        color: '#00A98F',
        bg:    '#E6F7F3',
        Icon:  CheckCircleIcon,
    },
    error: {
        color: '#DC2626',
        bg:    '#FEF2F2',
        Icon:  XCircleIcon,
    },
    warning: {
        color: '#B45309',
        bg:    '#FEF3C7',
        Icon:  AlertTriangleIcon,
    },
    info: {
        color: '#0F4C81',
        bg:    '#EAF1F8',
        Icon:  InfoIcon,
    },
}

// ─── Single Toast Card ────────────────────────────────────────────────────────

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
    const cfg = CONFIG[item.type]
    const [progress, setProgress] = useState(100)
    const startRef = useRef<number | null>(null)
    const rafRef   = useRef<number | null>(null)
    const pausedAt = useRef<number | null>(null)
    const remaining = useRef(item.duration)

    // Animate progress bar
    useEffect(() => {
        function tick(now: number) {
            if (!startRef.current) startRef.current = now
            const elapsed  = now - startRef.current
            const pct      = Math.max(0, 100 - (elapsed / item.duration) * 100)
            setProgress(pct)
            if (pct > 0) rafRef.current = requestAnimationFrame(tick)
            else onDismiss(item.id)
        }
        rafRef.current = requestAnimationFrame(tick)
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
    }, []) // eslint-disable-line

    function handleMouseEnter() {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        pausedAt.current = Date.now()
    }
    function handleMouseLeave() {
        if (pausedAt.current) {
            // Adjust start so remaining time is correct
            const pausedDuration = Date.now() - pausedAt.current
            if (startRef.current) startRef.current += pausedDuration
            pausedAt.current = null
        }
        function tick(now: number) {
            if (!startRef.current) startRef.current = now
            const elapsed = now - startRef.current
            const pct     = Math.max(0, 100 - (elapsed / item.duration) * 100)
            setProgress(pct)
            if (pct > 0) rafRef.current = requestAnimationFrame(tick)
            else onDismiss(item.id)
        }
        rafRef.current = requestAnimationFrame(tick)
    }

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                animation: item.leaving
                    ? 'toast-out 0.28s cubic-bezier(0.4,0,1,1) forwards'
                    : 'toast-in  0.35s cubic-bezier(0.2,0.8,0.2,1) both',
                borderLeft: `4px solid ${cfg.color}`,
                boxShadow: '0 8px 24px -8px rgba(15,76,129,0.18), 0 2px 8px -4px rgba(15,76,129,0.10)',
            }}
            className="relative w-[360px] overflow-hidden rounded-xl bg-white border border-gray-100 pointer-events-auto"
        >
            <div className="flex items-start gap-3 px-4 py-3.5 pr-10">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background: cfg.bg }}>
                    <cfg.Icon className="size-4" style={{ color: cfg.color }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug" style={{ color: '#1A1F2E' }}>
                        {item.message}
                    </p>
                    {item.description && (
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#334155' }}>
                            {item.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Close button */}
            <button
                onClick={() => onDismiss(item.id)}
                className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
                <XIcon className="size-3.5" />
            </button>

            {/* Progress bar */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[3px] origin-left rounded-b-xl transition-none"
                style={{
                    background: cfg.color,
                    opacity: 0.6,
                    transform: `scaleX(${progress / 100})`,
                    transformOrigin: 'left',
                }}
            />
        </div>
    )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

let idCounter = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const dismiss = useCallback((id: string) => {
        // Mark as leaving → animate out → remove
        setToasts((prev) => prev.map((t) => t.id === id ? { ...t, leaving: true } : t))
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 300)
    }, [])

    const add = useCallback((type: ToastType, msg: string, desc?: string, dur = 4000) => {
        const id = `toast-${++idCounter}`
        setToasts((prev) => [...prev, { id, type, message: msg, description: desc, duration: dur, leaving: false }])
    }, [])

    const ctx: ToastCtx = {
        success: (m, d, dur) => add('success', m, d, dur),
        error:   (m, d, dur) => add('error',   m, d, dur),
        warning: (m, d, dur) => add('warning', m, d, dur),
        info:    (m, d, dur) => add('info',    m, d, dur),
        dismiss,
    }

    return (
        <ToastContext.Provider value={ctx}>
            {children}

            {/* Portal: góc trên phải */}
            {mounted && createPortal(
                <>
                    <style>{`
                        @keyframes toast-in {
                            from { opacity: 0; transform: translateX(110%) scale(0.96); }
                            to   { opacity: 1; transform: translateX(0)    scale(1);    }
                        }
                        @keyframes toast-out {
                            from { opacity: 1; transform: translateX(0)    scale(1);    max-height: 120px; margin-bottom: 0; }
                            to   { opacity: 0; transform: translateX(110%) scale(0.96); max-height: 0;     margin-bottom: -8px; }
                        }
                    `}</style>
                    <div
                        aria-live="polite"
                        className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none"
                        style={{ maxWidth: 360 }}
                    >
                        {toasts.map((t) => (
                            <ToastCard key={t.id} item={t} onDismiss={dismiss} />
                        ))}
                    </div>
                </>,
                document.body
            )}
        </ToastContext.Provider>
    )
}
