"use client"

import * as React from "react"
import { ArrowUpIcon } from "lucide-react"

const data = [850, 920, 880, 960, 1020, 980, 1050, 1100, 1030, 1080, 1120, 1060,
  1090, 1140, 1200, 1150, 1180, 1220, 1160, 1240, 1200, 1180, 1220, 1250,
  1200, 1230, 1280, 1260, 1240, 1260]

function buildPath(data: number[], W: number, H: number) {
  const min = Math.min(...data) - 50
  const max = Math.max(...data) + 50
  const step = W / (data.length - 1)
  const pts = data.map((v, i) => ({ x: i * step, y: H - ((v - min) / (max - min)) * H }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const c1x = pts[i - 1].x + step / 3
    const c2x = pts[i].x - step / 3
    d += ` C ${c1x} ${pts[i-1].y}, ${c2x} ${pts[i].y}, ${pts[i].x} ${pts[i].y}`
  }
  return { d, pts, min, max }
}

export function AvgOrderChart() {
  const W = 300
  const H = 80
  const { d, pts, min, max } = buildPath(data, W, H)

  const areaD = `${d} L ${pts[pts.length - 1].x} ${H} L 0 ${H} Z`

  return (
    <div>
      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">$1,260</span>
          <span className="flex items-center text-xs text-green-600 font-medium">
            <ArrowUpIcon className="h-3 w-3" />12.4%
          </span>
        </div>
        <p className="text-xs text-muted-foreground">vs last period</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }}>
        <defs>
          <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#avgGrad)" />
        <path d={d} fill="none" stroke="#3b82f6" strokeWidth={1.5} />
      </svg>
    </div>
  )
}
