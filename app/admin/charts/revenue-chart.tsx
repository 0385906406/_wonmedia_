"use client"

import * as React from "react"

const revenueData = [
  3100, 3300, 3050, 3400, 3600, 3800, 4000, 4200, 4500, 4300, 4700, 4400,
  4600, 4800, 5000, 4700, 4900, 5100, 4800, 5200, 5000, 4900, 5100, 5000,
  5200, 5100, 5300, 5200, 5100, 5300,
]

const ordersData = [
  2300, 2400, 2350, 2500, 2600, 2700, 2800, 2900, 3000, 2850, 3100, 2950,
  3050, 3200, 3300, 3100, 3250, 3400, 3200, 3500, 3300, 3200, 3400, 3350,
  3500, 3400, 3600, 3500, 3400, 3600,
]

const days = [
  "May 01", "May 03", "May 05", "May 07", "May 09", "May 11",
  "May 13", "May 15", "May 17", "May 19", "May 21", "May 23",
  "May 25", "May 27", "May 29", "May 31",
]

function buildPath(data: number[], width: number, height: number, min: number, max: number) {
  const step = width / (data.length - 1)
  const range = max - min
  const points = data.map((v, i) => {
    const x = i * step
    const y = height - ((v - min) / range) * height
    return [x, y]
  })
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 1; i < points.length; i++) {
    const cp1x = points[i - 1][0] + step / 3
    const cp1y = points[i - 1][1]
    const cp2x = points[i][0] - step / 3
    const cp2y = points[i][1]
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i][0]} ${points[i][1]}`
  }
  return d
}

export function RevenueChart() {
  const W = 600
  const H = 200
  const pad = { top: 10, right: 10, bottom: 30, left: 48 }
  const w = W - pad.left - pad.right
  const h = H - pad.top - pad.bottom

  const allData = [...revenueData, ...ordersData]
  const min = Math.floor(Math.min(...allData) / 100) * 100 - 200
  const max = Math.ceil(Math.max(...allData) / 100) * 100 + 200

  const revPath = buildPath(revenueData, w, h, min, max)
  const ordPath = buildPath(ordersData, w, h, min, max)

  const yLabels = [5300, 4500, 3800, 3000, 2300]

  const step = w / (revenueData.length - 1)
  const xLabelIndices = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 29]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
      <g transform={`translate(${pad.left}, ${pad.top})`}>
        {yLabels.map((val) => {
          const y = h - ((val - min) / (max - min)) * h
          return (
            <g key={val}>
              <line x1={0} y1={y} x2={w} y2={y} stroke="#e5e7eb" strokeWidth={1} />
              <text x={-6} y={y} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="#9ca3af">
                ${(val / 1000).toFixed(1)}K
              </text>
            </g>
          )
        })}

        <path d={revPath} fill="none" stroke="#3b82f6" strokeWidth={2} />
        <path d={ordPath} fill="none" stroke="#a78bfa" strokeWidth={2} />

        {xLabelIndices.map((i) => {
          const x = i * step
          return (
            <text key={i} x={x} y={h + 18} textAnchor="middle" fontSize={9} fill="#9ca3af">
              {days[Math.floor(i / 2)] ?? ""}
            </text>
          )
        })}
      </g>
    </svg>
  )
}
