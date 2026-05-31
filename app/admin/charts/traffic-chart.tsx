"use client"

import * as React from "react"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

const sources = [
  { label: "Organic Search", sessions: 4821, bounce: "32%", trend: true },
  { label: "Direct", sessions: 2340, bounce: "28%", trend: true },
  { label: "Social Media", sessions: 1893, bounce: "41%", trend: false },
  { label: "Referral", sessions: 1205, bounce: "35%", trend: true },
]

const maxSessions = Math.max(...sources.map(s => s.sessions))

export function TrafficChart() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 text-xs font-medium text-muted-foreground uppercase tracking-wide pb-1 border-b">
        <span>Source</span>
        <span className="text-right">Bounce Rate</span>
      </div>
      {sources.map((s) => (
        <div key={s.label} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{s.label}</span>
            <span className={`flex items-center text-xs font-medium ${s.trend ? "text-green-600" : "text-red-500"}`}>
              {s.trend ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
              {s.bounce}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${(s.sessions / maxSessions) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-10 text-right">{s.sessions.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
