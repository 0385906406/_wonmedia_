'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NewPostRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/posts/new-post') }, [router])
  return null
}
