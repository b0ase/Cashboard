"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { Star } from 'lucide-react'

export type PaletteItem = {
  type: string
  name: string
  category: string
  icon?: React.ReactNode
}

export function NodePalette({
  title = 'Add Nodes',
  nodeTypes,
  categories,
  onPick,
}: {
  title?: string
  nodeTypes: PaletteItem[]
  categories: string[]
  onPick: (type: string) => void
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(categories.map((c) => [c, true])) as Record<string, boolean>
  )
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nodePalette.favorites')
      if (saved) setFavorites(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('nodePalette.favorites', JSON.stringify(favorites))
    } catch {}
  }, [favorites])

  const favItems = useMemo(
    () => nodeTypes.filter((n) => favorites.includes(n.type)),
    [nodeTypes, favorites]
  )

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg p-3 min-w-[260px] w-[260px] max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-400">{title} <span className="text-[10px] text-gray-500">({nodeTypes.length})</span></div>
        <button
          aria-label="toggle"
          onClick={() =>
            setOpen((prev) =>
              Object.fromEntries(Object.keys(prev).map((k) => [k, !prev[k]])) as Record<string, boolean>
            )
          }
          className="text-gray-400 hover:text-white text-xs"
        >
          Collapse
        </button>
      </div>
      {favItems.length > 0 && (
        <div className="mb-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-2">Favorites</div>
          <div className="grid grid-cols-2 gap-2">
            {favItems.map((n) => (
              <button
                key={`fav:${n.type}`}
                onClick={() => onPick(n.type)}
                className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-left"
                title={`Add ${n.name}`}
              >
                <span className="inline-flex items-center justify-center">{n.icon}</span>
                <span className="text-sm text-white truncate">{n.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {categories.map((cat) => (
        <div key={cat} className="mb-3">
          <button
            onClick={() => setOpen((p) => ({ ...p, [cat]: !p[cat] }))}
            className="w-full text-left text-[11px] uppercase tracking-wide text-gray-500 mb-2"
          >
            {cat} <span className="text-[10px] text-gray-600">({nodeTypes.filter((n) => n.category === cat).length})</span>
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
                    <span className="ml-auto text-yellow-400/70 hover:text-yellow-300" onClick={(e) => { e.stopPropagation(); setFavorites((f) => f.includes(n.type) ? f.filter((t) => t !== n.type) : f.concat(n.type)) }}>
                      <Star className={`w-3.5 h-3.5 ${favorites.includes(n.type) ? 'fill-yellow-400/70' : ''}`} />
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default NodePalette


