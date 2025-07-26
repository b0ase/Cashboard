export interface CashHandle {
  id: string
  handle: string
  name: string
  role: string
  organizationId?: string
  labels: string[]
  balance: number
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  description?: string
  cashHandles: CashHandle[]
  createdAt: Date
  updatedAt: Date
}

export interface Dividend {
  id: string
  amount: number
  recipientId: string
  senderId: string
  organizationId?: string
  description?: string
  status: 'pending' | 'sent' | 'failed'
  createdAt: Date
}

export interface Label {
  id: string
  name: string
  color: string
  organizationId?: string
} 