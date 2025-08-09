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
import { DollarSign, FileText, Target, AlertTriangle, CheckCircle, Users, Building, Crown, UserCheck, Banknote, Plug, Split, Play, Zap, User, Search } from 'lucide-react'
import NodePalette, { type PaletteItem } from '@/components/NodePalette'

// Use a broad string to allow many kinds without failing types
type NodeKind = string

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
    // Communication
    case 'email': return <User className={`${cls} text-blue-300`} />
    case 'sms': return <User className={`${cls} text-green-300`} />
    case 'notification': return <User className={`${cls} text-cyan-300`} />
    // Logic
    case 'condition': return <AlertTriangle className={`${cls} text-purple-400`} />
    case 'switch': return <Split className={`${cls} text-indigo-400`} />
    case 'router': return <Split className={`${cls} text-fuchsia-400`} />
    case 'delay': return <AlertTriangle className={`${cls} text-yellow-300`} />
    case 'queue': return <AlertTriangle className={`${cls} text-emerald-300`} />
    case 'batch': return <AlertTriangle className={`${cls} text-teal-300`} />
    case 'parallel': return <AlertTriangle className={`${cls} text-sky-300`} />
    case 'sequence': return <AlertTriangle className={`${cls} text-pink-300`} />
    case 'retry': return <AlertTriangle className={`${cls} text-orange-300`} />
    // Integrations (generic icon fallback)
    case 'api':
    case 'database':
    case 'webhook':
    case 'elevenlabs':
    case 'midjourney':
    case 'veo3':
    case 'openai':
    case 'anthropic':
    case 'stability':
    case 'runway':
    case 'replicate':
    case 'huggingface':
    case 'slack':
    case 'teams':
    case 'zoom':
    case 'stripe':
    case 'paypal':
    case 'square':
    case 'salesforce':
    case 'hubspot':
    case 'pipedrive':
    case 'googlesheets':
    case 'excel':
    case 'airtable':
    case 'notion':
    case 'instagram':
    case 'snapchat':
    case 'threads':
    case 'twitter':
    case 'facebook':
    case 'linkedin':
    case 'tiktok':
    case 'discord':
    case 'telegram':
    case 'whatsapp':
    case 'reddit':
      return <Plug className={`${cls} text-violet-400`} />
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
    case 'contract': return 'border-blue-400/60'
    case 'milestone': return 'border-indigo-400/60'
    case 'team': return 'border-pink-400/60'
    // integrations default
    case 'api':
    case 'database':
    case 'webhook':
    case 'elevenlabs':
    case 'midjourney':
    case 'veo3':
    case 'openai':
    case 'anthropic':
    case 'stability':
    case 'runway':
    case 'replicate':
    case 'huggingface':
    case 'slack':
    case 'teams':
    case 'zoom':
    case 'stripe':
    case 'paypal':
    case 'square':
    case 'salesforce':
    case 'hubspot':
    case 'pipedrive':
    case 'googlesheets':
    case 'excel':
    case 'airtable':
    case 'notion':
    case 'instagram':
    case 'snapchat':
    case 'threads':
    case 'twitter':
    case 'facebook':
    case 'linkedin':
    case 'tiktok':
    case 'discord':
    case 'telegram':
    case 'whatsapp':
    case 'reddit':
      return 'border-violet-400/60'
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

const choices: { label: string; kind: NodeKind; category: 'Basic' | 'Business' | 'Integration' | 'Communication' | 'Logic' | 'Process' }[] = [
  // Basic
  { label: 'Task', kind: 'task', category: 'Basic' },
  { label: 'Decision', kind: 'decision', category: 'Basic' },
  { label: 'Payment', kind: 'payment', category: 'Basic' },
  { label: 'Milestone', kind: 'milestone', category: 'Basic' },
  { label: 'Contract', kind: 'contract', category: 'Basic' },
  { label: 'Team', kind: 'team', category: 'Basic' },
  // Business
  { label: 'Workflows', kind: 'workflow', category: 'Business' },
  { label: 'Organizations', kind: 'organization', category: 'Business' },
  { label: 'Roles', kind: 'role', category: 'Business' },
  { label: 'Agents', kind: 'ai-agent', category: 'Business' },
  { label: 'People', kind: 'member', category: 'Business' },
  { label: 'Instruments', kind: 'instrument', category: 'Business' },
  { label: 'Contracts', kind: 'contract', category: 'Business' },
  { label: 'Wallets', kind: 'wallets', category: 'Business' },
  { label: 'Integration', kind: 'integration', category: 'Business' },
  { label: 'Contact', kind: 'contact', category: 'Business' },
  // Integration
  { label: 'YouTube', kind: 'youtube', category: 'Integration' },
  { label: 'API Call', kind: 'api', category: 'Integration' },
  { label: 'Database', kind: 'database', category: 'Integration' },
  { label: 'Webhook', kind: 'webhook', category: 'Integration' },
  { label: 'ElevenLabs', kind: 'elevenlabs', category: 'Integration' },
  { label: 'MidJourney', kind: 'midjourney', category: 'Integration' },
  { label: 'Veo3', kind: 'veo3', category: 'Integration' },
  { label: 'OpenAI', kind: 'openai', category: 'Integration' },
  { label: 'Anthropic', kind: 'anthropic', category: 'Integration' },
  { label: 'Stability AI', kind: 'stability', category: 'Integration' },
  { label: 'Runway ML', kind: 'runway', category: 'Integration' },
  { label: 'Replicate', kind: 'replicate', category: 'Integration' },
  { label: 'Hugging Face', kind: 'huggingface', category: 'Integration' },
  { label: 'Salesforce', kind: 'salesforce', category: 'Integration' },
  { label: 'HubSpot', kind: 'hubspot', category: 'Integration' },
  { label: 'Pipedrive', kind: 'pipedrive', category: 'Integration' },
  { label: 'Google Sheets', kind: 'googlesheets', category: 'Integration' },
  { label: 'Excel', kind: 'excel', category: 'Integration' },
  { label: 'Airtable', kind: 'airtable', category: 'Integration' },
  { label: 'Notion', kind: 'notion', category: 'Integration' },
  { label: 'Stripe', kind: 'stripe', category: 'Integration' },
  { label: 'PayPal', kind: 'paypal', category: 'Integration' },
  { label: 'Square', kind: 'square', category: 'Integration' },
  { label: 'Slack', kind: 'slack', category: 'Integration' },
  { label: 'Microsoft Teams', kind: 'teams', category: 'Integration' },
  { label: 'Zoom', kind: 'zoom', category: 'Integration' },
  // Communication
  { label: 'Email', kind: 'email', category: 'Communication' },
  { label: 'SMS', kind: 'sms', category: 'Communication' },
  { label: 'Notification', kind: 'notification', category: 'Communication' },
  // Logic
  { label: 'Trigger', kind: 'trigger', category: 'Logic' },
  { label: 'Condition', kind: 'condition', category: 'Logic' },
  { label: 'Switch', kind: 'switch', category: 'Logic' },
  { label: 'Router', kind: 'router', category: 'Logic' },
  { label: 'Delay', kind: 'delay', category: 'Logic' },
  { label: 'Queue', kind: 'queue', category: 'Logic' },
  { label: 'Batch', kind: 'batch', category: 'Logic' },
  { label: 'Parallel', kind: 'parallel', category: 'Logic' },
  { label: 'Sequence', kind: 'sequence', category: 'Logic' },
  { label: 'Retry', kind: 'retry', category: 'Logic' },
  // Process
  { label: 'Approval', kind: 'approval', category: 'Process' },
  { label: 'Review', kind: 'review', category: 'Process' },
  { label: 'Timer', kind: 'timer', category: 'Process' },
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
              <Controls position="bottom-left" showInteractive={false} />

              {/* Right-docked Add Nodes Palette (desktop) */}
              <Panel position="top-right">
                <NodePalette
                  title="Add Nodes"
                  nodeTypes={choices.map((c) => ({ type: c.kind, name: c.label, category: c.category, icon: <IconFor kind={c.kind} /> })) as PaletteItem[]}
                  categories={[...new Set(choices.map((c) => c.category))]}
                  onPick={(k) => {
                    const rf = (typeof window !== 'undefined') ? (window as any).__rfAdd : null
                    if (rf && rf.addAtCenter) rf.addAtCenter(k as NodeKind)
                  }}
                />
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

function RightPalette({ onPick }: { onPick: (k: NodeKind) => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<{ [k in 'Flow' | 'Business']: boolean }>({ Flow: true, Business: true })

  const filtered = useMemo(() =>
    choices.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
  [query])

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg p-3 min-w-[260px] w-[260px]">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-400">Add Nodes</div>
        <button aria-label="toggle" onClick={() => setOpen((p) => ({ Flow: !p.Flow, Business: !p.Business }))} className="text-gray-400 hover:text-white text-xs">Collapse</button>
      </div>
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search nodes"
          className="w-full pl-8 pr-2 py-2 bg-white/10 border border-white/20 rounded text-sm text-white placeholder-gray-500"
        />
      </div>
      {(['Flow','Business'] as const).map((cat) => (
        <div key={cat} className="mb-3">
          <button onClick={() => setOpen((p) => ({ ...p, [cat]: !p[cat] }))} className="w-full text-left text-[11px] uppercase tracking-wide text-gray-500 mb-2">
            {cat}
          </button>
          {open[cat] && (
            <div className="grid grid-cols-2 gap-2">
              {filtered.filter((c) => c.category === cat).map((c) => (
                <button key={c.kind} onClick={() => onPick(c.kind)} className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10">
                  <IconFor kind={c.kind} />
                  <span className="text-sm text-white truncate">{c.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
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


