"use client"

import React, { useMemo, useCallback, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import NodePalette from '@/components/NodePalette'
import { DollarSign, FileText, Target, AlertTriangle, Building, Crown, UserCheck, Banknote, Plug, Split, Play, Zap, User } from 'lucide-react'

type NodeKind = string

type RFNodeData = { label: string; kind: NodeKind; subtitle?: string }

function IconFor({ kind }: { kind: NodeKind }) {
  const cls = 'w-4 h-4'
  switch (kind) {
    case 'payment': return <DollarSign className={`${cls} text-yellow-400`} />
    case 'contract': return <FileText className={`${cls} text-blue-400`} />
    case 'splitter': return <Split className={`${cls} text-amber-400`} />
    case 'decision': return <AlertTriangle className={`${cls} text-purple-400`} />
    case 'organization': return <Building className={`${cls} text-orange-400`} />
    case 'role': return <Crown className={`${cls} text-amber-400`} />
    case 'member': return <UserCheck className={`${cls} text-cyan-400`} />
    case 'instrument': return <Banknote className={`${cls} text-emerald-400`} />
    case 'contact': return <User className={`${cls} text-blue-300`} />
    case 'trigger': return <Zap className={`${cls} text-yellow-500`} />
    case 'youtube': return <Play className={`${cls} text-red-500`} />
    default: return <Target className={`${cls} text-white`} />
  }
}

function ColoredNode({ data }: { data: RFNodeData }) {
  return (
    <div className="bg-black/70 backdrop-blur-xl border border-white/30 rounded-xl px-3 py-2 text-white min-w-[160px] shadow-xl">
      <div className="flex items-center gap-2">
        <IconFor kind={data.kind} />
        <div className="leading-tight">
          <div className="text-sm font-medium">{data.label}</div>
          {data.subtitle && <div className="text-[11px] text-gray-400">{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!bg-white/60" />
      <Handle type="source" position={Position.Right} className="!bg-white/60" />
    </div>
  )
}

const nodeTypes = { colored: ColoredNode }

const PALETTE = [
  { type: 'task', name: 'Task', category: 'Basic' },
  { type: 'decision', name: 'Decision', category: 'Basic' },
  { type: 'payment', name: 'Payment', category: 'Basic' },
  { type: 'milestone', name: 'Milestone', category: 'Basic' },
  { type: 'contract', name: 'Contract', category: 'Basic' },
  { type: 'team', name: 'Team', category: 'Basic' },
  { type: 'workflow', name: 'Workflows', category: 'Business' },
  { type: 'organization', name: 'Organizations', category: 'Business' },
  { type: 'role', name: 'Roles', category: 'Business' },
  { type: 'ai-agent', name: 'Agents', category: 'Business' },
  { type: 'member', name: 'People', category: 'Business' },
  { type: 'instrument', name: 'Instruments', category: 'Business' },
  { type: 'wallets', name: 'Wallets', category: 'Business' },
  { type: 'contact', name: 'Contact', category: 'Business' },
  { type: 'youtube', name: 'YouTube', category: 'Integration' },
  { type: 'api', name: 'API Call', category: 'Integration' },
  { type: 'database', name: 'Database', category: 'Integration' },
  { type: 'webhook', name: 'Webhook', category: 'Integration' },
  { type: 'email', name: 'Email', category: 'Communication' },
  { type: 'sms', name: 'SMS', category: 'Communication' },
  { type: 'notification', name: 'Notification', category: 'Communication' },
  { type: 'trigger', name: 'Trigger', category: 'Logic' },
]

export default function WorkflowReactFlowCanvas({ workflow }: { workflow: any }) {
  const initialNodes = useMemo<Node<RFNodeData>[]>(() =>
    (workflow?.nodes || []).map((n: any) => ({
      id: String(n.id),
      type: 'colored',
      position: { x: Number(n.x) || 0, y: Number(n.y) || 0 },
      data: { label: String(n.name || n.type), kind: String(n.type || 'task') },
    })), [workflow])

  const initialEdges = useMemo<Edge[]>(() =>
    (workflow?.connections || []).map((e: any) => ({
      id: String(e.id || `${e.from}-${e.to}`),
      source: String(e.from),
      target: String(e.to),
      animated: e.type === 'payment',
    })), [workflow])

  const [nodes, setNodes, onNodesChange] = useNodesState<RFNodeData>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), [setEdges])

  const handlePick = useCallback((type: string, rf: ReturnType<typeof useReactFlow>) => {
    const viewport = rf.getViewport()
    const rect = (rf as any).viewport?.getBoundingClientRect?.() || { width: 800, height: 600 }
    const centerScreen = { x: viewport.x + rect.width / 2, y: viewport.y + rect.height / 2 }
    const pos = rf.project(centerScreen)
    const id = `n${Date.now()}`
    setNodes((nds) => nds.concat({ id, type: 'colored', position: pos, data: { label: type.toUpperCase(), kind: type } }))
  }, [setNodes])

  return (
    <div className="absolute inset-0">
      <ReactFlowProvider>
        <InnerRF
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPick={handlePick}
          palette={PALETTE}
        />
      </ReactFlowProvider>
    </div>
  )
}

function InnerRF({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onPick, palette }:
  { nodes: Node<RFNodeData>[]; edges: Edge[]; onNodesChange: any; onEdgesChange: any; onConnect: any; onPick: (type: string, rf: any) => void; palette: any[] }) {
  const rf = useReactFlow()
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
      defaultEdgeOptions={{ style: { stroke: 'rgba(255,255,255,0.7)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.8)' } }}
      connectionLineStyle={{ stroke: 'rgba(255,255,255,0.6)', strokeWidth: 2 }}
    >
      <Background color="rgba(255,255,255,0.1)" />
      <MiniMap pannable zoomable style={{ background: 'rgba(0,0,0,0.6)' }} />
      <Controls position="bottom-left" showInteractive={false} />
      <Panel position="top-right" style={{ right: 16, top: 16 }}>
        <NodePalette
          title="Add Nodes"
          nodeTypes={palette as any}
          categories={[...new Set(palette.map((p) => p.category))]}
          onPick={(t) => onPick(t, rf)}
        />
      </Panel>
    </ReactFlow>
  )
}


