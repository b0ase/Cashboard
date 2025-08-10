'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { X, Maximize2, Minimize2, Info, Settings, Plus } from 'lucide-react'
import ReactFlow, { ReactFlowProvider, Background, MiniMap, Controls, Node, Edge, useNodesState, useEdgesState, addEdge, Connection, MarkerType } from 'reactflow'
import 'reactflow/dist/style.css'

// Import existing node types and data structures
import { RFNodeData, nodeTypes } from './WorkflowReactFlowCanvas'

interface NodeCanvasModalProps {
  node: Node<RFNodeData> | null
  isOpen: boolean
  onClose: () => void
}

// Node type specific content configurations
const NODE_TYPE_CONFIGS = {
  instrument: {
    title: 'Financial Instrument',
    description: 'A tradeable financial asset',
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    icon: '💰',
    fields: [
      { label: 'Asset Type', key: 'assetType', defaultValue: 'Bond' },
      { label: 'Symbol', key: 'symbol', defaultValue: 'BOND001' },
      { label: 'ISIN', key: 'isin', defaultValue: 'US000000000' },
      { label: 'Currency', key: 'currency', defaultValue: 'USD' },
      { label: 'Face Value', key: 'faceValue', defaultValue: '$1,000' },
      { label: 'Maturity Date', key: 'maturityDate', defaultValue: '2030-12-31' },
      { label: 'Coupon Rate', key: 'couponRate', defaultValue: '4.5%' },
      { label: 'Credit Rating', key: 'creditRating', defaultValue: 'AAA' }
    ],
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
    title: 'Digital Wallet',
    description: 'A secure digital asset storage solution',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    icon: '👛',
    fields: [
      { label: 'Wallet Type', key: 'walletType', defaultValue: 'Hardware' },
      { label: 'Address', key: 'address', defaultValue: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
      { label: 'Network', key: 'network', defaultValue: 'Bitcoin' },
      { label: 'Balance', key: 'balance', defaultValue: '0.00 BTC' },
      { label: 'Security Level', key: 'securityLevel', defaultValue: 'High' },
      { label: 'Multi-Sig', key: 'multiSig', defaultValue: 'Yes' }
    ],
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
    title: 'Organization',
    description: 'A business entity or institutional structure',
    color: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-500/30',
    icon: '🏢',
    fields: [
      { label: 'Entity Type', key: 'entityType', defaultValue: 'Corporation' },
      { label: 'Registration', key: 'registration', defaultValue: 'Delaware, USA' },
      { label: 'Tax ID', key: 'taxId', defaultValue: '12-3456789' },
      { label: 'Industry', key: 'industry', defaultValue: 'Financial Services' },
      { label: 'Employees', key: 'employees', defaultValue: '100-500' },
      { label: 'Founded', key: 'founded', defaultValue: '2010' }
    ],
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
    title: 'Role & Responsibilities',
    description: 'A defined position within an organizational structure',
    color: 'from-orange-500/20 to-red-500/20',
    borderColor: 'border-orange-500/30',
    icon: '👤',
    fields: [
      { label: 'Role Title', key: 'roleTitle', defaultValue: 'Portfolio Manager' },
      { label: 'Department', key: 'department', defaultValue: 'Investment Management' },
      { label: 'Level', key: 'level', defaultValue: 'Senior' },
      { label: 'Reports To', key: 'reportsTo', defaultValue: 'Chief Investment Officer' },
      { label: 'Team Size', key: 'teamSize', defaultValue: '5' },
      { label: 'Clearance Level', key: 'clearanceLevel', defaultValue: 'Level 3' }
    ],
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
    title: 'Smart Contract',
    description: 'A self-executing contract with terms directly written into code',
    color: 'from-teal-500/20 to-green-500/20',
    borderColor: 'border-teal-500/30',
    icon: '📜',
    fields: [
      { label: 'Contract Type', key: 'contractType', defaultValue: 'ERC-20 Token' },
      { label: 'Network', key: 'network', defaultValue: 'Ethereum' },
      { label: 'Address', key: 'address', defaultValue: '0x...' },
      { label: 'Gas Limit', key: 'gasLimit', defaultValue: '21,000' },
      { label: 'Status', key: 'status', defaultValue: 'Active' },
      { label: 'Audit Status', key: 'auditStatus', defaultValue: 'Verified' }
    ],
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
    title: 'Business Workflow',
    description: 'A sequence of connected steps that accomplish a business process',
    color: 'from-indigo-500/20 to-blue-500/20',
    borderColor: 'border-indigo-500/30',
    icon: '⚡',
    fields: [
      { label: 'Process Type', key: 'processType', defaultValue: 'Approval Workflow' },
      { label: 'Trigger', key: 'trigger', defaultValue: 'Manual' },
      { label: 'Priority', key: 'priority', defaultValue: 'High' },
      { label: 'SLA', key: 'sla', defaultValue: '24 hours' },
      { label: 'Owner', key: 'owner', defaultValue: 'Operations Team' },
      { label: 'Status', key: 'status', defaultValue: 'Active' }
    ],
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

// Default fallback configuration
const DEFAULT_CONFIG = {
  title: 'Node Details',
  description: 'Detailed view of this node',
  color: 'from-gray-500/20 to-slate-500/20',
  borderColor: 'border-gray-500/30',
  icon: '⚪',
  fields: [
    { label: 'Name', key: 'name', defaultValue: 'Node' },
    { label: 'Type', key: 'type', defaultValue: 'Generic' },
    { label: 'Status', key: 'status', defaultValue: 'Active' }
  ],
  initialNodes: [
    { id: 'properties', position: { x: 200, y: 150 }, data: { label: 'Properties', kind: 'info' } }
  ],
  initialEdges: []
}

function NodeCanvasContent({ node }: { node: Node<RFNodeData> }) {
  const config = NODE_TYPE_CONFIGS[node.data.kind as keyof typeof NODE_TYPE_CONFIGS] || DEFAULT_CONFIG
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Initialize canvas nodes and edges based on node type
  const initialNodes = useMemo(() => 
    config.initialNodes.map(n => ({
      ...n,
      id: `${node.id}-${n.id}`,
      type: 'colored' as const,
      data: { ...n.data, label: n.data.label }
    })), [config.initialNodes, node.id])
  
  const initialEdges = useMemo(() => 
    config.initialEdges.map(e => ({
      ...e,
      id: `${node.id}-${e.id}`,
      source: `${node.id}-${e.source}`,
      target: `${node.id}-${e.target}`,
      animated: true,
      style: { stroke: 'rgba(255,255,255,0.7)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.8)' }
    })), [config.initialEdges, node.id])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback((params: Edge | Connection) => 
    setEdges((eds) => addEdge({ ...params, animated: true }, eds)), [setEdges])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.color} border-b ${config.borderColor} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{config.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{node.data.label}</h2>
              <p className="text-gray-300">{config.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <p className="text-gray-200 text-sm mb-4">{config.description}</p>
        
        {/* Key Properties Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {config.fields.slice(0, isExpanded ? config.fields.length : 4).map((field) => (
            <div key={field.key} className="bg-black/20 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">{field.label}</div>
              <div className="text-sm text-white font-medium">
                {node.data.template?.[field.key] || field.defaultValue}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          defaultEdgeOptions={{
            style: { stroke: 'rgba(255,255,255,0.7)', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.8)' },
            type: 'smoothstep'
          }}
          connectionLineStyle={{ stroke: 'rgba(255,255,255,0.6)', strokeWidth: 2 }}
        >
          <Background color="rgba(255,255,255,0.1)" />
          <MiniMap 
            pannable 
            zoomable 
            style={{ background: 'rgba(0,0,0,0.6)' }}
            nodeColor={(node) => {
              const kind = node.data?.kind || 'default'
              const colors = {
                organization: '#8b5cf6',
                instrument: '#10b981',
                role: '#f59e0b',
                contract: '#14b8a6',
                workflow: '#3b82f6',
                security: '#ef4444',
                assessment: '#ec4899',
                monitoring: '#6366f1',
                integration: '#84cc16',
                default: '#6b7280'
              }
              return colors[kind as keyof typeof colors] || colors.default
            }}
          />
          <Controls position="bottom-left" showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  )
}

export default function NodeCanvasModal({ node, isOpen, onClose }: NodeCanvasModalProps) {
  if (!isOpen || !node) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-[95vw] h-[90vh] max-w-7xl bg-gray-900 rounded-xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-white/10 transition-colors bg-black/20"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Content */}
        <ReactFlowProvider>
          <NodeCanvasContent node={node} />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
