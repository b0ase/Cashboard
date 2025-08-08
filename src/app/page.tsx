'use client'

import { useState, useRef } from 'react'
import { X, DollarSign, FileText, CheckCircle, AlertTriangle, Zap, Users, Target, ArrowRight, Play, Pause, Settings } from 'lucide-react'

interface WorkflowNode {
  id: string
  type: 'payment' | 'contract' | 'task' | 'decision' | 'milestone' | 'team'
  name: string
  description: string
  x: number
  y: number
  status: 'pending' | 'active' | 'completed' | 'failed' | 'paused'
  amount?: number
  deadline?: string
  assignees?: string[]
  conditions?: string[]
  connections: string[]
  metadata?: Record<string, unknown>
}

interface Connection {
  id: string
  from: string
  to: string
  type: 'success' | 'failure' | 'conditional' | 'payment' | 'task'
  condition?: string
  amount?: number
}

interface WorkflowState {
  nodes: WorkflowNode[]
  connections: Connection[]
  selectedNode: string | null
  isConnecting: string | null
  dragging: string | null
  workflowStatus: 'running' | 'paused' | 'stopped'
  autoMode: boolean
}

export default function Dashboard() {
  const [workflow, setWorkflow] = useState<WorkflowState>({
    nodes: [
      {
        id: '1',
        type: 'payment',
        name: 'Project Payment',
        description: 'Initial project funding',
        x: 100,
        y: 100,
        status: 'active',
        amount: 5000,
        connections: []
      },
      {
        id: '2',
        type: 'contract',
        name: 'Development Contract',
        description: 'Frontend development agreement',
        x: 350,
        y: 100,
        status: 'pending',
        deadline: '2024-02-15',
        connections: []
      },
      {
        id: '3',
        type: 'task',
        name: 'UI Implementation',
        description: 'Build user interface components',
        x: 600,
        y: 100,
        status: 'pending',
        assignees: ['Alice', 'Bob'],
        connections: []
      },
      {
        id: '4',
        type: 'decision',
        name: 'Code Review',
        description: 'Quality check decision point',
        x: 850,
        y: 100,
        status: 'pending',
        conditions: ['Pass', 'Fail'],
        connections: []
      },
      {
        id: '5',
        type: 'milestone',
        name: 'Phase 1 Complete',
        description: 'First development milestone',
        x: 1100,
        y: 100,
        status: 'pending',
        connections: []
      },
      {
        id: '6',
        type: 'team',
        name: 'Dev Team',
        description: 'Development team assignment',
        x: 600,
        y: 250,
        status: 'active',
        assignees: ['Alice', 'Bob', 'Charlie'],
        connections: []
      }
    ],
    connections: [
      { id: '1-2', from: '1', to: '2', type: 'payment', amount: 5000 },
      { id: '2-3', from: '2', to: '3', type: 'task' },
      { id: '3-4', from: '3', to: '4', type: 'conditional' },
      { id: '4-5', from: '4', to: '5', type: 'success', condition: 'Pass' },
      { id: '6-3', from: '6', to: '3', type: 'task' }
    ],
    selectedNode: null,
    isConnecting: null,
    dragging: null,
    workflowStatus: 'running',
    autoMode: true
  })

  const boardRef = useRef<HTMLDivElement>(null)

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="w-4 h-4" />
      case 'contract': return <FileText className="w-4 h-4" />
      case 'task': return <Target className="w-4 h-4" />
      case 'decision': return <AlertTriangle className="w-4 h-4" />
      case 'milestone': return <CheckCircle className="w-4 h-4" />
      case 'team': return <Users className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      case 'failed': return 'bg-red-500'
      case 'paused': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'success': return 'stroke-green-400'
      case 'failure': return 'stroke-red-400'
      case 'payment': return 'stroke-yellow-400'
      case 'task': return 'stroke-blue-400'
      case 'conditional': return 'stroke-purple-400'
      default: return 'stroke-white'
    }
  }

  const addNode = (type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type,
      name: `New ${type}`,
      description: `Description for ${type}`,
      x: Math.random() * 800 + 100,
      y: Math.random() * 400 + 100,
      status: 'pending',
      connections: []
    }
    
    if (type === 'payment') newNode.amount = 1000
    if (type === 'contract') newNode.deadline = '2024-03-01'
    if (type === 'task') newNode.assignees = ['Team Member']
    if (type === 'decision') newNode.conditions = ['Yes', 'No']
    if (type === 'team') newNode.assignees = ['Member 1', 'Member 2']

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      selectedNode: newNode.id
    }))
  }

  const updateNode = (id: string, updates: Partial<WorkflowNode>) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === id ? { ...node, ...updates } : node
      )
    }))
  }

  const deleteNode = (id: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== id),
      connections: prev.connections.filter(c => c.from !== id && c.to !== id),
      selectedNode: prev.selectedNode === id ? null : prev.selectedNode
    }))
  }

  const startConnection = (fromId: string) => {
    setWorkflow(prev => ({ ...prev, isConnecting: fromId }))
  }

  const completeConnection = (toId: string) => {
    if (workflow.isConnecting && workflow.isConnecting !== toId) {
      const newConnection: Connection = {
        id: `${workflow.isConnecting}-${toId}`,
        from: workflow.isConnecting,
        to: toId,
        type: 'task'
      }
      setWorkflow(prev => ({
        ...prev,
        connections: [...prev.connections, newConnection],
        isConnecting: null
      }))
    } else {
      setWorkflow(prev => ({ ...prev, isConnecting: null }))
    }
  }

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    setWorkflow(prev => ({ ...prev, dragging: id, selectedNode: id }))
    e.stopPropagation()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (workflow.dragging && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      updateNode(workflow.dragging, { x, y })
    }
  }

  const handleMouseUp = () => {
    setWorkflow(prev => ({ ...prev, dragging: null }))
  }

  const getNodePosition = (id: string) => {
    return workflow.nodes.find(n => n.id === id)
  }

  const toggleWorkflowStatus = () => {
    setWorkflow(prev => ({
      ...prev,
      workflowStatus: prev.workflowStatus === 'running' ? 'paused' : 'running'
    }))
  }

  const toggleAutoMode = () => {
    setWorkflow(prev => ({ ...prev, autoMode: !prev.autoMode }))
  }

  const advanceWorkflow = () => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => {
        if (node.status === 'pending') {
          return { ...node, status: 'active' }
        } else if (node.status === 'active') {
          return { ...node, status: 'completed' }
        }
        return node
      })
    }))
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
          <div className="flex items-center space-x-4">
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3">
              <h1 className="text-2xl font-bold text-white tracking-wider font-mono">CASHBOARD</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleWorkflowStatus}
                className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  workflow.workflowStatus === 'running' 
                    ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                }`}
              >
                {workflow.workflowStatus === 'running' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span className="text-sm font-medium">{workflow.workflowStatus === 'running' ? 'Running' : 'Paused'}</span>
              </button>
              <button
                onClick={toggleAutoMode}
                className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  workflow.autoMode 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' 
                    : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Auto</span>
              </button>
              <button
                onClick={advanceWorkflow}
                className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-2">
              <div className="flex items-center space-x-1">
                <button onClick={() => addNode('payment')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                </button>
                <button onClick={() => addNode('contract')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <FileText className="w-4 h-4 text-blue-400" />
                </button>
                <button onClick={() => addNode('task')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Target className="w-4 h-4 text-green-400" />
                </button>
                <button onClick={() => addNode('decision')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <AlertTriangle className="w-4 h-4 text-purple-400" />
                </button>
                <button onClick={() => addNode('milestone')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <CheckCircle className="w-4 h-4 text-indigo-400" />
                </button>
                <button onClick={() => addNode('team')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Users className="w-4 h-4 text-pink-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Board */}
      <div
        ref={boardRef}
        className="absolute inset-0 pt-24 cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {workflow.connections.map(connection => {
            const from = getNodePosition(connection.from)
            const to = getNodePosition(connection.to)
            if (!from || !to) return null

            return (
              <g key={connection.id}>
                <line
                  x1={from.x + 120}
                  y1={from.y + 30}
                  x2={to.x + 120}
                  y2={to.y + 30}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                <line
                  x1={from.x + 120}
                  y1={from.y + 30}
                  x2={to.x + 120}
                  y2={to.y + 30}
                  className={getConnectionColor(connection.type)}
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                {connection.amount && (
                  <text
                    x={(from.x + to.x) / 2 + 120}
                    y={(from.y + to.y) / 2 + 25}
                    className="text-xs fill-white"
                    textAnchor="middle"
                  >
                    ${connection.amount.toLocaleString()}
                  </text>
                )}
              </g>
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
                fill="currentColor"
                className="text-white"
              />
            </marker>
          </defs>
        </svg>

        {/* Workflow Nodes */}
        {workflow.nodes.map(node => (
          <div
            key={node.id}
            className={`absolute bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-4 w-60 cursor-move transition-all duration-300 shadow-2xl hover:shadow-white/5 group ${
              workflow.selectedNode === node.id ? 'ring-2 ring-white/30 shadow-white/10' : ''
            } ${workflow.isConnecting === node.id ? 'ring-2 ring-green-400/50 shadow-green-400/20' : ''}`}
            style={{
              left: node.x,
              top: node.y,
              transform: workflow.dragging === node.id ? 'scale(1.05) rotate(1deg)' : 'scale(1)',
            }}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
            onDoubleClick={() => setWorkflow(prev => ({ ...prev, selectedNode: node.id }))}
            onClick={() => {
              if (workflow.isConnecting && workflow.isConnecting !== node.id) {
                completeConnection(node.id)
              }
            }}
          >
            {/* Header with icon, status, and delete button */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${getStatusColor(node.status)} rounded-full shadow-lg`}></div>
                <div className="text-white/60">
                  {getNodeIcon(node.type)}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteNode(node.id)
                }}
                className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 hover:scale-110"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            {/* Node content */}
            <div className="space-y-2">
              <input
                type="text"
                value={node.name}
                onChange={(e) => updateNode(node.id, { name: e.target.value })}
                placeholder="Node name"
                className="w-full bg-transparent border-none text-white text-sm font-medium focus:outline-none placeholder-gray-500 focus:placeholder-gray-400 transition-colors"
                onClick={(e) => e.stopPropagation()}
              />
              
              <input
                type="text"
                value={node.description}
                onChange={(e) => updateNode(node.id, { description: e.target.value })}
                placeholder="Description"
                className="w-full bg-transparent border-none text-gray-400 text-xs focus:outline-none placeholder-gray-600 focus:placeholder-gray-500 focus:text-gray-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Type-specific fields */}
              {node.type === 'payment' && node.amount && (
                <div className="text-yellow-400 text-sm font-medium">
                  ${node.amount.toLocaleString()}
                </div>
              )}
              
              {node.type === 'contract' && node.deadline && (
                <div className="text-blue-400 text-xs">
                  Due: {new Date(node.deadline).toLocaleDateString()}
                </div>
              )}
              
              {node.type === 'task' && node.assignees && (
                <div className="text-green-400 text-xs">
                  {node.assignees.join(', ')}
                </div>
              )}
              
              {node.type === 'decision' && node.conditions && (
                <div className="flex space-x-1">
                  {node.conditions.map((condition, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                      {condition}
                    </span>
                  ))}
                </div>
              )}
              
              {node.type === 'team' && node.assignees && (
                <div className="text-pink-400 text-xs">
                  Team: {node.assignees.length} members
                </div>
              )}
            </div>

            {/* Connect button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                startConnection(node.id)
              }}
              className={`w-full mt-3 text-xs px-2 py-1 rounded-lg transition-all duration-200 ${
                workflow.isConnecting === node.id 
                  ? 'bg-green-500/20 text-green-400 border border-green-400/30 shadow-green-400/20' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {workflow.isConnecting === node.id ? 'Click target' : 'Connect'}
            </button>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <div className="flex items-center space-x-4">
              <span>Nodes: {workflow.nodes.length}</span>
              <span>Connections: {workflow.connections.length}</span>
              <span>Status: {workflow.workflowStatus}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Auto Mode: {workflow.autoMode ? 'ON' : 'OFF'}</span>
              <Settings className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
