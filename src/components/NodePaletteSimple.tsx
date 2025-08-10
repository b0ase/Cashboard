"use client"

import React, { useState } from 'react'

export type PaletteItem = {
  type: string
  name: string
  category: string
  icon?: React.ReactNode
}

export default function NodePaletteSimple({
  title = "Add Nodes",
  nodeTypes,
  categories,
  onPick,
  visible = true
}: {
  title?: string
  nodeTypes: PaletteItem[]
  categories: string[]
  onPick: (type: string) => void
  visible?: boolean
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map((c) => [c, true])) as Record<string, boolean>
  )

  if (!visible) {
    return null
  }

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg p-3 min-w-[260px] w-[260px] max-h-[70vh] overflow-y-auto shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-400">
          {title} <span className="text-[10px] text-gray-500">({nodeTypes.length})</span>
        </div>
        <button
          onClick={() => setOpen(prev => Object.fromEntries(Object.keys(prev).map(k => [k, false])))}
          className="text-gray-400 hover:text-white text-xs hover:bg-white/10 px-2 py-1 rounded"
        >
          Collapse
        </button>
      </div>
      
      {categories.map((cat) => (
        <div key={cat} className="mb-3">
          <button
            onClick={() => setOpen((p) => ({ ...p, [cat]: !p[cat] }))}
            className="w-full text-left text-[11px] uppercase tracking-wide text-gray-500 mb-2"
          >
            {cat} ({nodeTypes.filter((n) => n.category === cat).length})
          </button>
          {open[cat] && (
            <div className="grid grid-cols-2 gap-2">
              {nodeTypes
                .filter((n) => n.category === cat)
                .map((n) => (
                  <button
                    key={`${n.category}:${n.type}`}
                    onClick={() => onPick(n.type)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-left"
                    title={`Add ${n.name}`}
                  >
                    <span className="inline-flex items-center justify-center">{n.icon}</span>
                    <span className="text-sm text-white truncate">{n.name}</span>
                  </button>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
