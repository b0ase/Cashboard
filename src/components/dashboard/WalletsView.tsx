'use client'

import React, { useState } from 'react'
import { Plus, X, Grid, Bitcoin, Coins, DollarSign, Wallet, Shield, FileText, Users, ArrowUpRight, ArrowDownLeft, RefreshCw, Settings } from 'lucide-react'
import type { Organization, Wallet as WalletType, WalletsViewProps } from '@/types/dashboard'
import { getWalletTemplates } from '@/data/templates'

export default function WalletsView({ organizations, selectedOrganization }: WalletsViewProps) {
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [showWalletTemplates, setShowWalletTemplates] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null)
  const [showWalletDetail, setShowWalletDetail] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [walletFormData, setWalletFormData] = useState({
    name: '',
    type: 'bitcoin' as WalletType['type'],
    address: '',
    description: '',
    network: 'mainnet' as WalletType['network']
  })

  const walletTemplates = getWalletTemplates()

  const wallets: WalletType[] = [
    { id: '1', name: 'Company Bitcoin Wallet', type: 'bitcoin', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', balance: 2.5, currency: 'BTC', isActive: true, organizationId: '1', description: 'Main corporate Bitcoin wallet for payments and reserves', network: 'mainnet', transactions: [], metadata: {}, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-20T10:30:00Z', lastSyncAt: '2024-01-20T16:00:00Z' },
    { id: '2', name: 'HandCash Corporate', type: 'handcash', address: '$techcorp', balance: 1000.0, currency: 'BSV', isActive: true, organizationId: '1', description: 'HandCash wallet for BSV transactions and microtransactions', network: 'mainnet', transactions: [], metadata: {}, createdAt: '2024-01-05T00:00:00Z', updatedAt: '2024-01-19T12:00:00Z', lastSyncAt: '2024-01-20T16:00:00Z' },
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
    if (address.length <= 16) return address
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  const totalBalance = filteredWallets.reduce((sum, wallet) => {
    const usdValue = wallet.currency === 'BTC' ? wallet.balance * 45000 :
                    wallet.currency === 'ETH' ? wallet.balance * 2500 :
                    wallet.currency === 'BSV' ? wallet.balance * 50 : 0
    return sum + usdValue
  }, 0)

  return (
    <div className="absolute inset-0 top-24 overflow-y-auto px-6 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Wallets</h1>
            <p className="text-gray-300">Manage cryptocurrency wallets and track balances</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowWalletTemplates(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-colors shadow-lg"
            >
              <Grid className="w-5 h-5" />
              <span className="font-medium">Browse Templates</span>
            </button>
            <button
              onClick={() => setShowCreateWallet(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Wallet</span>
            </button>
          </div>
        </div>
    </div>
  )
}
