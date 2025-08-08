'use client'

import { useState, useRef } from 'react'
import { Plus, X } from 'lucide-react'

interface CashHandle {
  id: string
  name: string
  role: string
  x: number
  y: number
  connections: string[]
}

interface Connection {
  id: string
  from: string
  to: string
}

export default function Dashboard() {
  const [cashHandles, setCashHandles] = useState<CashHandle[]>([
    { id: '1', name: 'Alice', role: 'Developer', x: 100, y: 100, connections: [] },
    { id: '2', name: 'Bob', role: 'Designer', x: 300, y: 150, connections: [] },
    { id: '3', name: 'Charlie', role: 'Manager', x: 200, y: 300, connections: [] },
  ])
  const [connections, setConnections] = useState<Connection[]>([])
  const [dragging, setDragging] = useState<string | null>(null)
  const [selectedHandle, setSelectedHandle] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const addCashHandle = () => {
    const newHandle: CashHandle = {
      id: Date.now().toString(),
      name: '',
      role: '',
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50,
      connections: []
    }
    setCashHandles([...cashHandles, newHandle])
    setSelectedHandle(newHandle.id)
  }

  const updateCashHandle = (id: string, updates: Partial<CashHandle>) => {
    setCashHandles(handles => 
      handles.map(handle => 
        handle.id === id ? { ...handle, ...updates } : handle
      )
    )
  }

  const deleteCashHandle = (id: string) => {
    setCashHandles(handles => handles.filter(h => h.id !== id))
    setConnections(conns => conns.filter(c => c.from !== id && c.to !== id))
  }

  const startConnection = (fromId: string) => {
    setIsConnecting(fromId)
  }

  const completeConnection = (toId: string) => {
    if (isConnecting && isConnecting !== toId) {
      const newConnection: Connection = {
        id: `${isConnecting}-${toId}`,
        from: isConnecting,
        to: toId
      }
      setConnections([...connections, newConnection])
    }
    setIsConnecting(null)
  }

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    setDragging(id)
    setSelectedHandle(id)
    e.stopPropagation()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      updateCashHandle(dragging, { x, y })
    }
  }

  const handleMouseUp = () => {
    setDragging(null)
  }

  const getHandlePosition = (id: string) => {
    return cashHandles.find(h => h.id === id)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/20 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.01),transparent_50%)]"></div>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1"></div>
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-8 py-4 shadow-2xl">
            <h1 className="text-3xl font-bold text-white tracking-wider font-mono">CASHBOARD</h1>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={addCashHandle}
              className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 px-6 py-3 rounded-xl flex items-center space-x-3 text-white shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Handle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Board */}
      <div
        ref={boardRef}
        className="absolute inset-0 pt-32 cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map(connection => {
            const from = getHandlePosition(connection.from)
            const to = getHandlePosition(connection.to)
            if (!from || !to) return null

            return (
              <line
                key={connection.id}
                x1={from.x + 96}
                y1={from.y + 20}
                x2={to.x + 96}
                y2={to.y + 20}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead)"
              />
            )
          })}
          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon
                points="0 0, 8 3, 0 6"
                fill="rgba(255, 255, 255, 0.15)"
              />
            </marker>
          </defs>
        </svg>

        {/* Cash Handle Nodes */}
        {cashHandles.map(handle => (
          <div
            key={handle.id}
            className={`absolute bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-4 w-48 h-20 cursor-move transition-all duration-300 shadow-2xl hover:shadow-white/5 group ${
              selectedHandle === handle.id ? 'ring-2 ring-white/30 shadow-white/10' : ''
            } ${isConnecting === handle.id ? 'ring-2 ring-green-400/50 shadow-green-400/20' : ''}`}
            style={{
              left: handle.x,
              top: handle.y,
              transform: dragging === handle.id ? 'scale(1.05) rotate(1deg)' : 'scale(1)',
            }}
            onMouseDown={(e) => handleMouseDown(e, handle.id)}
            onDoubleClick={() => setSelectedHandle(handle.id)}
            onClick={() => {
              if (isConnecting && isConnecting !== handle.id) {
                completeConnection(handle.id)
              }
            }}
          >
            {/* Status dot and delete button */}
            <div className="flex items-center justify-between mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteCashHandle(handle.id)
                }}
                className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 hover:scale-110"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            {/* Name and role inputs stacked vertically */}
            <div className="space-y-1 mb-2">
              <input
                type="text"
                value={handle.name}
                onChange={(e) => updateCashHandle(handle.id, { name: e.target.value })}
                placeholder="Name"
                className="w-full bg-transparent border-none text-white text-sm font-medium focus:outline-none placeholder-gray-500 focus:placeholder-gray-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              />
              
              <input
                type="text"
                value={handle.role}
                onChange={(e) => updateCashHandle(handle.id, { role: e.target.value })}
                placeholder="Role"
                className="w-full bg-transparent border-none text-gray-400 text-xs focus:outline-none placeholder-gray-600 focus:placeholder-gray-500 focus:text-gray-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Connect button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                startConnection(handle.id)
              }}
              className={`w-full text-xs px-2 py-1 rounded-lg transition-all duration-200 ${
                isConnecting === handle.id 
                  ? 'bg-green-500/20 text-green-400 border border-green-400/30 shadow-green-400/20' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {isConnecting === handle.id ? 'Click target' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
