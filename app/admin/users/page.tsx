'use client'

import { useEffect, useState, useCallback } from 'react'
import { PlusIcon, Trash2Icon, PencilIcon, UsersIcon, KeyRoundIcon } from 'lucide-react'
import { useToast } from '@/components/admin/toast-provider'

interface User {
  _id: string
  name: string
  email: string
  role: 'superadmin' | 'admin' | 'user'
  createdAt: string
}

const ROLE_LABELS = { superadmin: 'Super Admin', admin: 'Admin', user: 'User' }
const ROLE_BADGE = { superadmin: 'dh-badge-indigo', admin: 'dh-badge-green', user: 'dh-badge-gray' }

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const d = Math.floor(diff / 86400000)
  if (d < 1) return 'Hôm nay'
  if (d < 30) return `${d} ngày trước`
  const m = Math.floor(d / 30)
  if (m < 12) return `${m} tháng trước`
  return `${Math.floor(m / 12)} năm trước`
}

function Avatar({ name }: { name: string }) {
  const safeName = name?.trim() || '?'
  const initials = safeName.split(' ').map(w => w[0] ?? '').filter(Boolean).slice(0, 2).join('').toUpperCase() || '?'
  const colors = ['#00A98F', '#6366F1', '#0F4C81', '#B45309', '#15803d']
  const bg = colors[(safeName.charCodeAt(0) || 0) % colors.length]
  return (
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: bg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
      {initials}
    </div>
  )
}

const EMPTY_FORM = { name: '', email: '', password: '', role: 'user' as User['role'] }
const EMPTY_EDIT = { name: '', role: 'user' as User['role'], password: '' }

export default function UsersPage() {
  const [users, setUsers]         = useState<User[]>([])
  const [loading, setLoading]     = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [isSuperadmin, setIsSuperadmin]   = useState(false)
  const toast = useToast()

  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm]             = useState({ ...EMPTY_FORM })
  const [saving, setSaving]         = useState(false)

  const [editUser, setEditUser]   = useState<User | null>(null)
  const [editForm, setEditForm]   = useState({ ...EMPTY_EDIT })
  const [showEdit, setShowEdit]   = useState(false)

  const [deleting, setDeleting]   = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [usersRes, meRes] = await Promise.all([
      fetch('/api/admin/users'),
      fetch('/api/admin/users/me'),
    ])
    if (usersRes.ok) {
      const d = await usersRes.json()
      setUsers(d.data ?? [])
    }
    if (meRes.ok) {
      const me = await meRes.json()
      setCurrentUserId(me.id ?? '')
      setIsSuperadmin(me.role === 'superadmin')
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function create() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin'); return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      if (!res.ok) { toast.error(d.error ?? 'Lỗi tạo user'); return }
      setUsers(prev => [d.data, ...prev])
      setShowCreate(false)
      setForm({ ...EMPTY_FORM })
      toast.success('Đã tạo user thành công')
    } finally { setSaving(false) }
  }

  function openEdit(u: User) {
    setEditUser(u)
    setEditForm({ name: u.name, role: u.role, password: '' })
    setShowEdit(true)
  }

  async function saveEdit() {
    if (!editUser) return
    if (!editForm.name.trim()) { toast.error('Tên không được để trống'); return }
    setSaving(true)
    try {
      const body: Record<string, string> = {}
      if (editForm.name.trim() !== editUser.name) body.name = editForm.name.trim()
      if (editForm.role !== editUser.role) body.role = editForm.role
      if (editForm.password) body.password = editForm.password
      if (!Object.keys(body).length) { setShowEdit(false); return }
      const res = await fetch(`/api/admin/users/${editUser._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (!res.ok) { toast.error(d.error ?? 'Lỗi cập nhật'); return }
      setUsers(prev => prev.map(u => u._id === editUser._id ? d.data : u))
      setShowEdit(false)
      toast.success('Đã cập nhật user')
    } finally { setSaving(false) }
  }

  async function del(id: string, name: string) {
    if (!confirm(`Xoá user "${name}"?`)) return
    setDeleting(id)
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    const d = await res.json()
    if (!res.ok) { toast.error(d.error ?? 'Lỗi xoá'); setDeleting(null); return }
    setUsers(prev => prev.filter(u => u._id !== id))
    toast.success('Đã xoá user')
    setDeleting(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="dh-page-header">
        <div>
          <h1 className="dh-page-title">Người dùng</h1>
          <p className="dh-page-desc">Quản lý tài khoản và phân quyền hệ thống</p>
        </div>
        {isSuperadmin && (
          <button onClick={() => setShowCreate(true)} className="dh-btn dh-btn-primary" style={{ gap: 6 }}>
            <PlusIcon size={14} /> Thêm user
          </button>
        )}
      </div>

      {/* Table */}
      <div className="dh-card">
        {loading ? (
          <div style={{ padding: 40 }}>
            {[1,2,3].map(i => <div key={i} className="dh-skeleton" style={{ height: 52, marginBottom: 8 }} />)}
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>
            <UsersIcon size={36} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
            <p style={{ fontSize: 14 }}>Chưa có user nào.</p>
          </div>
        ) : (
          <table className="dh-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Tham gia</th>
                {isSuperadmin && <th style={{ width: 80 }}></th>}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={u.name} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#062340', fontSize: 14 }}>{u.name}</div>
                        {u._id === currentUserId && <div style={{ fontSize: 10, color: '#00A98F', fontWeight: 700 }}>● Bạn</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: '#64748b' }}>{u.email}</td>
                  <td><span className={`dh-badge ${ROLE_BADGE[u.role]}`}>{ROLE_LABELS[u.role]}</span></td>
                  <td style={{ fontSize: 12, color: '#94a3b8' }}>{timeAgo(u.createdAt)}</td>
                  {isSuperadmin && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(u)} className="dh-btn-icon" title="Sửa">
                          <PencilIcon size={13} />
                        </button>
                        {u.role !== 'superadmin' && u._id !== currentUserId && (
                          <button onClick={() => del(u._id, u.name)} disabled={deleting === u._id}
                            className="dh-btn-icon" style={{ color: '#ef4444', borderColor: '#FECACA' }} title="Xoá">
                            <Trash2Icon size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="dh-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowCreate(false) }}>
          <div className="dh-modal" style={{ maxWidth: 480 }}>
            <div className="dh-modal-header">
              <h3 className="dh-modal-title">Thêm user mới</h3>
            </div>
            <div className="dh-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="dh-label">Họ tên <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="dh-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="dh-label">Email <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="dh-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="user@wonmedia.com" />
              </div>
              <div>
                <label className="dh-label">Mật khẩu <span style={{ color: '#ef4444' }}>*</span></label>
                <input className="dh-input" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Tối thiểu 8 ký tự" />
              </div>
              <div>
                <label className="dh-label">Vai trò</label>
                <select className="dh-input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as User['role'] }))}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="dh-modal-footer">
              <button onClick={() => setShowCreate(false)} className="dh-btn dh-btn-secondary">Huỷ</button>
              <button onClick={create} disabled={saving} className="dh-btn dh-btn-primary">
                {saving ? 'Đang tạo...' : 'Tạo user'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && editUser && (
        <div className="dh-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowEdit(false) }}>
          <div className="dh-modal" style={{ maxWidth: 480 }}>
            <div className="dh-modal-header">
              <h3 className="dh-modal-title">Sửa user: {editUser.name}</h3>
            </div>
            <div className="dh-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="dh-label">Họ tên</label>
                <input className="dh-input" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              {editUser.role !== 'superadmin' && (
                <div>
                  <label className="dh-label">Vai trò</label>
                  <select className="dh-input" value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value as User['role'] }))}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}
              <div>
                <label className="dh-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <KeyRoundIcon size={12} /> Mật khẩu mới
                  <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 400 }}>(để trống nếu không đổi)</span>
                </label>
                <input className="dh-input" type="password" value={editForm.password} onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))} placeholder="Mật khẩu mới..." />
              </div>
            </div>
            <div className="dh-modal-footer">
              <button onClick={() => setShowEdit(false)} className="dh-btn dh-btn-secondary">Huỷ</button>
              <button onClick={saveEdit} disabled={saving} className="dh-btn dh-btn-primary">
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
