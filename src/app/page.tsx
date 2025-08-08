'use client'

import { useState, useRef } from 'react'
import { X, DollarSign, FileText, CheckCircle, AlertTriangle, Zap, Users, Target, ArrowRight, Play, Pause, Settings, Building2, UserPlus, Menu, Plus, Crown, TrendingUp, Shield, Palette, BarChart3 } from 'lucide-react'

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
  type: 'payment' | 'contract' | 'task' | 'decision' | 'milestone' | 'team'
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
  nodes: WorkflowNode[]
  connections: Connection[]
  selectedNode: string | null
  isConnecting: string | null
  dragging: string | null
  workflowStatus: 'running' | 'paused' | 'stopped'
  autoMode: boolean
}

interface AppState {
  currentView: 'workflow' | 'organizations' | 'roles' | 'members'
  selectedOrganization: string | null
  sidebarOpen: boolean
  organizations: Organization[]
  roles: Role[]
  workflow: WorkflowState
}

interface WorkflowViewProps {
  workflow: WorkflowState
  boardRef: React.RefObject<HTMLDivElement | null>
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onMouseDown: (e: React.MouseEvent, id: string) => void
  onNodeUpdate: (id: string, updates: Partial<WorkflowNode>) => void
  onNodeDelete: (id: string) => void
  onStartConnection: (fromId: string) => void
  onCompleteConnection: (toId: string) => void
  onDoubleClick: (id: string) => void
  getNodeIcon: (type: string) => React.ReactNode
  getStatusColor: (status: string) => string
  getConnectionColor: (type: string) => string
  getNodePosition: (id: string) => WorkflowNode | undefined
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
    workflow: {
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
    autoMode: true
  }
  })

  const { workflow, organizations, roles, currentView, selectedOrganization, sidebarOpen } = appState

  const boardRef = useRef<HTMLDivElement>(null)

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="w-4 h-4" />
      case 'contract': return <FileText className="w-4 h-4" />
      case 'task': return <Target className="w-4 h-4" />
      case 'decision': return <AlertTriangle className="w-4 h-4" />
      case 'milestone': return <CheckCircle className="w-4 h-4" />
      case 'team': return <Users className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
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
      workflow: {
        ...prev.workflow,
        nodes: [...prev.workflow.nodes, newNode],
        selectedNode: newNode.id
      }
    }))
  }

  const updateNode = (id: string, updates: Partial<WorkflowNode>) => {
    setAppState(prev => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        nodes: prev.workflow.nodes.map(node => 
          node.id === id ? { ...node, ...updates } : node
        )
      }
    }))
  }

  const deleteNode = (id: string) => {
    setAppState(prev => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        nodes: prev.workflow.nodes.filter(n => n.id !== id),
        connections: prev.workflow.connections.filter(c => c.from !== id && c.to !== id),
        selectedNode: prev.workflow.selectedNode === id ? null : prev.workflow.selectedNode
      }
    }))
  }

  const startConnection = (fromId: string) => {
    setAppState(prev => ({ 
      ...prev, 
      workflow: { ...prev.workflow, isConnecting: fromId } 
    }))
  }

  const completeConnection = (toId: string) => {
    if (workflow.isConnecting && workflow.isConnecting !== toId) {
      const newConnection: Connection = {
        id: `${workflow.isConnecting}-${toId}`,
        from: workflow.isConnecting,
        to: toId,
        type: 'task'
      }
      setAppState(prev => ({
        ...prev,
        workflow: {
          ...prev.workflow,
          connections: [...prev.workflow.connections, newConnection],
          isConnecting: null
        }
      }))
    } else {
      setAppState(prev => ({ 
        ...prev, 
        workflow: { ...prev.workflow, isConnecting: null } 
      }))
    }
  }

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    setAppState(prev => ({ 
      ...prev, 
      workflow: { ...prev.workflow, dragging: id, selectedNode: id } 
    }))
    e.stopPropagation()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (workflow.dragging && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      updateNode(workflow.dragging, { x, y })
    }
  }

  const handleMouseUp = () => {
    setAppState(prev => ({ 
      ...prev, 
      workflow: { ...prev.workflow, dragging: null } 
    }))
  }

  const getNodePosition = (id: string) => {
    return workflow.nodes.find(n => n.id === id)
  }

  const toggleWorkflowStatus = () => {
    setAppState(prev => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        workflowStatus: prev.workflow.workflowStatus === 'running' ? 'paused' : 'running'
      }
    }))
  }

  const toggleAutoMode = () => {
    setAppState(prev => ({ 
      ...prev, 
      workflow: { ...prev.workflow, autoMode: !prev.workflow.autoMode } 
    }))
  }

  const advanceWorkflow = () => {
    setAppState(prev => ({
      ...prev,
      workflow: {
        ...prev.workflow,
        nodes: prev.workflow.nodes.map(node => {
          if (node.status === 'pending') {
            return { ...node, status: 'active' }
          } else if (node.status === 'active') {
            return { ...node, status: 'completed' }
          }
          return node
        })
      }
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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/20 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.01),transparent_50%)]"></div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="absolute left-0 top-0 h-full w-64 bg-black/80 backdrop-blur-xl border-r border-white/20 z-30">
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
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3">
                <h1 className="text-2xl font-bold text-white tracking-wider font-mono">CASHBOARD</h1>
              </div>
            {currentView === 'workflow' && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleWorkflowStatus}
                  className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    workflow.workflowStatus === 'running' 
                      ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
                  }`}
                >
                  {workflow.workflowStatus === 'running' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  <span className="text-sm font-medium">{workflow.workflowStatus === 'running' ? 'Running' : 'Paused'}</span>
                </button>
                <button
                  onClick={toggleAutoMode}
                  className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    workflow.autoMode 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Auto</span>
                </button>
                <button
                  onClick={advanceWorkflow}
                  className="px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          {currentView === 'workflow' && (
            <div className="flex items-center space-x-2">
              <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-2">
                <div className="flex items-center space-x-1">
                  <button onClick={() => addNode('payment')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                  </button>
                  <button onClick={() => addNode('contract')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </button>
                  <button onClick={() => addNode('task')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Target className="w-4 h-4 text-green-400" />
                  </button>
                  <button onClick={() => addNode('decision')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <AlertTriangle className="w-4 h-4 text-purple-400" />
                  </button>
                  <button onClick={() => addNode('milestone')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <CheckCircle className="w-4 h-4 text-indigo-400" />
                  </button>
                  <button onClick={() => addNode('team')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Users className="w-4 h-4 text-pink-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
                  </div>
        </div>

        {/* Content Views */}
        {currentView === 'workflow' && (
          <WorkflowView 
            workflow={workflow}
            boardRef={boardRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onNodeUpdate={updateNode}
            onNodeDelete={deleteNode}
            onStartConnection={startConnection}
            onCompleteConnection={completeConnection}
            onDoubleClick={(id: string) => setAppState(prev => ({ 
              ...prev, 
              workflow: { ...prev.workflow, selectedNode: id } 
            }))}
            getNodeIcon={getNodeIcon}
            getStatusColor={getStatusColor}
            getConnectionColor={getConnectionColor}
            getNodePosition={getNodePosition}
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
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <div className="flex items-center space-x-4">
              <span>View: {currentView}</span>
              {currentView === 'workflow' && (
                <>
                  <span>Nodes: {workflow.nodes.length}</span>
                  <span>Connections: {workflow.connections.length}</span>
                  <span>Status: {workflow.workflowStatus}</span>
                </>
              )}
              {currentView === 'organizations' && (
                <span>Organizations: {organizations.length}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {currentView === 'workflow' && (
                <>
                  <span>Auto Mode: {workflow.autoMode ? 'ON' : 'OFF'}</span>
                  <Settings className="w-4 h-4" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
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
  onNodeUpdate, 
  onNodeDelete, 
  onStartConnection, 
  onCompleteConnection, 
  onDoubleClick,
  getNodeIcon,
  getStatusColor,
  getConnectionColor,
  getNodePosition
}: WorkflowViewProps) {
  return (
    <div
      ref={boardRef}
      className="absolute inset-0 top-24 cursor-grab active:cursor-grabbing"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
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
          className={`absolute bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl p-4 w-60 cursor-move transition-all duration-300 shadow-2xl hover:shadow-white/5 group ${
            workflow.selectedNode === node.id ? 'ring-2 ring-white/30 shadow-white/10' : ''
          } ${workflow.isConnecting === node.id ? 'ring-2 ring-green-400/50 shadow-green-400/20' : ''}`}
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 ${getStatusColor(node.status)} rounded-full shadow-lg`}></div>
              <div className="text-white/60">
                {getNodeIcon(node.type)}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNodeDelete(node.id)
              }}
              className="text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 hover:scale-110"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          
          {/* Node content */}
          <div className="space-y-2">
            <input
              type="text"
              value={node.name}
              onChange={(e) => onNodeUpdate(node.id, { name: e.target.value })}
              placeholder="Node name"
              className="w-full bg-transparent border-none text-white text-sm font-medium focus:outline-none placeholder-gray-500 focus:placeholder-gray-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            />
            
            <input
              type="text"
              value={node.description}
              onChange={(e) => onNodeUpdate(node.id, { description: e.target.value })}
              placeholder="Description"
              className="w-full bg-transparent border-none text-gray-400 text-xs focus:outline-none placeholder-gray-600 focus:placeholder-gray-500 focus:text-gray-300 transition-colors"
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
