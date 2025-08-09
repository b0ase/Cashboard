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
import { getOrganizationTemplates, getRoleTemplates, getAgentTemplates, getInstrumentTemplates, getContractTemplates, getIntegrationTemplates } from '@/data/templates'
import { DollarSign, FileText, Target, AlertTriangle, Building, Crown, UserCheck, Banknote, Plug, Split, Play, Zap, User, Workflow, Wallet } from 'lucide-react'

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
    case 'wallets': return <Wallet className={`${cls} text-teal-300`} />
    case 'workflow': return <Target className={`${cls} text-indigo-400`} />
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
  { type: 'team', name: 'Team', category: 'Basic' },
  // Business (replace Contact with Contract; move Contract here)
  { type: 'workflow', name: 'Workflows', category: 'Business' },
  { type: 'organization', name: 'Organizations', category: 'Business' },
  { type: 'role', name: 'Roles', category: 'Business' },
  { type: 'ai-agent', name: 'Agents', category: 'Business' },
  { type: 'member', name: 'People', category: 'Business' },
  { type: 'instrument', name: 'Instruments', category: 'Business' },
  { type: 'wallets', name: 'Wallets', category: 'Business' },
  { type: 'contract', name: 'Contract', category: 'Business' },
  // Integration
  { type: 'youtube', name: 'YouTube', category: 'Integration' },
  { type: 'api', name: 'API Call', category: 'Integration' },
  { type: 'database', name: 'Database', category: 'Integration' },
  { type: 'webhook', name: 'Webhook', category: 'Integration' },
  { type: 'email', name: 'Email', category: 'Communication' },
  { type: 'sms', name: 'SMS', category: 'Communication' },
  { type: 'notification', name: 'Notification', category: 'Communication' },
  { type: 'trigger', name: 'Trigger', category: 'Logic' },
]

const BUSINESS_KINDS = new Set(['workflow','organization','role','ai-agent','member','instrument','wallets','contract'])

type TemplateItem = { id: string; name: string; description?: string }

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
  const [templateModal, setTemplateModal] = useState<{ kind: string; items: TemplateItem[] } | null>(null)

  const handlePick = useCallback((type: string, rf: ReturnType<typeof useReactFlow>) => {
    if (BUSINESS_KINDS.has(type)) {
      // Gather templates from the existing dashboards in page.tsx (basic mock via kind)
      let items: TemplateItem[] = []
      // Minimal mapping – we can expand if needed by importing from page.tsx later
      if (type === 'organization') items = getOrganizationTemplates().map(t => ({ id: t.id || t.name, name: t.name, description: t.description }))
      else if (type === 'instrument') items = getInstrumentTemplates().map(t => ({ id: t.id || t.name, name: t.name, description: t.description }))
      else if (type === 'role') items = getRoleTemplates().map(t => ({ id: t.id || t.name, name: t.name, description: t.description }))
      else if (type === 'member') items = getAgentTemplates().map(t => ({ id: t.id || t.name, name: t.name, description: t.description }))
      else if (type === 'contract') items = getContractTemplates().map(t => ({ id: t.id || t.name, name: t.name, description: t.description }))
      else if (type === 'workflow') items = [ { id: 'wf-blank', name: 'Blank Workflow' } ]
      else if (type === 'integration') items = getIntegrationTemplates().map(t => ({ id: t.name, name: t.name, description: t.description }))
      setTemplateModal({ kind: type, items })
      return
    }
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
          templateModal={templateModal}
          setTemplateModal={setTemplateModal}
        />
      </ReactFlowProvider>
    </div>
  )
}

function InnerRF({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onPick, palette, templateModal, setTemplateModal }:
  { nodes: Node<RFNodeData>[]; edges: Edge[]; onNodesChange: any; onEdgesChange: any; onConnect: any; onPick: (type: string, rf: any) => void; palette: any[]; templateModal: { kind: string; items: TemplateItem[] } | null; setTemplateModal: (v: any) => void }) {
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
      {templateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-black/90 border border-white/20 rounded-lg p-4 w-[520px] max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white text-sm font-medium">Select {templateModal.kind} Template</h3>
              <button className="text-gray-400 hover:text-white" onClick={() => setTemplateModal(null)}>Close</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {templateModal.items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    const viewport = rf.getViewport()
                    const rect = (rf as any).viewport?.getBoundingClientRect?.() || { width: 800, height: 600 }
                    const centerScreen = { x: viewport.x + rect.width / 2, y: viewport.y + rect.height / 2 }
                    const pos = rf.project(centerScreen)
                    const id = `n${Date.now()}`
                    setNodes((nds) => nds.concat({ id, type: 'colored', position: pos, data: { label: it.name, kind: templateModal.kind } }))
                    setTemplateModal(null)
                  }}
                  className="p-3 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-left"
                >
                  <div className="text-white text-sm font-medium">{it.name}</div>
                  {it.description && <div className="text-xs text-gray-400">{it.description}</div>}
                </button>
              ))}
            </div>
            {templateModal.items.length === 0 && (
              <div className="text-gray-400 text-sm">No templates yet.</div>
            )}
          </div>
        </div>
      )}
    </ReactFlow>
  )
}


