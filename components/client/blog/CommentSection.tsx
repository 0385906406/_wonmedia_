'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface CommentLike { userId: string }

interface Comment {
  _id: string
  userId: string
  userName: string
  content: string
  likes: CommentLike[]
  parentId: string | null
  createdAt: string
}

interface Props {
  postId: string
  lang: string
  isLoggedIn: boolean
  currentUserId?: string
  currentUserName?: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Vừa xong'
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.floor(h / 24)
  return `${d} ngày trước`
}

function Avatar({ name }: { name: string }) {
  // BUG-044: guard khi name rỗng
  const safeName = name?.trim() || '?'
  const initials = safeName.split(' ').map(w => w[0] ?? '').filter(Boolean).slice(0, 2).join('').toUpperCase() || '?'
  const colors = ['#00A98F', '#6366F1', '#0F4C81', '#B45309', '#15803d']
  const color = colors[(safeName.charCodeAt(0) || 0) % colors.length]
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 700, flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function CommentItem({
  comment, currentUserId, isLoggedIn, onLike, onReply,
}: {
  comment: Comment
  currentUserId?: string
  isLoggedIn: boolean
  onLike: (id: string) => void
  onReply: (id: string, name: string) => void
}) {
  const liked = currentUserId ? comment.likes.some(l => l.userId === currentUserId) : false

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <Avatar name={comment.userName} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: '#F8F9FB', borderRadius: '0 12px 12px 12px',
          padding: '12px 16px', border: '1px solid #E5E8ED',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#062340' }}>{comment.userName}</span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>{timeAgo(comment.createdAt)}</span>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.65, wordBreak: 'break-word' }}>
            {comment.content}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6, paddingLeft: 4 }}>
          {isLoggedIn && (
            <>
              <button
                onClick={() => onLike(comment._id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600,
                  color: liked ? '#6366F1' : '#94a3b8',
                  padding: '2px 0', transition: 'color 0.15s',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'}
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {comment.likes.length > 0 && <span>{comment.likes.length}</span>}
              </button>
              <button
                onClick={() => onReply(comment._id, comment.userName)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, color: '#94a3b8',
                  padding: '2px 0', transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0F4C81')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
              >
                Trả lời
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function CommentSection({ postId, lang, isLoggedIn, currentUserId, currentUserName }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const esRef = useRef<EventSource | null>(null)

  // Load initial comments
  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then(r => r.json())
      .then(d => setComments(d.data ?? []))
      .finally(() => setLoading(false))
  }, [postId])

  // SSE realtime
  useEffect(() => {
    const es = new EventSource(`/api/posts/${postId}/comments/stream`)
    esRef.current = es

    es.onmessage = (e) => {
      // BUG-043: guard JSON.parse — malformed frame không crash handler
      let data: { type: string; comment?: Comment; commentId?: string; likes?: CommentLike[] }
      try { data = JSON.parse(e.data) } catch { return }
      if (data.type === 'new' && data.comment) {
        setComments(prev => [...prev, data.comment!])
      } else if (data.type === 'delete') {
        setComments(prev => prev.filter(c => c._id !== data.commentId))
      } else if (data.type === 'like' && data.likes) {
        setComments(prev => prev.map(c =>
          c._id === data.commentId ? { ...c, likes: data.likes! } : c
        ))
      }
    }

    return () => { es.close(); esRef.current = null }
  }, [postId])

  const handleLike = useCallback(async (commentId: string) => {
    if (!isLoggedIn) return
    // Optimistic update ngay lập tức
    setComments(prev => prev.map(c => {
      if (c._id !== commentId) return c
      const alreadyLiked = currentUserId ? c.likes.some(l => l.userId === currentUserId) : false
      const newLikes = alreadyLiked
        ? c.likes.filter(l => l.userId !== currentUserId)
        : [...c.likes, { userId: currentUserId! }]
      return { ...c, likes: newLikes }
    }))
    // Gọi API (SSE sẽ không fire thêm vì server broadcast chỉ đến các client khác)
    await fetch(`/api/posts/${postId}/comments/${commentId}`, { method: 'POST' })
  }, [postId, isLoggedIn, currentUserId])

  const handleReply = useCallback((id: string, name: string) => {
    setReplyTo({ id, name })
    textareaRef.current?.focus()
    textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || submitting) return
    setSubmitting(true)
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text.trim(), parentId: replyTo?.id ?? null }),
    })
    if (res.ok) {
      setText('')
      setReplyTo(null)
    }
    setSubmitting(false)
  }

  // Group: top-level + replies
  const topLevel = comments.filter(c => !c.parentId)
  const replies = (parentId: string) => comments.filter(c => c.parentId === parentId)

  return (
    <section style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid #E5E8ED' }}>
      <h3 style={{
        fontSize: 20, fontWeight: 800, color: '#062340',
        margin: '0 0 32px', letterSpacing: '-0.3px',
        fontFamily: 'var(--font-primary)',
      }}>
        Bình luận {comments.length > 0 && (
          <span style={{
            fontSize: 13, fontWeight: 600, color: '#6366F1',
            background: '#EEF0FE', borderRadius: 100,
            padding: '2px 10px', marginLeft: 8,
          }}>
            {comments.length}
          </span>
        )}
      </h3>

      {/* Form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
          {replyTo && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#EEF0FE', borderRadius: 8,
              padding: '8px 14px', marginBottom: 10, fontSize: 13,
              color: '#4338CA',
            }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
              </svg>
              Trả lời <strong style={{ marginLeft: 4 }}>{replyTo.name}</strong>
              <button type="button" onClick={() => setReplyTo(null)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#6366F1', fontSize: 16, lineHeight: 1 }}>
                ×
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <Avatar name={currentUserName ?? 'U'} />
            <div style={{ flex: 1 }}>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                rows={3}
                maxLength={2000}
                style={{
                  width: '100%', resize: 'vertical',
                  padding: '12px 14px', borderRadius: 10,
                  border: '1.5px solid #E5E8ED',
                  fontSize: 14, color: '#334155', lineHeight: 1.6,
                  fontFamily: 'var(--font-primary)',
                  outline: 'none', transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#6366F1')}
                onBlur={e => (e.target.style.borderColor = '#E5E8ED')}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{text.length}/2000</span>
                <button
                  type="submit"
                  disabled={!text.trim() || submitting}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '9px 20px', borderRadius: 8, border: 'none',
                    background: text.trim() && !submitting
                      ? 'linear-gradient(135deg, #6366F1, #4338CA)' : '#E5E8ED',
                    color: text.trim() && !submitting ? '#fff' : '#94a3b8',
                    fontSize: 13, fontWeight: 700, cursor: text.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                  }}
                >
                  {submitting ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  )}
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div style={{
          background: '#F8F9FB', border: '1.5px dashed #E5E8ED',
          borderRadius: 12, padding: '24px', textAlign: 'center', marginBottom: 40,
        }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: '#334155' }}>
            Đăng nhập để tham gia bình luận
          </p>
          <a href="/auth/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '9px 20px', borderRadius: 8,
            background: 'linear-gradient(135deg, #6366F1, #4338CA)',
            color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none',
          }}>
            Đăng nhập
          </a>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div className="dh-skeleton" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
              <div className="dh-skeleton" style={{ flex: 1, height: 72, borderRadius: 10 }} />
            </div>
          ))}
        </div>
      ) : topLevel.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14, padding: '32px 0' }}>
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {topLevel.map(c => (
            <div key={c._id}>
              <CommentItem
                comment={c}
                currentUserId={currentUserId}
                isLoggedIn={isLoggedIn}
                onLike={handleLike}
                onReply={handleReply}
              />
              {/* Replies */}
              {replies(c._id).length > 0 && (
                <div style={{ marginLeft: 48, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {replies(c._id).map(r => (
                    <CommentItem
                      key={r._id}
                      comment={r}
                      currentUserId={currentUserId}
                      isLoggedIn={isLoggedIn}
                      onLike={handleLike}
                      onReply={handleReply}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  )
}
