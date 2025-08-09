import { Plus, Building2, Users, DollarSign, MoreVertical } from 'lucide-react'

// Mock data for demonstration
const mockOrganizations = [
  {
    id: '1',
    name: 'Tech Team',
    description: 'Development and engineering team',
    memberCount: 8,
    totalBalance: 15000,
    cashHandles: ['@alex', '@sarah', '@mike', '@david', '@emma', '@james', '@lisa', '@tom'],
  },
  {
    id: '2',
    name: 'Design Team',
    description: 'UI/UX and creative design team',
    memberCount: 4,
    totalBalance: 8500,
    cashHandles: ['@sarah', '@anna', '@chris', '@maria'],
  },
  {
    id: '3',
    name: 'Product Team',
    description: 'Product management and strategy',
    memberCount: 3,
    totalBalance: 12000,
    cashHandles: ['@mike', '@rachel', '@steve'],
  },
]

export default function OrganizationsPage() {
  return (
    <div className="min-h-screen p-6 overflow-y-auto overflow-x-hidden w-full">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Organizations</h1>
            <p className="text-gray-300">Group and manage cash handles by organization</p>
          </div>
          <button className="glass-button px-6 py-3 rounded-lg flex items-center space-x-2 text-white font-medium">
            <Plus className="w-5 h-5" />
            <span>Create Organization</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Organizations</p>
                <p className="text-2xl font-bold text-white">{mockOrganizations.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Members</p>
                <p className="text-2xl font-bold text-white">
                  {mockOrganizations.reduce((sum, org) => sum + org.memberCount, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Balance</p>
                <p className="text-2xl font-bold text-white">
                  ${mockOrganizations.reduce((sum, org) => sum + org.totalBalance, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Organizations List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockOrganizations.map((org) => (
            <div key={org.id} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{org.name}</h3>
                    <p className="text-gray-400">{org.description}</p>
                  </div>
                </div>
                <button className="glass-button p-2 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Members</p>
                  <p className="text-lg font-semibold text-white">{org.memberCount}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Total Balance</p>
                  <p className="text-lg font-semibold text-green-400">${org.totalBalance.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Cash Handles</p>
                <div className="flex flex-wrap gap-2">
                  {org.cashHandles.map((handle, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 text-sm text-white rounded-full"
                    >
                      {handle}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {mockOrganizations.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No organizations yet</h3>
            <p className="text-gray-400 mb-6">Create your first organization to group cash handles</p>
            <button className="glass-button px-6 py-3 rounded-lg text-white font-medium">
              Create Organization
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 