# Design System — NIC SATI v3.3.1

## Fonts

| Biến | Font | Dùng cho |
|------|------|----------|
| `--font-primary` | Be Vietnam Pro | Body, heading chính |
| `--nic-font-mono-sans` | Space Grotesk | KPI, tag, label kỹ thuật |
| `--nic-font-monospace` | JetBrains Mono | Code |
| `--nic-font-ko` | Noto Sans KR | Korean UI |
| `--nic-font-ja` | Noto Sans JP | Japanese UI |
| `--nic-font-zh` | Noto Sans SC | Chinese UI |

### Đa ngôn ngữ — Font tự động qua `[lang]`
```css
[lang="ko"] { font-family: var(--nic-font-ko); }
[lang="ja"] { font-family: var(--nic-font-ja); }
[lang="zh"] { font-family: var(--nic-font-zh); }
```

## Màu sắc

| Token | Hex | Dùng cho |
|-------|-----|----------|
| `--nic-navy` | `#0F4C81` | Primary brand |
| `--nic-navy-deep` | `#062340` | Text heading |
| `--nic-teal` | `#00A98F` | Secondary, success |
| `--nic-indigo` | `#6366F1` | CTA, focus |
| `--nic-yellow` | `#FCD34D` | Badge, highlight |
| `--nic-gray-text` | `#334155` | Body text |
| `--nic-gray-border` | `#E5E8ED` | Border |
| `--nic-gray-light` | `#F8F9FB` | Background |

## Gradients

| Token | Dùng cho |
|-------|----------|
| `--nic-g1` | Hero background (light) |
| `--nic-g2` | Brand gradient (teal→navy→indigo) |
| `--nic-g3` | Dark sections, footer |
| `--nic-g4` | Badge yellow |

## Typography Scale

| Class | Size | Weight |
|-------|------|--------|
| `.nic-display-xl` | 92px | 800 |
| `.nic-display-l` | 56px | 800 |
| `.nic-h1` | 40px | 700 |
| `.nic-h2` | 28px | 700 |
| `.nic-h3` | 20px | 700 |
| `.nic-body-large` | 16px | 400 |
| `.nic-body` | 14px | 400 |
| `.nic-caption` | 12px | 500 |
| `.nic-tag` | 10px | 700 + uppercase |
| `.nic-kpi` | 32px | 700 (Space Grotesk) |

## Border Radius

| Token | Value | Dùng cho |
|-------|-------|----------|
| `--nic-radius-sm` | 6px | Input |
| `--nic-radius-md` | 8px | Button, card nhỏ |
| `--nic-radius-card` | 12px | Card |
| `--nic-radius-pill` | 100px | Badge, pill button |
