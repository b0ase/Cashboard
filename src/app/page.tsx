'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import WorkflowReactFlowCanvas from '@/components/WorkflowReactFlowCanvas'
import WorkflowDashboard from '@/components/WorkflowDashboard'
import { HandCashAuthButton, UserProfileCard } from '@/components/HandCashAuth'
import { useAuth } from '@/contexts/AuthContext'
import { 
  getOrganizationTemplates, 
  getRoleTemplates, 
  getAgentTemplates, 
  getInstrumentTemplates, 
  getContractTemplates, 
  getIntegrationTemplates,
  getWalletTemplates 
} from '@/data/templates'
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
  PlayCircle,
  User,
  Wallet,
  Bitcoin,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,

  Package,
  Home,
  // New icons for enhanced canvas
  PieChart,
  Monitor,
  Cog,
  Globe,
  Database,
  GitBranch,
  Link,
  Mail,
  MessageSquare,
  Bell,
  CheckSquare,
  Eye,
  Clock,
  Hash,
  Calculator,
  Shuffle,
  Layers,
  Filter,
  ArrowUpDown,
  Merge,
  Split,
  Router,
  Server,
  Code,
  Terminal,
  ShoppingCart,
  MousePointer,
  Hand,
  Trash2,
  Copy,
  Clipboard,
  Grid,

  ZoomIn,
  ZoomOut,
  UserCheck,
  Banknote,
  Plug,
  Headphones,
  Folder,
  MoreVertical,
  FolderPlus,
  FolderMinus,
  Rocket
} from 'lucide-react'
import DemoModal from '../components/DemoModal'

// EXAMPLE Business Workflow Definition
const getExampleBusinessWorkflow = () => ({
  nodes: [
    // === TOP TIER: REVENUE SOURCES (PYRAMID BASE) ===
    { id: 1, name: 'Music Track Streaming', type: 'youtube', x: 100, y: 100, handcashHandle: 'AUDEX_Streaming' },
    { id: 2, name: 'YouTube Ad Revenue', type: 'youtube', x: 300, y: 100, handcashHandle: 'AUDEX_YouTube' },
    { id: 3, name: 'Spotify Royalties', type: 'payment', x: 500, y: 100, handcashHandle: 'AUDEX_Spotify' },
    { id: 4, name: 'Platform Subscriptions', type: 'payment', x: 700, y: 100, handcashHandle: 'AUDEX_Subs' },
    { id: 5, name: 'NFT Music Sales', type: 'instrument', x: 900, y: 100, handcashHandle: 'AUDEX_NFTs' },
    
    // === SECOND TIER: REVENUE AGGREGATION ===
    { id: 10, name: 'AUDEX Revenue Pool', type: 'splitter', x: 500, y: 250, handcashHandle: 'AUDEX_Revenue' },
    
    // === THIRD TIER: CORPORATE DISTRIBUTION ===
    { id: 15, name: 'AUDEX Treasury (51%)', type: 'organization', x: 300, y: 400, handcashHandle: 'AUDEX_Treasury' },
    { id: 16, name: 'Artist Royalty Pool (35%)', type: 'member', x: 500, y: 400, handcashHandle: 'AUDEX_Artists' },
    { id: 17, name: 'Operations Reserve (10%)', type: 'workflow', x: 700, y: 400, handcashHandle: 'AUDEX_Ops' },
    { id: 18, name: 'Platform Development (4%)', type: 'trigger', x: 900, y: 400, handcashHandle: 'AUDEX_Dev' },
    
    // === FOURTH TIER: TOKEN MANAGEMENT ===
    { id: 20, name: 'AUDEX Token Contract', type: 'contract', x: 500, y: 550, handcashHandle: 'AUDEX_Tokens' },
    
    // === FIFTH TIER: DIVIDEND CALCULATION ===
    { id: 30, name: 'Quarterly Dividend Calculator', type: 'decision', x: 500, y: 700, handcashHandle: 'AUDEX_Dividends' },
    
    // === BOTTOM TIER: SHAREHOLDER DISTRIBUTION (PYRAMID TOP) ===
    { id: 21, name: 'Treasury Tokens (51%)', type: 'wallets', x: 200, y: 850, handcashHandle: 'AUDEX_Treasury_Tokens' },
    { id: 22, name: 'Public Shareholders (35%)', type: 'member', x: 400, y: 850, handcashHandle: 'AUDEX_Public' },
    { id: 23, name: 'Artist Token Holders (10%)', type: 'member', x: 600, y: 850, handcashHandle: 'AUDEX_Artist_Tokens' },
    { id: 24, name: 'Team & Advisors (4%)', type: 'role', x: 800, y: 850, handcashHandle: 'AUDEX_Team' },
    
    // === SIDE BRANCH: INDIVIDUAL TRACK ASSETS ===
    { id: 40, name: 'Track NFT #001', type: 'instrument', x: 1100, y: 250, handcashHandle: 'AUDEX_Track001' },
    { id: 41, name: 'Track Royalty Split', type: 'splitter', x: 1100, y: 400, handcashHandle: 'AUDEX_TrackSplit' },
    { id: 42, name: 'Track Shareholders', type: 'member', x: 1100, y: 550, handcashHandle: 'AUDEX_TrackHolders' },
    
    // === SIDE BRANCH: PLATFORM ASSETS ===
    { id: 50, name: 'AUDEX Platform IP', type: 'contract', x: 100, y: 550, handcashHandle: 'AUDEX_Platform' },
    { id: 51, name: 'User Database', type: 'workflow', x: 100, y: 700, handcashHandle: 'AUDEX_Users' },
    { id: 52, name: 'Music Catalog Rights', type: 'instrument', x: 100, y: 850, handcashHandle: 'AUDEX_Catalog' }
  ],
  connections: [
    // PYRAMID FLOW: Revenue sources to main pool (Tier 1 → Tier 2)
    { from: 1, to: 10, type: 'payment' },
    { from: 2, to: 10, type: 'payment' },
    { from: 3, to: 10, type: 'payment' },
    { from: 4, to: 10, type: 'payment' },
    { from: 5, to: 10, type: 'payment' },
    
    // Main pool to corporate distribution (Tier 2 → Tier 3)
    { from: 10, to: 15, type: 'payment' },
    { from: 10, to: 16, type: 'payment' },
    { from: 10, to: 17, type: 'payment' },
    { from: 10, to: 18, type: 'payment' },
    
    // Corporate distribution to token contract (Tier 3 → Tier 4)
    { from: 15, to: 20, type: 'payment' },
    { from: 16, to: 20, type: 'payment' },
    
    // Token contract to dividend calculator (Tier 4 → Tier 5)
    { from: 20, to: 30, type: 'payment' },
    
    // Dividend calculator to shareholders (Tier 5 → Tier 6)
    { from: 30, to: 21, type: 'payment' },
    { from: 30, to: 22, type: 'payment' },
    { from: 30, to: 23, type: 'payment' },
    { from: 30, to: 24, type: 'payment' },
    
    // SIDE BRANCH: Individual track flows
    { from: 1, to: 40, type: 'payment' },
    { from: 40, to: 41, type: 'payment' },
    { from: 41, to: 42, type: 'payment' },
    
    // SIDE BRANCH: Platform asset connections
    { from: 4, to: 50, type: 'payment' },
    { from: 50, to: 51, type: 'payment' },
    { from: 51, to: 52, type: 'payment' }
  ]
})

interface HandCashHandle {
  id: string
  handle: string
  displayName: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  profileImage?: string
  tokenAddress?: string
  publicAddress?: string
  shareAllocation: number
  role: string
  organizationId: string
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_started'
  kycDocuments: KYCDocument[]
  dateOfBirth?: string
  nationality?: string
  address?: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  joinedAt: string
  lastActive?: string
  status: 'active' | 'inactive' | 'pending'
}

interface KYCDocument {
  id: string
  type: 'passport' | 'drivers_license' | 'national_id' | 'utility_bill' | 'bank_statement' | 'other'
  name: string
  url?: string
  uploadedAt: string
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
}

interface Contract {
  id: string
  name: string
  type: 'employment' | 'service' | 'partnership' | 'licensing' | 'nda' | 'consulting' | 'vendor' | 'lease' | 'loan' | 'investment' | 'supply' | 'distribution' | 'franchise' | 'joint_venture' | 'merger' | 'acquisition' | 'other'
  description: string
  parties: string[]
  value?: number
  currency?: string
  startDate: string
  endDate?: string
  status: 'draft' | 'pending_review' | 'pending_signature' | 'active' | 'completed' | 'terminated' | 'expired'
  organizationId?: string
  terms: ContractTerm[]
  documents: ContractDocument[]
  createdAt: string
  updatedAt: string
  createdBy: string
  lastModifiedBy: string
  // Workflow Components
  workflowId?: string
  workflow?: {
    id: string
    name: string
    description: string
    organizations: string[] // Organization IDs involved in this contract
    roles: string[] // Role IDs assigned to this contract
    members: string[] // Member IDs participating in this contract
    instruments: string[] // Financial instrument IDs related to this contract
    integrations: ContractIntegration[]
    automations: ContractAutomation[]
    milestones: ContractMilestone[]
    notifications: ContractNotification[]
  }
}

interface ContractIntegration {
  id: string
  type: 'api' | 'webhook' | 'email' | 'sms' | 'blockchain' | 'payment' | 'document_signing' | 'crm' | 'accounting' | 'other'
  name: string
  description: string
  endpoint?: string
  apiKey?: string
  isActive: boolean
  triggerEvents: ('contract_created' | 'contract_signed' | 'milestone_reached' | 'payment_due' | 'contract_expired' | 'other')[]
  configuration: Record<string, unknown>
}

interface ContractAutomation {
  id: string
  name: string
  description: string
  trigger: {
    type: 'date' | 'milestone' | 'signature' | 'payment' | 'other'
    condition: string
    value?: string
  }
  action: {
    type: 'send_notification' | 'create_task' | 'update_status' | 'send_payment' | 'generate_document' | 'other'
    parameters: Record<string, unknown>
  }
  isActive: boolean
}

interface ContractMilestone {
  id: string
  name: string
  description: string
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  assignedTo: string[] // Member IDs
  deliverables: string[]
  paymentAmount?: number
  currency?: string
}

interface ContractNotification {
  id: string
  type: 'email' | 'sms' | 'in_app' | 'webhook'
  recipients: string[] // Member IDs or email addresses
  subject: string
  message: string
  triggerEvent: string
  isActive: boolean
}

interface ContractTerm {
  id: string
  title: string
  content: string
  category: 'payment' | 'delivery' | 'performance' | 'termination' | 'liability' | 'intellectual_property' | 'confidentiality' | 'dispute_resolution' | 'other'
  isRequired: boolean
  order: number
}

interface ContractDocument {
  id: string
  name: string
  type: 'contract' | 'amendment' | 'addendum' | 'exhibit' | 'signature_page' | 'other'
  url?: string
  uploadedAt: string
  uploadedBy: string
  version: number
  isActive: boolean
}

interface ContractsViewProps {
  organizations: Organization[]
  selectedOrganization: string | null
  roles?: Role[]
  instruments?: FinancialInstrument[]
  workflows?: WorkflowState[]
  onCreateContract?: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>) => void
}

interface Wallet {
  id: string
  name: string
  type: 'bitcoin' | 'ethereum' | 'bsv' | 'handcash' | 'metamask' | 'hardware' | 'paper' | 'multi_sig' | 'other'
  address: string
  balance: number
  currency: string
  isActive: boolean
  organizationId?: string
  description?: string
  publicKey?: string
  encryptedPrivateKey?: string
  derivationPath?: string
  network: 'mainnet' | 'testnet' | 'regtest'
  transactions: WalletTransaction[]
  metadata: {
    isWatchOnly?: boolean
    isMultiSig?: boolean
    requiredSignatures?: number
    totalSigners?: number
    hdWallet?: boolean
    seedPhrase?: boolean
    hardware?: {
      device: string
      model: string
    }
  }
  createdAt: string
  updatedAt: string
  lastSyncAt?: string
}

interface WalletTransaction {
  id: string
  txHash: string
  type: 'incoming' | 'outgoing' | 'internal'
  amount: number
  currency: string
  fromAddress?: string
  toAddress?: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
  blockHeight?: number
  timestamp: string
  fee?: number
  description?: string
  tags?: string[]
}

interface WalletsViewProps {
  organizations: Organization[]
  selectedOrganization: string | null
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
  automationType?: 'ai-agent' | 'workflow' | 'hybrid'
  isAutomated?: boolean
  workflowId?: string | null
  aiPrompt?: string
  organizationId?: string
}

interface WorkflowNode {
  id: string
  type: 'payment' | 'contract' | 'task' | 'decision' | 'milestone' | 'team' | 'kpi' | 'employee' | 'deliverable' | 'asset' | 'mint' | 'payroll' | 'production' | 'marketing' | 'sales' | 'legal' | 'finance' | 'hr' | 'it' | 'operations' | 'api' | 'database' | 'loop' | 'condition' | 'trigger' | 'webhook' | 'email' | 'sms' | 'notification' | 'approval' | 'review' | 'timer' | 'counter' | 'calculator' | 'transformer' | 'validator' | 'aggregator' | 'filter' | 'sorter' | 'merger' | 'splitter' | 'gateway' | 'service' | 'function' | 'script' | 'organization' | 'role' | 'member' | 'instrument' | 'integration' | 'switch' | 'router' | 'delay' | 'queue' | 'batch' | 'parallel' | 'sequence' | 'retry' | 'ai-agent' | 'instagram' | 'snapchat' | 'threads' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube' | 'discord' | 'telegram' | 'whatsapp' | 'reddit' | 'voice' | 'elevenlabs' | 'midjourney' | 'veo3' | 'openai' | 'anthropic' | 'stability' | 'runway' | 'replicate' | 'huggingface' | 'cohere' | 'perplexity' | 'salesforce' | 'hubspot' | 'pipedrive' | 'googlesheets' | 'excel' | 'airtable' | 'notion' | 'stripe' | 'paypal' | 'square' | 'slack' | 'teams' | 'zoom' | 'wallets' | 'workflow' | 'contact'
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
  // Business entity references
  organizationRef?: string  // ID of linked organization
  roleRef?: string         // ID of linked role
  memberRef?: string       // ID of linked member
  instrumentRef?: string   // ID of linked instrument
  integrationRef?: string  // ID of linked integration
  contractRef?: string     // ID of linked contract
  walletRef?: string       // ID of linked wallet
  workflowRef?: string     // ID of linked workflow
  childNodes?: WorkflowNode[]
  memberCount?: number
  width?: number
  height?: number
  isSelected?: boolean
}

interface Connection {
  id: string
  from: string
  to: string
  type: 'success' | 'failure' | 'conditional' | 'payment' | 'task'
  condition?: string
  amount?: number
}

interface CanvasTool {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  shortcut?: string
  active?: boolean
}

interface WorkflowState {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  connections: Connection[]
  selectedNode: string | null
  selectedNodes: string[]
  isConnecting: string | null
  dragging: string | null
  workflowStatus: 'running' | 'paused' | 'stopped'
  autoMode: boolean
  createdAt: string
  updatedAt: string
  organizationId?: string
  currentTool: 'select' | 'pan' | 'connect' | 'delete' | 'zoom'
  clipboard: WorkflowNode[]
  gridSnap: boolean
  showGrid: boolean
  folder?: string  // Simple folder name
}

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  status: 'sending' | 'sent' | 'error'
}

interface AppState {
  currentView: 'dashboard' | 'workflow' | 'organizations' | 'roles' | 'people' | 'instruments' | 'contracts' | 'wallets' | 'security' | 'integrations' | 'agents' | 'settings' | 'profile' | 'billing' | 'market' | 'launchpad'
  selectedOrganization: string | null
  selectedPerson: HandCashHandle | null
  sidebarOpen: boolean
  isMobile: boolean
  organizations: Organization[]
  roles: Role[]
  workflows: WorkflowState[]
  folders: string[]
  selectedWorkflow: string | null
  chatMessages: ChatMessage[]
  isChatOpen: boolean
  instruments: FinancialInstrument[]
  contracts: Contract[]
  wallets: Wallet[]
  securityProducts: SecurityProduct[]
  apiKeys: ApiKey[]
  sshKeys: SshKey[]
  mcpServers: McpServer[]
  userProfile: UserProfile
}

interface ApiKey {
  id: string
  name: string
  key: string
  permissions: string[]
  createdAt: string
  lastUsed?: string
  isActive: boolean
}

interface SshKey {
  id: string
  name: string
  publicKey: string
  fingerprint: string
  createdAt: string
  lastUsed?: string
  isActive: boolean
}

interface McpServer {
  id: string
  name: string
  url: string
  description: string
  isActive: boolean
  createdAt: string
}

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    notifications: boolean
    autoSave: boolean
  }
  createdAt: string
  updatedAt: string
}

interface WorkflowViewProps {
  workflow: WorkflowState
  boardRef: React.RefObject<HTMLDivElement | null>
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onMouseDown: (e: React.MouseEvent, id?: string) => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: () => void
  onNodeUpdate: (id: string, updates: Partial<WorkflowNode>) => void
  onNodeDelete: (id: string) => void
  onNodesDelete: (ids: string[]) => void
  onNodesCopy: (ids: string[]) => void
  onNodesPaste: (position?: { x: number; y: number }) => void
  onStartConnection: (fromId: string) => void
  onCompleteConnection: (toId: string) => void
  onDoubleClick: (id: string) => void
  onToggleExpansion: (nodeId: string) => void
  onToolChange: (tool: WorkflowState['currentTool']) => void
  onSelectionChange: (nodeIds: string[]) => void
  onAddNode: (type: WorkflowNode['type'], position: { x: number; y: number }) => void
  getNodeIcon: (type: string) => React.ReactNode
  getStatusColor: (status: string) => string
  getConnectionColor: (type: string) => string
  getNodePosition: (id: string) => WorkflowNode | undefined
  isMobile: boolean
  canvasScale: number
  canvasOffset: { x: number; y: number }
  resetCanvasView: () => void
  setCanvasScale: (scale: number | ((prev: number) => number)) => void
  setCanvasOffset: (offset: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void
}

interface OrganizationsViewProps {
  organizations: Organization[]
  selectedOrganization: string | null
  onSelectOrganization: (orgId: string) => void
  onDeselectOrganization: () => void
  onCreateOrganization: (name: string, description: string, tokenSymbol: string) => void
}

interface RolesViewProps {
  roles: Role[]
  organizations: Organization[]
  selectedOrganization: string | null
  onAddMember: (organizationId: string, handle: string, displayName: string, roleId: string) => void
  onCreateRole: (name: string, description: string, icon: string, permissions: string[], defaultShareAllocation: number, automationType: 'ai-agent' | 'workflow' | 'hybrid') => void
  onUpdateRole: (roleId: string, updates: Partial<Role>) => void
  onDeleteRole: (roleId: string) => void
}

interface PeopleViewProps {
  organizations: Organization[]
  selectedOrganization: string | null
  onUpdateShareAllocation: (organizationId: string, personId: string, shares: number) => void
}

interface FinancialInstrument {
  id: string
  name: string
  type: 'equity' | 'debt' | 'derivative' | 'reward' | 'utility' | 'governance' | 'hybrid'
  symbol: string
  description: string
  organizationId?: string
  workflowId?: string
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
    customWorkflow?: boolean
    workflowDescription?: string
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
  onSelectOrganization: (orgId: string) => void
  onDeselectOrganization: () => void
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



function DashboardContentInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Handle HandCash redirect - if authToken is present, redirect to callback
  useEffect(() => {
    const authToken = searchParams.get('authToken')
    if (authToken) {
      // Redirect to callback page with the authToken
      router.push(`/auth/handcash/callback?authToken=${authToken}`)
    }
  }, [searchParams, router])

  const [appState, setAppState] = useState<AppState>({
    currentView: 'dashboard',
    selectedOrganization: null,
    selectedPerson: null,
    sidebarOpen: true,
    organizations: [
      {
        id: '1',
        name: 'TechCorp Inc.',
        description: 'Innovative technology solutions',
        tokenSymbol: 'TECH',
        totalShares: 1000000,
        members: [
          {
            id: '1',
            handle: '$alice_dev',
            displayName: 'Alice Johnson',
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice@techcorp.com',
            phone: '+1-555-0123',
            profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
            publicAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            shareAllocation: 25,
            role: 'CEO',
            organizationId: '1',
            kycStatus: 'approved',
            kycDocuments: [
              {
                id: '1',
                type: 'passport',
                name: 'Passport - Alice Johnson',
                uploadedAt: '2024-01-10T10:00:00Z',
                status: 'approved',
                notes: 'Valid passport, identity verified'
              },
              {
                id: '2',
                type: 'utility_bill',
                name: 'Utility Bill - January 2024',
                uploadedAt: '2024-01-10T10:05:00Z',
                status: 'approved'
              }
            ],
            dateOfBirth: '1985-06-15',
            nationality: 'United States',
            address: {
              street: '123 Tech Street',
              city: 'San Francisco',
              state: 'CA',
              country: 'United States',
              postalCode: '94105'
            },
            joinedAt: '2024-01-01T00:00:00Z',
            lastActive: '2024-01-20T15:30:00Z',
            status: 'active'
          },
          {
            id: '2',
            handle: '$bob_tech',
            displayName: 'Bob Smith',
            firstName: 'Bob',
            lastName: 'Smith',
            email: 'bob@techcorp.com',
            phone: '+1-555-0124',
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            publicAddress: '3FUpjxWpEGqW4gZWBEyKVFiZqvs2g3x4kJ',
            shareAllocation: 20,
            role: 'Tech Lead AI Agent',
            organizationId: '1',
            kycStatus: 'pending',
            kycDocuments: [
              {
                id: '3',
                type: 'drivers_license',
                name: 'Drivers License - Bob Smith',
                uploadedAt: '2024-01-15T14:00:00Z',
                status: 'pending',
                notes: 'Under review'
              }
            ],
            dateOfBirth: '1990-03-22',
            nationality: 'Canada',
            address: {
              street: '456 Innovation Ave',
              city: 'Toronto',
              state: 'ON',
              country: 'Canada',
              postalCode: 'M5V 3A8'
            },
            joinedAt: '2024-01-05T00:00:00Z',
            lastActive: '2024-01-19T09:15:00Z',
            status: 'active'
          },
          {
            id: '3',
            handle: '$sarah_marketing',
            displayName: 'Sarah Wilson',
            firstName: 'Sarah',
            lastName: 'Wilson',
            email: 'sarah@techcorp.com',
            phone: '+1-555-0125',
            profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            publicAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
            shareAllocation: 15,
            role: 'Marketing AI Agent',
            organizationId: '1',
            kycStatus: 'approved',
            kycDocuments: [
              {
                id: '4',
                type: 'national_id',
                name: 'National ID - Sarah Wilson',
                uploadedAt: '2024-01-08T16:30:00Z',
                status: 'approved'
              },
              {
                id: '5',
                type: 'bank_statement',
                name: 'Bank Statement - December 2023',
                uploadedAt: '2024-01-08T16:35:00Z',
                status: 'approved'
              }
            ],
            dateOfBirth: '1988-11-08',
            nationality: 'United Kingdom',
            address: {
              street: '789 Marketing Blvd',
              city: 'London',
              state: 'England',
              country: 'United Kingdom',
              postalCode: 'SW1A 1AA'
            },
            joinedAt: '2024-01-03T00:00:00Z',
            lastActive: '2024-01-20T11:45:00Z',
            status: 'active'
          },
          {
            id: '4',
            handle: '$mike_finance',
            displayName: 'Mike Chen',
            firstName: 'Mike',
            lastName: 'Chen',
            email: 'mike@techcorp.com',
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            publicAddress: '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo',
            shareAllocation: 18,
            role: 'Finance AI Agent',
            organizationId: '1',
            kycStatus: 'not_started',
            kycDocuments: [],
            dateOfBirth: '1992-07-12',
            nationality: 'Singapore',
            joinedAt: '2024-01-10T00:00:00Z',
            lastActive: '2024-01-18T13:20:00Z',
            status: 'pending'
          }
        ],
        createdAt: '2024-01-01',
        status: 'active'
      }
    ],
    roles: [
      // === C-SUITE EXECUTIVES ===
      { 
        id: '1', 
        name: 'CEO', 
        description: 'Chief Executive Officer - Strategic leadership and decision making', 
        icon: 'crown', 
        permissions: ['admin', 'finance', 'operations'], 
        defaultShareAllocation: 25,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '11', 
        name: 'CFO', 
        description: 'Chief Financial Officer - Financial planning, analysis, and strategic financial management', 
        icon: 'bar-chart-3', 
        permissions: ['admin', 'finance', 'data-analysis'], 
        defaultShareAllocation: 22,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '12', 
        name: 'COO', 
        description: 'Chief Operating Officer - Operations management, process optimization, and execution', 
        icon: 'settings', 
        permissions: ['admin', 'operations', 'workflow-creation'], 
        defaultShareAllocation: 20,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '9', 
        name: 'CTO', 
        description: 'Chief Technology Officer - Technology strategy, architecture, and innovation leadership', 
        icon: 'code', 
        permissions: ['admin', 'tech', 'workflow-creation'], 
        defaultShareAllocation: 20,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '10', 
        name: 'CMO', 
        description: 'Chief Marketing Officer - Marketing strategy, brand management, and growth initiatives', 
        icon: 'trending-up', 
        permissions: ['admin', 'marketing', 'data-analysis'], 
        defaultShareAllocation: 18,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '13', 
        name: 'CHRO', 
        description: 'Chief Human Resources Officer - People strategy, culture, and organizational development', 
        icon: 'users', 
        permissions: ['admin', 'operations'], 
        defaultShareAllocation: 12,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '17', 
        name: 'General Counsel', 
        description: 'Chief Legal Officer - Legal strategy, compliance, risk management, and corporate governance', 
        icon: 'shield', 
        permissions: ['admin', 'legal'], 
        defaultShareAllocation: 14,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '18', 
        name: 'Head of Data', 
        description: 'Chief Data Officer - Data strategy, analytics, and business intelligence leadership', 
        icon: 'bar-chart-3', 
        permissions: ['data-analysis', 'tech', 'workflow-creation'], 
        defaultShareAllocation: 13,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '19', 
        name: 'Head of Security', 
        description: 'Chief Security Officer - Information security, risk assessment, and cybersecurity strategy', 
        icon: 'shield', 
        permissions: ['tech', 'admin', 'operations'], 
        defaultShareAllocation: 11,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '50', 
        name: 'Chief Innovation Officer', 
        description: 'Chief Innovation Officer - Innovation strategy, emerging technologies, and digital transformation', 
        icon: 'lightbulb', 
        permissions: ['admin', 'tech', 'workflow-creation'], 
        defaultShareAllocation: 15,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '51', 
        name: 'Chief Revenue Officer', 
        description: 'Chief Revenue Officer - Revenue strategy, growth optimization, and market expansion', 
        icon: 'trending-up', 
        permissions: ['admin', 'marketing', 'data-analysis'], 
        defaultShareAllocation: 17,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '52', 
        name: 'Chief Strategy Officer', 
        description: 'Chief Strategy Officer - Corporate strategy, business development, and strategic planning', 
        icon: 'target', 
        permissions: ['admin', 'data-analysis', 'workflow-creation'], 
        defaultShareAllocation: 14,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },

      // === VICE PRESIDENTS ===
      { 
        id: '14', 
        name: 'VP of Sales', 
        description: 'Vice President of Sales - Sales strategy, team leadership, and revenue generation', 
        icon: 'trending-up', 
        permissions: ['marketing', 'data-analysis'], 
        defaultShareAllocation: 16,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '15', 
        name: 'VP of Engineering', 
        description: 'Vice President of Engineering - Engineering leadership, technical delivery, and team management', 
        icon: 'code', 
        permissions: ['tech', 'workflow-creation', 'operations'], 
        defaultShareAllocation: 18,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '16', 
        name: 'VP of Product', 
        description: 'Vice President of Product - Product strategy, roadmap, and user experience leadership', 
        icon: 'zap', 
        permissions: ['workflow-creation', 'data-analysis', 'marketing'], 
        defaultShareAllocation: 15,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '53', 
        name: 'VP of Operations', 
        description: 'Vice President of Operations - Operational excellence, process improvement, and efficiency optimization', 
        icon: 'settings', 
        permissions: ['operations', 'workflow-creation', 'data-analysis'], 
        defaultShareAllocation: 14,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '54', 
        name: 'VP of Finance', 
        description: 'Vice President of Finance - Financial operations, planning, and analysis', 
        icon: 'bar-chart-3', 
        permissions: ['finance', 'data-analysis', 'admin'], 
        defaultShareAllocation: 13,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '55', 
        name: 'VP of Marketing', 
        description: 'Vice President of Marketing - Marketing operations, campaigns, and brand management', 
        icon: 'trending-up', 
        permissions: ['marketing', 'data-analysis', 'workflow-creation'], 
        defaultShareAllocation: 13,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '56', 
        name: 'VP of Human Resources', 
        description: 'Vice President of Human Resources - Talent management, culture, and employee experience', 
        icon: 'users', 
        permissions: ['operations', 'admin'], 
        defaultShareAllocation: 11,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '57', 
        name: 'VP of Business Development', 
        description: 'Vice President of Business Development - Partnerships, strategic alliances, and growth initiatives', 
        icon: 'handshake', 
        permissions: ['marketing', 'data-analysis', 'admin'], 
        defaultShareAllocation: 12,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },

      // === DIRECTORS ===
      { 
        id: '6', 
        name: 'Creative Director', 
        description: 'Content creation, brand management, and creative strategy', 
        icon: 'palette', 
        permissions: ['marketing', 'workflow-creation'], 
        defaultShareAllocation: 15,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '58', 
        name: 'Director of Engineering', 
        description: 'Engineering team leadership, technical architecture, and development processes', 
        icon: 'code', 
        permissions: ['tech', 'workflow-creation'], 
        defaultShareAllocation: 12,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '59', 
        name: 'Director of Product Management', 
        description: 'Product strategy, roadmap planning, and cross-functional coordination', 
        icon: 'zap', 
        permissions: ['workflow-creation', 'data-analysis'], 
        defaultShareAllocation: 11,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '60', 
        name: 'Director of Sales', 
        description: 'Sales team management, revenue optimization, and customer acquisition', 
        icon: 'trending-up', 
        permissions: ['marketing', 'data-analysis'], 
        defaultShareAllocation: 10,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '61', 
        name: 'Director of Marketing', 
        description: 'Marketing campaigns, digital strategy, and brand positioning', 
        icon: 'megaphone', 
        permissions: ['marketing', 'data-analysis'], 
        defaultShareAllocation: 9,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '62', 
        name: 'Director of Operations', 
        description: 'Operational processes, efficiency optimization, and resource management', 
        icon: 'settings', 
        permissions: ['operations', 'workflow-creation'], 
        defaultShareAllocation: 9,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '63', 
        name: 'Director of Finance', 
        description: 'Financial planning, budgeting, and financial operations management', 
        icon: 'bar-chart-3', 
        permissions: ['finance', 'data-analysis'], 
        defaultShareAllocation: 8,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '64', 
        name: 'Director of IT', 
        description: 'Information technology infrastructure, systems management, and technical support', 
        icon: 'server', 
        permissions: ['tech', 'operations'], 
        defaultShareAllocation: 8,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '65', 
        name: 'Director of Quality Assurance', 
        description: 'Quality control, testing processes, and product reliability', 
        icon: 'check-circle', 
        permissions: ['tech', 'operations'], 
        defaultShareAllocation: 7,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '66', 
        name: 'Director of Customer Experience', 
        description: 'Customer journey optimization, satisfaction improvement, and experience design', 
        icon: 'smile', 
        permissions: ['marketing', 'data-analysis'], 
        defaultShareAllocation: 8,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },

      // === MANAGERS ===
      { 
        id: '2', 
        name: 'Marketing Manager', 
        description: 'Marketing campaigns, social media management, and customer engagement', 
        icon: 'trending-up', 
        permissions: ['marketing', 'data-analysis'], 
        defaultShareAllocation: 15,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '3', 
        name: 'Finance Manager', 
        description: 'Financial analysis, budget tracking, and reporting', 
        icon: 'bar-chart-3', 
        permissions: ['finance', 'admin', 'data-analysis'], 
        defaultShareAllocation: 20,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '5', 
        name: 'Operations Manager', 
        description: 'Process management, workflow optimization, and operational efficiency', 
        icon: 'settings', 
        permissions: ['operations', 'workflow-creation'], 
        defaultShareAllocation: 12,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '8', 
        name: 'Customer Success Manager', 
        description: 'Customer support, relationship management, and satisfaction monitoring', 
        icon: 'users', 
        permissions: ['marketing', 'data-analysis'], 
        defaultShareAllocation: 10,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '20', 
        name: 'Head of Customer Success', 
        description: 'Customer Success Leadership - Customer retention, satisfaction, and growth strategies', 
        icon: 'users', 
        permissions: ['marketing', 'data-analysis', 'operations'], 
        defaultShareAllocation: 10,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '67', 
        name: 'Project Manager', 
        description: 'Project coordination, timeline management, and cross-team collaboration', 
        icon: 'calendar', 
        permissions: ['operations', 'workflow-creation'], 
        defaultShareAllocation: 6,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '68', 
        name: 'Product Manager', 
        description: 'Product development, feature planning, and market research', 
        icon: 'box', 
        permissions: ['workflow-creation', 'data-analysis'], 
        defaultShareAllocation: 7,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '69', 
        name: 'Sales Manager', 
        description: 'Sales team coordination, pipeline management, and revenue tracking', 
        icon: 'target', 
        permissions: ['marketing', 'data-analysis'], 
        defaultShareAllocation: 7,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '70', 
        name: 'HR Manager', 
        description: 'Human resources operations, recruitment, and employee relations', 
        icon: 'users', 
        permissions: ['operations', 'admin'], 
        defaultShareAllocation: 6,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '71', 
        name: 'IT Manager', 
        description: 'IT infrastructure management, system administration, and technical support', 
        icon: 'server', 
        permissions: ['tech', 'operations'], 
        defaultShareAllocation: 6,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '72', 
        name: 'Content Manager', 
        description: 'Content creation, editorial oversight, and digital asset management', 
        icon: 'file-text', 
        permissions: ['marketing', 'workflow-creation'], 
        defaultShareAllocation: 5,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '73', 
        name: 'Community Manager', 
        description: 'Community engagement, social media management, and brand advocacy', 
        icon: 'message-circle', 
        permissions: ['marketing'], 
        defaultShareAllocation: 4,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '74', 
        name: 'Account Manager', 
        description: 'Client relationship management, account growth, and customer retention', 
        icon: 'briefcase', 
        permissions: ['marketing', 'data-analysis'], 
        defaultShareAllocation: 5,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },

      // === TECHNICAL LEADS ===
      { 
        id: '4', 
        name: 'Tech Lead', 
        description: 'Code review, technical documentation, and development workflows', 
        icon: 'code', 
        permissions: ['tech', 'workflow-creation'], 
        defaultShareAllocation: 25,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '75', 
        name: 'Senior Software Engineer', 
        description: 'Software development, code architecture, and technical mentorship', 
        icon: 'code', 
        permissions: ['tech', 'workflow-creation'], 
        defaultShareAllocation: 8,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '76', 
        name: 'DevOps Lead', 
        description: 'Infrastructure automation, deployment pipelines, and system reliability', 
        icon: 'server', 
        permissions: ['tech', 'operations'], 
        defaultShareAllocation: 7,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '77', 
        name: 'Data Engineer', 
        description: 'Data pipeline development, ETL processes, and data infrastructure', 
        icon: 'database', 
        permissions: ['tech', 'data-analysis'], 
        defaultShareAllocation: 6,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '78', 
        name: 'Security Engineer', 
        description: 'Cybersecurity implementation, vulnerability assessment, and security protocols', 
        icon: 'shield', 
        permissions: ['tech', 'admin'], 
        defaultShareAllocation: 6,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '79', 
        name: 'Frontend Lead', 
        description: 'Frontend development, UI/UX implementation, and user interface optimization', 
        icon: 'monitor', 
        permissions: ['tech', 'workflow-creation'], 
        defaultShareAllocation: 6,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '80', 
        name: 'Backend Lead', 
        description: 'Backend development, API design, and server-side architecture', 
        icon: 'server', 
        permissions: ['tech', 'workflow-creation'], 
        defaultShareAllocation: 6,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '81', 
        name: 'Mobile Lead', 
        description: 'Mobile application development, cross-platform solutions, and mobile UX', 
        icon: 'smartphone', 
        permissions: ['tech', 'workflow-creation'], 
        defaultShareAllocation: 6,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },

      // === SPECIALISTS ===
      { 
        id: '7', 
        name: 'Legal Counsel', 
        description: 'Contract analysis, compliance monitoring, and legal documentation', 
        icon: 'shield', 
        permissions: ['legal', 'admin', 'data-analysis'], 
        defaultShareAllocation: 18,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '82', 
        name: 'Data Scientist', 
        description: 'Data analysis, machine learning, and predictive modeling', 
        icon: 'bar-chart-3', 
        permissions: ['data-analysis', 'tech'], 
        defaultShareAllocation: 7,
        automationType: 'hybrid',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '83', 
        name: 'Business Analyst', 
        description: 'Business process analysis, requirements gathering, and process optimization', 
        icon: 'trending-up', 
        permissions: ['data-analysis', 'operations'], 
        defaultShareAllocation: 5,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '84', 
        name: 'UX Designer', 
        description: 'User experience design, usability testing, and interaction design', 
        icon: 'paintbrush', 
        permissions: ['workflow-creation', 'marketing'], 
        defaultShareAllocation: 5,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '85', 
        name: 'UI Designer', 
        description: 'User interface design, visual design, and design system development', 
        icon: 'palette', 
        permissions: ['workflow-creation', 'marketing'], 
        defaultShareAllocation: 5,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '86', 
        name: 'Digital Marketing Specialist', 
        description: 'SEO, SEM, social media marketing, and digital advertising', 
        icon: 'megaphone', 
        permissions: ['marketing', 'data-analysis'], 
        defaultShareAllocation: 4,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '87', 
        name: 'Content Strategist', 
        description: 'Content planning, editorial strategy, and content marketing', 
        icon: 'file-text', 
        permissions: ['marketing', 'workflow-creation'], 
        defaultShareAllocation: 4,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '88', 
        name: 'Compliance Officer', 
        description: 'Regulatory compliance, risk assessment, and policy enforcement', 
        icon: 'check-circle', 
        permissions: ['legal', 'admin'], 
        defaultShareAllocation: 5,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '89', 
        name: 'Financial Analyst', 
        description: 'Financial modeling, investment analysis, and financial reporting', 
        icon: 'calculator', 
        permissions: ['finance', 'data-analysis'], 
        defaultShareAllocation: 5,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '90', 
        name: 'Market Research Analyst', 
        description: 'Market analysis, competitive research, and consumer insights', 
        icon: 'search', 
        permissions: ['marketing', 'data-analysis'], 
        defaultShareAllocation: 4,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '91', 
        name: 'Training Specialist', 
        description: 'Employee training, skill development, and learning program management', 
        icon: 'book', 
        permissions: ['operations'], 
        defaultShareAllocation: 3,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '92', 
        name: 'Procurement Specialist', 
        description: 'Vendor management, contract negotiation, and supply chain optimization', 
        icon: 'shopping-cart', 
        permissions: ['operations', 'finance'], 
        defaultShareAllocation: 3,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '93', 
        name: 'Quality Assurance Engineer', 
        description: 'Software testing, quality control, and bug tracking', 
        icon: 'check-circle', 
        permissions: ['tech', 'operations'], 
        defaultShareAllocation: 4,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '94', 
        name: 'Technical Writer', 
        description: 'Technical documentation, user manuals, and API documentation', 
        icon: 'file-text', 
        permissions: ['tech', 'workflow-creation'], 
        defaultShareAllocation: 3,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '95', 
        name: 'Customer Support Specialist', 
        description: 'Customer service, technical support, and issue resolution', 
        icon: 'headphones', 
        permissions: ['marketing'], 
        defaultShareAllocation: 3,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },

      // === COORDINATORS & ASSISTANTS ===
      { 
        id: '96', 
        name: 'Executive Assistant', 
        description: 'Executive support, calendar management, and administrative coordination', 
        icon: 'calendar', 
        permissions: ['admin'], 
        defaultShareAllocation: 2,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '97', 
        name: 'Administrative Coordinator', 
        description: 'Administrative tasks, office management, and operational support', 
        icon: 'folder', 
        permissions: ['operations'], 
        defaultShareAllocation: 2,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '98', 
        name: 'Marketing Coordinator', 
        description: 'Marketing campaign support, event coordination, and promotional activities', 
        icon: 'calendar', 
        permissions: ['marketing'], 
        defaultShareAllocation: 2,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '99', 
        name: 'Sales Coordinator', 
        description: 'Sales support, lead management, and customer onboarding', 
        icon: 'users', 
        permissions: ['marketing'], 
        defaultShareAllocation: 2,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      },
      { 
        id: '100', 
        name: 'Research Assistant', 
        description: 'Research support, data collection, and analysis assistance', 
        icon: 'search', 
        permissions: ['data-analysis'], 
        defaultShareAllocation: 2,
        automationType: 'workflow',
        isAutomated: false,
        workflowId: null,
        organizationId: '1'
      }
    ],
    folders: [],
    workflows: [
      {
        id: '1',
        name: 'Example Organisation Workflow: AUDEX',
        description: 'Complete AUDEX Corporation organizational structure with 100 nodes covering executive leadership, technology divisions, business operations, partnerships, and revenue streams',
        nodes: [
          { id: 'n1', type: 'youtube', name: 'YouTube Ad Revenue', description: 'AdSense receipts for AUDEX channel', x: 100, y: 120, status: 'active', connections: [], metadata: { mediaType: 'channel', channelId: 'UCxxxxxxxxxxxxxxxx' } },
          { id: 'n2', type: 'splitter', name: 'Split 70/20/10', description: 'Revenue allocation', x: 380, y: 120, status: 'active', connections: [], metadata: { percentages: { royaltyPool: 70, ops: 20, reserve: 10 } } },
          { id: 'n3', type: 'payment', name: 'Royalty Pool (70%)', description: 'Funds allocated to royalties', x: 680, y: 120, status: 'pending', connections: [], metadata: { amount: '70%' } },
          { id: 'n4', type: 'payment', name: 'Dividend Distributor', description: 'Weekly pro‑rata to AUDEX', x: 980, y: 120, status: 'pending', connections: [], metadata: { tokenSymbol: 'AUDEX', schedule: 'weekly' } },
          { id: 'n5', type: 'member', name: 'Shareholders', description: 'AUDEX holders (pro‑rata)', x: 1280, y: 120, status: 'active', connections: [], metadata: { holders: ['Alice 15%', 'Bob 25%', 'Charlie 20%', 'Diana 40%'] } },
          { id: 'n6', type: 'payment', name: 'Ops (20%)', description: 'Operating budget', x: 680, y: 240, status: 'pending', connections: [], metadata: { amount: '20%' } },
          { id: 'n7', type: 'payment', name: 'Reserve (10%)', description: 'Safety reserve', x: 680, y: 320, status: 'pending', connections: [], metadata: { amount: '10%' } }
        ],
        connections: [
          { id: 'c1', from: 'n1', to: 'n2', type: 'payment' },
          { id: 'c2', from: 'n2', to: 'n3', type: 'payment', amount: 70 },
          { id: 'c3', from: 'n2', to: 'n6', type: 'payment', amount: 20 },
          { id: 'c4', from: 'n2', to: 'n7', type: 'payment', amount: 10 },
          { id: 'c5', from: 'n3', to: 'n4', type: 'payment' },
          { id: 'c6', from: 'n4', to: 'n5', type: 'payment' }
        ],
        selectedNode: null,
        selectedNodes: [],
        isConnecting: null,
        dragging: null,
        workflowStatus: 'paused',
        autoMode: true,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        organizationId: '1',
        currentTool: 'select',
        clipboard: [],
        gridSnap: true,
        showGrid: true
      },
      {
        id: '2',
        name: 'AUDEX Music Corporation Workflow',
        description: 'Complete music streaming and royalty distribution workflow with YouTube revenue, Spotify royalties, NFT sales, and artist distribution',
        nodes: [
          { id: 'n1', type: 'youtube', name: 'Music Track Streaming', description: 'Streaming revenue from music platforms', x: 100, y: 100, status: 'active', connections: [], metadata: { mediaType: 'music', platform: 'streaming' } },
          { id: 'n2', type: 'youtube', name: 'YouTube Ad Revenue', description: 'AdSense receipts for music videos', x: 300, y: 100, status: 'active', connections: [], metadata: { mediaType: 'video', platform: 'youtube' } },
          { id: 'n3', type: 'payment', name: 'Spotify Royalties', description: 'Royalty payments from Spotify', x: 500, y: 100, status: 'active', connections: [], metadata: { platform: 'spotify', royaltyType: 'streaming' } },
          { id: 'n4', type: 'payment', name: 'Platform Subscriptions', description: 'Premium subscription revenue', x: 700, y: 100, status: 'active', connections: [], metadata: { platform: 'subscription', tier: 'premium' } },
          { id: 'n5', type: 'instrument', name: 'NFT Music Sales', description: 'NFT sales of music tracks', x: 900, y: 100, status: 'active', connections: [], metadata: { type: 'nft', asset: 'music' } },
          { id: 'n6', type: 'splitter', name: 'AUDEX Revenue Pool', description: 'Central revenue distribution hub', x: 500, y: 250, status: 'active', connections: [], metadata: { distribution: 'centralized' } },
          { id: 'n7', type: 'organization', name: 'AUDEX Treasury (51%)', description: 'Corporate treasury allocation', x: 300, y: 400, status: 'active', connections: [], metadata: { allocation: '51%', purpose: 'treasury' } },
          { id: 'n8', type: 'member', name: 'Artist Royalty Pool (35%)', description: 'Artist royalty distribution', x: 500, y: 400, status: 'active', connections: [], metadata: { allocation: '35%', purpose: 'artists' } },
          { id: 'n9', type: 'workflow', name: 'Operations Reserve (10%)', description: 'Operational expenses fund', x: 700, y: 400, status: 'active', connections: [], metadata: { allocation: '10%', purpose: 'operations' } },
          { id: 'n10', type: 'trigger', name: 'Platform Development (4%)', description: 'Platform development fund', x: 900, y: 400, status: 'active', connections: [], metadata: { allocation: '4%', purpose: 'development' } }
        ],
        connections: [
          { id: 'c1', from: 'n1', to: 'n6', type: 'payment' },
          { id: 'c2', from: 'n2', to: 'n6', type: 'payment' },
          { id: 'c3', from: 'n3', to: 'n6', type: 'payment' },
          { id: 'c4', from: 'n4', to: 'n6', type: 'payment' },
          { id: 'c5', from: 'n5', to: 'n6', type: 'payment' },
          { id: 'c6', from: 'n6', to: 'n7', type: 'payment', amount: 51 },
          { id: 'c7', from: 'n6', to: 'n8', type: 'payment', amount: 35 },
          { id: 'c8', from: 'n6', to: 'n9', type: 'payment', amount: 10 },
          { id: 'c9', from: 'n6', to: 'n10', type: 'payment', amount: 4 }
        ],
        selectedNode: null,
        selectedNodes: [],
        isConnecting: null,
        dragging: null,
        workflowStatus: 'paused',
        autoMode: true,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        organizationId: '1',
        currentTool: 'select',
        clipboard: [],
        gridSnap: true,
        showGrid: true
      },
      {
        id: '3',
        name: 'DeFi Lending Protocol Workflow',
        description: 'Decentralized lending and borrowing workflow with collateral management, liquidation engine, and governance',
        nodes: [
          { id: 'n1', type: 'wallet', name: 'User Collateral', description: 'User deposited collateral assets', x: 100, y: 100, status: 'active', connections: [], metadata: { type: 'collateral', asset: 'crypto' } },
          { id: 'n2', type: 'integration', name: 'Collateral Oracle', description: 'Price feed for collateral valuation', x: 300, y: 100, status: 'active', connections: [], metadata: { type: 'oracle', provider: 'chainlink' } },
          { id: 'n3', type: 'workflow', name: 'Liquidation Engine', description: 'Automated liquidation system', x: 500, y: 100, status: 'active', connections: [], metadata: { type: 'automation', purpose: 'liquidation' } },
          { id: 'n4', type: 'contract', name: 'Interest Rate Model', description: 'Dynamic interest rate calculation', x: 700, y: 100, status: 'active', connections: [], metadata: { type: 'smart-contract', model: 'dynamic' } },
          { id: 'n5', type: 'organization', name: 'Lending Pool', description: 'Central lending pool contract', x: 500, y: 250, status: 'active', connections: [], metadata: { type: 'pool', purpose: 'lending' } },
          { id: 'n6', type: 'member', name: 'Borrower', description: 'User borrowing assets', x: 300, y: 400, status: 'active', connections: [], metadata: { type: 'user', role: 'borrower' } },
          { id: 'n7', type: 'member', name: 'Lender', description: 'User providing liquidity', x: 700, y: 400, status: 'active', connections: [], metadata: { type: 'user', role: 'lender' } },
          { id: 'n8', type: 'instrument', name: 'Governance Token', description: 'Protocol governance token', x: 500, y: 550, status: 'active', connections: [], metadata: { type: 'token', purpose: 'governance' } }
        ],
        connections: [
          { id: 'c1', from: 'n1', to: 'n2', type: 'data' },
          { id: 'c2', from: 'n2', to: 'n3', type: 'data' },
          { id: 'c3', from: 'n2', to: 'n4', type: 'data' },
          { id: 'c4', from: 'n3', to: 'n5', type: 'control' },
          { id: 'c5', from: 'n4', to: 'n5', type: 'control' },
          { id: 'c6', from: 'n5', to: 'n6', type: 'payment' },
          { id: 'c7', from: 'n5', to: 'n7', type: 'payment' },
          { id: 'c8', from: 'n5', to: 'n8', type: 'control' }
        ],
        selectedNode: null,
        selectedNodes: [],
        isConnecting: null,
        dragging: null,
        workflowStatus: 'paused',
        autoMode: true,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        organizationId: '1',
        currentTool: 'select',
        clipboard: [],
        gridSnap: true,
        showGrid: true
      },
      {
        id: '4',
        name: 'Supply Chain Management Workflow',
        description: 'End-to-end supply chain tracking and management workflow with blockchain verification',
        nodes: [
          { id: 'n1', type: 'organization', name: 'Raw Materials Supplier', description: 'Initial raw materials provider', x: 100, y: 100, status: 'active', connections: [], metadata: { type: 'supplier', tier: '1' } },
          { id: 'n2', type: 'workflow', name: 'Manufacturing Plant', description: 'Production and assembly facility', x: 300, y: 100, status: 'active', connections: [], metadata: { type: 'facility', purpose: 'manufacturing' } },
          { id: 'n3', type: 'assessment', name: 'Quality Control', description: 'Quality assurance and testing', x: 500, y: 100, status: 'active', connections: [], metadata: { type: 'qa', standard: 'iso9001' } },
          { id: 'n4', type: 'organization', name: 'Warehouse', description: 'Storage and inventory management', x: 700, y: 100, status: 'active', connections: [], metadata: { type: 'facility', purpose: 'storage' } },
          { id: 'n5', type: 'workflow', name: 'Distribution Center', description: 'Logistics and shipping hub', x: 900, y: 100, status: 'active', connections: [], metadata: { type: 'facility', purpose: 'distribution' } },
          { id: 'n6', type: 'organization', name: 'Retail Store', description: 'Final point of sale', x: 500, y: 250, status: 'active', connections: [], metadata: { type: 'facility', purpose: 'retail' } },
          { id: 'n7', type: 'member', name: 'Customer', description: 'End consumer', x: 500, y: 400, status: 'active', connections: [], metadata: { type: 'user', role: 'consumer' } },
          { id: 'n8', type: 'integration', name: 'Blockchain Tracker', description: 'Supply chain verification system', x: 500, y: 550, status: 'active', connections: [], metadata: { type: 'blockchain', purpose: 'tracking' } }
        ],
        connections: [
          { id: 'c1', from: 'n1', to: 'n2', type: 'material' },
          { id: 'c2', from: 'n2', to: 'n3', type: 'product' },
          { id: 'c3', from: 'n3', to: 'n4', type: 'product' },
          { id: 'c4', from: 'n4', to: 'n5', type: 'product' },
          { id: 'c5', from: 'n5', to: 'n6', type: 'product' },
          { id: 'c6', from: 'n6', to: 'n7', type: 'product' },
          { id: 'c7', from: 'n1', to: 'n8', type: 'data' },
          { id: 'c8', from: 'n2', to: 'n8', type: 'data' },
          { id: 'c9', from: 'n3', to: 'n8', type: 'data' },
          { id: 'c10', from: 'n4', to: 'n8', type: 'data' },
          { id: 'c11', from: 'n5', to: 'n8', type: 'data' },
          { id: 'c12', from: 'n6', to: 'n8', type: 'data' },
          { id: 'c13', from: 'n7', to: 'n8', type: 'data' }
        ],
        selectedNode: null,
        selectedNodes: [],
        isConnecting: null,
        dragging: null,
        workflowStatus: 'paused',
        autoMode: true,
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20',
        organizationId: '1',
        currentTool: 'select',
        clipboard: [],
        gridSnap: true,
        showGrid: true
