import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { redirect } from 'next/navigation'
import { ToastProvider } from '@/components/admin/toast-provider'
import AdminShell from './AdminShell'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

async function getUserFromCookie() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)
    const jwt = payload as { id?: string; name?: string; role?: string; email?: string; tokenVersion?: number }

    if (jwt.id) {
      await connectDB()
      const dbUser = await User.findById(jwt.id).select('tokenVersion name role email').lean() as {
        tokenVersion?: number; name?: string; role?: string; email?: string
      } | null
      if (!dbUser) return null
      if ((dbUser.tokenVersion ?? 0) !== (jwt.tokenVersion ?? 0)) return null
      return { name: dbUser.name, role: dbUser.role, email: dbUser.email }
    }

    return jwt
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
