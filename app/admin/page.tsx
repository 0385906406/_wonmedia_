'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileTextIcon, BriefcaseIcon, UsersIcon, InboxIcon,
  TrophyIcon, HandshakeIcon, ArrowRightIcon, PlusIcon,
  EyeIcon, MailIcon, CheckCircle2Icon, Loader2Icon,
  NewspaperIcon, GlobeIcon, SettingsIcon,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Stats {
  blogCount: number
  jobCount: number
  partnerCount: number
  unreadMessages: number
  achievementTotal: number
  serviceCount: number
}

interface RecentPost {
  _id: string; slug: string; type: string
  title: { vi: string }; date: string; active: boolean
  createdAt: string
}

interface RecentMsg {
  _id: string; name: string; email: string
  subject: string; read: boolean; createdAt: string
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, icon: Icon, color, href, sub,
}: {
  label: string; value: number | string; icon: React.ElementType
  color: string; href: string; sub?: string
}) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push(href)}
      style={{
        display: 'flex', flexDirection: 'column', gap: 16,
        background: '#fff', borderRadius: 16, padding: '24px 24px 20px',
        border: '1px solid #E5E8ED', textAlign: 'left', cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(15,76,129,0.06)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        width: '100%',
      }}
      className="stat-card"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color,
        }}>
          <Icon size={22} />
        </div>
        <ArrowRightIcon size={16} style={{ color: '#94a3b8', marginTop: 4 }} />
      </div>
      <div>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 6px', fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: 32, fontWeight: 800, color: '#0b2a59', margin: 0, lineHeight: 1 }}>{value}</p>
        {sub && <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0', fontWeight: 500 }}>{sub}</p>}
      </div>
    </button>
  )
}

// ─── Quick action ─────────────────────────────────────────────────────────────
function QuickAction({ label, icon: Icon, color, href }: { label: string; icon: React.ElementType; color: string; href: string }) {
  const router = useRouter()
  return (
    <button onClick={() => router.push(href)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 16px', borderRadius: 10,
        border: '1.5px solid #E5E8ED', background: '#fff',
        cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#374151',
        transition: 'all 0.2s ease', width: '100%',
      }}
      className="quick-action"
    >
      <span style={{ color, flexShrink: 0 }}><Icon size={16} /></span>
      {label}
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats]         = useState<Stats | null>(null)
  const [recentPosts, setRecent]  = useState<RecentPost[]>([])
  const [recentMsgs, setMsgs]    = useState<RecentMsg[]>([])
  const [loading, setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/posts?page=1').then(r => r.json()),
      fetch('/api/homepage/partners').then(r => r.json()),
      fetch('/api/contact/submit').then(r => r.json()),
      fetch('/api/homepage/achievements').then(r => r.json()),
      fetch('/api/homepage/services').then(r => r.json()),
    ]).then(([postsRes, partnersRes, msgsRes, achRes, svcRes]) => {
      // Blog vs tuyen-dung từ list
      const allPosts: RecentPost[] = postsRes.data ?? []
      setStats({
        blogCount:       postsRes.total ?? 0,
        jobCount:        0,
        partnerCount:    (partnersRes.data ?? []).length,
        unreadMessages:  msgsRes.unread ?? 0,
        achievementTotal: (achRes.data ?? []).reduce((s: number, a: { value: number }) => s + (a.value || 0), 0),
        serviceCount:    (svcRes.data ?? []).length,
      })
      setRecent(allPosts.slice(0, 6))
      setMsgs((msgsRes.data ?? []).slice(0, 5))
    }).catch(() => {}).finally(() => setLoading(false))

    // Separate call for blog/job counts
    Promise.all([
      fetch('/api/posts?type=blog').then(r => r.json()),
      fetch('/api/posts?type=tuyen-dung').then(r => r.json()),
    ]).then(([b, j]) => {
      setStats(s => s ? { ...s, blogCount: b.total ?? s.blogCount, jobCount: j.total ?? 0 } : s)
    }).catch(() => {})
  }, [])

  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12, color: '#64748b' }}>
      <Loader2Icon size={20} className="animate-spin" />
      <span style={{ fontSize: 14 }}>Đang tải dữ liệu...</span>
    </div>
  )

  return (
    <div style={{ padding: '24px', width: '100%', fontFamily: 'var(--font-vi, system-ui)' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0b2a59', margin: '0 0 4px', letterSpacing: '-0.4px' }}>
          Bảng điều khiển
        </h1>
        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{today} · WON Media CMS</p>
      </div>

      {/* ── Stats grid ── */}
      <div className="dash-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="Bài viết Blog"    value={stats?.blogCount ?? 0}        icon={NewspaperIcon}  color="#15803d" href="/admin/posts?type=blog"       sub="bài đang hoạt động" />
        <StatCard label="Vị trí Tuyển dụng" value={stats?.jobCount ?? 0}        icon={BriefcaseIcon}  color="#1d4ed8" href="/admin/posts?type=tuyen-dung" sub="vị trí đang tuyển" />
        <StatCard label="Đối tác"           value={stats?.partnerCount ?? 0}    icon={HandshakeIcon}  color="#7c3aed" href="/admin/homepage?tab=partners" sub="đối tác chiến lược" />
        <StatCard label="Tin nhắn mới"      value={stats?.unreadMessages ?? 0}  icon={InboxIcon}      color="#dc2626" href="/admin/lien-he?tab=inbox"     sub="chưa đọc" />
      </div>

      {/* ── Main content ── */}
      <div className="dash-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* Left — Recent posts */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E8ED', overflow: 'hidden', boxShadow: '0 2px 8px rgba(15,76,129,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9' }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0b2a59', margin: 0 }}>Bài viết gần đây</h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>Blog & Tuyển dụng</p>
            </div>
            <button onClick={() => router.push('/admin/posts')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#15803d', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 8, transition: 'background 0.2s' }}
              className="view-all-btn">
              Xem tất cả <ArrowRightIcon size={13} />
            </button>
          </div>

          {recentPosts.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: '#94a3b8' }}>
              <FileTextIcon size={32} strokeWidth={1.5} style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontSize: 13 }}>Chưa có bài viết nào</p>
              <button onClick={() => router.push('/admin/posts/new-post')}
                style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#15803d', background: '#f0fdf4', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer' }}>
                <PlusIcon size={13} /> Tạo bài đầu tiên
              </button>
            </div>
          ) : (
            <div>
              {recentPosts.map((post, i) => {
                const isBlog = post.type === 'blog'
                return (
                  <div key={post._id}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px', borderBottom: i < recentPosts.length - 1 ? '1px solid #F8FAFC' : 'none', transition: 'background 0.15s', cursor: 'pointer' }}
                    onClick={() => router.push(`/admin/posts/${post._id}`)}
                    className="post-row"
                  >
                    {/* Icon */}
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isBlog ? '#dcfce7' : '#dbeafe' }}>
                      {isBlog ? <FileTextIcon size={16} color="#15803d" /> : <BriefcaseIcon size={16} color="#1d4ed8" />}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.title?.vi || '(Chưa có tiêu đề)'}
                      </p>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{post.date || new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '1px 7px', borderRadius: 100, background: isBlog ? '#dcfce7' : '#dbeafe', color: isBlog ? '#15803d' : '#1d4ed8' }}>
                          {isBlog ? 'Blog' : 'Tuyển dụng'}
                        </span>
                      </div>
                    </div>
                    {/* Status */}
                    <div style={{ flexShrink: 0 }}>
                      {post.active
                        ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#15803d', fontWeight: 600 }}><CheckCircle2Icon size={12} />Active</span>
                        : <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Ẩn</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Quick actions */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E8ED', padding: '20px 20px', boxShadow: '0 2px 8px rgba(15,76,129,0.05)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0b2a59', margin: '0 0 14px' }}>Thao tác nhanh</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <QuickAction label="Tạo bài viết mới"     icon={PlusIcon}       color="#15803d" href="/admin/posts/new-post" />
              <QuickAction label="Quản lý trang chủ"    icon={GlobeIcon}      color="#0b2a59" href="/admin/homepage" />
              <QuickAction label="Trang giới thiệu"     icon={UsersIcon}      color="#7c3aed" href="/admin/gioi-thieu" />
              <QuickAction label="Hộp thư liên hệ"      icon={MailIcon}       color="#dc2626" href="/admin/lien-he?tab=inbox" />
              <QuickAction label="Cài đặt hệ thống"     icon={SettingsIcon}   color="#64748b" href="/admin/settings" />
            </div>
          </div>

          {/* Recent messages */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E8ED', overflow: 'hidden', boxShadow: '0 2px 8px rgba(15,76,129,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid #F1F5F9' }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0b2a59', margin: 0 }}>Tin nhắn gần đây</h2>
              <button onClick={() => router.push('/admin/lien-he?tab=inbox')}
                style={{ fontSize: 11, fontWeight: 600, color: '#15803d', background: 'none', border: 'none', cursor: 'pointer' }}>
                Xem tất cả
              </button>
            </div>
            {recentMsgs.length === 0 ? (
              <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94a3b8' }}>
                <InboxIcon size={24} strokeWidth={1.5} style={{ margin: '0 auto 8px', display: 'block' }} />
                <p style={{ fontSize: 12 }}>Chưa có tin nhắn</p>
              </div>
            ) : (
              <div>
                {recentMsgs.map((msg, i) => (
                  <div key={msg._id}
                    style={{ padding: '12px 20px', borderBottom: i < recentMsgs.length - 1 ? '1px solid #F8FAFC' : 'none', cursor: 'pointer', background: msg.read ? 'transparent' : '#fefce8', transition: 'background 0.15s' }}
                    onClick={() => router.push('/admin/lien-he?tab=inbox')}
                    className="msg-row"
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EAF1F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#0b2a59' }}>
                          {msg.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                          <p style={{ fontSize: 12, fontWeight: msg.read ? 500 : 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.name}</p>
                          {!msg.read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', flexShrink: 0 }} />}
                        </div>
                        <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WON Media info */}
          <div style={{ background: 'linear-gradient(135deg, #062340 0%, #0F4C81 100%)', borderRadius: 16, padding: '20px', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <TrophyIcon size={18} color="#FCD34D" />
              <span style={{ fontSize: 13, fontWeight: 700 }}>WON Media</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Đối tác', value: stats?.partnerCount ?? 0 },
                { label: 'Dịch vụ', value: stats?.serviceCount ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px' }}>
                  <p style={{ fontSize: 22, fontWeight: 800, margin: '0 0 2px', color: '#FCD34D' }}>{value}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => router.push('/admin/homepage')}
              style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', width: '100%', justifyContent: 'center', transition: 'background 0.2s' }}
              className="manage-btn">
              <EyeIcon size={13} /> Quản lý trang chủ
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(15,76,129,0.12) !important; }
        .quick-action:hover { border-color: #22c55e !important; background: #f0fdf4 !important; color: #15803d !important; }
        .view-all-btn:hover { background: #f0fdf4; }
        .post-row:hover { background: #F8FAFC; }
        .msg-row:hover { background: #F8FAFC !important; }
        .manage-btn:hover { background: rgba(255,255,255,0.2) !important; color: #fff !important; }
        @media (max-width: 1100px) {
          .dash-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .dash-main-grid  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .dash-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
