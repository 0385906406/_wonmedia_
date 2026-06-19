'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

function PostsListInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const q    = searchParams.get('q')    ?? ''
  const type = searchParams.get('type') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1')

  const [inputQ, setInputQ] = useState(q)
  const [posts, setPosts]   = useState<Post[]>([])
  const [total, setTotal]   = useState(0)
  const [pages, setPages]   = useState(1)
  const [loading, setLoading] = useState(true)

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

  function submitSearch() { navigate({ q: inputQ, page: '1' }) }

  async function deletePost(id: string) {
    if (!confirm('Xoá bài viết này?')) return
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    if (!res.ok) { alert('Xoá thất bại. Vui lòng thử lại.'); return }
    fetch_()
  }

  async function toggleActive(post: Post) {
    setPosts(prev => prev.map(p => p._id === post._id ? { ...p, active: !p.active } : p))
    const res = await fetch(`/api/posts/${post._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !post.active }),
    })
    if (!res.ok) {
      setPosts(prev => prev.map(p => p._id === post._id ? { ...p, active: post.active } : p))
      alert('Cập nhật thất bại')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="dh-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-navy-pale)', color: 'var(--color-navy)',
          }}>
            <FileTextIcon size={20} />
          </div>
          <div>
            <h1 className="dh-page-title">Bài viết</h1>
            <p className="dh-page-desc">{total} bài · Blog &amp; Tuyển dụng</p>
          </div>
        </div>
        <button onClick={() => router.push('/admin/posts/new-post')} className="dh-btn dh-btn-primary gap-2">
          <PlusIcon size={16} />Tạo bài viết
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <SearchIcon size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-text)', opacity: 0.5 }} />
          <input
            value={inputQ}
            onChange={e => setInputQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitSearch()}
            placeholder="Tìm theo tiêu đề, slug..."
            className="dh-input"
            style={{ paddingLeft: 34 }}
          />
        </div>

        <div style={{ display: 'flex', borderRadius: 8, border: '1px solid var(--color-gray-border)', overflow: 'hidden', background: 'white', height: 40 }}>
          {[
            { v: '', label: 'Tất cả' },
            { v: 'blog', label: 'Blog' },
            { v: 'tuyen-dung', label: 'Tuyển dụng' },
          ].map(({ v, label }, i, arr) => (
            <button
              key={v}
              onClick={() => navigate({ type: v, page: '1' })}
              style={{
                height: '100%', padding: '0 16px', fontSize: 13, fontWeight: 500,
                borderRight: i < arr.length - 1 ? '1px solid var(--color-gray-border)' : 'none',
                background: type === v ? 'var(--color-navy)' : 'transparent',
                color: type === v ? 'white' : 'var(--color-gray-text)',
                cursor: 'pointer', border: 'none',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <button onClick={submitSearch} className="dh-btn dh-btn-primary gap-2" style={{ height: 40 }}>
          <SearchIcon size={14} />Tìm
        </button>
      </div>

      <div className="dh-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--color-gray-text)', padding: '64px 0' }}>
            <Loader2Icon size={18} className="animate-spin" />Đang tải...
          </div>
        ) : posts.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '64px 0', color: '#94a3b8' }}>
            <FileTextIcon size={32} strokeWidth={1.5} />
            <p style={{ fontSize: 14 }}>Chưa có bài viết nào</p>
            <button onClick={() => router.push('/admin/posts/new-post')} className="dh-btn dh-btn-primary dh-btn-sm gap-2" style={{ marginTop: 4 }}>
              <PlusIcon size={14} />Tạo bài đầu tiên
            </button>
          </div>
        ) : (
          <table className="dh-table">
            <thead>
              <tr>
                <th>Bài viết</th>
                <th className="hidden sm:table-cell">Loại</th>
                <th className="hidden md:table-cell">Ngày</th>
                <th>Kích hoạt</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 40, borderRadius: 8, overflow: 'hidden', background: 'var(--color-gray-light)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {post.thumbnail
                          ? <img src={post.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <ImageIcon size={16} style={{ color: '#94a3b8' }} />}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-navy-deep)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 280 }}>
                          {post.title?.vi || '(Chưa có tiêu đề)'}
                        </p>
                        <p style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className={`dh-badge ${post.type === 'blog' ? 'dh-badge-indigo' : 'dh-badge-yellow'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {post.type === 'blog' ? <FileTextIcon size={10} /> : <BriefcaseIcon size={10} />}
                      {post.type === 'blog' ? 'Blog' : 'Tuyển dụng'}
                    </span>
                  </td>
                  <td className="hidden md:table-cell" style={{ fontSize: 12, color: 'var(--color-gray-text)' }}>{post.date || '—'}</td>
                  <td>
                    <button onClick={() => toggleActive(post)} className={`dh-toggle ${post.active ? 'on' : 'off'}`}>
                      <span className="dh-toggle-knob" />
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                      <button
                        className="dh-btn-icon"
                        onClick={() => router.push(`/admin/posts/${post._id}`)}
                        title="Chỉnh sửa"
                      >
                        <PencilIcon size={14} />
                      </button>
                      <button
                        className="dh-btn-icon"
                        onClick={() => deletePost(post._id)}
                        title="Xoá"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2Icon size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--color-gray-border)' }}>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>Trang {page} / {pages} · {total} bài</p>
            <div className="dh-pagination">
              <button className="dh-page-btn" disabled={page <= 1} onClick={() => navigate({ page: String(page - 1) })}>
                <ChevronLeftIcon size={14} />Trước
              </button>
              <button className="dh-page-btn" disabled={page >= pages} onClick={() => navigate({ page: String(page + 1) })}>
                Tiếp<ChevronRightIcon size={14} />
              </button>
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
