"use client"

import * as React from "react"

const data = [
  { label: "Watches", value: 1225, color: "#3b82f6" },
  { label: "Clothing", value: 965, color: "#22d3ee" },
  { label: "Gadgets", value: 830, color: "#22c55e" },
  { label: "Others", value: 532, color: "#a78bfa" },
]

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polarToCartesian(cx, cy, r, start)
  const e = polarToCartesian(cx, cy, r, end)
  const large = end - start > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
}

export function CategoryDonut() {
  const total = data.reduce((s, d) => s + d.value, 0)
  const cx = 80
  const cy = 80
  const R = 65
  const r = 40

  let angle = 0
  const arcs = data.map((d) => {
    const sweep = (d.value / total) * 360
    const start = angle
    const end = angle + sweep - 2
    angle += sweep
    return { ...d, start, end }
  })

  return (
    <svg viewBox="0 0 160 160" className="w-full max-w-[160px] mx-auto" style={{ height: 160 }}>
      {arcs.map((arc) => (
        <path
          key={arc.label}
          d={describeArc(cx, cy, (R + r) / 2, arc.start, arc.end)}
          fill="none"
          stroke={arc.color}
          strokeWidth={R - r}
          strokeLinecap="butt"
        />
      ))}
    </svg>
  )
}
