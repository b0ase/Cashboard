"use client"

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type PaletteItem = {
  type: string
  name: string
  category: string
  icon?: React.ReactNode
}

export function FixedNodePalette({
  title = "Add Nodes",
  nodeTypes,
  categories,
  onPick,
  visible = true,
  collapsed = false,
  onToggleCollapsed,
}: {
  title?: string
  nodeTypes: PaletteItem[]
  categories: string[]
  onPick: (type: string) => void
  visible?: boolean
  collapsed?: boolean
  onToggleCollapsed?: () => void
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map((c) => [c, true])) as Record<string, boolean>
  )

  if (!visible) {
    return null
  }

  return (
    <div 
      className={`fixed right-0 top-0 h-[80vh] bg-black/90 backdrop-blur-xl border-l border-white/20 transition-all duration-300 z-50 ${
        collapsed ? 'w-12' : 'w-80'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapsed}
        className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-black/90 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        title={collapsed ? "Expand palette" : "Collapse palette"}
      >
        {collapsed ? <ChevronLeft className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-white" />}
      </button>

      {/* Palette Content */}
      <div className={`h-full flex flex-col ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-400 mt-1">{nodeTypes.length} node types available</p>
        </div>

        {/* Node Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <button
                onClick={() => setOpen((p) => ({ ...p, [cat]: !p[cat] }))}
                className="w-full text-left text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>{cat}</span>
                <span className="text-xs text-gray-500">
                  ({nodeTypes.filter((n) => n.category === cat).length})
                </span>
              </button>
              
              {open[cat] && (
                <div className="grid grid-cols-2 gap-2 ml-2">
                  {nodeTypes
                    .filter((n) => n.category === cat)
                    .map((n) => (
                      <button
                        key={`${n.category}:${n.type}`}
                        onClick={() => onPick(n.type)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:border-white/20 group"
                        title={`Add ${n.name}`}
                      >
                        <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                          {n.icon}
                        </span>
                        <span className="text-xs text-white truncate">{n.name}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center">
            Drag nodes from here to the canvas
          </p>
        </div>
      </div>
    </div>
  )
}

export default FixedNodePalette
