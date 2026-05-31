'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Menu, ExternalLink, LogOut } from 'lucide-react'

const PAGE_TITLES: Record<string, string> = {
  admin:       'Tổng quan',
  posts:       'Bài viết',
  homepage:    'Trang chủ',
  'gioi-thieu': 'Giới thiệu',
  'lien-he':   'Liên hệ',
  users:       'Người dùng',
  settings:    'Cài đặt',
  new:         'Tạo bài viết mới',
}

const ROLE_LABELS: Record<string, string> = {
  superadmin: 'Quản trị viên',
  admin:      'Quản trị viên',
  user:       'Người dùng',
}

interface Props {
  userName: string
  userRole: string
  onMenuToggle: () => void
}

export default function AdminHeader({ userName, userRole, onMenuToggle }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const segments = pathname.split('/').filter(Boolean)
  const pageTitle = PAGE_TITLES[segments[2]] || PAGE_TITLES[segments[1]] || 'Admin'

  const initials = userName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="dh-header">
      <button onClick={onMenuToggle} className="dh-hamburger" aria-label="Mở menu">
        <Menu size={20} />
      </button>

      <h1 className="dh-header-title">{pageTitle}</h1>

      <div className="dh-header-right">
        <Link href="/vi" target="_blank" rel="noopener noreferrer" className="dh-header-site-btn">
          <ExternalLink size={13} />
          <span className="dh-header-site-label">Trang chủ</span>
        </Link>

        <div className="dh-user-pill">
          <div className="dh-user-avatar">{initials}</div>
          <div className="dh-user-info">
            <span className="dh-user-name">{userName}</span>
            <span className="dh-user-role">{ROLE_LABELS[userRole] ?? userRole}</span>
          </div>
          <button onClick={handleLogout} className="dh-logout-btn" title="Đăng xuất">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  )
}
