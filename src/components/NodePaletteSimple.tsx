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
  
  // Resizing state
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null>(null)
  const [size, setSize] = useState({ width: 260, height: 400 })
  
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
  
  // Resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw') => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizing(true)
    setResizeDirection(direction)
    
    document.body.style.userSelect = 'none'
    document.body.style.cursor = direction.includes('e') || direction.includes('w') ? 'ew-resize' : 'ns-resize'
  }, [])

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !paletteRef.current) return
    
    e.preventDefault()
    
    const rect = paletteRef.current.getBoundingClientRect()
    const deltaX = e.clientX - rect.left
    const deltaY = e.clientY - rect.top
    
    let newWidth = size.width
    let newHeight = size.height
    
    // Calculate new dimensions based on resize direction
    if (resizeDirection?.includes('e')) {
      newWidth = Math.max(200, deltaX)
    }
    if (resizeDirection?.includes('w')) {
      newWidth = Math.max(200, size.width - (e.clientX - rect.right))
    }
    if (resizeDirection?.includes('s')) {
      newHeight = Math.max(300, deltaY)
    }
    if (resizeDirection?.includes('n')) {
      newHeight = Math.max(300, size.height - (e.clientY - rect.bottom))
    }
    
    // Constrain to reasonable limits
    const maxWidth = 800
    const maxHeight = 800
    
    newWidth = Math.min(newWidth, maxWidth)
    newHeight = Math.min(newHeight, maxHeight)
    
    setSize({ width: newWidth, height: newHeight })
  }, [isResizing, resizeDirection, size])

  const handleResizeEnd = useCallback(() => {
    if (!isResizing) return
    
    setIsResizing(false)
    setResizeDirection(null)
    
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [isResizing])

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

  // Set up resize event listeners
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
      }
    }
  }, [isResizing, handleResizeMove, handleResizeEnd])

  if (!visible) {
    return null
  }

  return (
    <div 
      ref={paletteRef}
      className={`bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg p-3 overflow-y-auto transition-all relative ${
        isDragging ? 'shadow-2xl scale-[1.02] border-blue-400/50' : 'shadow-lg'
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: '200px',
        minHeight: '300px'
      }}
    >
      {/* Additional Resize Handles for the main container */}
      {/* North (top) */}
      <div 
        className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-400/20 transition-colors z-10"
        onMouseDown={(e) => handleResizeStart(e, 'n')}
        title="Resize height"
      ></div>
      
      {/* South (bottom) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-blue-400/20 transition-colors z-10"
        onMouseDown={(e) => handleResizeStart(e, 's')}
        title="Resize height"
      ></div>
      
      {/* East (right) */}
      <div 
        className="absolute top-0 right-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-400/20 transition-colors z-10"
        onMouseDown={(e) => handleResizeStart(e, 'e')}
        title="Resize width"
      ></div>
      
      {/* West (left) */}
      <div 
        className="absolute top-0 left-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-400/20 transition-colors z-10"
        onMouseDown={(e) => handleResizeStart(e, 'w')}
        title="Resize width"
      ></div>
      
      {/* Corner handles */}
      <div 
        className="absolute top-0 right-0 w-3 h-3 cursor-nw-resize hover:bg-blue-400/30 transition-colors z-10"
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
        title="Resize diagonally"
      ></div>
      
      <div 
        className="absolute top-0 left-0 w-3 h-3 cursor-ne-resize hover:bg-blue-400/30 transition-colors z-10"
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
        title="Resize diagonally"
      ></div>
      
      <div 
        className="absolute bottom-0 right-0 w-3 h-3 cursor-ne-resize hover:bg-blue-400/30 transition-colors z-10"
        onMouseDown={(e) => handleResizeStart(e, 'se')}
        title="Resize diagonally"
      ></div>
      
      <div 
        className="absolute bottom-0 left-0 w-3 h-3 cursor-nw-resize hover:bg-blue-400/30 transition-colors z-10"
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
        title="Resize diagonally"
      ></div>
      <div 
        className="flex items-center justify-between mb-2 cursor-grab active:cursor-grabbing hover:bg-white/5 p-2 -m-2 mb-0 rounded transition-colors relative"
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
        
        {/* Resize Handles */}
        {/* North (top) */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-400/20 transition-colors"
          onMouseDown={(e) => handleResizeStart(e, 'n')}
          title="Resize height"
        ></div>
        
        {/* South (bottom) */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-blue-400/20 transition-colors"
          onMouseDown={(e) => handleResizeStart(e, 's')}
          title="Resize height"
        ></div>
        
        {/* East (right) */}
        <div 
          className="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-400/20 transition-colors"
          onMouseDown={(e) => handleResizeStart(e, 'e')}
          title="Resize width"
        ></div>
        
        {/* West (left) */}
        <div 
          className="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-400/20 transition-colors"
          onMouseDown={(e) => handleResizeStart(e, 'w')}
          title="Resize width"
        ></div>
        
        {/* Corner handles */}
        <div 
          className="absolute top-0 right-0 w-2 h-2 cursor-nw-resize hover:bg-blue-400/30 transition-colors"
          onMouseDown={(e) => handleResizeStart(e, 'ne')}
          title="Resize diagonally"
        ></div>
        
        <div 
          className="absolute top-0 left-0 w-2 h-2 cursor-ne-resize hover:bg-blue-400/30 transition-colors"
          onMouseDown={(e) => handleResizeStart(e, 'nw')}
          title="Resize diagonally"
        ></div>
        
        <div 
          className="absolute bottom-0 right-0 w-2 h-2 cursor-ne-resize hover:bg-blue-400/30 transition-colors"
          onMouseDown={(e) => handleResizeStart(e, 'se')}
          title="Resize diagonally"
        ></div>
        
        <div 
          className="absolute bottom-0 left-0 w-2 h-2 cursor-nw-resize hover:bg-blue-400/30 transition-colors"
          onMouseDown={(e) => handleResizeStart(e, 'sw')}
          title="Resize diagonally"
        ></div>
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
