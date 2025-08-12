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
  MiniMap,
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
  CheckSquare, GitBranch, Flag, Users, Mail, MessageSquare, Bell, Database, Code, Laptop, TrendingUp, Bot,
  Shield, Lock, Coins, Gavel, Eye, Vote, Clock, Image, Heart, UserPlus, Camera, ArrowLeft, ChevronRight,
  Pause, ZoomIn, ZoomOut, RotateCcw, X, Settings, Layout
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

export type RFNodeData = { 
  label: string; 
  kind: NodeKind; 
  subtitle?: string; 
  template?: TemplateItem; 
  handcashHandle?: string; 
  tokenAddress?: string;
  // Wallet-specific properties
  multisigThreshold?: number;
  multisigSigners?: string[];
  walletType?: 'single' | 'multisig' | 'script' | 'smart_contract';
  // Bitcoin Schema properties
  schemaType?: string;
  schemaVersion?: string;
  // sCrypt smart contract properties
  contractCode?: string;
  contractParams?: Record<string, any>;
  isComposable?: boolean;
}

function IconFor({ kind }: { kind: NodeKind }) {
  const cls = 'w-6 h-6'
  switch (kind) {
    case 'payment': return <DollarSign className={`${cls} text-yellow-500`} />
    case 'contract': return <FileText className={`${cls} text-blue-500`} />
    case 'splitter': return <Split className={`${cls} text-amber-500`} />
    case 'decision': return <AlertTriangle className={`${cls} text-purple-500`} />
    case 'organization': return <Building className={`${cls} text-orange-500`} />
    case 'role': return <Crown className={`${cls} text-amber-500`} />
    case 'member': return <UserCheck className={`${cls} text-cyan-500`} />
    case 'instrument': return <Banknote className={`${cls} text-emerald-500`} />
    case 'wallets': return <Wallet className={`${cls} text-teal-500`} />
    case 'workflow': return <Target className={`${cls} text-indigo-500`} />
    case 'trigger': return <Zap className={`${cls} text-yellow-600`} />
    case 'youtube': return <Play className={`${cls} text-red-600`} />
    // sCrypt Smart Contracts
    case 'scrypt-multisig': return <Shield className={`${cls} text-cyan-500`} />
    case 'scrypt-escrow': return <Lock className={`${cls} text-blue-600`} />
    case 'scrypt-token': return <Coins className={`${cls} text-green-600`} />
    case 'scrypt-auction': return <Gavel className={`${cls} text-purple-600`} />
    case 'scrypt-oracle': return <Eye className={`${cls} text-amber-600`} />
    case 'scrypt-voting': return <Vote className={`${cls} text-indigo-600`} />
    case 'scrypt-timelock': return <Clock className={`${cls} text-orange-600`} />
    case 'scrypt-nft': return <Image className={`${cls} text-pink-600`} />
    // Bitcoin Schema Standards
    case 'schema-post': return <FileText className={`${cls} text-emerald-600`} />
    case 'schema-profile': return <User className={`${cls} text-blue-600`} />
    case 'schema-like': return <Heart className={`${cls} text-red-600`} />
    case 'schema-follow': return <UserPlus className={`${cls} text-green-600`} />
    case 'schema-media': return <Camera className={`${cls} text-purple-600`} />
    default: return <Target className={`${cls} text-white`} />
  }
}

function ColoredNode({ data, id }: { data: RFNodeData; id: string }) {
  const [isEditingHandle, setIsEditingHandle] = React.useState(false)
  const [handcashHandle, setHandcashHandle] = React.useState(data.handcashHandle || '')
  const [isEditingTokenAddress, setIsEditingTokenAddress] = React.useState(false)
  const [tokenAddress, setTokenAddress] = React.useState(data.tokenAddress || '')
  const [isEditingMultisig, setIsEditingMultisig] = React.useState(false)
  const [multisigThreshold, setMultisigThreshold] = React.useState(data.multisigThreshold || 2)
  const [multisigSigners, setMultisigSigners] = React.useState(data.multisigSigners || [])
  const [showButtons, setShowButtons] = React.useState(false)
  
  // Check if this is an AI assistant node that should be wide and short
  const isAIAssistant = data.label?.toLowerCase().includes('openai') || 
                       data.label?.toLowerCase().includes('anthropic') ||
                       data.label?.toLowerCase().includes('claude') ||
                       data.kind === 'ai-agent' ||
                       (data.template && data.template.category === 'AI & Machine Learning')
  
  const containerClass = isAIAssistant 
    ? "relative bg-black/70 backdrop-blur-xl border border-white/30 rounded-xl px-6 py-3 text-white min-w-[480px] max-w-[480px] shadow-xl"
    : "relative bg-black/70 backdrop-blur-xl border border-white/30 rounded-xl px-4 py-3 text-white min-w-[220px] shadow-xl"

  const handleSaveHandle = () => {
    data.handcashHandle = handcashHandle
    setIsEditingHandle(false)
  }

  const handleSaveTokenAddress = () => {
    data.tokenAddress = tokenAddress
    setIsEditingTokenAddress(false)
  }

  const handleSaveMultisig = () => {
    data.multisigThreshold = multisigThreshold
    data.multisigSigners = multisigSigners
    setIsEditingMultisig(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveHandle()
    }
    if (e.key === 'Escape') {
      setHandcashHandle(data.handcashHandle || '')
      setIsEditingHandle(false)
    }
  }

  const handleTokenAddressKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTokenAddress()
    }
    if (e.key === 'Escape') {
      setTokenAddress(data.tokenAddress || '')
      setIsEditingTokenAddress(false)
    }
  }

  const handlePropertiesClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Trigger the existing node editor modal
    const nodeElement = e.currentTarget.closest('.react-flow__node')
    if (nodeElement) {
      const nodeEvent = new MouseEvent('dblclick', { bubbles: true })
      nodeElement.dispatchEvent(nodeEvent)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Trigger navigation to node canvas
    const nodeElement = e.currentTarget.closest('.react-flow__node')
    if (nodeElement) {
      const nodeEvent = new MouseEvent('click', { bubbles: true })
      nodeElement.dispatchEvent(nodeEvent)
    }
  }

  return (
    <div 
      className={containerClass}
      onMouseEnter={() => setShowButtons(true)}
      onMouseLeave={() => setShowButtons(false)}
    >
      {/* Node Action Buttons - Show on Hover */}
      {showButtons && (
        <div className="absolute bottom-1 right-1 flex gap-1 z-10">
          <button
            onClick={handlePropertiesClick}
            className="w-6 h-6 bg-blue-500/80 hover:bg-blue-500 text-white rounded transition-colors flex items-center justify-center"
            title="Edit Properties"
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={handleCanvasClick}
            className="w-6 h-6 bg-green-500/80 hover:bg-green-500 text-white rounded transition-colors flex items-center justify-center"
            title="Open Canvas"
          >
            <Layout className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Remove the node from the canvas immediately
              if ((window as any).deleteNodeFromCanvas) {
                (window as any).deleteNodeFromCanvas(id)
              }
            }}
            className="w-6 h-6 bg-red-500/80 hover:bg-red-600 text-white rounded transition-colors flex items-center justify-center"
            title="Delete Node"
          >
            🗑️
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1 w-full">
        {/* Node Header */}
        <div className="flex items-center gap-2">
          <IconFor kind={data.kind} />
          <div className="leading-tight flex-1">
            <div className={`font-medium ${isAIAssistant ? 'text-xs' : 'text-sm'}`}>{data.label}</div>
            {data.subtitle && <div className="text-[10px] text-gray-400">{data.subtitle}</div>}
          </div>
        </div>
        
        {/* HandCash Handle */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-green-400 font-mono">$</span>
          {isEditingHandle ? (
            <input
              type="text"
              value={handcashHandle}
              onChange={(e) => setHandcashHandle(e.target.value)}
              onBlur={handleSaveHandle}
              onKeyDown={handleKeyDown}
              className="bg-white/20 text-white text-[10px] font-mono px-1 py-0.5 rounded min-w-0 flex-1"
              placeholder="HandCash_Handle"
              autoFocus
            />
          ) : (
            <div 
              onClick={() => setIsEditingHandle(true)}
              className="text-[10px] text-green-400 font-mono cursor-pointer hover:text-green-300 transition-colors flex-1 truncate"
              title={`HandCash Handle: $${handcashHandle || 'Click to edit'}`}
            >
              {handcashHandle || 'Click_to_edit'}
            </div>
          )}
        </div>

        {/* BSV Type 1 Address (Bitcoin SV Ordinals) */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-orange-400 font-mono">₿</span>
          {isEditingTokenAddress ? (
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              onBlur={handleSaveTokenAddress}
              onKeyDown={handleTokenAddressKeyDown}
              className="bg-white/20 text-white text-[10px] font-mono px-1 py-0.5 rounded min-w-0 flex-1"
              placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              autoFocus
            />
          ) : (
            <div 
              onClick={() => setIsEditingTokenAddress(true)}
              className="text-[10px] text-gray-400 font-mono cursor-pointer hover:text-gray-300 transition-colors flex-1 truncate"
              title={`BSV Type 1 Address: ${tokenAddress || 'Click to edit BSV Type 1 address'}`}
            >
              {tokenAddress || '1A1z...click_to_edit'}
            </div>
          )}
        </div>

        {/* Wallet-specific properties */}
        {data.kind === 'wallets' && (
          <div className="mt-2 space-y-1">
            {/* Wallet Type */}
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-blue-400">Type:</span>
              <select
                value={data.walletType || 'single'}
                onChange={(e) => {
                  data.walletType = e.target.value as any
                  if (e.target.value === 'multisig') {
                    data.multisigThreshold = multisigThreshold
                    data.multisigSigners = multisigSigners
                  }
                }}
                className="bg-white/10 text-white text-[9px] px-1 py-0.5 rounded border-none outline-none"
              >
                <option value="single">Single</option>
                <option value="multisig">Multisig</option>
                <option value="script">Script</option>
                <option value="smart_contract">Smart Contract</option>
              </select>
            </div>

            {/* Multisig Configuration */}
            {data.walletType === 'multisig' && (
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-purple-400">Threshold:</span>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={multisigThreshold}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 2
                      setMultisigThreshold(val)
                      data.multisigThreshold = val
                    }}
                    className="bg-white/10 text-white text-[9px] px-1 py-0.5 rounded w-8 text-center"
                  />
                  <span className="text-[9px] text-gray-400">of {multisigSigners.length || 3}</span>
                </div>
                <div className="text-[9px] text-gray-400">
                  Signers: {multisigSigners.length > 0 ? multisigSigners.join(', ').slice(0, 20) + '...' : 'Click to add'}
                </div>
              </div>
            )}

            {/* Bitcoin Schema Integration */}
            {data.schemaType && (
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-green-400">Schema:</span>
                <span className="text-[9px] text-white">{data.schemaType}</span>
                {data.schemaVersion && (
                  <span className="text-[9px] text-gray-400">v{data.schemaVersion}</span>
                )}
              </div>
            )}

            {/* sCrypt Smart Contract */}
            {data.walletType === 'smart_contract' && (
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-cyan-400">sCrypt:</span>
                  <span className="text-[9px] text-white">{data.isComposable ? 'Composable' : 'Standard'}</span>
                </div>
                {data.contractCode && (
                  <div className="text-[9px] text-gray-400 font-mono truncate">
                    {data.contractCode.slice(0, 15)}...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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
  { type: 'task', name: 'Task', category: 'Basic', icon: <CheckSquare className="w-6 h-6 text-emerald-500" /> },
  { type: 'decision', name: 'Decision', category: 'Basic', icon: <GitBranch className="w-6 h-6 text-amber-500" /> },
  { type: 'payment', name: 'Payment', category: 'Basic', icon: <DollarSign className="w-6 h-6 text-green-500" /> },
  { type: 'milestone', name: 'Milestone', category: 'Basic', icon: <Flag className="w-6 h-6 text-red-500" /> },
  { type: 'team', name: 'Team', category: 'Basic', icon: <Users className="w-6 h-6 text-green-500" /> },
  
  // Business
  { type: 'workflow', name: 'Workflows', category: 'Business', icon: <Workflow className="w-6 h-6 text-blue-500" /> },
  { type: 'organization', name: 'Organizations', category: 'Business', icon: <Building className="w-6 h-6 text-blue-500" /> },
  { type: 'role', name: 'Roles', category: 'Business', icon: <Crown className="w-6 h-6 text-amber-500" /> },
  { type: 'ai-agent', name: 'Agents', category: 'Business', icon: <Bot className="w-6 h-6 text-purple-500" /> },
  { type: 'member', name: 'People', category: 'Business', icon: <UserCheck className="w-6 h-6 text-purple-500" /> },
  { type: 'instrument', name: 'Instruments', category: 'Business', icon: <TrendingUp className="w-6 h-6 text-orange-500" /> },
  { type: 'wallets', name: 'Wallets', category: 'Business', icon: <Wallet className="w-6 h-6 text-amber-500" /> },
  { type: 'contract', name: 'Contract', category: 'Business', icon: <FileText className="w-6 h-6 text-gray-500" /> },
  { type: 'integration', name: 'Integrations', category: 'Business', icon: <Plug className="w-6 h-6 text-violet-500" /> },
  
  // Integration
  { type: 'youtube', name: 'YouTube', category: 'Integration', icon: <Play className="w-6 h-6 text-red-600" /> },
  { type: 'api', name: 'API Call', category: 'Integration', icon: <Code className="w-6 h-6 text-purple-500" /> },
  { type: 'database', name: 'Database', category: 'Integration', icon: <Database className="w-6 h-6 text-blue-500" /> },
  { type: 'webhook', name: 'Webhook', category: 'Integration', icon: <Zap className="w-6 h-6 text-violet-500" /> },
  
  // Communication
  { type: 'email', name: 'Email', category: 'Communication', icon: <Mail className="w-6 h-6 text-red-500" /> },
  { type: 'sms', name: 'SMS', category: 'Communication', icon: <MessageSquare className="w-6 h-6 text-green-500" /> },
  { type: 'notification', name: 'Notification', category: 'Communication', icon: <Bell className="w-6 h-6 text-yellow-500" /> },
  
  // Logic
  { type: 'trigger', name: 'Trigger', category: 'Logic', icon: <Zap className="w-6 h-6 text-yellow-500" /> },
  
  // sCrypt Smart Contracts (Composable)
  { type: 'scrypt-multisig', name: 'MultiSig Contract', category: 'sCrypt', icon: <Shield className="w-6 h-6 text-cyan-500" /> },
  { type: 'scrypt-escrow', name: 'Escrow Contract', category: 'sCrypt', icon: <Lock className="w-6 h-6 text-blue-600" /> },
  { type: 'scrypt-token', name: 'Token Contract', category: 'sCrypt', icon: <Coins className="w-6 h-6 text-green-600" /> },
  { type: 'scrypt-auction', name: 'Auction Contract', category: 'sCrypt', icon: <Gavel className="w-6 h-6 text-purple-600" /> },
  { type: 'scrypt-oracle', name: 'Oracle Contract', category: 'sCrypt', icon: <Eye className="w-6 h-6 text-amber-600" /> },
  { type: 'scrypt-voting', name: 'Voting Contract', category: 'sCrypt', icon: <Vote className="w-6 h-6 text-indigo-600" /> },
  { type: 'scrypt-timelock', name: 'TimeLock Contract', category: 'sCrypt', icon: <Clock className="w-6 h-6 text-orange-600" /> },
  { type: 'scrypt-nft', name: 'NFT Contract', category: 'sCrypt', icon: <Image className="w-6 h-6 text-pink-600" /> },
  
  // Bitcoin Schema Standards
  { type: 'schema-post', name: 'Post Schema', category: 'Bitcoin Schema', icon: <FileText className="w-6 h-6 text-emerald-600" /> },
  { type: 'schema-profile', name: 'Profile Schema', category: 'Bitcoin Schema', icon: <User className="w-6 h-6 text-blue-600" /> },
  { type: 'schema-like', name: 'Like Schema', category: 'Bitcoin Schema', icon: <Heart className="w-6 h-6 text-red-600" /> },
  { type: 'schema-follow', name: 'Follow Schema', category: 'Bitcoin Schema', icon: <UserPlus className="w-6 h-6 text-green-600" /> },
  { type: 'schema-media', name: 'Media Schema', category: 'Bitcoin Schema', icon: <Camera className="w-6 h-6 text-purple-600" /> },
]

const BUSINESS_KINDS = new Set(['workflow','organization','role','ai-agent','member','instrument','wallets','contract','integration','scrypt-multisig','scrypt-escrow','scrypt-token','scrypt-auction','scrypt-oracle','scrypt-voting','scrypt-timelock','scrypt-nft','schema-post','schema-profile','schema-like','schema-follow','schema-media'])



// Navigation stack for canvas hierarchy
interface CanvasNavItem {
  id: string
  title: string
  workflow: any
  nodeData?: any
}

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
  // Navigation stack state
  const [navigationStack, setNavigationStack] = React.useState<CanvasNavItem[]>([
    { id: 'main', title: tabTitle || 'Main Canvas', workflow }
  ])
  const [currentCanvasIndex, setCurrentCanvasIndex] = React.useState(0)
  const currentCanvas = navigationStack[currentCanvasIndex]

  // Navigation functions
  const navigateToNodeCanvas = (node: Node<RFNodeData>) => {
    const config = NODE_CANVAS_CONFIGS[node.data.kind as keyof typeof NODE_CANVAS_CONFIGS]
    if (!config) return

    const newCanvasItem: CanvasNavItem = {
      id: `node-${node.id}-${Date.now()}`,
      title: `${node.data.label} Details`,
      workflow: { nodes: config.initialNodes, connections: config.initialEdges },
      nodeData: node
    }

    setNavigationStack(prev => [...prev.slice(0, currentCanvasIndex + 1), newCanvasItem])
    setCurrentCanvasIndex(currentCanvasIndex + 1)
  }

  const navigateBack = () => {
    if (currentCanvasIndex > 0) {
      setCurrentCanvasIndex(currentCanvasIndex - 1)
    }
  }

  const navigateToCanvas = (index: number) => {
    if (index >= 0 && index < navigationStack.length) {
      setCurrentCanvasIndex(index)
    }
  }

  const initialNodes = useMemo<Node<RFNodeData>[]>(() => {
    // Use the current canvas workflow from navigation stack
    const workflowToUse = currentCanvas?.workflow || workflow
    
    // If this is a node canvas tab, use the node canvas data
    if (currentCanvas?.nodeData || nodeCanvasData) {
      const nodeData = currentCanvas?.nodeData || nodeCanvasData
      const config = NODE_CANVAS_CONFIGS[nodeData.data.kind as keyof typeof NODE_CANVAS_CONFIGS] || DEFAULT_NODE_CONFIG
      return config.initialNodes.map(n => ({
        ...n,
        id: `${nodeData.id}-${n.id}`,
        type: 'colored' as const,
        data: { ...n.data, label: n.data.label }
      }))
    }
    
    // Otherwise use the regular workflow nodes
    return (workflowToUse?.nodes || []).map((n: any) => ({
      id: String(n.id),
      type: 'colored',
      position: { x: Number(n.x) || 0, y: Number(n.y) || 0 },
      data: { 
        label: String(n.name || n.type), 
        kind: String(n.type || 'task'),
        handcashHandle: n.handcashHandle || `${String(n.name || n.type).replace(/\s+/g, '_')}_Handle`
      },
    }))
  }, [workflow, nodeCanvasData, currentCanvas])

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
  
  // Load saved state from localStorage on initialization
  React.useEffect(() => {
    if (tabTitle) {
      const savedData = localStorage.getItem(`cashboard-canvas-${tabTitle.replace(/[^a-zA-Z0-9]/g, '-')}`)
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          if (parsed.nodes && parsed.nodes.length > 0) {
            console.log('📂 Loading saved canvas state:', parsed.nodes.length, 'nodes')
            const savedNodes = parsed.nodes.map((n: any) => ({
              id: n.id,
              type: 'colored',
              position: { x: n.x, y: n.y },
              data: n.data
            }))
            setNodes(savedNodes)
            if (parsed.edges && parsed.edges.length > 0) {
              const savedEdges = parsed.edges.map((e: any) => ({
                id: e.id,
                source: e.source,
                target: e.target,
                type: e.type || 'default',
                animated: e.type === 'payment'
              }))
              setEdges(savedEdges)
            }
            return // Don't load initial state if we have saved state
          }
        } catch (error) {
          console.warn('Failed to parse saved canvas state:', error)
        }
      }
    }
    
    // Fallback to initial state if no saved state
    console.log('🔄 Loading initial canvas state:', initialNodes.length, 'nodes')
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [tabTitle, initialNodes, initialEdges])

  // Auto-save whenever nodes or edges change
  React.useEffect(() => {
    if (tabTitle && (nodes.length > 0 || edges.length > 0)) {
      const saveData = {
        timestamp: new Date().toISOString(),
        canvasName: tabTitle,
        nodes: nodes.map(node => ({
          id: node.id,
          x: node.position.x,
          y: node.position.y,
          data: node.data
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: edge.type
        }))
      }
      
      localStorage.setItem(`cashboard-canvas-${tabTitle.replace(/[^a-zA-Z0-9]/g, '-')}`, JSON.stringify(saveData))
      console.log('💾 Auto-saved canvas state:', saveData.nodes.length, 'nodes,', saveData.edges.length, 'edges')
    }
  }, [nodes, edges, tabTitle])


  
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
      data: { 
        label: type.toUpperCase(), 
        kind: type,
        handcashHandle: `${type.replace(/\s+/g, '_')}_${id.slice(-4)}`
      } 
    }
    
    setNodes((nds) => nds.concat(newNode))
    return true
  }, [nodes, setNodes])

  // Expose the addNode function to parent
  React.useEffect(() => {
    // Always expose the function when this canvas is active
    (window as any).addNodeToActiveCanvas = addNodeToCanvas
    
    // Expose the deleteNode function to parent
    ;(window as any).deleteNodeFromCanvas = (nodeId: string) => {
      setNodes(nds => nds.filter(node => node.id !== nodeId))
      setEdges(eds => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId))
    }
    
    // Cleanup when component unmounts
    return () => {
      (window as any).addNodeToActiveCanvas = null
      ;(window as any).deleteNodeFromCanvas = null
    }
  }, [addNodeToCanvas, setNodes, setEdges])

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
    // Single click navigates to node canvas using the navigation stack
    navigateToNodeCanvas(node)
  }, [currentCanvasIndex, navigationStack])

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
          navigationStack={navigationStack}
          currentCanvasIndex={currentCanvasIndex}
          navigateBack={navigateBack}
          navigateToCanvas={navigateToCanvas}
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

function InnerRF({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onPick, palette, templateModal, setTemplateModal, setNodes, setEdges, onTemplateSelect, onNodeClick, onNodeDoubleClick, tabTitle, connectionStyle, navigationStack, currentCanvasIndex, navigateBack, navigateToCanvas }:
  { nodes: Node<RFNodeData>[]; edges: Edge[]; onNodesChange: any; onEdgesChange: any; onConnect: any; onPick: (type: string, rf: any) => void; palette: any[]; templateModal: { kind: string; items: TemplateItem[] } | null; setTemplateModal: (v: any) => void; setNodes: any; setEdges: any; onTemplateSelect?: (template: TemplateItem) => void; onNodeClick?: (event: React.MouseEvent, node: Node<RFNodeData>) => void; onNodeDoubleClick?: (event: React.MouseEvent, node: Node<RFNodeData>) => void; tabTitle?: string; connectionStyle?: 'bezier' | 'smoothstep' | 'straight'; navigationStack: CanvasNavItem[]; currentCanvasIndex: number; navigateBack: () => void; navigateToCanvas: (index: number) => void }) {
  
  // Canvas control states
  const [isRunning, setIsRunning] = React.useState(false)
  const [autoMode, setAutoMode] = React.useState(false)
  const [canvasScale, setCanvasScale] = React.useState(25) // Start zoomed out by default
  const [currentConnectionStyle, setCurrentConnectionStyle] = React.useState<'bezier' | 'smoothstep' | 'straight'>(connectionStyle || 'bezier')

  // Set initial zoom when component mounts
  React.useEffect(() => {
    if ((window as any).reactFlowInstance) {
      // Set initial zoom to be more zoomed out
      (window as any).reactFlowInstance.setZoom(0.25);
      setCanvasScale(25);
      console.log('🔍 Set initial zoom to 25% (more zoomed out)');
    }
  }, [])
  
  // Control functions
  const toggleWorkflowStatus = () => setIsRunning(!isRunning)
  const toggleAutoMode = () => setAutoMode(!autoMode)
  
  const zoomIn = () => {
    if ((window as any).reactFlowInstance) {
      (window as any).reactFlowInstance.zoomIn()
      setCanvasScale(Math.round((window as any).reactFlowInstance.getZoom() * 100))
    }
  }
  
  const zoomOut = () => {
    if ((window as any).reactFlowInstance) {
      (window as any).reactFlowInstance.zoomOut()
      setCanvasScale(Math.round((window as any).reactFlowInstance.getZoom() * 100))
    }
  }
  
  const resetView = () => {
    if ((window as any).reactFlowInstance) {
      (window as any).reactFlowInstance.fitView()
      setCanvasScale(Math.round((window as any).reactFlowInstance.getZoom() * 100))
    }
  }
  
  const cycleConnectionStyle = () => {
    const styles: ('bezier' | 'smoothstep' | 'straight')[] = ['bezier', 'smoothstep', 'straight']
    const currentIndex = styles.indexOf(currentConnectionStyle)
    const nextStyle = styles[(currentIndex + 1) % styles.length]
    setCurrentConnectionStyle(nextStyle)
  }
  const rf = useReactFlow()
  
  // Expose React Flow instance globally for controls and set up zoom listener
  React.useEffect(() => {
    (window as any).reactFlowInstance = rf
    
    // Set up interval to check for zoom changes from mouse wheel and other interactions
    const handleZoomChange = () => {
      if (rf) {
        const currentZoom = rf.getZoom();
        setCanvasScale(Math.round(currentZoom * 100));
      }
    };
    
    // Check for zoom changes every 100ms
    const zoomInterval = setInterval(handleZoomChange, 100);
    
    return () => clearInterval(zoomInterval);
  }, [rf])
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
      defaultViewport={{ x: 0, y: 0, zoom: 0.25 }}
      minZoom={0.1}
      maxZoom={2}
      defaultEdgeOptions={{ 
        style: { stroke: 'rgba(255,255,255,0.7)', strokeWidth: 2 }, 
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.8)' },
        type: connectionStyle || 'bezier'
      }}
      connectionLineStyle={{ stroke: 'rgba(255,255,255,0.6)', strokeWidth: 2 }}
    >
      <Background color="rgba(255,255,255,0.1)" />
      {/* Navigation Breadcrumb Panel */}
      <Panel position="top-left" className="m-2">
        <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2">
          <div className="flex items-center space-x-2">
            {/* Back Button */}
            {currentCanvasIndex > 0 && (
              <button
                onClick={navigateBack}
                className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 rounded transition-colors"
                title="Go back to previous canvas"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-xs">Back</span>
              </button>
            )}
            
            {/* Breadcrumb Trail */}
            <div className="flex items-center space-x-1">
              {navigationStack.map((canvas, index) => (
                <div key={canvas.id} className="flex items-center space-x-1">
                  <button
                    onClick={() => navigateToCanvas(index)}
                    className={`text-sm font-medium px-2 py-1 rounded transition-colors ${
                      index === currentCanvasIndex
                        ? 'text-white bg-white/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={canvas.title}
                  >
                    {canvas.title.length > 20 ? canvas.title.slice(0, 20) + '...' : canvas.title}
                  </button>
                  {index < navigationStack.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-gray-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Canvas Controls Panel */}
      <Panel position="top-right" className="m-2 mr-4">
        <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleWorkflowStatus}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                isRunning 
                  ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                  : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
              }`}
              title={isRunning ? 'Pause workflow' : 'Start workflow'}
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isRunning ? 'Running' : 'Paused'}
            </button>
            
            <button
              onClick={toggleAutoMode}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                autoMode 
                  ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                  : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
              }`}
              title={autoMode ? 'Switch to manual mode' : 'Switch to auto mode'}
            >
              <Zap className="w-3 h-3" />
              {autoMode ? 'Auto' : 'Manual'}
            </button>
            
            <div className="flex items-center gap-1 text-xs text-gray-400 border-l border-white/20 pl-2 ml-2">
              <button onClick={zoomOut} className="hover:text-white transition-colors" title="Zoom Out">
                <ZoomOut className="w-3 h-3" />
              </button>
              <span className="min-w-[35px] text-center" title="Current zoom level">
                {canvasScale}%
              </span>
              <button onClick={zoomIn} className="hover:text-white transition-colors" title="Zoom In">
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>
            
            <button
              onClick={resetView}
              className="px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              title="Reset canvas view to fit all nodes"
            >
              Reset
            </button>
            
            <button
              onClick={cycleConnectionStyle}
              className="px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all capitalize"
              title={`Current: ${currentConnectionStyle}. Click to cycle through connection styles.`}
            >
              {currentConnectionStyle}
            </button>
            
            <button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                // Test localStorage first
                try {
                  localStorage.setItem('test-save', 'test-value');
                  const testValue = localStorage.getItem('test-save');
                  console.log('🧪 localStorage test:', testValue === 'test-value' ? 'PASSED' : 'FAILED');
                  localStorage.removeItem('test-save');
                } catch (error) {
                  console.error('❌ localStorage test failed:', error);
                  return;
                }
                
                // Manual save - trigger the auto-save effect
                const canvasName = tabTitle || 'canvas';
                console.log('🔍 Save button clicked:', { tabTitle, canvasName, nodesCount: nodes.length, edgesCount: edges.length });
                
                const saveData = {
                  timestamp: new Date().toISOString(),
                  canvasName: canvasName,
                  nodes: nodes.map(node => ({
                    id: node.id,
                    x: node.position.x,
                    y: node.position.y,
                    data: node.data
                  })),
                  edges: edges.map(edge => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    type: edge.type
                  }))
                };
                
                const storageKey = `cashboard-canvas-${canvasName.replace(/[^a-zA-Z0-9]/g, '-')}`;
                console.log('💾 Saving to localStorage with key:', storageKey);
                console.log('💾 Save data:', saveData);
                
                try {
                  localStorage.setItem(storageKey, JSON.stringify(saveData));
                  console.log('✅ Successfully saved to localStorage');
                  
                  // Verify the save worked
                  const savedData = localStorage.getItem(storageKey);
                  if (savedData) {
                    console.log('✅ Verification: Data found in localStorage');
                    const parsed = JSON.parse(savedData);
                    console.log('✅ Verification: Parsed data has', parsed.nodes?.length || 0, 'nodes');
                  } else {
                    console.log('❌ Verification: Data not found in localStorage');
                  }
                  
                  // Show feedback without alert
                  console.log(`💾 Manual save: ${canvasName} layout saved to localStorage`)
                  
                  // Visual feedback - briefly change button color
                  const button = event.currentTarget as HTMLButtonElement;
                  const originalClass = button.className;
                  button.className = 'px-2 py-1 rounded text-xs bg-green-500/60 text-white transition-all';
                  setTimeout(() => {
                    button.className = originalClass;
                  }, 500);
                } catch (error) {
                  console.error('❌ Failed to save to localStorage:', error);
                  // Visual feedback for error
                  const button = event.currentTarget as HTMLButtonElement;
                  const originalClass = button.className;
                  button.className = 'px-2 py-1 rounded text-xs bg-red-500/60 text-white transition-all';
                  setTimeout(() => {
                    button.className = originalClass;
                  }, 1000);
                }
              }}
              className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-all"
              title="Save current canvas layout to localStorage (auto-save is already enabled)"
            >
              💾 Save
            </button>
          </div>
        </div>
      </Panel>

      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
        <NodePaletteSimple
          title="Add Nodes"
          nodeTypes={palette as any}
          categories={[...new Set(palette.map((p) => p.category))]}
          onPick={(t) => onPick(t, rf)}
          visible={true}
        />
      </div>
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
                          handcashHandle: `${it.name.replace(/\s+/g, '_')}_${id.slice(-4)}`,
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


