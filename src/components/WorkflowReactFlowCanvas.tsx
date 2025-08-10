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
import { getOrganizationTemplates, getRoleTemplates, getAgentTemplates, getInstrumentTemplates, getContractTemplates, getIntegrationTemplates, TemplateItem } from '@/data/templates'
import { getOrganizationCanvasTemplate } from '@/data/organizationCanvasTemplates'
import NodeEditor from '@/components/NodeEditor'
import { DollarSign, FileText, Target, AlertTriangle, Building, Crown, UserCheck, Banknote, Plug, Split, Play, Zap, User, Workflow, Wallet } from 'lucide-react'

type NodeKind = string

type RFNodeData = { label: string; kind: NodeKind; subtitle?: string; template?: TemplateItem }

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
  // Check if this is an AI assistant node that should be wide and short
  const isAIAssistant = data.label?.toLowerCase().includes('openai') || 
                       data.label?.toLowerCase().includes('anthropic') ||
                       data.label?.toLowerCase().includes('claude') ||
                       data.kind === 'ai-agent' ||
                       (data.template && data.template.category === 'AI & Machine Learning')
  
  const containerClass = isAIAssistant 
    ? "bg-black/70 backdrop-blur-xl border border-white/30 rounded-xl px-4 py-1.5 text-white min-w-[416px] max-w-[416px] h-[32px] shadow-xl flex items-center"
    : "bg-black/70 backdrop-blur-xl border border-white/30 rounded-xl px-3 py-2 text-white min-w-[160px] shadow-xl"
  
  const contentClass = isAIAssistant 
    ? "flex items-center gap-3 w-full"
    : "flex items-center gap-2"

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        <IconFor kind={data.kind} />
        <div className="leading-tight flex-1">
          <div className={`font-medium ${isAIAssistant ? 'text-xs' : 'text-sm'}`}>{data.label}</div>
          {data.subtitle && <div className="text-[10px] text-gray-400">{data.subtitle}</div>}
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
  { type: 'integration', name: 'Integrations', category: 'Business' },
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

const BUSINESS_KINDS = new Set(['workflow','organization','role','ai-agent','member','instrument','wallets','contract','integration'])



export default function WorkflowReactFlowCanvas({ 
  workflow, 
  templates, 
  onTemplateSelect,
  tabTitle 
}: { 
  workflow: any; 
  templates?: any; 
  onTemplateSelect?: (template: TemplateItem) => void;
  tabTitle?: string;
}) {
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
  const [editingNode, setEditingNode] = useState<Node<RFNodeData> | null>(null)

  const handlePick = useCallback((type: string, rf: ReturnType<typeof useReactFlow>) => {
    if (BUSINESS_KINDS.has(type)) {
      // Gather templates from the existing dashboards in page.tsx (basic mock via kind)
      let items: TemplateItem[] = []
      const live = templates || {
        organizations: getOrganizationTemplates(),
        roles: getRoleTemplates(),
        agents: getAgentTemplates(),
        instruments: getInstrumentTemplates(),
        contracts: getContractTemplates(),
        integrations: getIntegrationTemplates(),
      }
      const pick = <T extends { id?: string; name: string; description?: string; country?: string; type?: string; code?: string; size?: string; category?: string }>(arr?: T[]) => (arr || []).map(t => ({ id: (t as any).id || t.name, name: t.name, description: t.description, country: t.country, type: t.type, code: t.code, size: t.size, category: t.category }))
      if (type === 'organization') items = pick(live.organizations)
      else if (type === 'instrument') items = pick(live.instruments)
      else if (type === 'role') items = pick(live.roles)
      else if (type === 'member') items = pick(live.agents)
      else if (type === 'contract') items = pick(live.contracts)
      else if (type === 'workflow') items = [ { id: 'wf-blank', name: 'Blank Workflow' } ]
      else if (type === 'integration') items = pick(live.integrations)
      setTemplateModal({ kind: type, items })
      return
    }
    const viewport = rf.getViewport()
    const rect = (rf as any).viewport?.getBoundingClientRect?.() || { width: 800, height: 600 }
    const centerScreen = { x: viewport.x + rect.width / 2, y: viewport.y + rect.height / 2 }
    const pos = rf.project(centerScreen)
    const id = `n${Date.now()}`
    setNodes((nds) => nds.concat({ id, type: 'colored', position: pos, data: { label: type.toUpperCase(), kind: type } }))
  }, [setNodes, templates])

  const handleNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node<RFNodeData>) => {
    event.stopPropagation()
    setEditingNode(node)
  }, [])

  const handleNodeSave = useCallback((nodeId: string, updates: any) => {
    setNodes(nds => 
      nds.map(node => 
        node.id === nodeId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                ...updates,
                label: updates.name || updates.title || node.data.label
              }
            }
          : node
      )
    )
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
          setNodes={setNodes}
          setEdges={setEdges}
          onTemplateSelect={onTemplateSelect}
          onNodeDoubleClick={handleNodeDoubleClick}
        />
        
        {/* Node Editor Modal */}
        <NodeEditor
          node={editingNode}
          isOpen={!!editingNode}
          onClose={() => setEditingNode(null)}
          onSave={handleNodeSave}
        />
      </ReactFlowProvider>
    </div>
  )
}

function InnerRF({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onPick, palette, templateModal, setTemplateModal, setNodes, setEdges, onTemplateSelect, onNodeDoubleClick }:
  { nodes: Node<RFNodeData>[]; edges: Edge[]; onNodesChange: any; onEdgesChange: any; onConnect: any; onPick: (type: string, rf: any) => void; palette: any[]; templateModal: { kind: string; items: TemplateItem[] } | null; setTemplateModal: (v: any) => void; setNodes: any; setEdges: any; onTemplateSelect?: (template: TemplateItem) => void; onNodeDoubleClick?: (event: React.MouseEvent, node: Node<RFNodeData>) => void }) {
  const rf = useReactFlow()
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDoubleClick={onNodeDoubleClick}
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setTemplateModal(null)}
        >
          <div 
            className="bg-black/90 border border-white/20 rounded-lg p-6 w-[900px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-semibold">Select {templateModal.kind} Template</h3>
              <button className="text-gray-400 hover:text-white text-lg" onClick={() => setTemplateModal(null)}>✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templateModal.items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => {
                    if (templateModal.kind === 'organization' && it.category && onTemplateSelect) {
                      // Create a new tab with the organization template
                      onTemplateSelect(it)
                    } else if (templateModal.kind === 'organization' && it.category) {
                      // Fallback: Load the full organization canvas template in current tab
                      const canvasTemplate = getOrganizationCanvasTemplate(it)
                      setNodes(canvasTemplate.nodes)
                      setEdges(canvasTemplate.edges)
                    } else {
                      // Default behavior for other template types
                      const viewport = rf.getViewport()
                      const rect = (rf as any).viewport?.getBoundingClientRect?.() || { width: 800, height: 600 }
                      const centerScreen = { x: viewport.x + rect.width / 2, y: viewport.y + rect.height / 2 }
                      const pos = rf.project(centerScreen)
                      const id = `n${Date.now()}`
                      setNodes((nds: Node<RFNodeData>[]) => nds.concat({ id, type: 'colored', position: pos, data: { label: it.name, kind: templateModal.kind, template: it } }))
                    }
                    setTemplateModal(null)
                  }}
                  className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:scale-105 hover:border-white/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {it.icon && <span className="text-2xl">{it.icon}</span>}
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{it.name}</div>
                      <div className="text-xs text-gray-400">
                        {it.country && it.type ? `${it.country} • ${it.type}` : 
                         it.category ? `${it.category}` : 
                         'Integration'}
                      </div>
                      {(it as any).status && (
                        <div className={`text-xs mt-1 ${(it as any).status === 'Connected' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {(it as any).status} {(it as any).lastSync && `• Last sync: ${(it as any).lastSync}`}
                        </div>
                      )}
                    </div>
                  </div>
                  {it.description && <div className="text-xs text-gray-300 mb-2">{it.description}</div>}
                  {(it as any).features && (
                    <div className="text-xs text-blue-300 mb-2">
                      Features: {(it as any).features.slice(0, 3).join(', ')}
                      {(it as any).features.length > 3 && '...'}
                    </div>
                  )}
                  {(it as any).defaultDuration && (
                    <div className="text-xs text-amber-300 mb-2">
                      Default: {(it as any).defaultDuration} months
                    </div>
                  )}
                  {it.code && <div className="text-xs text-blue-400">{it.code}</div>}
                  {it.size && <div className="text-xs text-gray-500 capitalize">{it.size}</div>}
                  <div className="mt-2 text-xs text-green-400">Click to create →</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </ReactFlow>
  )
}


