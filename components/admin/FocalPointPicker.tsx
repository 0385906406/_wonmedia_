'use client'

// Bảng 3×3 — mỗi ô là tên hiển thị + giá trị CSS object-position
const GRID: { label: string; value: string; row: number; col: number }[] = [
  { label: 'Trên trái',  value: 'left top',      row: 0, col: 0 },
  { label: 'Trên giữa', value: 'center top',     row: 0, col: 1 },
  { label: 'Trên phải', value: 'right top',      row: 0, col: 2 },
  { label: 'Giữa trái', value: 'left center',    row: 1, col: 0 },
  { label: 'Giữa',      value: 'center center',  row: 1, col: 1 },
  { label: 'Giữa phải', value: 'right center',   row: 1, col: 2 },
  { label: 'Dưới trái', value: 'left bottom',    row: 2, col: 0 },
  { label: 'Dưới giữa', value: 'center bottom',  row: 2, col: 1 },
  { label: 'Dưới phải', value: 'right bottom',   row: 2, col: 2 },
]

interface Props {
  thumbnail: string
  value: string
  onChange: (v: string) => void
}

export function FocalPointPicker({ thumbnail, value, onChange }: Props) {
  const active = value || 'center center'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Preview ảnh với focal point overlay */}
      <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9', background: '#F1F5F9' }}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: active, display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#E8F5E9,#E3F2FD)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Chưa có ảnh</span>
          </div>
        )}

        {/* Grid overlay 3×3 */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(3,1fr)',
          padding: 8, gap: 0,
        }}>
          {GRID.map(pt => {
            const isActive = active === pt.value
            return (
              <button
                key={pt.value}
                type="button"
                title={pt.label}
                onClick={() => onChange(pt.value)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                <span style={{
                  width: isActive ? 14 : 10,
                  height: isActive ? 14 : 10,
                  borderRadius: '50%',
                  background: isActive ? '#6366F1' : 'rgba(255,255,255,0.85)',
                  border: isActive ? '2px solid #fff' : '1.5px solid rgba(0,0,0,0.25)',
                  boxShadow: isActive
                    ? '0 0 0 3px rgba(99,102,241,0.4), 0 2px 6px rgba(0,0,0,0.3)'
                    : '0 1px 4px rgba(0,0,0,0.25)',
                  transition: 'all 0.15s',
                  display: 'block', flexShrink: 0,
                }} />
              </button>
            )
          })}
        </div>

        {/* Label vị trí hiện tại */}
        <div style={{
          position: 'absolute', bottom: 6, right: 8,
          background: 'rgba(6,35,64,0.7)', backdropFilter: 'blur(4px)',
          borderRadius: 5, padding: '2px 8px',
          fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.3px',
        }}>
          {GRID.find(p => p.value === active)?.label ?? 'Giữa'}
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
        Click vào điểm trên ảnh để chọn vùng hiển thị khi ảnh bị crop.
      </p>
    </div>
  )
}
