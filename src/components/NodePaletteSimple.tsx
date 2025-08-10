"use client"

import React, { useState, useRef, useCallback } from 'react'
import { GripVertical } from 'lucide-react'

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
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const paletteRef = useRef<HTMLDivElement>(null)
  
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragging(true)
    
    // Store the offset from the mouse to the element's top-left corner
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
    
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'grabbing'
  }, [position])
  
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !paletteRef.current) return
    
    e.preventDefault()
    
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y
    
    // Update position state and transform
    setPosition({ x: newX, y: newY })
    paletteRef.current.style.transform = `translate(${newX}px, ${newY}px)`
  }, [isDragging, dragOffset])
  
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    
    setIsDragging(false)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [isDragging])
  
  // Set up drag event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove)
        document.removeEventListener('mouseup', handleDragEnd)
      }
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  if (!visible) {
    return null
  }

  return (
    <div 
      ref={paletteRef}
      className={`bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg p-3 min-w-[260px] w-[260px] max-h-[70vh] overflow-y-auto transition-all ${
        isDragging ? 'shadow-2xl scale-[1.02] border-blue-400/50' : 'shadow-lg'
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
    >
      <div 
        className="flex items-center justify-between mb-2 cursor-grab active:cursor-grabbing hover:bg-white/5 p-2 -m-2 mb-0 rounded transition-colors"
        onMouseDown={handleDragStart}
        title="Drag to move palette"
      >
        <div className="flex items-center gap-2">
          <div className="text-gray-400 hover:text-white">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="text-xs text-gray-400">
            {title} <span className="text-[10px] text-gray-500">({nodeTypes.length})</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation() // Prevent drag from starting
            setOpen(prev => Object.fromEntries(Object.keys(prev).map(k => [k, false])))
          }}
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
