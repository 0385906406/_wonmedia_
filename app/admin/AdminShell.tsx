'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

interface Props {
  userName: string
  userRole: string
  children: React.ReactNode
}

export default function AdminShell({ userName, userRole, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="dh-admin-wrap">
      <AdminSidebar
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="dh-cms-main">
        <AdminHeader
          userName={userName}
          userRole={userRole}
          onMenuToggle={() => setMobileOpen((v) => !v)}
        />
        <main style={{ padding: '24px', minHeight: 'calc(100vh - 56px)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
