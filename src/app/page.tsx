'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Menu, 
  X, 
  DollarSign, 
  FileText, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Zap, 
  Play, 
  Pause, 
  ArrowRight,
  Building2,
  Crown,
  Coins,
  Bot,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Send,
  Maximize2,
  Minimize2,
  RotateCcw,
  Plus,
  UserPlus,
  TrendingUp,
  BarChart3,
  Palette,
  Shield,
  CreditCard,
  Settings,
  Scale,
  Circle,
  Building,
  PlayCircle
} from 'lucide-react'
import DemoModal from '../components/DemoModal'

// Client-side only time display component to prevent hydration errors
function TimeDisplay({ timestamp }: { timestamp: Date }) {
  const [timeString, setTimeString] = useState<string>('')

  useEffect(() => {
    setTimeString(timestamp.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    }))
  }, [timestamp])

  return <span>{timeString}</span>
}

interface HandCashHandle {
  id: string
  handle: string
  displayName: string
  tokenAddress?: string
  shareAllocation: number
  role: string
  organizationId: string
}

interface Organization {
  id: string
  name: string
  description: string
  tokenSymbol: string
  tokenAddress?: string
  totalShares: number
  members: HandCashHandle[]
  createdAt: string
  status: 'active' | 'inactive' | 'pending'
}

interface Role {
  id: string
  name: string
  description: string
  icon: string
  permissions: string[]
  defaultShareAllocation: number
}

interface WorkflowNode {
  id: string
  type: 'payment' | 'contract' | 'task' | 'decision' | 'milestone' | 'team' | 'kpi' | 'employee' | 'deliverable' | 'asset' | 'mint' | 'payroll' | 'production' | 'marketing' | 'sales' | 'legal' | 'finance' | 'hr' | 'it' | 'operations'
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
  isExpanded?: boolean
  childNodes?: WorkflowNode[]
  memberCount?: number
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
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  connections: Connection[]
  selectedNode: string | null
  isConnecting: string | null
  dragging: string | null
  workflowStatus: 'running' | 'paused' | 'stopped'
  autoMode: boolean
  createdAt: string
  updatedAt: string
  organizationId?: string
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  status: 'sending' | 'sent' | 'error'
}

interface AppState {
  currentView: 'workflow' | 'organizations' | 'roles' | 'members' | 'instruments' | 'security' | 'integrations'
  selectedOrganization: string | null
  sidebarOpen: boolean
  isMobile: boolean
  organizations: Organization[]
  roles: Role[]
  workflows: WorkflowState[]
  selectedWorkflow: string | null
  chatMessages: ChatMessage[]
  isChatOpen: boolean
  instruments: FinancialInstrument[]
  securityProducts: SecurityProduct[]
}

interface WorkflowViewProps {
  workflow: WorkflowState
  boardRef: React.RefObject<HTMLDivElement | null>
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onMouseDown: (e: React.MouseEvent, id: string) => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: () => void
  onNodeUpdate: (id: string, updates: Partial<WorkflowNode>) => void
  onNodeDelete: (id: string) => void
  onStartConnection: (fromId: string) => void
  onCompleteConnection: (toId: string) => void
  onDoubleClick: (id: string) => void
  onToggleExpansion: (nodeId: string) => void
  getNodeIcon: (type: string) => React.ReactNode
  getStatusColor: (status: string) => string
  getConnectionColor: (type: string) => string
  getNodePosition: (id: string) => WorkflowNode | undefined
  isMobile: boolean
  canvasScale: number
  canvasOffset: { x: number; y: number }
  resetCanvasView: () => void
  setCanvasScale: (scale: number | ((prev: number) => number)) => void
}

interface OrganizationsViewProps {
  organizations: Organization[]
  selectedOrganization: string | null
  onSelectOrganization: (orgId: string) => void
  onCreateOrganization: (name: string, description: string, tokenSymbol: string) => void
}

interface RolesViewProps {
  roles: Role[]
  organizations: Organization[]
  selectedOrganization: string | null
  onAddMember: (organizationId: string, handle: string, displayName: string, roleId: string) => void
}

interface MembersViewProps {
  organizations: Organization[]
  selectedOrganization: string | null
  onUpdateShareAllocation: (organizationId: string, memberId: string, shares: number) => void
}

interface FinancialInstrument {
  id: string
  name: string
  type: 'equity' | 'debt' | 'derivative' | 'reward' | 'utility' | 'governance' | 'hybrid'
  symbol: string
  description: string
  organizationId: string
  totalSupply: number
  issuedSupply: number
  decimals: number
  blockchain: string
  contractAddress?: string
  metadata: {
    maturityDate?: string
    interestRate?: number
    couponRate?: number
    strikePrice?: number
    expiryDate?: string
    vestingSchedule?: string
    votingPower?: number
    dividendYield?: number
    collateralRatio?: number
    liquidationThreshold?: number
    rewardMultiplier?: number
    stakingAPY?: number
    governanceWeight?: number
    utilityFunctions?: string[]
  }
  status: 'draft' | 'active' | 'paused' | 'matured' | 'liquidated'
  createdAt: string
  updatedAt: string
}

interface InstrumentsViewProps {
  instruments: FinancialInstrument[]
  organizations: Organization[]
  selectedOrganization: string | null
  onCreateInstrument: (instrument: Omit<FinancialInstrument, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdateInstrument: (id: string, updates: Partial<FinancialInstrument>) => void
  onDeleteInstrument: (id: string) => void
}

interface SecurityProduct {
  id: string
  name: string
  type: 'auth' | 'identity' | 'access' | 'encryption' | 'audit' | 'compliance' | 'governance' | 'biometric' | 'zero-knowledge' | 'multisig'
  category: 'authentication' | 'authorization' | 'identity-management' | 'data-protection' | 'compliance' | 'governance'
  description: string
  organizationId: string
  blockchain: string
  contractAddress?: string
  tokenSymbol?: string
  pricing: {
    model: 'subscription' | 'usage-based' | 'one-time' | 'revenue-share'
    price: number
    currency: string
    billingCycle?: string
  }
  features: {
    oauthCompatible: boolean
    multiFactorAuth: boolean
    biometricSupport: boolean
    zeroKnowledgeProofs: boolean
    auditTrail: boolean
    complianceFrameworks: string[]
    apiEndpoints: string[]
    sdkSupport: string[]
  }
  metadata: {
    maxUsers?: number
    dataRetentionDays?: number
    encryptionLevel?: string
    auditLogRetention?: number
    complianceCertifications?: string[]
    uptimeSLA?: number
    responseTime?: number
  }
  status: 'development' | 'beta' | 'active' | 'deprecated'
  createdAt: string
  updatedAt: string
}



export default function Dashboard() {
  const [appState, setAppState] = useState<AppState>({
    currentView: 'workflow',
    selectedOrganization: null,
    sidebarOpen: true,
    organizations: [
      {
        id: '1',
        name: 'TechCorp Inc.',
        description: 'Innovative technology solutions',
        tokenSymbol: 'TECH',
        totalShares: 1000000,
        members: [],
        createdAt: '2024-01-01',
        status: 'active'
      }
    ],
    roles: [
      { id: '1', name: 'CEO', description: 'Chief Executive Officer', icon: 'crown', permissions: ['admin', 'finance', 'hr'], defaultShareAllocation: 20 },
      { id: '2', name: 'CTO', description: 'Chief Technology Officer', icon: 'trending-up', permissions: ['tech', 'product'], defaultShareAllocation: 15 },
      { id: '3', name: 'CMO', description: 'Chief Marketing Officer', icon: 'trending-up', permissions: ['marketing', 'sales'], defaultShareAllocation: 12 },
      { id: '4', name: 'Data Analyst', description: 'Data analysis and insights', icon: 'bar-chart-3', permissions: ['data', 'analytics'], defaultShareAllocation: 5 },
      { id: '5', name: 'Marketer', description: 'Marketing and growth', icon: 'trending-up', permissions: ['marketing'], defaultShareAllocation: 3 },
      { id: '6', name: 'Developer', description: 'Software development', icon: 'code', permissions: ['tech'], defaultShareAllocation: 8 },
      { id: '7', name: 'Designer', description: 'UI/UX design', icon: 'palette', permissions: ['design'], defaultShareAllocation: 6 },
      { id: '8', name: 'Legal', description: 'Legal and compliance', icon: 'shield', permissions: ['legal', 'compliance'], defaultShareAllocation: 4 }
    ],
    workflows: [
      {
        id: '1',
        name: 'Development Project Workflow',
        description: 'Complete development project with payment, contract, and team coordination',
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
            memberCount: 3,
            isExpanded: false,
            childNodes: [
              {
                id: '6-1',
                type: 'task',
                name: 'Alice - Frontend',
                description: 'React component development',
                x: 500,
                y: 350,
                status: 'active',
                assignees: ['Alice'],
                connections: []
              },
              {
                id: '6-2',
                type: 'task',
                name: 'Bob - Backend',
                description: 'API development',
                x: 700,
                y: 350,
                status: 'pending',
                assignees: ['Bob'],
                connections: []
              },
              {
                id: '6-3',
                type: 'task',
                name: 'Charlie - Testing',
                description: 'Quality assurance',
                x: 600,
                y: 450,
                status: 'pending',
                assignees: ['Charlie'],
                connections: []
              }
            ],
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
        autoMode: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        organizationId: '1'
      }
    ],
    selectedWorkflow: '1',
  chatMessages: [
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you create organizations, manage workflows, and automate business processes. Try saying something like "Create a new organization" or "Add a new team member".',
      timestamp: new Date(),
      status: 'sent'
    }
  ],
  isChatOpen: false,
  isMobile: false,
  instruments: [
    {
      id: '1',
      name: 'TechCorp Equity Shares',
      type: 'equity',
      symbol: 'TECH',
      description: 'Common equity shares with voting rights',
      organizationId: '1',
      totalSupply: 1000000,
      issuedSupply: 500000,
      decimals: 18,
      blockchain: 'Bitcoin SV',
      contractAddress: '0x1234567890abcdef',
      metadata: {
        votingPower: 1,
        dividendYield: 0.05,
        governanceWeight: 1
      },
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'TechCorp Employee Options',
      type: 'derivative',
      symbol: 'TECH-OPT',
      description: 'Employee stock options with vesting',
      organizationId: '1',
      totalSupply: 100000,
      issuedSupply: 25000,
      decimals: 18,
      blockchain: 'Bitcoin SV',
      metadata: {
        strikePrice: 10,
        expiryDate: '2029-01-15',
        vestingSchedule: '4-year vesting with 1-year cliff'
      },
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ],
  securityProducts: [
    {
      id: '1',
      name: 'BlockAuth OAuth',
      type: 'auth',
      category: 'authentication',
      description: 'Blockchain-based OAuth 2.0 compatible authentication service',
      organizationId: '1',
      blockchain: 'Bitcoin SV',
      contractAddress: '0xauth1234567890abcdef',
      tokenSymbol: 'AUTH',
      pricing: {
        model: 'usage-based',
        price: 0.001,
        currency: 'BSV',
        billingCycle: 'per-request'
      },
      features: {
        oauthCompatible: true,
        multiFactorAuth: true,
        biometricSupport: false,
        zeroKnowledgeProofs: false,
        auditTrail: true,
        complianceFrameworks: ['GDPR', 'SOC2'],
        apiEndpoints: ['/oauth/authorize', '/oauth/token', '/userinfo'],
        sdkSupport: ['JavaScript', 'Python', 'React Native']
      },
      metadata: {
        maxUsers: 1000000,
        dataRetentionDays: 90,
        encryptionLevel: 'AES-256',
        auditLogRetention: 365,
        complianceCertifications: ['ISO 27001'],
        uptimeSLA: 99.9,
        responseTime: 100
      },
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Immutable Audit Log',
      type: 'audit',
      category: 'compliance',
      description: 'Immutable blockchain audit trail for compliance and governance',
      organizationId: '1',
      blockchain: 'Bitcoin SV',
      contractAddress: '0xaudit1234567890abcdef',
      pricing: {
        model: 'subscription',
        price: 99,
        currency: 'USD',
        billingCycle: 'monthly'
      },
      features: {
        oauthCompatible: false,
        multiFactorAuth: false,
        biometricSupport: false,
        zeroKnowledgeProofs: true,
        auditTrail: true,
        complianceFrameworks: ['SOX', 'HIPAA', 'PCI-DSS'],
        apiEndpoints: ['/audit/log', '/audit/verify', '/audit/export'],
        sdkSupport: ['Java', 'C#', 'Go']
      },
      metadata: {
        maxUsers: 50000,
        dataRetentionDays: 2555,
        encryptionLevel: 'SHA-256',
        auditLogRetention: 2555,
        complianceCertifications: ['SOC2 Type II'],
        uptimeSLA: 99.99,
        responseTime: 50
      },
      status: 'active',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ]
})

  const { workflows, selectedWorkflow, organizations, roles, currentView, selectedOrganization, sidebarOpen, chatMessages, isChatOpen, instruments } = appState

  const boardRef = useRef<HTMLDivElement>(null)
  
  // Helper function to get current workflow
  const getCurrentWorkflow = () => {
    return selectedWorkflow ? workflows.find(w => w.id === selectedWorkflow) : workflows[0]
  }
  
  const currentWorkflow = getCurrentWorkflow()
  
  // Mobile detection and responsive state
  const [isMobile, setIsMobile] = useState(false)
  const [canvasScale, setCanvasScale] = useState(1)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false)
  const [lastTouchDistance, setLastTouchDistance] = useState(0)
  const [lastTouchCenter, setLastTouchCenter] = useState({ x: 0, y: 0 })
  const [showDemoModal, setShowDemoModal] = useState(false)

  // Mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      setIsMobile(mobile)
      setAppState(prev => ({ ...prev, isMobile: mobile }))
      
      // Adjust initial node positions for mobile
      if (mobile) {
        setAppState(prev => ({
          ...prev,
          workflows: prev.workflows.map(w => ({
            ...w,
            nodes: w.nodes.map((node, index) => ({
              ...node,
              x: 50 + (index * 200),
              y: 50 + (Math.floor(index / 2) * 120)
            }))
          }))
        }))
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Touch event handlers for canvas dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - start canvas dragging
      setIsDraggingCanvas(true)
      const touch = e.touches[0]
      setLastTouchCenter({ x: touch.clientX, y: touch.clientY })
    } else if (e.touches.length === 2) {
      // Two touches - prepare for pinch to zoom
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
      setLastTouchDistance(distance)
      setLastTouchCenter({
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    
    if (e.touches.length === 1 && isDraggingCanvas) {
      // Single touch - drag canvas
      const touch = e.touches[0]
      const deltaX = touch.clientX - lastTouchCenter.x
      const deltaY = touch.clientY - lastTouchCenter.y
      
      setCanvasOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
      
      setLastTouchCenter({ x: touch.clientX, y: touch.clientY })
    } else if (e.touches.length === 2) {
      // Two touches - pinch to zoom
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)
      
      if (lastTouchDistance > 0) {
        const scale = distance / lastTouchDistance
        const newScale = Math.max(0.5, Math.min(2, canvasScale * scale))
        setCanvasScale(newScale)
      }
      
      setLastTouchDistance(distance)
    }
  }

  const handleTouchEnd = () => {
    setIsDraggingCanvas(false)
    setLastTouchDistance(0)
  }

  // Reset canvas view
  const resetCanvasView = () => {
    setCanvasScale(1)
    setCanvasOffset({ x: 0, y: 0 })
  }

  const getNodeIcon = (type: string) => {
    const iconSize = isMobile ? "w-3 h-3" : "w-4 h-4"
    switch (type) {
      case 'payment': return <DollarSign className={iconSize} />
      case 'contract': return <FileText className={iconSize} />
      case 'task': return <Target className={iconSize} />
      case 'decision': return <AlertTriangle className={iconSize} />
      case 'milestone': return <CheckCircle className={iconSize} />
      case 'team': return <Users className={iconSize} />
      default: return <Zap className={iconSize} />
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
    if (!currentWorkflow) return
    
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

    setAppState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === currentWorkflow.id 
          ? { 
              ...w, 
              nodes: [...w.nodes, newNode],
              selectedNode: newNode.id,
              updatedAt: new Date().toISOString()
            }
          : w
      )
    }))
  }

  const updateNode = (id: string, updates: Partial<WorkflowNode>) => {
    if (!currentWorkflow) return
    
    setAppState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === currentWorkflow.id 
          ? { 
              ...w, 
              nodes: w.nodes.map(node => 
                node.id === id ? { ...node, ...updates } : node
              ),
              updatedAt: new Date().toISOString()
            }
          : w
      )
    }))
  }

  const deleteNode = (id: string) => {
    if (!currentWorkflow) return
    
    setAppState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === currentWorkflow.id 
          ? { 
              ...w, 
              nodes: w.nodes.filter(n => n.id !== id),
              connections: w.connections.filter(c => c.from !== id && c.to !== id),
              selectedNode: w.selectedNode === id ? null : w.selectedNode,
              updatedAt: new Date().toISOString()
            }
          : w
      )
    }))
  }

  const startConnection = (fromId: string) => {
    if (!currentWorkflow) return
    
    setAppState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === currentWorkflow.id 
          ? { ...w, isConnecting: fromId }
          : w
      )
    }))
  }

  const completeConnection = (toId: string) => {
    if (!currentWorkflow) return
    
    if (currentWorkflow.isConnecting && currentWorkflow.isConnecting !== toId) {
      const newConnection: Connection = {
        id: `${currentWorkflow.isConnecting}-${toId}`,
        from: currentWorkflow.isConnecting,
        to: toId,
        type: 'task'
      }
      setAppState(prev => ({
        ...prev,
        workflows: prev.workflows.map(w => 
          w.id === currentWorkflow.id 
            ? { 
                ...w, 
                connections: [...w.connections, newConnection],
                isConnecting: null,
                updatedAt: new Date().toISOString()
              }
            : w
        )
      }))
    } else {
      setAppState(prev => ({
        ...prev,
        workflows: prev.workflows.map(w => 
          w.id === currentWorkflow.id 
            ? { ...w, isConnecting: null }
            : w
        )
      }))
    }
  }

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (!currentWorkflow) return
    
    setAppState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === currentWorkflow.id 
          ? { ...w, dragging: id, selectedNode: id }
          : w
      )
    }))
    e.stopPropagation()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!currentWorkflow || !currentWorkflow.dragging || !boardRef.current) return
    
    const rect = boardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    updateNode(currentWorkflow.dragging, { x, y })
  }

  const handleMouseUp = () => {
    if (!currentWorkflow) return
    
    setAppState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === currentWorkflow.id 
          ? { ...w, dragging: null }
          : w
      )
    }))
  }

  const getNodePosition = (id: string) => {
    return currentWorkflow?.nodes.find(n => n.id === id)
  }

  const toggleWorkflowStatus = () => {
    if (!currentWorkflow) return
    
    setAppState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === currentWorkflow.id 
          ? { 
              ...w, 
              workflowStatus: w.workflowStatus === 'running' ? 'paused' : 'running',
              updatedAt: new Date().toISOString()
            }
          : w
      )
    }))
  }

  const toggleAutoMode = () => {
    if (!currentWorkflow) return
    
    setAppState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === currentWorkflow.id 
          ? { 
              ...w, 
              autoMode: !w.autoMode,
              updatedAt: new Date().toISOString()
            }
          : w
      )
    }))
  }

  const advanceWorkflow = () => {
    if (!currentWorkflow) return
    
    setAppState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === currentWorkflow.id 
          ? {
              ...w,
              nodes: w.nodes.map(node => {
                if (node.status === 'pending') {
                  return { ...node, status: 'active' }
                } else if (node.status === 'active') {
                  return { ...node, status: 'completed' }
                }
                return node
              }),
              updatedAt: new Date().toISOString()
            }
          : w
      )
    }))
  }

  // Workflow management functions
  const createWorkflow = (name: string, description: string) => {
    const newWorkflow: WorkflowState = {
      id: Date.now().toString(),
      name,
      description,
      nodes: [],
      connections: [],
      selectedNode: null,
      isConnecting: null,
      dragging: null,
      workflowStatus: 'stopped',
      autoMode: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: selectedOrganization || undefined
    }

    setAppState(prev => ({
      ...prev,
      workflows: [...prev.workflows, newWorkflow],
      selectedWorkflow: newWorkflow.id
    }))
  }

  const openWorkflow = (workflowId: string) => {
    setAppState(prev => ({
      ...prev,
      selectedWorkflow: workflowId
    }))
  }

  const deleteWorkflow = (workflowId: string) => {
    setAppState(prev => ({
      ...prev,
      workflows: prev.workflows.filter(w => w.id !== workflowId),
      selectedWorkflow: prev.selectedWorkflow === workflowId ? null : prev.selectedWorkflow
    }))
  }

  // Organization Management Functions
  const createOrganization = (name: string, description: string, tokenSymbol: string) => {
    const newOrg: Organization = {
      id: Date.now().toString(),
      name,
      description,
      tokenSymbol,
      totalShares: 1000000,
      members: [],
      createdAt: new Date().toISOString(),
      status: 'active'
    }
    setAppState(prev => ({
      ...prev,
      organizations: [...prev.organizations, newOrg],
      selectedOrganization: newOrg.id
    }))
  }

  const addMember = (organizationId: string, handle: string, displayName: string, roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    const newMember: HandCashHandle = {
      id: Date.now().toString(),
      handle,
      displayName,
      shareAllocation: role?.defaultShareAllocation || 0,
      role: role?.name || 'Member',
      organizationId
    }
    setAppState(prev => ({
      ...prev,
      organizations: prev.organizations.map(org => 
        org.id === organizationId 
          ? { ...org, members: [...org.members, newMember] }
          : org
      )
    }))
  }

  const updateShareAllocation = (organizationId: string, memberId: string, shares: number) => {
    setAppState(prev => ({
      ...prev,
      organizations: prev.organizations.map(org => 
        org.id === organizationId 
          ? {
              ...org,
              members: org.members.map(member => 
                member.id === memberId 
                  ? { ...member, shareAllocation: shares }
                  : member
              )
            }
          : org
      )
    }))
  }

  const setCurrentView = (view: AppState['currentView']) => {
    setAppState(prev => ({ ...prev, currentView: view }))
  }

  const toggleSidebar = () => {
    setAppState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))
  }

  const selectOrganization = (orgId: string) => {
    setAppState(prev => ({ ...prev, selectedOrganization: orgId }))
  }

  // AI Chat Functions
  const toggleChat = () => {
    setAppState(prev => ({ ...prev, isChatOpen: !prev.isChatOpen }))
  }

  const sendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
      status: 'sending'
    }

    setAppState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, userMessage]
    }))

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = processAICommand(content)
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        status: 'sent'
      }

      setAppState(prev => ({
        ...prev,
        chatMessages: prev.chatMessages.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' as const } : msg
        ).concat(aiMessage)
      }))
    }, 1000)
  }

  const toggleNodeExpansion = (nodeId: string) => {
    if (!currentWorkflow) return
    
    setAppState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === currentWorkflow.id 
          ? {
              ...w,
              nodes: w.nodes.map(node => 
                node.id === nodeId ? { ...node, isExpanded: !node.isExpanded } : node
              ),
              updatedAt: new Date().toISOString()
            }
          : w
      )
    }))
  }

  const processAICommand = (command: string): string => {
    const lowerCommand = command.toLowerCase()
    
    // Organization creation
    if (lowerCommand.includes('create') && lowerCommand.includes('organization')) {
      const name = command.match(/organization\s+(?:called\s+)?([a-zA-Z\s]+)/i)?.[1] || 'New Organization'
      const orgId = Date.now().toString()
      createOrganization(name.trim(), 'AI-created organization', 'ORG')
      return `✅ Created organization "${name.trim()}" with ID ${orgId}. You can now add roles and members.`
    }

    // Add roles
    if (lowerCommand.includes('add') && lowerCommand.includes('role')) {
      const roleMatch = command.match(/add\s+(CEO|CTO|CMO|CFO|Data\s+Analyst|Marketer|Developer|Designer|Legal)/i)
      if (roleMatch) {
        const roleName = roleMatch[1]
        return `✅ Role "${roleName}" is already available in the system. You can assign it to team members.`
      }
      return `Available roles: CEO, CTO, CMO, CFO, Data Analyst, Marketer, Developer, Designer, Legal`
    }

    // Equity allocation
    if (lowerCommand.includes('equity') || lowerCommand.includes('shares')) {
      const equityMatch = command.match(/(\d+)%\s+equity/i)
      if (equityMatch) {
        const percentage = equityMatch[1]
        return `✅ I'll help you allocate ${percentage}% equity. Please select the organization and member in the interface.`
      }
      return `To allocate equity, specify the percentage (e.g., "10% equity") and I'll help you assign it.`
    }

    // Token creation
    if (lowerCommand.includes('token') && lowerCommand.includes('billion')) {
      return `✅ I can help you create a token with 1 billion supply. Please specify the blockchain (e.g., "Bitcoin SV") and token symbol.`
    }

    // Contract generation
    if (lowerCommand.includes('contract') && (lowerCommand.includes('employment') || lowerCommand.includes('employee'))) {
      return `✅ I'll generate an employment contract with KPIs and clawback conditions. This will create a new contract node in your workflow.`
    }

    // Team expansion
    if (lowerCommand.includes('team') && lowerCommand.includes('expand')) {
      return `✅ I can help you expand your team. Please specify the number of people and their roles.`
    }

    // Default response
    return `I understand you want to: "${command}". I can help you with:
    • Creating organizations and roles
    • Allocating equity and shares
    • Generating contracts and workflows
    • Managing team members
    • Token creation and management
    
    Please be more specific about what you'd like me to do.`
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/20 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.01),transparent_50%)]"></div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="relative min-h-screen w-64 bg-black/80 backdrop-blur-xl border-r border-white/20 z-30 flex-shrink-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">CASHBOARD</h2>
              <button
                onClick={toggleSidebar}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="space-y-2">
              <button
                onClick={() => setCurrentView('workflow')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  currentView === 'workflow' 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5" />
                  <span>Workflows</span>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('organizations')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  currentView === 'organizations' 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5" />
                  <span>Organizations</span>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('roles')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  currentView === 'roles' 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Crown className="w-5 h-5" />
                  <span>Roles</span>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('members')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  currentView === 'members' 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span>Members</span>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('instruments')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  currentView === 'instruments' 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Coins className="w-5 h-5" />
                  <span>Instruments</span>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('integrations')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  currentView === 'integrations' 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5" />
                  <span>Integrations</span>
                </div>
              </button>
            </nav>

            {/* Selected Organization */}
            {selectedOrganization && (
              <div className="mt-8 p-4 bg-white/10 rounded-lg">
                <h3 className="text-sm font-medium text-white mb-2">Current Organization</h3>
                <p className="text-gray-300 text-sm">
                  {organizations.find(org => org.id === selectedOrganization)?.name}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className={`absolute top-0 left-0 right-0 z-20 ${isMobile ? 'p-3' : 'p-6'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
              </button>
              <div className={`bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl ${
                isMobile ? 'px-4 py-2' : 'px-6 py-3'
              }`}>
                <h1 className={`font-bold text-white tracking-wider font-mono ${
                  isMobile ? 'text-lg' : 'text-2xl'
                }`}>CASHBOARD</h1>
              </div>
              
              {/* Demo Button */}
              <button
                onClick={() => setShowDemoModal(true)}
                className={`bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 ${
                  isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
                }`}
              >
                <PlayCircle className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
                <span className={isMobile ? 'hidden' : ''}>Watch Demo</span>
              </button>
            {currentView === 'workflow' && currentWorkflow && (
              <div className={`flex items-center space-x-2 ${isMobile ? 'flex-wrap gap-1' : ''}`}>
                <button
                  onClick={toggleWorkflowStatus}
                  className={`rounded-lg flex items-center space-x-2 transition-all ${
                    currentWorkflow.workflowStatus === 'running' 
                      ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                  } ${isMobile ? 'px-2 py-1' : 'px-3 py-2'}`}
                >
                  {currentWorkflow.workflowStatus === 'running' ? <Play className={isMobile ? "w-3 h-3" : "w-4 h-4"} /> : <Pause className={isMobile ? "w-3 h-3" : "w-4 h-4"} />}
                  {!isMobile && <span className="text-sm font-medium">{currentWorkflow.workflowStatus === 'running' ? 'Running' : 'Paused'}</span>}
                </button>
                <button
                  onClick={toggleAutoMode}
                  className={`rounded-lg flex items-center space-x-2 transition-all ${
                    currentWorkflow.autoMode 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                  } ${isMobile ? 'px-2 py-1' : 'px-3 py-2'}`}
                >
                  <Zap className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                  {!isMobile && <span className="text-sm font-medium">Auto</span>}
                </button>
                <button
                  onClick={advanceWorkflow}
                  className={`rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all ${
                    isMobile ? 'px-2 py-1' : 'px-3 py-2'
                  }`}
                >
                  <ArrowRight className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                </button>
              </div>
            )}
          </div>
          
          {currentView === 'workflow' && (
            <div className={`flex items-center space-x-2 ${isMobile ? 'flex-wrap gap-1' : ''}`}>
              <div className={`bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl ${
                isMobile ? 'p-1' : 'p-2'
              }`}>
                <div className={`flex items-center space-x-1 ${isMobile ? 'flex-wrap gap-1' : ''}`}>
                  <button onClick={() => addNode('payment')} className={`hover:bg-white/10 rounded-lg transition-colors ${
                    isMobile ? 'p-1' : 'p-2'
                  }`}>
                    <DollarSign className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-yellow-400`} />
                  </button>
                  <button onClick={() => addNode('contract')} className={`hover:bg-white/10 rounded-lg transition-colors ${
                    isMobile ? 'p-1' : 'p-2'
                  }`}>
                    <FileText className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-blue-400`} />
                  </button>
                  <button onClick={() => addNode('task')} className={`hover:bg-white/10 rounded-lg transition-colors ${
                    isMobile ? 'p-1' : 'p-2'
                  }`}>
                    <Target className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-green-400`} />
                  </button>
                  <button onClick={() => addNode('decision')} className={`hover:bg-white/10 rounded-lg transition-colors ${
                    isMobile ? 'p-1' : 'p-2'
                  }`}>
                    <AlertTriangle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-purple-400`} />
                  </button>
                  <button onClick={() => addNode('milestone')} className={`hover:bg-white/10 rounded-lg transition-colors ${
                    isMobile ? 'p-1' : 'p-2'
                  }`}>
                    <CheckCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-indigo-400`} />
                  </button>
                  <button onClick={() => addNode('team')} className={`hover:bg-white/10 rounded-lg transition-colors ${
                    isMobile ? 'p-1' : 'p-2'
                  }`}>
                    <Users className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-pink-400`} />
                  </button>
                </div>
              </div>
            </div>
          )}
                  </div>
        </div>

        {/* Content Views */}
        {currentView === 'workflow' && !currentWorkflow && (
          <WorkflowsView 
            workflows={workflows}
            selectedWorkflow={selectedWorkflow}
            onCreateWorkflow={createWorkflow}
            onOpenWorkflow={openWorkflow}
            onDeleteWorkflow={deleteWorkflow}
            isMobile={isMobile}
          />
        )}

        {currentView === 'workflow' && currentWorkflow && (
          <WorkflowView 
            workflow={currentWorkflow}
            boardRef={boardRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onNodeUpdate={updateNode}
            onNodeDelete={deleteNode}
            onStartConnection={startConnection}
            onCompleteConnection={completeConnection}
            onDoubleClick={(id: string) => {
              if (!currentWorkflow) return
              setAppState(prev => ({
                ...prev,
                workflows: prev.workflows.map(w => 
                  w.id === currentWorkflow.id 
                    ? { ...w, selectedNode: id }
                    : w
                )
              }))
            }}
            onToggleExpansion={toggleNodeExpansion}
            getNodeIcon={getNodeIcon}
            getStatusColor={getStatusColor}
            getConnectionColor={getConnectionColor}
            getNodePosition={getNodePosition}
            isMobile={isMobile}
            canvasScale={canvasScale}
            canvasOffset={canvasOffset}
            resetCanvasView={resetCanvasView}
            setCanvasScale={setCanvasScale}
            chatMessages={chatMessages}
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
            sendMessage={sendMessage}
            sidebarOpen={sidebarOpen}
            onBackToWorkflows={() => setAppState(prev => ({ ...prev, selectedWorkflow: null }))}
          />
        )}

        {currentView === 'organizations' && (
          <OrganizationsView 
            organizations={organizations}
            selectedOrganization={selectedOrganization}
            onSelectOrganization={selectOrganization}
            onCreateOrganization={createOrganization}
          />
        )}

        {currentView === 'roles' && (
          <RolesView 
            roles={roles}
            selectedOrganization={selectedOrganization}
            onAddMember={addMember}
          />
        )}

                {currentView === 'members' && (
          <MembersView
            organizations={organizations}
            selectedOrganization={selectedOrganization}
            onUpdateShareAllocation={updateShareAllocation}
          />
        )}
        {currentView === 'instruments' && (
          <InstrumentsView
            instruments={instruments}
            organizations={organizations}
            selectedOrganization={selectedOrganization}
            onCreateInstrument={(instrument) => {
              const newInstrument: FinancialInstrument = {
                ...instrument,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
              setAppState(prev => ({
                ...prev,
                instruments: [...prev.instruments, newInstrument]
              }))
            }}
            onDeleteInstrument={(id: string) => {
              setAppState(prev => ({
                ...prev,
                instruments: prev.instruments.filter(instrument => instrument.id !== id)
              }))
            }}
          />
        )}

        {currentView === 'integrations' && (
          <IntegrationsView />
        )}
      </div>

      {/* Demo Modal */}
      <DemoModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)} 
      />

    </div>
  )
}

// Integrations View Component
function IntegrationsView() {
  const [selectedCategory, setSelectedCategory] = useState<'crm' | 'spreadsheet' | 'cms' | 'payment' | 'communication' | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const integrations = [
    // CRM Integrations
    {
      id: '1',
      name: 'Salesforce',
      category: 'crm',
      description: 'Customer relationship management platform',
      icon: '🟦',
      status: 'connected',
      lastSync: '2 minutes ago',
      features: ['Contact Sync', 'Deal Tracking', 'Revenue Analytics']
    },
    {
      id: '2',
      name: 'HubSpot',
      category: 'crm',
      description: 'Inbound marketing and sales platform',
      icon: '🟧',
      status: 'available',
      lastSync: null,
      features: ['Lead Management', 'Email Marketing', 'Analytics']
    },
    {
      id: '3',
      name: 'Pipedrive',
      category: 'crm',
      description: 'Sales pipeline management',
      icon: '🔴',
      status: 'available',
      lastSync: null,
      features: ['Pipeline Management', 'Activity Tracking', 'Forecasting']
    },

    // Spreadsheet Integrations
    {
      id: '4',
      name: 'Google Sheets',
      category: 'spreadsheet',
      description: 'Cloud-based spreadsheet application',
      icon: '🟢',
      status: 'connected',
      lastSync: '5 minutes ago',
      features: ['Real-time Sync', 'Formula Support', 'Collaboration']
    },
    {
      id: '5',
      name: 'Microsoft Excel',
      category: 'spreadsheet',
      description: 'Desktop spreadsheet application',
      icon: '🟦',
      status: 'available',
      lastSync: null,
      features: ['Advanced Formulas', 'Data Analysis', 'Charts']
    },
    {
      id: '6',
      name: 'Airtable',
      category: 'spreadsheet',
      description: 'Database-spreadsheet hybrid',
      icon: '🟣',
      status: 'available',
      lastSync: null,
      features: ['Database Views', 'Automations', 'API Access']
    },

    // CMS Integrations
    {
      id: '7',
      name: 'WordPress',
      category: 'cms',
      description: 'Content management system',
      icon: '🔵',
      status: 'connected',
      lastSync: '1 hour ago',
      features: ['Content Sync', 'User Management', 'Plugin Support']
    },
    {
      id: '8',
      name: 'Shopify',
      category: 'cms',
      description: 'E-commerce platform',
      icon: '🟢',
      status: 'available',
      lastSync: null,
      features: ['Product Management', 'Order Processing', 'Analytics']
    },
    {
      id: '9',
      name: 'WooCommerce',
      category: 'cms',
      description: 'WordPress e-commerce plugin',
      icon: '🟠',
      status: 'available',
      lastSync: null,
      features: ['Product Catalog', 'Payment Processing', 'Inventory']
    },

    // Payment Integrations
    {
      id: '10',
      name: 'Stripe',
      category: 'payment',
      description: 'Payment processing platform',
      icon: '💳',
      status: 'connected',
      lastSync: 'Real-time',
      features: ['Payment Processing', 'Subscription Management', 'Analytics']
    },
    {
      id: '11',
      name: 'PayPal',
      category: 'payment',
      description: 'Digital payment platform',
      icon: '🔵',
      status: 'available',
      lastSync: null,
      features: ['Payment Gateway', 'Business Accounts', 'Mobile Payments']
    },
    {
      id: '12',
      name: 'Square',
      category: 'payment',
      description: 'Point of sale and payment processing',
      icon: '🟢',
      status: 'available',
      lastSync: null,
      features: ['POS System', 'Payment Processing', 'Inventory Management']
    },

    // Communication Integrations
    {
      id: '13',
      name: 'Slack',
      category: 'communication',
      description: 'Team communication platform',
      icon: '🟣',
      status: 'connected',
      lastSync: 'Real-time',
      features: ['Channel Management', 'Bot Integration', 'File Sharing']
    },
    {
      id: '14',
      name: 'Microsoft Teams',
      category: 'communication',
      description: 'Collaboration and communication platform',
      icon: '🔵',
      status: 'available',
      lastSync: null,
      features: ['Video Calls', 'File Collaboration', 'App Integration']
    },
    {
      id: '15',
      name: 'Discord',
      category: 'communication',
      description: 'Voice and text communication',
      icon: '🟣',
      status: 'available',
      lastSync: null,
      features: ['Voice Channels', 'Bot Support', 'Server Management']
    }
  ]

  const categories = [
    { id: 'all', name: 'All Integrations', icon: '🔗' },
    { id: 'crm', name: 'CRM Systems', icon: '👥' },
    { id: 'spreadsheet', name: 'Spreadsheets', icon: '📊' },
    { id: 'cms', name: 'CMS & E-commerce', icon: '🌐' },
    { id: 'payment', name: 'Payment Systems', icon: '💳' },
    { id: 'communication', name: 'Communication', icon: '💬' }
  ]

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400'
      case 'available': return 'text-blue-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 border-green-400/30'
      case 'available': return 'bg-blue-500/20 border-blue-400/30'
      case 'error': return 'bg-red-500/20 border-red-400/30'
      default: return 'bg-gray-500/20 border-gray-400/30'
    }
  }

  return (
    <div className="absolute inset-0 top-24 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
          <p className="text-gray-400">Connect your favorite tools and platforms to automate workflows and sync data</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as 'crm' | 'spreadsheet' | 'cms' | 'payment' | 'communication' | 'all')}
                className={`px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-blue-500/20 border-blue-400/50 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:border-white/30 transition-all duration-300 hover:shadow-lg hover:shadow-white/5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                    <p className="text-sm text-gray-400">{integration.description}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBg(integration.status)} ${getStatusColor(integration.status)}`}>
                  {integration.status === 'connected' ? 'Connected' : 'Available'}
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Features</h4>
                <div className="flex flex-wrap gap-1">
                  {integration.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/10 text-xs text-gray-300 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Info */}
              {integration.lastSync && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400">
                    Last sync: <span className="text-green-400">{integration.lastSync}</span>
                  </p>
                </div>
              )}

              {/* Action Button */}
              <button
                className={`w-full py-2 px-4 rounded-lg transition-all ${
                  integration.status === 'connected'
                    ? 'bg-green-500/20 text-green-400 border border-green-400/30 hover:bg-green-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-400/30 hover:bg-blue-500/30'
                }`}
              >
                {integration.status === 'connected' ? 'Manage Connection' : 'Connect'}
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold text-white mb-2">No integrations found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Workflows List View Component
function WorkflowsView({ 
  workflows, 
  selectedWorkflow, 
  onCreateWorkflow, 
  onOpenWorkflow, 
  onDeleteWorkflow,
  isMobile 
}: {
  workflows: WorkflowState[]
  selectedWorkflow: string | null
  onCreateWorkflow: (name: string, description: string) => void
  onOpenWorkflow: (workflowId: string) => void
  onDeleteWorkflow: (workflowId: string) => void
  isMobile: boolean
}) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [newWorkflowDescription, setNewWorkflowDescription] = useState('')

  const handleCreate = () => {
    if (newWorkflowName.trim()) {
      onCreateWorkflow(newWorkflowName.trim(), newWorkflowDescription.trim())
      setNewWorkflowName('')
      setNewWorkflowDescription('')
      setShowCreateModal(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'stopped': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Running'
      case 'paused': return 'Paused'
      case 'stopped': return 'Stopped'
      default: return 'Unknown'
    }
  }

  return (
    <div className="absolute inset-0 top-24 p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`font-bold text-white ${isMobile ? 'text-2xl' : 'text-3xl'} mb-2`}>
            Workflows
          </h1>
          <p className="text-gray-400">
            Manage your automated business processes and workflows
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className={`bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 ${
            isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
          }`}
        >
          <Plus className={isMobile ? "w-4 h-4" : "w-5 h-5"} />
          <span className={isMobile ? 'hidden' : ''}>Create Workflow</span>
        </button>
      </div>

      {/* Workflows Grid */}
      {workflows.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
            <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Workflows Yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first workflow to automate business processes and manage team coordination.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition-colors"
            >
              Create Your First Workflow
            </button>
          </div>
        </div>
      ) : (
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className={`bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:bg-black/60 transition-all duration-200 cursor-pointer group ${
                selectedWorkflow === workflow.id ? 'ring-2 ring-blue-400/50 bg-blue-500/10' : ''
              }`}
              onClick={() => onOpenWorkflow(workflow.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">
                    {workflow.name}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {workflow.description}
                  </p>
                </div>
                
                {/* Status Badge */}
                <div className={`flex items-center space-x-2 ml-4`}>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(workflow.workflowStatus)}`}></div>
                  <span className="text-xs text-gray-400">
                    {getStatusText(workflow.workflowStatus)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">
                    {workflow.nodes.length}
                  </div>
                  <div className="text-xs text-gray-400">Nodes</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">
                    {workflow.connections.length}
                  </div>
                  <div className="text-xs text-gray-400">Connections</div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Updated {new Date(workflow.updatedAt).toLocaleDateString()}
                </div>
                
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenWorkflow(workflow.id)
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Open Workflow"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Are you sure you want to delete this workflow?')) {
                        onDeleteWorkflow(workflow.id)
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete Workflow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-white mb-4">Create New Workflow</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  placeholder="Enter workflow name..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreate()
                    }
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newWorkflowDescription}
                  onChange={(e) => setNewWorkflowDescription(e.target.value)}
                  placeholder="Describe your workflow..."
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newWorkflowName.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
              >
                Create Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Workflow View Component
function WorkflowView({ 
  workflow, 
  boardRef, 
  onMouseMove, 
  onMouseUp, 
  onMouseDown, 
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onNodeUpdate, 
  onNodeDelete, 
  onStartConnection, 
  onCompleteConnection, 
  onDoubleClick,
  onToggleExpansion,
  getNodeIcon,
  getStatusColor,
  getConnectionColor,
  getNodePosition,
  isMobile,
  canvasScale,
  canvasOffset,
  resetCanvasView,
  setCanvasScale,
  chatMessages,
  isChatOpen,
  toggleChat,
  sendMessage,
  onBackToWorkflows
}: WorkflowViewProps & {
  chatMessages: ChatMessage[]
  isChatOpen: boolean
  toggleChat: () => void
  sendMessage: (content: string) => void
  sidebarOpen: boolean
  onBackToWorkflows: () => void
}) {
  return (
    <div className="absolute inset-0 top-24 flex flex-col">
      {/* Workflow Header */}
      <div className="absolute top-4 left-4 z-30 flex items-center space-x-3">
        <button
          onClick={onBackToWorkflows}
          className="p-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all"
          title="Back to Workflows"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
        <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2">
          <h2 className="text-white font-medium text-sm">{workflow.name}</h2>
        </div>
      </div>

      {/* Mobile Canvas Controls */}
      {isMobile && (
        <div className="absolute top-4 right-4 z-30 flex space-x-2">
          <button
            onClick={resetCanvasView}
            className="p-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCanvasScale(prev => Math.min(2, prev + 0.2))}
            className="p-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all"
            title="Zoom In"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCanvasScale(prev => Math.max(0.5, prev - 0.2))}
            className="p-2 bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg text-white hover:bg-white/10 transition-all"
            title="Zoom Out"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Canvas Area */}
      <div
        ref={boardRef}
        className={`flex-1 cursor-grab active:cursor-grabbing transition-all duration-300 ${isChatOpen ? (isMobile ? 'mb-64' : 'mb-96') : (isMobile ? 'mb-20' : 'mb-16')}`}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `scale(${canvasScale}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
          transformOrigin: '0 0'
        }}
      >
      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {workflow.connections.map((connection: Connection) => {
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
      {workflow.nodes.map((node: WorkflowNode) => (
        <div
          key={node.id}
          className={`absolute bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl cursor-move transition-all duration-300 shadow-2xl hover:shadow-white/5 group ${
            workflow.selectedNode === node.id ? 'ring-2 ring-white/30 shadow-white/10' : ''
          } ${workflow.isConnecting === node.id ? 'ring-2 ring-green-400/50 shadow-green-400/20' : ''} ${
            isMobile ? 'p-2 w-40' : 'p-4 w-60'
          }`}
          style={{
            left: node.x,
            top: node.y,
            transform: workflow.dragging === node.id ? 'scale(1.05) rotate(1deg)' : 'scale(1)',
          }}
          onMouseDown={(e) => onMouseDown(e, node.id)}
          onDoubleClick={() => onDoubleClick(node.id)}
          onClick={() => {
            if (workflow.isConnecting && workflow.isConnecting !== node.id) {
              onCompleteConnection(node.id)
            }
          }}
        >
          {/* Header with icon, status, and delete button */}
          <div className={`flex items-center justify-between ${isMobile ? 'mb-2' : 'mb-3'}`}>
            <div className="flex items-center space-x-2">
              <div className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} ${getStatusColor(node.status)} rounded-full shadow-lg`}></div>
              <div className="text-white/60">
                {getNodeIcon(node.type)}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNodeDelete(node.id)
              }}
              className={`text-gray-400 hover:text-red-400 transition-colors ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} hover:scale-110`}
            >
              <X className={isMobile ? "w-2.5 h-2.5" : "w-3 h-3"} />
            </button>
          </div>
          
          {/* Node content */}
          <div className={`space-y-${isMobile ? '1' : '2'}`}>
            <input
              type="text"
              value={node.name}
              onChange={(e) => onNodeUpdate(node.id, { name: e.target.value })}
              placeholder="Node name"
              className={`w-full bg-transparent border-none text-white font-medium focus:outline-none placeholder-gray-500 focus:placeholder-gray-400 transition-colors ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}
              onClick={(e) => e.stopPropagation()}
            />
            
            <input
              type="text"
              value={node.description}
              onChange={(e) => onNodeUpdate(node.id, { description: e.target.value })}
              placeholder="Description"
              className={`w-full bg-transparent border-none text-gray-400 focus:outline-none placeholder-gray-600 focus:placeholder-gray-500 focus:text-gray-300 transition-colors ${
                isMobile ? 'text-xs' : 'text-xs'
              }`}
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
                {node.conditions.map((condition, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            )}
            
            {node.type === 'team' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-pink-400 text-xs">
                    Team: {node.memberCount || node.assignees?.length || 0} members
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleExpansion(node.id)
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {node.isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                </div>
                
                {node.isExpanded && node.childNodes && (
                  <div className="mt-3 space-y-2">
                    {node.childNodes.map((childNode) => (
                      <div
                        key={childNode.id}
                        className="bg-white/10 rounded-lg p-2 border border-white/20"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="text-white/60">
                            {getNodeIcon(childNode.type)}
                          </div>
                          <div className="flex-1">
                            <div className="text-white text-xs font-medium">{childNode.name}</div>
                            <div className="text-gray-400 text-xs">{childNode.description}</div>
                          </div>
                          <div className={`w-2 h-2 ${getStatusColor(childNode.status)} rounded-full`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
              onStartConnection(node.id)
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

      {/* AI Chat Bar */}
      <div className={`bg-black/90 backdrop-blur-xl border-t border-white/20 transition-all duration-300 ${
        isChatOpen ? (isMobile ? 'h-64' : 'h-96') : (isMobile ? 'h-12' : 'h-16')
      }`}>
        {/* Chat Header - Entire bar is clickable */}
        <div 
          onClick={toggleChat}
          className={`flex items-center justify-between border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${
            isMobile ? 'p-2' : 'p-4'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Bot className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-blue-400`} />
            <span className={`text-white font-medium ${isMobile ? 'text-sm' : ''}`}>AI Assistant</span>
          </div>
          
          {/* Toggle Icon - Right side */}
          <div className="bg-blue-500 text-white rounded-full shadow-lg transition-all duration-200"
               style={{ padding: isMobile ? '0.375rem' : '0.5rem' }}>
            {isChatOpen ? <ChevronDown className={isMobile ? "w-3 h-3" : "w-4 h-4"} /> : <ChevronUp className={isMobile ? "w-3 h-3" : "w-4 h-4"} />}
          </div>
        </div>

        {/* Chat Messages */}
        {isChatOpen && (
          <div 
            className={`flex-1 overflow-y-auto space-y-4 ${
              isMobile ? 'p-2 max-h-48' : 'p-4 max-h-64'
            }`}
            onClick={(e) => e.stopPropagation()} // Prevent chat toggle when clicking messages
          >
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white border border-white/20'
                  } ${isMobile ? 'max-w-[80%]' : 'max-w-xs lg:max-w-md'}`}
                >
                  <p className={isMobile ? 'text-xs' : 'text-sm'}>{message.content}</p>
                  <p className={`text-xs opacity-70 mt-1 ${isMobile ? 'text-xs' : ''}`}>
                    <TimeDisplay timestamp={message.timestamp} />
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat Input */}
        <div 
          className={`border-t border-white/10 ${isMobile ? 'p-2' : 'p-4'}`}
          onClick={(e) => e.stopPropagation()} // Prevent chat toggle when clicking input area
        >
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={isMobile ? "Ask me anything..." : "Ask me to create organizations, manage workflows, or automate processes..."}
              className={`flex-1 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2'
              }`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  sendMessage(e.currentTarget.value.trim())
                  e.currentTarget.value = ''
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[placeholder*="Ask me"]') as HTMLInputElement
                if (input && input.value.trim()) {
                  sendMessage(input.value.trim())
                  input.value = ''
                }
              }}
              className={`bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors ${
                isMobile ? 'p-1.5' : 'p-2'
              }`}
            >
              <Send className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Organizations View Component
function OrganizationsView({ 
  organizations, 
  selectedOrganization, 
  onSelectOrganization, 
  onCreateOrganization 
}: OrganizationsViewProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', tokenSymbol: '' })

  const handleCreate = () => {
    if (formData.name && formData.description && formData.tokenSymbol) {
      onCreateOrganization(formData.name, formData.description, formData.tokenSymbol)
      setFormData({ name: '', description: '', tokenSymbol: '' })
      setShowCreateForm(false)
    }
  }

  return (
    <div className="absolute inset-0 top-24 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Organizations</h1>
            <p className="text-gray-300">Manage your business organizations and token allocations</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 px-6 py-3 rounded-xl flex items-center space-x-3 text-white shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Organization</span>
          </button>
        </div>

        {/* Create Organization Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-6 w-96">
              <h2 className="text-xl font-bold text-white mb-4">Create New Organization</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Organization Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Token Symbol (e.g., TECH)"
                  value={formData.tokenSymbol}
                  onChange={(e) => setFormData({ ...formData, tokenSymbol: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleCreate}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org: Organization) => (
            <div
              key={org.id}
              className={`bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-6 cursor-pointer transition-all hover:shadow-white/5 ${
                selectedOrganization === org.id ? 'ring-2 ring-blue-400 shadow-blue-400/20' : ''
              }`}
              onClick={() => onSelectOrganization(org.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">{org.name}</h3>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  org.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  org.status === 'inactive' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {org.status}
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{org.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Token:</span>
                  <span className="text-white font-medium">{org.tokenSymbol}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Members:</span>
                  <span className="text-white">{org.members.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Shares:</span>
                  <span className="text-white">{org.totalShares.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Roles View Component
function RolesView({ roles, selectedOrganization, onAddMember }: Omit<RolesViewProps, 'organizations'>) {
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({ handle: '', displayName: '' })

  const handleAddMember = () => {
    if (selectedOrganization && selectedRole && formData.handle && formData.displayName) {
      onAddMember(selectedOrganization, formData.handle, formData.displayName, selectedRole.id)
      setFormData({ handle: '', displayName: '' })
      setShowAddMemberForm(false)
    }
  }

  return (
    <div className="absolute inset-0 top-24 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Roles & Members</h1>
            <p className="text-gray-300">Define roles and add team members with HandCash handles</p>
          </div>
          {selectedOrganization && (
            <button
              onClick={() => setShowAddMemberForm(true)}
              className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 px-6 py-3 rounded-xl flex items-center space-x-3 text-white shadow-lg hover:shadow-xl"
            >
              <UserPlus className="w-5 h-5" />
              <span className="font-medium">Add Member</span>
            </button>
          )}
        </div>

        {/* Add Member Modal */}
        {showAddMemberForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-6 w-96">
              <h2 className="text-xl font-bold text-white mb-4">Add Team Member</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="HandCash Handle (e.g., @alice)"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Display Name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={selectedRole?.id || ''}
                  onChange={(e) => setSelectedRole(roles.find((r: Role) => r.id === e.target.value) || null)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {roles.map((role: Role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} - {role.defaultShareAllocation}% shares
                    </option>
                  ))}
                </select>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddMember}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Member
                  </button>
                  <button
                    onClick={() => setShowAddMemberForm(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role: Role) => (
            <div
              key={role.id}
              className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  {role.icon === 'crown' && <Crown className="w-5 h-5 text-yellow-400" />}
                  {role.icon === 'trending-up' && <TrendingUp className="w-5 h-5 text-green-400" />}
                  {role.icon === 'bar-chart-3' && <BarChart3 className="w-5 h-5 text-blue-400" />}
                  {role.icon === 'palette' && <Palette className="w-5 h-5 text-purple-400" />}
                  {role.icon === 'shield' && <Shield className="w-5 h-5 text-red-400" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{role.name}</h3>
                  <p className="text-gray-400 text-sm">{role.defaultShareAllocation}% shares</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">{role.description}</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/10 text-white text-xs rounded"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Instruments View Component
function InstrumentsView({ instruments, organizations, selectedOrganization, onCreateInstrument, onDeleteInstrument }: Omit<InstrumentsViewProps, 'onUpdateInstrument'>) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'equity' as FinancialInstrument['type'],
    symbol: '',
    description: '',
    totalSupply: 1000000,
    decimals: 18,
    blockchain: 'Bitcoin SV'
  })

  const currentOrg = organizations.find((org: Organization) => org.id === selectedOrganization)
  const orgInstruments = instruments.filter(instrument => instrument.organizationId === selectedOrganization)

  const handleCreate = () => {
    if (formData.name && formData.symbol && selectedOrganization) {
      onCreateInstrument({
        ...formData,
        organizationId: selectedOrganization,
        issuedSupply: 0,
        status: 'draft',
        metadata: {}
      })
      setFormData({
        name: '',
        type: 'equity',
        symbol: '',
        description: '',
        totalSupply: 1000000,
        decimals: 18,
        blockchain: 'Bitcoin SV'
      })
      setShowCreateForm(false)
    }
  }

  const getInstrumentTypeColor = (type: FinancialInstrument['type']) => {
    switch (type) {
      case 'equity': return 'text-green-400'
      case 'debt': return 'text-red-400'
      case 'derivative': return 'text-purple-400'
      case 'reward': return 'text-yellow-400'
      case 'utility': return 'text-blue-400'
      case 'governance': return 'text-indigo-400'
      case 'hybrid': return 'text-pink-400'
      default: return 'text-gray-400'
    }
  }

  const getInstrumentIcon = (type: FinancialInstrument['type']) => {
    switch (type) {
      case 'equity': return <TrendingUp className="w-5 h-5" />
      case 'debt': return <CreditCard className="w-5 h-5" />
      case 'derivative': return <BarChart3 className="w-5 h-5" />
      case 'reward': return <Coins className="w-5 h-5" />
      case 'utility': return <Settings className="w-5 h-5" />
      case 'governance': return <Scale className="w-5 h-5" />
      case 'hybrid': return <Circle className="w-5 h-5" />
      default: return <Circle className="w-5 h-5" />
    }
  }

  return (
    <div className="absolute inset-0 top-24 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Financial Instruments</h1>
            <p className="text-gray-300">Create and manage blockchain-based financial instruments</p>
          </div>
          {selectedOrganization && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Instrument</span>
            </button>
          )}
        </div>

        {!selectedOrganization ? (
          <div className="text-center py-12">
            <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Select an Organization</h3>
            <p className="text-gray-400">Please select an organization to view and manage its financial instruments</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Organization Summary */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Building className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{currentOrg?.name}</h3>
                  <p className="text-gray-400 text-sm">{currentOrg?.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">{orgInstruments.length}</div>
                  <div className="text-gray-400 text-sm">Total Instruments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {orgInstruments.filter(i => i.status === 'active').length}
                  </div>
                  <div className="text-gray-400 text-sm">Active</div>
                </div>
              </div>
            </div>

            {/* Instrument Cards */}
            {orgInstruments.map((instrument) => (
              <div key={instrument.id} className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-6 hover:border-white/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-white/10 ${getInstrumentTypeColor(instrument.type)}`}>
                      {getInstrumentIcon(instrument.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{instrument.name}</h3>
                      <p className="text-gray-400 text-sm">{instrument.symbol}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      instrument.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      instrument.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                      instrument.status === 'paused' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {instrument.status}
                    </span>
                    <button
                      onClick={() => onDeleteInstrument(instrument.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">{instrument.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Supply:</span>
                    <span className="text-white">{instrument.issuedSupply.toLocaleString()} / {instrument.totalSupply.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Blockchain:</span>
                    <span className="text-white">{instrument.blockchain}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Type:</span>
                    <span className={`capitalize ${getInstrumentTypeColor(instrument.type)}`}>{instrument.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Instrument Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Create New Instrument</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Employee Stock Options"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as FinancialInstrument['type'] }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="equity">Equity</option>
                    <option value="debt">Debt</option>
                    <option value="derivative">Derivative</option>
                    <option value="reward">Reward</option>
                    <option value="utility">Utility</option>
                    <option value="governance">Governance</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
                  <input
                    type="text"
                    value={formData.symbol}
                    onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., TECH-OPT"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the instrument's purpose and terms"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Supply</label>
                  <input
                    type="number"
                    value={formData.totalSupply}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalSupply: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={handleCreate}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create Instrument
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Members View Component
function MembersView({ organizations, selectedOrganization, onUpdateShareAllocation }: MembersViewProps) {
  const currentOrg = organizations.find((org: Organization) => org.id === selectedOrganization)

  return (
    <div className="absolute inset-0 top-24 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Team Members</h1>
          <p className="text-gray-300">Manage team members and share allocations</p>
        </div>

        {currentOrg ? (
          <div className="space-y-6">
            <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">{currentOrg.name} - Team Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{currentOrg.members.length}</div>
                  <div className="text-gray-400 text-sm">Total Members</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{currentOrg.totalShares.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Total Shares</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{currentOrg.tokenSymbol}</div>
                  <div className="text-gray-400 text-sm">Token Symbol</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentOrg.members.map((member: HandCashHandle) => (
                <div
                  key={member.id}
                  className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {member.displayName.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{member.handle}</h3>
                      <p className="text-gray-400 text-sm">{member.displayName}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Role:</span>
                      <span className="text-white text-sm font-medium">{member.role}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Shares:</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={member.shareAllocation}
                          onChange={(e) => onUpdateShareAllocation(currentOrg.id, member.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-white text-sm">%</span>
                      </div>
                    </div>
                    {member.tokenAddress && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Token:</span>
                        <span className="text-green-400 text-sm font-mono">{member.tokenAddress.slice(0, 8)}...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Organization Selected</h3>
            <p className="text-gray-400">Please select an organization to view its members</p>
          </div>
        )}
      </div>
    </div>
  )
}
