'use client'

import React, { useState } from 'react'
import { Plus, X, FileText } from 'lucide-react'
import type { Organization, HandCashHandle, KYCDocument, PeopleViewProps } from '@/types/dashboard'

export default function PeopleView({ organizations, selectedOrganization, onUpdateShareAllocation }: PeopleViewProps) {
  const [selectedMember, setSelectedMember] = useState<HandCashHandle | null>(null)
  const [showMemberProfile, setShowMemberProfile] = useState(false)
  const [editingMember, setEditingMember] = useState<HandCashHandle | null>(null)
  const [showKYCUpload, setShowKYCUpload] = useState(false)
  const [showCreateMemberForm, setShowCreateMemberForm] = useState(false)
  const [showMemberTemplates, setShowMemberTemplates] = useState(false)
  const [selectedMemberCategory, setSelectedMemberCategory] = useState('All')
  const [memberFormData, setMemberFormData] = useState({
    handle: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: '',
    publicAddress: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    memberType: 'employee' as 'employee' | 'customer' | 'supplier' | 'contractor' | 'advisor' | 'investor' | 'partner' | 'other',
    organizationId: selectedOrganization || ''
  })
  const [newKYCDoc, setNewKYCDoc] = useState({
    type: 'passport' as KYCDocument['type'],
    name: '',
    notes: ''
  })

  const currentOrg = organizations.find((org: Organization) => org.id === selectedOrganization)

  const openMemberProfile = (member: HandCashHandle) => {
    setSelectedMember(member)
    setEditingMember({ ...member })
    setShowMemberProfile(true)
  }

  const getKYCStatusColor = (status: HandCashHandle['kycStatus']) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'not_started': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusColor = (status: HandCashHandle['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'pending': return 'bg-yellow-500'
    }
  }

  const formatLastActive = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const memberTemplates = [
    { id: '1', name: 'CEO/Founder', category: 'Employee', type: 'employee', description: 'Chief Executive Officer', handle: 'ceo', firstName: 'John', lastName: 'Smith', email: 'ceo@company.com', phone: '+1-555-0001' },
    { id: '2', name: 'CTO/Tech Lead', category: 'Employee', type: 'employee', description: 'Chief Technology Officer', handle: 'cto', firstName: 'Jane', lastName: 'Doe', email: 'cto@company.com', phone: '+1-555-0002' },
  ]

  const memberCategories = ['All', 'Employee', 'Customer', 'Supplier', 'Contractor', 'Advisor', 'Investor', 'Partner']

  const applyMemberTemplate = (template: typeof memberTemplates[0]) => {
    setMemberFormData({
      ...memberFormData,
      handle: template.handle,
      firstName: template.firstName,
      lastName: template.lastName,
      email: template.email,
      phone: template.phone,
      memberType: template.type,
    })
    setShowMemberTemplates(false)
  }

  const handleCreateMember = () => {
    console.log('Creating member:', memberFormData)
    setShowCreateMemberForm(false)
  }

  const filteredMemberTemplates = selectedMemberCategory === 'All' 
    ? memberTemplates 
    : memberTemplates.filter(template => template.category === selectedMemberCategory)

  return (
    <div className="absolute inset-0 top-24 overflow-y-auto px-6 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">People</h1>
            <p className="text-gray-300">Manage team members, KYC status, and share allocations</p>
          </div>
          <button
            onClick={() => setShowCreateMemberForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create New Member</span>
          </button>
        </div>
    </div>
  )
}
