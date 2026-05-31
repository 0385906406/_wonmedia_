'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, FileText, Home, LogOut,
  Settings, Phone, Info, Users,
} from 'lucide-react'

type NavItem =
  | { icon: React.ReactNode; label: string; href: string; divider?: false }
  | { divider: true; label: string }

const NAV_ITEMS: NavItem[] = [
  { icon: <LayoutDashboard size={16} />, label: 'Tổng quan',   href: '/admin' },
  { divider: true, label: 'NỘI DUNG' },
  { icon: <FileText size={16} />,       label: 'Bài viết',     href: '/admin/posts' },
  { divider: true, label: 'TRANG WEB' },
  { icon: <Home size={16} />,           label: 'Trang chủ',    href: '/admin/homepage' },
  { icon: <Info size={16} />,           label: 'Giới thiệu',   href: '/admin/gioi-thieu' },
  { icon: <Phone size={16} />,          label: 'Liên hệ',      href: '/admin/lien-he' },
  { divider: true, label: 'HỆ THỐNG' },
  { icon: <Users size={16} />,          label: 'Người dùng',   href: '/admin/users' },
  { icon: <Settings size={16} />,       label: 'Cài đặt',      href: '/admin/settings' },
]

interface Props {
  isMobileOpen: boolean
  onMobileClose: () => void
}

export default function AdminSidebar({ isMobileOpen, onMobileClose }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname.startsWith(href + '/')
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <>
      {isMobileOpen && (
        <div className="dh-sidebar-overlay" onClick={onMobileClose} />
      )}

      <aside className={`dh-sidebar${isMobileOpen ? ' open' : ''}`}>
        {/* Brand */}
        <div className="dh-sidebar-brand">
          <span className="dh-sidebar-brand-name">WON</span>
          <span className="dh-sidebar-brand-sub">Media</span>
        </div>

        {/* Nav */}
        <nav className="dh-sidebar-nav">
          {NAV_ITEMS.map((item, i) => {
            if (item.divider) {
              return (
                <div key={i} className="dh-sidebar-divider">{item.label}</div>
              )
            }
            const active = isActive(item.href!)
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={onMobileClose}
                className={`dh-nav-item${active ? ' active' : ''}`}
              >
                <span style={{ flexShrink: 0, opacity: active ? 1 : 0.8 }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="dh-sidebar-bottom">
          <Link href="/vi" className="dh-nav-item">
            <Home size={16} />
            <span>Về trang chủ</span>
          </Link>
          <button onClick={handleLogout} className="dh-nav-item">
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  )
}
