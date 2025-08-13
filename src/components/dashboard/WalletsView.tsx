'use client'

import React, { useState, useEffect } from 'react'
import { Plus, X, Grid, Bitcoin, Coins, DollarSign, Wallet, Shield, FileText, Users, ArrowUpRight, ArrowDownLeft, RefreshCw, Settings, Building2, Zap, Link, Eye, EyeOff, TrendingUp, AlertCircle, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import type { Organization, Wallet as WalletType, WalletsViewProps } from '@/types/dashboard'

export default function WalletsView({ organizations, selectedOrganization }: WalletsViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'wallets' | 'builder' | 'integrations'>('overview')
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [showWalletBuilder, setShowWalletBuilder] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null)
  const [showWalletDetail, setShowWalletDetail] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showBalances, setShowBalances] = useState(true)

  // Sample data - in real app this would come from API/context
  const wallets: WalletType[] = [
    { 
      id: '1', 
      name: 'Treasury Wallet', 
      type: 'bitcoin', 
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 
      balance: 12.5, 
      currency: 'BTC', 
      isActive: true, 
      organizationId: '1', 
      description: 'Main corporate treasury wallet for reserves and large transactions', 
      network: 'mainnet', 
      transactions: [], 
      metadata: { isWatchOnly: false, isMultiSig: true, requiredSignatures: 2, totalSigners: 3 }, 
      createdAt: '2024-01-01T00:00:00Z', 
      updatedAt: '2024-01-20T10:30:00Z', 
      lastSyncAt: '2024-01-20T16:00:00Z' 
    },
    { 
      id: '2', 
      name: 'HandCash Operations', 
      type: 'handcash', 
      address: '$techcorp', 
      balance: 2500.0, 
      currency: 'BSV', 
      isActive: true, 
      organizationId: '1', 
      description: 'HandCash wallet for daily operations and microtransactions', 
      network: 'mainnet', 
      transactions: [], 
      metadata: { isWatchOnly: false, hdWallet: true }, 
      createdAt: '2024-01-05T00:00:00Z', 
      updatedAt: '2024-01-19T12:00:00Z', 
      lastSyncAt: '2024-01-20T16:00:00Z' 
    },
    { 
      id: '3', 
      name: 'Ethereum DeFi', 
      type: 'ethereum', 
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 
      balance: 45.2, 
      currency: 'ETH', 
      isActive: true, 
      organizationId: '1', 
      description: 'Ethereum wallet for DeFi operations and yield farming', 
      network: 'mainnet', 
      transactions: [], 
      metadata: { isWatchOnly: false, hdWallet: true }, 
      createdAt: '2024-01-10T00:00:00Z', 
      updatedAt: '2024-01-20T14:00:00Z', 
      lastSyncAt: '2024-01-20T16:00:00Z' 
    },
    { 
      id: '4', 
      name: 'Cold Storage', 
      type: 'hardware', 
      address: 'Hardware Wallet', 
      balance: 8.75, 
      currency: 'BTC', 
      isActive: true, 
      organizationId: '1', 
      description: 'Hardware wallet for long-term cold storage', 
      network: 'mainnet', 
      transactions: [], 
      metadata: { isWatchOnly: true, hardware: { device: 'Ledger', model: 'Nano X' } }, 
      createdAt: '2024-01-15T00:00:00Z', 
      updatedAt: '2024-01-20T16:00:00Z', 
      lastSyncAt: '2024-01-20T16:00:00Z' 
    }
  ]

  const filteredWallets = selectedOrganization 
    ? wallets.filter(wallet => wallet.organizationId === selectedOrganization)
    : wallets

  const getWalletTypeIcon = (type: WalletType['type']) => {
    switch (type) {
      case 'bitcoin': return <Bitcoin className="w-5 h-5" />
      case 'ethereum': return <Coins className="w-5 h-5" />
      case 'bsv': return <Bitcoin className="w-5 h-5" />
      case 'handcash': return <DollarSign className="w-5 h-5" />
      case 'metamask': return <Wallet className="w-5 h-5" />
      case 'hardware': return <Shield className="w-5 h-5" />
      case 'paper': return <FileText className="w-5 h-5" />
      case 'multi_sig': return <Users className="w-5 h-5" />
      default: return <Wallet className="w-5 h-5" />
    }
  }

  const getWalletTypeColor = (type: WalletType['type']) => {
    switch (type) {
      case 'bitcoin': return 'text-orange-400'
      case 'ethereum': return 'text-blue-400'
      case 'bsv': return 'text-yellow-400'
      case 'handcash': return 'text-green-400'
      case 'metamask': return 'text-orange-500'
      case 'hardware': return 'text-purple-400'
      case 'paper': return 'text-gray-400'
      case 'multi_sig': return 'text-indigo-400'
      default: return 'text-gray-400'
    }
  }

  const formatBalance = (balance: number, currency: string) => {
    return `${balance.toLocaleString()} ${currency}`
  }

  const truncateAddress = (address: string) => {
    if (address.startsWith('$')) return address
    if (address.startsWith('0x')) return `${address.slice(0, 6)}...${address.slice(-4)}`
    if (address.length <= 16) return address
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  const getUSDValue = (balance: number, currency: string) => {
    const rates = {
      'BTC': 45000,
      'ETH': 2500,
      'BSV': 50,
      'USD': 1
    }
    return balance * (rates[currency as keyof typeof rates] || 0)
  }

  const totalBalance = filteredWallets.reduce((sum, wallet) => {
    return sum + getUSDValue(wallet.balance, wallet.currency)
  }, 0)

  const refreshBalances = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Balance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Portfolio Value</h3>
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="text-blue-400 hover:text-blue-300"
            >
              {showBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {showBalances ? `$${totalBalance.toLocaleString()}` : '••••••'}
          </div>
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            +12.5% this month
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Active Wallets</h3>
          <div className="text-3xl font-bold text-white mb-2">{filteredWallets.length}</div>
          <div className="text-green-400 text-sm">All wallets operational</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Last Sync</h3>
          <div className="text-3xl font-bold text-white mb-2">2 min ago</div>
          <div className="text-orange-400 text-sm">Real-time updates</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-black/40 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg p-4 text-center transition-colors">
            <Plus className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-white font-medium">Add Wallet</div>
          </button>
          <button className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg p-4 text-center transition-colors">
            <Zap className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-white font-medium">Send Payment</div>
          </button>
          <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg p-4 text-center transition-colors">
            <Link className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-white font-medium">Connect Wallet</div>
          </button>
          <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg p-4 text-center transition-colors">
            <Settings className="w-8 h-8 mx-auto mb-2 text-orange-400" />
            <div className="text-white font-medium">Settings</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-black/40 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {filteredWallets.slice(0, 3).map(wallet => (
            <div key={wallet.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white/10 ${getWalletTypeColor(wallet.type)}`}>
                  {getWalletTypeIcon(wallet.type)}
                </div>
                <div>
                  <div className="text-white font-medium">{wallet.name}</div>
                  <div className="text-gray-400 text-sm">{truncateAddress(wallet.address)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{formatBalance(wallet.balance, wallet.currency)}</div>
                <div className="text-gray-400 text-sm">${getUSDValue(wallet.balance, wallet.currency).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderWallets = () => (
    <div className="space-y-6">
      {/* Wallet List */}
      <div className="bg-black/40 border border-white/20 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Organization Wallets</h3>
            <button
              onClick={refreshBalances}
              disabled={isRefreshing}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-white/20">
          {filteredWallets.map(wallet => (
            <div key={wallet.id} className="p-6 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-white/10 ${getWalletTypeColor(wallet.type)}`}>
                    {getWalletTypeIcon(wallet.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-semibold text-white">{wallet.name}</h4>
                      {wallet.metadata.isMultiSig && (
                        <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                          Multi-Sig
                        </span>
                      )}
                      {wallet.metadata.isWatchOnly && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                          Watch Only
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{wallet.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{truncateAddress(wallet.address)}</span>
                      <span>•</span>
                      <span className="capitalize">{wallet.network}</span>
                      <span>•</span>
                      <span>Last sync: {new Date(wallet.lastSyncAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatBalance(wallet.balance, wallet.currency)}
                  </div>
                  <div className="text-gray-400">
                    ${getUSDValue(wallet.balance, wallet.currency).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">View Details</button>
                    <button className="text-green-400 hover:text-green-300 text-sm">Send</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBuilder = () => (
    <div className="space-y-6">
      <div className="bg-black/40 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Wallet Builder</h3>
        <p className="text-gray-400 mb-6">Create custom wallet integrations and automation workflows</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/20 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-3">Custom Wallet Integration</h4>
            <p className="text-gray-400 text-sm mb-4">Build custom wallet connectors for any blockchain or service</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
              Start Building
            </button>
          </div>
          
          <div className="bg-white/5 border border-white/20 rounded-lg p-4">
            <h4 className="text-lg font-medium text-white mb-3">Automation Workflows</h4>
            <p className="text-gray-400 text-sm mb-4">Create automated wallet operations and triggers</p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
              Create Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="bg-black/40 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Wallet Integrations</h3>
        <p className="text-gray-400 mb-6">Connect external wallets and services</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/20 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-white font-medium mb-2">HandCash</h4>
            <p className="text-gray-400 text-sm mb-3">Connect your HandCash wallet</p>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
              Connect
            </button>
          </div>
          
          <div className="bg-white/5 border border-white/20 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-6 h-6 text-orange-400" />
            </div>
            <h4 className="text-white font-medium mb-2">MetaMask</h4>
            <p className="text-gray-400 text-sm mb-3">Connect your MetaMask wallet</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
              Connect
            </button>
          </div>
          
          <div className="bg-white/5 border border-white/20 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-white font-medium mb-2">Hardware Wallets</h4>
            <p className="text-gray-400 text-sm mb-3">Connect Ledger, Trezor, etc.</p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="absolute inset-0 top-24 overflow-y-auto px-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Wallets</h1>
          <p className="text-gray-300">Manage cryptocurrency wallets, track balances, and build integrations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshBalances}
            disabled={isRefreshing}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateWallet(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Wallet</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 p-1 bg-black/60 backdrop-blur-xl rounded-xl border border-white/20">
        {[
          { id: 'overview', label: 'Overview', icon: Grid },
          { id: 'wallets', label: 'Wallets', icon: Wallet },
          { id: 'builder', label: 'Builder', icon: Zap },
          { id: 'integrations', label: 'Integrations', icon: Link }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'wallets' && renderWallets()}
      {activeTab === 'builder' && renderBuilder()}
      {activeTab === 'integrations' && renderIntegrations()}
    </div>
  )
}
