'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  PlusIcon, SearchIcon, PencilIcon, Trash2Icon,
  FileTextIcon, BriefcaseIcon, Loader2Icon, ImageIcon,
  ChevronLeftIcon, ChevronRightIcon,
} from 'lucide-react'

interface Post {
  _id: string; slug: string; type: 'blog' | 'tuyen-dung'
  thumbnail: string; date: string; showOnHomepage: boolean
  active: boolean; title: { vi: string; en: string }
  category: { vi: string }; createdAt: string
}

const INPUT_CLS = 'h-10 rounded-lg border-[#E5E8ED] bg-white text-[#1A1F2E] placeholder:text-[#94a3b8] focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/10 text-sm'

function PostsListInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Đọc từ URL — luôn đồng bộ sau mỗi navigate
  const q    = searchParams.get('q')    ?? ''
  const type = searchParams.get('type') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1')

  // Input riêng cho ô tìm kiếm (để user gõ thoải mái trước khi submit)
  const [inputQ, setInputQ] = useState(q)

  const [posts, setPosts]   = useState<Post[]>([])
  const [total, setTotal]   = useState(0)
  const [pages, setPages]   = useState(1)
  const [loading, setLoading] = useState(true)

  // Đồng bộ input khi URL thay đổi từ bên ngoài
  useEffect(() => { setInputQ(q) }, [q])

  const fetch_ = useCallback(() => {
    setLoading(true)
    const sp = new URLSearchParams()
    if (q)    sp.set('q', q)
    if (type) sp.set('type', type)
    sp.set('page', String(page))
    fetch(`/api/posts?${sp}`).then(r => r.json()).then(r => {
      if (r.data) { setPosts(r.data); setTotal(r.total); setPages(r.pages) }
    }).finally(() => setLoading(false))
  }, [q, type, page])

  useEffect(() => { fetch_() }, [fetch_])

  function navigate(params: Record<string, string>) {
    const sp = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([k, v]) => v ? sp.set(k, v) : sp.delete(k))
    router.push(`/admin/posts?${sp}`)
  }

  function submitSearch() {
    navigate({ q: inputQ, page: '1' })
  }

  async function deletePost(id: string) {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('Xoá thất bại. Vui lòng thử lại.')
      return
    }
    fetch_()
  }

  async function toggleActive(post: Post) {
    // Optimistic update
    setPosts(prev => prev.map(p => p._id === post._id ? { ...p, active: !p.active } : p))
    const res = await fetch(`/api/posts/${post._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !post.active }),
    })
    if (!res.ok) {
      // Rollback
      setPosts(prev => prev.map(p => p._id === post._id ? { ...p, active: post.active } : p))
      alert('Cập nhật thất bại')
    }
  }

  return (
    <div className="p-6 max-w-12xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
            <FileTextIcon size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#0f172a]">Bài viết</h1>
            <p className="text-xs text-[#64748b] mt-0.5">{total} bài · Blog & Tuyển dụng</p>
          </div>
        </div>
        <Button onClick={() => router.push('/admin/posts/new-post')} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
          <PlusIcon size={16} />Tạo bài viết
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <Input
            value={inputQ}
            onChange={e => setInputQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitSearch()}
            placeholder="Tìm theo tiêu đề, slug..."
            className={`${INPUT_CLS} pl-9`}
          />
        </div>

        {/* Category filter — same h-10 as input */}
        <div className="flex rounded-lg border border-[#E5E8ED] overflow-hidden bg-white h-10">
          {[
            { v: '', label: 'Tất cả' },
            { v: 'blog', label: 'Blog' },
            { v: 'tuyen-dung', label: 'Tuyển dụng' },
          ].map(({ v, label }, i, arr) => (
            <button
              key={v}
              onClick={() => navigate({ type: v, page: '1' })}
              className={`h-full px-4 text-sm font-medium transition-colors ${
                i < arr.length - 1 ? 'border-r border-[#E5E8ED]' : ''
              } ${
                type === v
                  ? 'bg-green-600 text-white'
                  : 'text-[#64748b] hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search button */}
        <Button onClick={submitSearch} className="h-10 gap-2 bg-green-600 hover:bg-green-700 text-white px-5">
          <SearchIcon size={14} />Tìm
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-[#E5E8ED] shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-[#64748b] py-16">
            <Loader2Icon size={18} className="animate-spin" />Đang tải...
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-[#94a3b8]">
            <FileTextIcon size={32} strokeWidth={1.5} />
            <p className="text-sm">Chưa có bài viết nào</p>
            <Button onClick={() => router.push('/admin/posts/new-post')} size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white mt-1">
              <PlusIcon size={14} />Tạo bài đầu tiên
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F1F5F9]">
                <th className="text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider px-4 py-3">Bài viết</th>
                <th className="text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Loại</th>
                <th className="text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider px-4 py-3 hidden md:table-cell">Ngày</th>
                <th className="text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider px-4 py-3">Kích hoạt</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-[#F1F5F9] flex-shrink-0 flex items-center justify-center">
                        {post.thumbnail
                          ? <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
                          : <ImageIcon size={16} className="text-[#94a3b8]" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#0f172a] truncate max-w-[280px]">
                          {post.title?.vi || '(Chưa có tiêu đề)'}
                        </p>
                        <p className="text-xs text-[#94a3b8] font-mono mt-0.5 truncate">{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className={`text-xs gap-1 ${post.type === 'blog' ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-orange-200 text-orange-600 bg-orange-50'}`}
                    >
                      {post.type === 'blog' ? <FileTextIcon size={10} /> : <BriefcaseIcon size={10} />}
                      {post.type === 'blog' ? 'Blog' : 'Tuyển dụng'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-[#64748b]">{post.date || '—'}</td>
                  <td className="px-4 py-3">
                    <Switch checked={post.active} onCheckedChange={() => toggleActive(post)} className="data-[state=checked]:bg-green-600" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost" size="icon"
                        className="h-8 w-8 text-[#64748b] hover:text-green-700 hover:bg-green-50"
                        onClick={() => router.push(`/admin/posts/${post._id}`)}
                      >
                        <PencilIcon size={14} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748b] hover:text-red-600 hover:bg-red-50">
                            <Trash2Icon size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bài <strong>{post.title?.vi}</strong> sẽ bị xóa vĩnh viễn.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deletePost(post._id)} className="bg-red-600 hover:bg-red-700">Xóa</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#F1F5F9]">
            <p className="text-xs text-[#94a3b8]">Trang {page} / {pages} · {total} bài</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => navigate({ page: String(page - 1) })} className="gap-1 border-[#E5E8ED]">
                <ChevronLeftIcon size={14} />Trước
              </Button>
              <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => navigate({ page: String(page + 1) })} className="gap-1 border-[#E5E8ED]">
                Tiếp<ChevronRightIcon size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PostsPage() {
  return <Suspense><PostsListInner /></Suspense>
}
