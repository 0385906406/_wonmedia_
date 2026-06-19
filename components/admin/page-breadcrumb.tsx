'use client'

import { usePathname } from 'next/navigation'
import { HomeIcon, ChevronRightIcon } from 'lucide-react'

const SEGMENT_LABELS: Record<string, string> = {
    admin:       'Trang chủ',
    settings:    'Cài đặt',
    products:    'Sản phẩm',
    orders:      'Đơn hàng',
    users:       'Người dùng',
    new:         'Thêm mới',
    edit:        'Chỉnh sửa',
    details:     'Chi tiết',
    analytics:   'Phân tích',
    customers:   'Khách hàng',
    projects:    'Dự án',
    dashboard:   'Bảng điều khiển',
}

interface Crumb {
    label: string
    href: string
    isCurrent: boolean
}

function buildCrumbs(pathname: string): Crumb[] {
    const segments = pathname.split('/').filter(Boolean)
    return segments.map((seg, i) => ({
        label: SEGMENT_LABELS[seg] ?? seg,
        href: '/' + segments.slice(0, i + 1).join('/'),
        isCurrent: i === segments.length - 1,
    }))
}

export function PageBreadcrumb() {
    const pathname = usePathname()
    const crumbs = buildCrumbs(pathname)

    if (crumbs.length <= 1) return null

    return (
        <nav aria-label="Đường dẫn trang" className="flex items-center gap-0.5">
            {crumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-0.5">
                    {i > 0 && (
                        <ChevronRightIcon
                            className="mx-1 size-3"
                            style={{ color: 'var(--nic-gray-border)' }}
                            aria-hidden
                        />
                    )}

                    {i === 0 ? (
                        <a
                            href={crumb.href}
                            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted"
                            style={{ color: 'var(--nic-gray-text)' }}
                        >
                            <HomeIcon className="size-3.5 shrink-0" />
                            <span className="hidden sm:inline">{crumb.label}</span>
                        </a>
                    ) : crumb.isCurrent ? (
                        <span
                            className="rounded-md px-2 py-1 text-sm font-medium"
                            style={{ color: 'var(--nic-text)' }}
                            aria-current="page"
                        >
                            {crumb.label}
                        </span>
                    ) : (
                        <a
                            href={crumb.href}
                            className="rounded-md px-2 py-1 text-sm transition-colors hover:bg-muted"
                            style={{ color: 'var(--nic-gray-text)' }}
                        >
                            {crumb.label}
                        </a>
                    )}
                </span>
            ))}
        </nav>
    )
}
