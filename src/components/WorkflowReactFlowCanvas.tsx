"use client"

import React, { useMemo, useCallback, useState } from 'react'
import ReactFlow, {
  Background,
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
import NodePaletteSimple from '@/components/NodePaletteSimple'
import { getOrganizationTemplates, getRoleTemplates, getAgentTemplates, getInstrumentTemplates, getContractTemplates, getIntegrationTemplates, getCryptoTemplates, getWalletTemplates, TemplateItem } from '@/data/templates'
import { getOrganizationCanvasTemplate } from '@/data/organizationCanvasTemplates'
import NodeEditor from '@/components/NodeEditor'
import NodeCanvasModal from '@/components/NodeCanvasModal'
import { 
  DollarSign, FileText, Target, AlertTriangle, Building, Crown, UserCheck, Banknote, Plug, Split, Play, Zap, User, Workflow, Wallet,
  CheckSquare, GitBranch, Flag, Users, Mail, MessageSquare, Bell, Database, Code, Laptop, TrendingUp, Bot
} from 'lucide-react'

// Node canvas configurations (copied from NodeCanvasModal)
const NODE_CANVAS_CONFIGS = {
  instrument: {
    initialNodes: [
      { id: 'issuer', position: { x: 100, y: 100 }, data: { label: 'Issuer', kind: 'organization' } },
      { id: 'terms', position: { x: 300, y: 100 }, data: { label: 'Terms & Conditions', kind: 'contract' } },
      { id: 'payments', position: { x: 200, y: 250 }, data: { label: 'Payment Schedule', kind: 'workflow' } },
      { id: 'rating', position: { x: 400, y: 250 }, data: { label: 'Credit Rating', kind: 'assessment' } }
    ],
    initialEdges: [
      { id: 'issuer-terms', source: 'issuer', target: 'terms' },
      { id: 'terms-payments', source: 'terms', target: 'payments' },
      { id: 'issuer-rating', source: 'issuer', target: 'rating' }
    ]
  },
  wallets: {
    initialNodes: [
      { id: 'keys', position: { x: 100, y: 100 }, data: { label: 'Private Keys', kind: 'security' } },
      { id: 'transactions', position: { x: 300, y: 100 }, data: { label: 'Transactions', kind: 'workflow' } },
      { id: 'backup', position: { x: 200, y: 250 }, data: { label: 'Backup & Recovery', kind: 'security' } },
      { id: 'monitoring', position: { x: 400, y: 250 }, data: { label: 'Monitoring', kind: 'integration' } }
    ],
    initialEdges: [
      { id: 'keys-transactions', source: 'keys', target: 'transactions' },
      { id: 'keys-backup', source: 'keys', target: 'backup' },
      { id: 'transactions-monitoring', source: 'transactions', target: 'monitoring' }
    ]
  },
  organization: {
    initialNodes: [
      { id: 'governance', position: { x: 100, y: 100 }, data: { label: 'Governance', kind: 'workflow' } },
      { id: 'departments', position: { x: 300, y: 100 }, data: { label: 'Departments', kind: 'organization' } },
      { id: 'compliance', position: { x: 200, y: 250 }, data: { label: 'Compliance', kind: 'contract' } },
      { id: 'reporting', position: { x: 400, y: 250 }, data: { label: 'Reporting', kind: 'integration' } }
    ],
    initialEdges: [
      { id: 'governance-departments', source: 'governance', target: 'departments' },
      { id: 'governance-compliance', source: 'governance', target: 'compliance' },
      { id: 'compliance-reporting', source: 'compliance', target: 'reporting' }
    ]
  },
  role: {
    initialNodes: [
      { id: 'responsibilities', position: { x: 100, y: 100 }, data: { label: 'Responsibilities', kind: 'workflow' } },
      { id: 'permissions', position: { x: 300, y: 100 }, data: { label: 'Permissions', kind: 'security' } },
      { id: 'reporting', position: { x: 200, y: 250 }, data: { label: 'Reporting Lines', kind: 'organization' } },
      { id: 'kpis', position: { x: 400, y: 250 }, data: { label: 'KPIs & Metrics', kind: 'assessment' } }
    ],
    initialEdges: [
      { id: 'responsibilities-permissions', source: 'responsibilities', target: 'permissions' },
      { id: 'responsibilities-reporting', source: 'responsibilities', target: 'reporting' },
      { id: 'reporting-kpis', source: 'reporting', target: 'kpis' }
    ]
  },
  contract: {
    initialNodes: [
      { id: 'code', position: { x: 100, y: 100 }, data: { label: 'Contract Code', kind: 'integration' } },
      { id: 'functions', position: { x: 300, y: 100 }, data: { label: 'Functions', kind: 'workflow' } },
      { id: 'events', position: { x: 200, y: 250 }, data: { label: 'Events & Logs', kind: 'monitoring' } },
      { id: 'security', position: { x: 400, y: 250 }, data: { label: 'Security Audit', kind: 'assessment' } }
    ],
    initialEdges: [
      { id: 'code-functions', source: 'code', target: 'functions' },
      { id: 'functions-events', source: 'functions', target: 'events' },
      { id: 'code-security', source: 'code', target: 'security' }
    ]
  },
  workflow: {
    initialNodes: [
      { id: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Trigger Event', kind: 'integration' } },
      { id: 'process', position: { x: 300, y: 100 }, data: { label: 'Process Steps', kind: 'workflow' } },
      { id: 'approval', position: { x: 200, y: 250 }, data: { label: 'Approval Gate', kind: 'role' } },
      { id: 'completion', position: { x: 400, y: 250 }, data: { label: 'Completion', kind: 'integration' } }
    ],
    initialEdges: [
      { id: 'trigger-process', source: 'trigger', target: 'process' },
      { id: 'process-approval', source: 'process', target: 'approval' },
      { id: 'approval-completion', source: 'approval', target: 'completion' }
    ]
  }
}

const DEFAULT_NODE_CONFIG = {
  initialNodes: [
    { id: 'properties', position: { x: 200, y: 150 }, data: { label: 'Properties', kind: 'info' } }
  ],
  initialEdges: []
}

type NodeKind = string

export type RFNodeData = { label: string; kind: NodeKind; subtitle?: string; template?: TemplateItem }

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
      <Handle type="target" position={Position.Top} className="!bg-white/60" />
      <Handle type="source" position={Position.Bottom} className="!bg-white/60" />
    </div>
  )
}

const nodeTypes = { colored: ColoredNode }
export { nodeTypes }

const PALETTE = [
  // Basic
  { type: 'task', name: 'Task', category: 'Basic', icon: <CheckSquare className="w-4 h-4 text-emerald-400" /> },
  { type: 'decision', name: 'Decision', category: 'Basic', icon: <GitBranch className="w-4 h-4 text-amber-400" /> },
  { type: 'payment', name: 'Payment', category: 'Basic', icon: <DollarSign className="w-4 h-4 text-green-400" /> },
  { type: 'milestone', name: 'Milestone', category: 'Basic', icon: <Flag className="w-4 h-4 text-red-400" /> },
  { type: 'team', name: 'Team', category: 'Basic', icon: <Users className="w-4 h-4 text-green-400" /> },
  
  // Business
  { type: 'workflow', name: 'Workflows', category: 'Business', icon: <Workflow className="w-4 h-4 text-blue-400" /> },
  { type: 'organization', name: 'Organizations', category: 'Business', icon: <Building className="w-4 h-4 text-blue-400" /> },
  { type: 'role', name: 'Roles', category: 'Business', icon: <Crown className="w-4 h-4 text-amber-400" /> },
  { type: 'ai-agent', name: 'Agents', category: 'Business', icon: <Bot className="w-4 h-4 text-purple-400" /> },
  { type: 'member', name: 'People', category: 'Business', icon: <UserCheck className="w-4 h-4 text-purple-400" /> },
  { type: 'instrument', name: 'Instruments', category: 'Business', icon: <TrendingUp className="w-4 h-4 text-orange-400" /> },
  { type: 'wallets', name: 'Wallets', category: 'Business', icon: <Wallet className="w-4 h-4 text-amber-400" /> },
  { type: 'contract', name: 'Contract', category: 'Business', icon: <FileText className="w-4 h-4 text-gray-400" /> },
  { type: 'integration', name: 'Integrations', category: 'Business', icon: <Plug className="w-4 h-4 text-violet-400" /> },
  
  // Integration
  { type: 'youtube', name: 'YouTube', category: 'Integration', icon: <Play className="w-4 h-4 text-red-500" /> },
  { type: 'api', name: 'API Call', category: 'Integration', icon: <Code className="w-4 h-4 text-purple-400" /> },
  { type: 'database', name: 'Database', category: 'Integration', icon: <Database className="w-4 h-4 text-blue-400" /> },
  { type: 'webhook', name: 'Webhook', category: 'Integration', icon: <Zap className="w-4 h-4 text-violet-400" /> },
  
  // Communication
  { type: 'email', name: 'Email', category: 'Communication', icon: <Mail className="w-4 h-4 text-red-400" /> },
  { type: 'sms', name: 'SMS', category: 'Communication', icon: <MessageSquare className="w-4 h-4 text-green-400" /> },
  { type: 'notification', name: 'Notification', category: 'Communication', icon: <Bell className="w-4 h-4 text-yellow-400" /> },
  
  // Logic
  { type: 'trigger', name: 'Trigger', category: 'Logic', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
]

const BUSINESS_KINDS = new Set(['workflow','organization','role','ai-agent','member','instrument','wallets','contract','integration'])



export default function WorkflowReactFlowCanvas({ 
  workflow, 
  templates, 
  onTemplateSelect,
  onNodeCanvasSelect,
  tabTitle,
  nodeCanvasData,
  onAddNode,
  connectionStyle
}: { 
  workflow: any; 
  templates?: any; 
  onTemplateSelect?: (template: TemplateItem) => void;
  onNodeCanvasSelect?: (node: any) => void;
  tabTitle?: string;
  nodeCanvasData?: any;
  onAddNode?: (type: string) => void;
  connectionStyle?: 'bezier' | 'smoothstep' | 'straight';
}) {
  const initialNodes = useMemo<Node<RFNodeData>[]>(() => {
    // If this is a node canvas tab, use the node canvas data
    if (nodeCanvasData) {
      const config = NODE_CANVAS_CONFIGS[nodeCanvasData.data.kind as keyof typeof NODE_CANVAS_CONFIGS] || DEFAULT_NODE_CONFIG
      return config.initialNodes.map(n => ({
        ...n,
        id: `${nodeCanvasData.id}-${n.id}`,
        type: 'colored' as const,
        data: { ...n.data, label: n.data.label }
      }))
    }
    
    // Otherwise use the regular workflow nodes
    return (workflow?.nodes || []).map((n: any) => ({
      id: String(n.id),
      type: 'colored',
      position: { x: Number(n.x) || 0, y: Number(n.y) || 0 },
      data: { label: String(n.name || n.type), kind: String(n.type || 'task') },
    }))
  }, [workflow, nodeCanvasData])

  const initialEdges = useMemo<Edge[]>(() => {
    // If this is a node canvas tab, use the node canvas edges
    if (nodeCanvasData) {
      const config = NODE_CANVAS_CONFIGS[nodeCanvasData.data.kind as keyof typeof NODE_CANVAS_CONFIGS] || DEFAULT_NODE_CONFIG
      return config.initialEdges.map(e => ({
        ...e,
        id: `${nodeCanvasData.id}-${e.id}`,
        source: `${nodeCanvasData.id}-${e.source}`,
        target: `${nodeCanvasData.id}-${e.target}`,
        animated: true,
        style: { stroke: 'rgba(255,255,255,0.7)', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.8)' }
      }))
    }
    
    // Otherwise use the regular workflow edges
    return (workflow?.connections || []).map((e: any) => ({
      id: String(e.id || `${e.from}-${e.to}`),
      source: String(e.from),
      target: String(e.to),
      animated: e.type === 'payment',
    }))
  }, [workflow, nodeCanvasData])

  const [nodes, setNodes, onNodesChange] = useNodesState<RFNodeData>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  // Reset nodes and edges when tab changes (initialNodes/initialEdges change)
  React.useEffect(() => {
    console.log('🔄 Resetting canvas for tab change:', tabTitle, 'Nodes:', initialNodes.length, 'Edges:', initialEdges.length)
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, tabTitle]) // Removed setNodes, setEdges to avoid dependency issues
  
  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), [setEdges])
  const [templateModal, setTemplateModal] = useState<{ kind: string; items: TemplateItem[] } | null>(null)
  const [editingNode, setEditingNode] = useState<Node<RFNodeData> | null>(null)
  const [nodeCanvasModal, setNodeCanvasModal] = useState<Node<RFNodeData> | null>(null)

  // External node addition function for chatbot
  const addNodeToCanvas = useCallback((type: string) => {
    const existingNodes = nodes
    
    // Position new nodes in a vertical layout with some spacing
    let newX = 100 + Math.random() * 200 // Add some randomness to avoid overlap
    let newY = 100 + (existingNodes.length * 120) // 120px vertical spacing
    
    const id = `n${Date.now()}`
    const newNode = { 
      id, 
      type: 'colored', 
      position: { x: newX, y: newY }, 
      data: { label: type.toUpperCase(), kind: type } 
    }
    
    setNodes((nds) => nds.concat(newNode))
    return true
  }, [nodes, setNodes])

  // Expose the addNode function to parent
  React.useEffect(() => {
    // Always expose the function when this canvas is active
    (window as any).addNodeToActiveCanvas = addNodeToCanvas
    
    // Cleanup when component unmounts
    return () => {
      (window as any).addNodeToActiveCanvas = null
    }
  }, [addNodeToCanvas])

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
        crypto: getCryptoTemplates(),
        wallets: getWalletTemplates(),
      }
      const pick = <T extends { id?: string; name: string; description?: string; country?: string; type?: string; code?: string; size?: string; category?: string }>(arr?: T[]) => (arr || []).map(t => ({ id: (t as any).id || t.name, name: t.name, description: t.description, country: t.country, type: t.type, code: t.code, size: t.size, category: t.category }))
      if (type === 'organization') items = pick(live.organizations)
      else if (type === 'instrument') items = pick(live.instruments)
      else if (type === 'role') items = pick(live.roles)
      else if (type === 'member') items = pick(live.agents)
      else if (type === 'contract') items = pick(live.contracts)
      else if (type === 'workflow') items = [ { id: 'wf-blank', name: 'Blank Workflow' } ]
      else if (type === 'integration') items = pick(live.integrations)
      else if (type === 'crypto') items = pick(live.crypto)
      else if (type === 'wallets') items = pick(live.wallets)
      setTemplateModal({ kind: type, items })
      return
    }
    
    // Position new nodes at the center of the current viewport
    const viewport = rf.getViewport()
    const reactFlowBounds = rf.getViewport()
    
    // Get the center of the current view with some randomness to avoid overlap
    const centerX = -viewport.x + (window.innerWidth / 2) / viewport.zoom
    const centerY = -viewport.y + (window.innerHeight / 2) / viewport.zoom
    
    // Add some randomness to avoid nodes stacking exactly on top of each other
    const randomOffsetX = (Math.random() - 0.5) * 200
    const randomOffsetY = (Math.random() - 0.5) * 200
    
    const pos = { 
      x: centerX + randomOffsetX, 
      y: centerY + randomOffsetY 
    }
    
    const id = `n${Date.now()}`
    console.log('Creating node at position:', pos)
    setNodes((nds) => nds.concat({ id, type: 'colored', position: pos, data: { label: type.toUpperCase(), kind: type } }))
  }, [setNodes, templates])

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node<RFNodeData>) => {
    event.stopPropagation()
    // Single click opens the node canvas as a new tab if callback is provided
    if (onNodeCanvasSelect) {
      onNodeCanvasSelect(node)
    } else {
      // Fallback to modal if no tab callback is provided
      setNodeCanvasModal(node)
    }
  }, [onNodeCanvasSelect])

  const handleNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node<RFNodeData>) => {
    event.stopPropagation()
    // Double click opens the node editor
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
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          tabTitle={tabTitle}
          connectionStyle={connectionStyle}
        />
        
        {/* Node Editor Modal */}
        <NodeEditor
          node={editingNode}
          isOpen={!!editingNode}
          onClose={() => setEditingNode(null)}
          onSave={handleNodeSave}
        />
        
        {/* Node Canvas Modal */}
        <NodeCanvasModal
          node={nodeCanvasModal}
          isOpen={!!nodeCanvasModal}
          onClose={() => setNodeCanvasModal(null)}
        />
      </ReactFlowProvider>
    </div>
  )
}

function InnerRF({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onPick, palette, templateModal, setTemplateModal, setNodes, setEdges, onTemplateSelect, onNodeClick, onNodeDoubleClick, tabTitle, connectionStyle }:
  { nodes: Node<RFNodeData>[]; edges: Edge[]; onNodesChange: any; onEdgesChange: any; onConnect: any; onPick: (type: string, rf: any) => void; palette: any[]; templateModal: { kind: string; items: TemplateItem[] } | null; setTemplateModal: (v: any) => void; setNodes: any; setEdges: any; onTemplateSelect?: (template: TemplateItem) => void; onNodeClick?: (event: React.MouseEvent, node: Node<RFNodeData>) => void; onNodeDoubleClick?: (event: React.MouseEvent, node: Node<RFNodeData>) => void; tabTitle?: string; connectionStyle?: 'bezier' | 'smoothstep' | 'straight' }) {
  const rf = useReactFlow()
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onNodeDoubleClick={onNodeDoubleClick}
      nodeTypes={nodeTypes}
      fitView
      defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
      defaultEdgeOptions={{ 
        style: { stroke: 'rgba(255,255,255,0.7)', strokeWidth: 2 }, 
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.8)' },
        type: connectionStyle || 'bezier'
      }}
      connectionLineStyle={{ stroke: 'rgba(255,255,255,0.6)', strokeWidth: 2 }}
    >
      <Background color="rgba(255,255,255,0.1)" />
      {tabTitle && (
        <Panel position="top-left" className="m-2">
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2">
            <div className="text-sm text-white font-medium">{tabTitle}</div>
          </div>
        </Panel>
      )}

      <Panel position="top-right" className="m-2">
        <NodePaletteSimple
          title="Add Nodes"
          nodeTypes={palette as any}
          categories={[...new Set(palette.map((p) => p.category))]}
          onPick={(t) => onPick(t, rf)}
          visible={true}
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
                    // Handle special crypto modal case
                    if (templateModal.kind === 'instrument' && (it as any).type === 'crypto-modal') {
                      const cryptoItems = getCryptoTemplates().map(crypto => ({ 
                        id: crypto.id || crypto.name, 
                        name: crypto.name, 
                        description: crypto.description, 
                        category: crypto.category 
                      }))
                      setTemplateModal({ kind: 'crypto', items: cryptoItems })
                      return
                    }
                    
                    if (templateModal.kind === 'organization' && it.category && onTemplateSelect) {
                      // Create a new tab with the organization template
                      onTemplateSelect(it)
                    } else if (templateModal.kind === 'organization' && it.category) {
                      // Fallback: Load the full organization canvas template in current tab
                      const canvasTemplate = getOrganizationCanvasTemplate(it)
                      setNodes(canvasTemplate.nodes)
                      setEdges(canvasTemplate.edges)
                    } else {
                      // Default behavior for other template types - position at viewport center
                      console.log('Adding template node:', { name: it.name, kind: templateModal.kind, template: it })
                      
                      const viewport = rf.getViewport()
                      
                      // Position at the center of the current viewport with some randomness
                      const centerX = -viewport.x + (window.innerWidth / 2) / viewport.zoom
                      const centerY = -viewport.y + (window.innerHeight / 2) / viewport.zoom
                      
                      // Add randomness to avoid nodes stacking exactly on top of each other
                      const randomOffsetX = (Math.random() - 0.5) * 200
                      const randomOffsetY = (Math.random() - 0.5) * 200
                      
                      const pos = { 
                        x: centerX + randomOffsetX, 
                        y: centerY + randomOffsetY 
                      }
                      const id = `n${Date.now()}`
                      
                      const newNode = { 
                        id, 
                        type: 'colored', 
                        position: pos, 
                        data: { 
                          label: it.name, 
                          kind: templateModal.kind, 
                          template: it,
                          subtitle: it.description || it.category || ''
                        } 
                      }
                      
                      console.log('Creating new node:', newNode)
                      setNodes((nds: Node<RFNodeData>[]) => {
                        const updatedNodes = nds.concat(newNode)
                        console.log('Updated nodes array:', updatedNodes)
                        return updatedNodes
                      })
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
                  {(it as any).marketCap && (
                    <div className="text-xs text-green-300 mb-2">
                      Market Cap: {(it as any).marketCap}
                      {(it as any).symbol && ` • ${(it as any).symbol}`}
                    </div>
                  )}
                  {(it as any).supportedChains && (
                    <div className="text-xs text-purple-300 mb-2">
                      Chains: {(it as any).supportedChains.slice(0, 3).join(', ')}
                      {(it as any).supportedChains.length > 3 && '...'}
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


