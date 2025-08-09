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
import { DollarSign, FileText, Target, AlertTriangle, CheckCircle, Users, Building, Crown, UserCheck, Banknote, Plug, Split, Play, Zap, User } from 'lucide-react'

type NodeKind =
  | 'youtube'
  | 'splitter'
  | 'payment'
  | 'decision'
  | 'member'
  | 'instrument'
  | 'organization'
  | 'role'
  | 'contact'
  | 'trigger'

type NodeData = {
  label: string
  kind: NodeKind
  subtitle?: string
}

const IconFor = ({ kind, size = 18 }: { kind: NodeKind; size?: number }) => {
  const cls = `w-[${size}px] h-[${size}px]`
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

const borderClassFor = (kind: NodeKind) => {
  switch (kind) {
    case 'payment': return 'border-yellow-400/60'
    case 'decision': return 'border-purple-400/60'
    case 'organization': return 'border-orange-400/60'
    case 'role': return 'border-amber-400/60'
    case 'member': return 'border-cyan-400/60'
    case 'instrument': return 'border-emerald-400/60'
    case 'splitter': return 'border-amber-400/60'
    case 'youtube': return 'border-red-500/60'
    case 'trigger': return 'border-yellow-500/60'
    case 'contact': return 'border-blue-300/60'
    default: return 'border-white/30'
  }
}

function ColoredNode({ data, isConnectMode }: { data: NodeData; isConnectMode?: boolean }) {
  return (
    <div className={`bg-black/70 backdrop-blur-xl border ${borderClassFor(data.kind)} rounded-xl px-3 py-2 text-white min-w-[160px] shadow-xl`}> 
      <div className="flex items-center gap-2">
        <IconFor kind={data.kind} />
        <div className="leading-tight">
          <div className="text-sm font-medium">{data.label}</div>
          {data.subtitle && <div className="text-[11px] text-gray-400">{data.subtitle}</div>}
        </div>
      </div>
      {isConnectMode && <Handle type="target" position={Position.Left} className="!bg-white/60" />}
      {isConnectMode && <Handle type="source" position={Position.Right} className="!bg-white/60" />}
    </div>
  )
}

// Pass connect mode to node via props
const nodeTypes = {
  colored: (props: any) => <ColoredNode {...props} isConnectMode={props.data?.isConnectMode} />,
}

const initialNodes: Node<NodeData>[] = [
  { id: 'n1', type: 'colored', position: { x: 100, y: 100 }, data: { label: 'YouTube Ad Revenue', kind: 'youtube', subtitle: 'AdSense receipts' } },
  { id: 'n2', type: 'colored', position: { x: 380, y: 100 }, data: { label: 'Split 70/20/10', kind: 'splitter' } },
  { id: 'n3', type: 'colored', position: { x: 680, y: 60 }, data: { label: 'Royalty Pool (70%)', kind: 'payment' } },
  { id: 'n3b', type: 'colored', position: { x: 680, y: 140 }, data: { label: 'Ops (20%)', kind: 'payment' } },
  { id: 'n3c', type: 'colored', position: { x: 680, y: 220 }, data: { label: 'Reserve (10%)', kind: 'payment' } },
  { id: 'n4', type: 'colored', position: { x: 960, y: 100 }, data: { label: 'Runway Guardrail', kind: 'decision', subtitle: '< 6 months?' } },
  { id: 'n5', type: 'colored', position: { x: 1240, y: 100 }, data: { label: 'Dividend Distributor', kind: 'payment', subtitle: 'Weekly to AUDEX' } },
  { id: 'n11', type: 'colored', position: { x: 1520, y: 100 }, data: { label: 'Shareholders', kind: 'member', subtitle: 'AUDEX holders' } },
  { id: 'n10', type: 'colored', position: { x: 960, y: 220 }, data: { label: 'AUDEX Token', kind: 'instrument' } },
  { id: 'n6', type: 'colored', position: { x: 820, y: 300 }, data: { label: 'AUDEX', kind: 'organization' } },
]

const initialEdges: Edge[] = [
  { id: 'c1', source: 'n1', target: 'n2', animated: true },
  { id: 'c2', source: 'n2', target: 'n3' },
  { id: 'c3', source: 'n2', target: 'n3b' },
  { id: 'c4', source: 'n2', target: 'n3c' },
  { id: 'c5', source: 'n3', target: 'n4' },
  { id: 'c6', source: 'n4', target: 'n5' },
  { id: 'c8', source: 'n5', target: 'n11', animated: true },
  { id: 'c10', source: 'n6', target: 'n10' },
]

const choices: { label: string; kind: NodeKind; category: 'Flow' | 'Business' }[] = [
  { label: 'YouTube', kind: 'youtube', category: 'Flow' },
  { label: 'Splitter', kind: 'splitter', category: 'Flow' },
  { label: 'Payment', kind: 'payment', category: 'Flow' },
  { label: 'Decision', kind: 'decision', category: 'Flow' },
  { label: 'Trigger', kind: 'trigger', category: 'Flow' },
  { label: 'Organization', kind: 'organization', category: 'Business' },
  { label: 'Role', kind: 'role', category: 'Business' },
  { label: 'Member', kind: 'member', category: 'Business' },
  { label: 'Instrument', kind: 'instrument', category: 'Business' },
  { label: 'Contact', kind: 'contact', category: 'Business' },
]

export const dynamic = 'force-dynamic'

function OverlayPanel({
  selectedKind,
  setSelectedKind,
  onAdd,
}: {
  selectedKind: NodeKind | ''
  setSelectedKind: (k: NodeKind | '') => void
  onAdd: (pos: { x: number; y: number }, kind: NodeKind) => void
}) {
  const rf = useReactFlow()
  const addNodeAtCenter = useCallback(() => {
    if (!selectedKind) return
    const viewport = rf.getViewport()
    const rect = (rf as any).viewport?.getBoundingClientRect?.() || { width: 800, height: 600 }
    const centerScreen = { x: viewport.x + rect.width / 2, y: viewport.y + rect.height / 2 }
    const pos = rf.project(centerScreen)
    onAdd(pos, selectedKind)
    setSelectedKind('')
  }, [rf, selectedKind, setSelectedKind, onAdd])

  // Expose a tiny helper to window so the left palette can trigger centered adds without re-creating RF context
  if (typeof window !== 'undefined') {
    ;(window as any).__rfAdd = {
      addAtCenter: (kind: NodeKind) => {
        const viewport = rf.getViewport()
        const rect = (rf as any).viewport?.getBoundingClientRect?.() || { width: 800, height: 600 }
        const centerScreen = { x: viewport.x + rect.width / 2, y: viewport.y + rect.height / 2 }
        const pos = rf.project(centerScreen)
        onAdd(pos, kind)
      }
    }
  }

  return (
    <Panel position="top-left">
      <div className="glass-card bg-black/70 backdrop-blur-xl border border-white/20 rounded-lg p-2 flex items-center gap-2">
        <select
          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
          value={selectedKind}
          onChange={(e) => setSelectedKind(e.target.value as NodeKind)}
        >
          <option value="">Add node…</option>
          {choices.map((c) => (
            <option key={c.kind} value={c.kind}>{c.label}</option>
          ))}
        </select>
        <button
          className="glass-button bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm disabled:opacity-50"
          disabled={!selectedKind}
          onClick={addNodeAtCenter}
        >
          Add
        </button>
        <button
          className="glass-button bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
          onClick={() => rf.fitView({ padding: 0.2 })}
        >
          Fit View
        </button>
      </div>
    </Panel>
  )
}

export default function ReactFlowDemoPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedKind, setSelectedKind] = useState<NodeKind | ''>('')
  const [currentTool, setCurrentTool] = useState<'select' | 'connect'>('select')
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true)
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([])

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), [setEdges])

  const handleAddAtPos = useCallback((pos: { x: number; y: number }, kind: NodeKind) => {
    const id = `n${Date.now()}`
    setNodes((nds) => nds.concat({ id, type: 'colored', position: pos, data: { label: kind.toUpperCase(), kind } }))
  }, [setNodes])

  const nodeTypesMemo = useMemo(() => nodeTypes, [])

  const handleSelectionChange = useCallback((sel: { nodes?: { id: string }[] } | null) => {
    const next = (sel?.nodes || []).map((n) => n.id)
    setSelectedNodeIds((prev) => (prev.length === next.length && prev.every((id, i) => id === next[i])) ? prev : next)
  }, [])

  // Reflect connect mode into node data for handles visibility
  const nodesWithMode = useMemo(
    () => nodes.map((n) => ({ ...n, data: { ...n.data, isConnectMode: currentTool === 'connect' } })),
    [nodes, currentTool]
  )

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">React Flow Canvas (Experimental)</h1>
        <div className="h-[75vh] bg-black/50 border border-white/20 rounded-lg overflow-hidden relative">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodesWithMode}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypesMemo}
              fitView
              snapToGrid={snapToGrid}
              onSelectionChange={handleSelectionChange}
              defaultEdgeOptions={{ style: { stroke: 'rgba(255,255,255,0.7)', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.8)' } }}
              connectionLineStyle={{ stroke: 'rgba(255,255,255,0.6)', strokeWidth: 2 }}
            >
              <Background color="rgba(255,255,255,0.1)" />
              <MiniMap pannable zoomable style={{ background: 'rgba(0,0,0,0.6)' }} />
              <Controls showInteractive={false} />
              <OverlayPanel selectedKind={selectedKind} setSelectedKind={setSelectedKind} onAdd={handleAddAtPos} />

              {/* Add Nodes Palette (desktop) */}
              <Panel position="top-left">
                <div className="bg-black/70 backdrop-blur-xl border border-white/20 rounded-lg p-3 min-w-[220px]">
                  <div className="text-xs text-gray-400 mb-2">Add Nodes</div>
                  {(['Flow','Business'] as const).map((cat) => (
                    <div key={cat} className="mb-2">
                      <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">{cat}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {choices.filter(c => c.category===cat).map((c) => (
                          <button
                            key={c.kind}
                            onClick={() => {
                              // center add; position resolved in panel via useReactFlow
                              const rf = (window as any).__rfAdd || null
                              if (rf && rf.addAtCenter) {
                                rf.addAtCenter(c.kind)
                              } else {
                                setSelectedKind(c.kind)
                              }
                            }}
                            className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-left"
                            title={`Add ${c.label}`}
                          >
                            <IconFor kind={c.kind} />
                            <span className="text-sm text-white">{c.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Toolbar: tools and zoom */}
              <Panel position="top-right">
                <Toolbar
                  currentTool={currentTool}
                  setCurrentTool={setCurrentTool}
                  snapToGrid={snapToGrid}
                  setSnapToGrid={setSnapToGrid}
                  selectedIds={selectedNodeIds}
                  deleteSelected={() => setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)))}
                />
              </Panel>

              {/* Inspector */}
              {selectedNodeIds.length === 1 && (
                <Panel position="bottom-right">
                  <Inspector node={nodes.find((n) => n.id === selectedNodeIds[0]) as Node<NodeData> | undefined} onRename={(name) => setNodes((nds) => nds.map((n) => (n.id === selectedNodeIds[0] ? { ...n, data: { ...n.data, label: name } } : n)))} />
                </Panel>
              )}
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  )
}

function Toolbar({
  currentTool,
  setCurrentTool,
  snapToGrid,
  setSnapToGrid,
  selectedIds,
  deleteSelected,
}: {
  currentTool: 'select' | 'connect'
  setCurrentTool: (t: 'select' | 'connect') => void
  snapToGrid: boolean
  setSnapToGrid: (v: boolean) => void
  selectedIds: string[]
  deleteSelected: () => void
}) {
  const rf = useReactFlow()
  return (
    <div className="glass-card bg-black/70 backdrop-blur-xl border border-white/20 rounded-lg p-2 flex items-center gap-2">
      <button onClick={() => setCurrentTool('select')} className={`px-2 py-1 rounded text-sm ${currentTool === 'select' ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10'}`}>Select</button>
      <button onClick={() => setCurrentTool('connect')} className={`px-2 py-1 rounded text-sm ${currentTool === 'connect' ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10'}`}>Connect</button>
      <span className="mx-2 h-5 w-px bg-white/20" />
      <button onClick={() => rf.zoomIn()} className="px-2 py-1 rounded text-sm text-gray-300 hover:bg-white/10">Zoom In</button>
      <button onClick={() => rf.zoomOut()} className="px-2 py-1 rounded text-sm text-gray-300 hover:bg-white/10">Zoom Out</button>
      <button onClick={() => rf.fitView({ padding: 0.2 })} className="px-2 py-1 rounded text-sm text-gray-300 hover:bg-white/10">Reset</button>
      <span className="mx-2 h-5 w-px bg-white/20" />
      <label className="flex items-center gap-1 text-sm text-gray-300">
        <input type="checkbox" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} />
        Snap
      </label>
      <span className="mx-2 h-5 w-px bg-white/20" />
      <button disabled={selectedIds.length === 0} onClick={deleteSelected} className={`px-2 py-1 rounded text-sm ${selectedIds.length ? 'text-red-300 hover:bg-red-500/10' : 'text-gray-500 cursor-not-allowed'}`}>Delete</button>
    </div>
  )
}

function Inspector({ node, onRename }: { node?: Node<NodeData>; onRename: (name: string) => void }) {
  if (!node) return null
  return (
    <div className="glass-card bg-black/70 backdrop-blur-xl border border-white/20 rounded-lg p-3 text-white min-w-[220px]">
      <div className="text-sm text-gray-400 mb-1">Node</div>
      <input
        value={node.data.label}
        onChange={(e) => onRename(e.target.value)}
        className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm mb-2"
      />
      <div className="text-xs text-gray-400">Type: <span className="text-gray-200">{node.data.kind}</span></div>
      {node.data.subtitle && (
        <div className="text-xs text-gray-400">Subtitle: <span className="text-gray-200">{node.data.subtitle}</span></div>
      )}
    </div>
  )
}


