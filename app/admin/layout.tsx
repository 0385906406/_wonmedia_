import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { redirect } from 'next/navigation'
import { ToastProvider } from '@/components/admin/toast-provider'
import AdminShell from './AdminShell'

async function getUserFromCookie() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)
    return payload as { name?: string; role?: string; email?: string }
  } catch {
    return null
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserFromCookie()
  if (!user) redirect('/auth/login')

  return (
    <ToastProvider>
      <AdminShell userName={user.name ?? 'Admin'} userRole={user.role ?? 'admin'}>
        {children}
      </AdminShell>
    </ToastProvider>
  )
}
