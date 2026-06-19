'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Trash2, MessageSquare, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'

interface Comment {
  _id: string
  postSlug: string
  postId: string
  userName: string
  userEmail: string
  content: string
  likes: { userId: string }[]
  parentId: string | null
  active: boolean
  createdAt: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Vừa xong'
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  return `${Math.floor(h / 24)} ngày trước`
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [pages, setPages]       = useState(1)
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value)
      setPage(1)
    }, 400)
  }

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page) })
    if (debouncedSearch) params.set('search', debouncedSearch)
    const res = await fetch(`/api/admin/comments?${params}`)
    const data = await res.json()
    setComments(data.data ?? [])
    setTotal(data.total ?? 0)
    setPages(data.pages ?? 1)
    setLoading(false)
  }, [page, debouncedSearch])

  useEffect(() => { load() }, [load])

  async function handleDelete(id: string) {
    if (!confirm('Xoá bình luận này?')) return
    setDeleting(id)
    const res = await fetch('/api/admin/comments', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) {
      const d = await res.json().catch(() => ({}))
      alert(d.error ?? 'Xoá thất bại')
    } else {
      setComments(prev => prev.filter(c => c._id !== id))
      setTotal(t => t - 1)
    }
    setDeleting(null)
  }

  return (
    <div>
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Bình luận</h1>
          <p className="dh-page-desc">Quản lý tất cả bình luận từ bài viết</p>
        </div>
        <button onClick={load} className="dh-btn dh-btn-secondary" style={{ gap: 6 }}>
          <RefreshCw size={14} />
          Tải lại
        </button>
      </div>

      <div className="dh-card" style={{ marginBottom: 20 }}>
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              className="dh-input"
              style={{ paddingLeft: 32 }}
              placeholder="Tìm theo nội dung..."
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>
          <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, flexShrink: 0 }}>
            {total} bình luận
          </span>
        </div>
      </div>

      <div className="dh-card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div className="dh-skeleton" style={{ width: '100%', height: 48, marginBottom: 8 }} />
            <div className="dh-skeleton" style={{ width: '100%', height: 48, marginBottom: 8 }} />
            <div className="dh-skeleton" style={{ width: '100%', height: 48 }} />
          </div>
        ) : comments.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <MessageSquare size={40} style={{ color: '#E5E8ED', marginBottom: 12 }} />
            <p style={{ color: '#94a3b8', fontSize: 14 }}>Không có bình luận nào</p>
          </div>
        ) : (
          <table className="dh-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Nội dung</th>
                <th>Người dùng</th>
                <th>Bài viết</th>
                <th>Loại</th>
                <th>Lượt thích</th>
                <th>Thời gian</th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {comments.map(c => (
                <tr key={c._id}>
                  <td>
                    <p style={{
                      margin: 0, fontSize: 13, color: '#334155',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {c.content}
                    </p>
                  </td>
                  <td>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#062340' }}>{c.userName}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{c.userEmail}</p>
                    </div>
                  </td>
                  <td>
                    <a href={`/admin/posts/${c.postId}`}
                      style={{ fontSize: 12, color: '#6366F1', textDecoration: 'none', fontWeight: 600 }}>
                      {c.postSlug}
                    </a>
                  </td>
                  <td>
                    <span className={`dh-badge ${c.parentId ? 'dh-badge-indigo' : 'dh-badge-green'}`}>
                      {c.parentId ? 'Trả lời' : 'Chính'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.likes.length > 0 ? '#6366F1' : '#94a3b8' }}>
                      {c.likes.length > 0 ? `♥ ${c.likes.length}` : '—'}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>{timeAgo(c.createdAt)}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(c._id)}
                      disabled={deleting === c._id}
                      className="dh-btn-icon"
                      style={{ color: '#ef4444', borderColor: '#FECACA' }}
                      title="Xoá bình luận"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {pages > 1 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E8ED', display: 'flex', justifyContent: 'flex-end' }}>
            <div className="dh-pagination">
              <button className="dh-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`dh-page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
              <button className="dh-page-btn" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
