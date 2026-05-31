"use client"

import * as React from "react"

const segments = [
  { label: "New Customers", value: 38, color: "#3b82f6" },
  { label: "Returning Customers", value: 45, color: "#22d3ee" },
  { label: "Inactive", value: 17, color: "#e5e7eb" },
]

export function CustomerSegChart() {
  const W = 300
  const H = 12

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">2,341</span>
        <span className="text-xs text-muted-foreground">total customers</span>
      </div>

      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ width: `${s.value}%`, backgroundColor: s.color }}
            className="h-full first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>

      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-muted-foreground">{s.label}</span>
            </div>
            <span className="font-medium">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
