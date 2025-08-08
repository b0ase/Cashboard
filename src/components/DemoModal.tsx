'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, DollarSign, Users, Building2, Zap, TrendingUp, CreditCard, Coins } from 'lucide-react'

interface PaymentFlow {
  id: string
  from: string
  to: string
  amount: number
  currency: 'USD' | 'BSV'
  timestamp: Date
  status: 'pending' | 'completed'
}

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [paymentFlows, setPaymentFlows] = useState<PaymentFlow[]>([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalDividends, setTotalDividends] = useState(0)
  const [activeFlows, setActiveFlows] = useState<string[]>([])
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    {
      title: "Point of Sale Transaction",
      description: "Customer makes a purchase using stablecoin or Bitcoin SV",
      icon: <CreditCard className="w-8 h-8 text-green-400" />
    },
    {
      title: "Real-time Revenue Collection",
      description: "Payment is instantly processed and added to company revenue",
      icon: <DollarSign className="w-8 h-8 text-yellow-400" />
    },
    {
      title: "Automatic Dividend Calculation",
      description: "System calculates dividend allocation based on shareholder percentages",
      icon: <TrendingUp className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Micropayment Distribution",
      description: "Dividends are distributed to shareholders in real-time",
      icon: <Users className="w-8 h-8 text-purple-400" />
    }
  ]

  // Generate random payment flows
  const generatePaymentFlow = () => {
    const currencies: ('USD' | 'BSV')[] = ['USD', 'BSV']
    const amounts = [12.50, 25.00, 45.99, 67.25, 89.99, 125.00, 199.99]
    const customers = ['Customer A', 'Customer B', 'Customer C', 'Customer D']
    const shareholders = ['Alice (15%)', 'Bob (25%)', 'Charlie (20%)', 'Diana (40%)']
    
    const currency = currencies[Math.floor(Math.random() * currencies.length)]
    const amount = amounts[Math.floor(Math.random() * amounts.length)]
    const customer = customers[Math.floor(Math.random() * customers.length)]
    const shareholder = shareholders[Math.floor(Math.random() * shareholders.length)]
    
    const flow: PaymentFlow = {
      id: Date.now().toString(),
      from: customer,
      to: shareholder,
      amount,
      currency,
      timestamp: new Date(),
      status: 'pending'
    }
    
    return flow
  }

  // Animation loop
  useEffect(() => {
    if (!isOpen) return

    const animate = () => {
      // Generate new payment flow every 2-4 seconds
      if (Math.random() < 0.3) {
        const newFlow = generatePaymentFlow()
        setPaymentFlows(prev => [...prev.slice(-9), newFlow]) // Keep last 10 flows
        setActiveFlows(prev => [...prev, newFlow.id])
        
        // Update totals
        setTotalRevenue(prev => prev + newFlow.amount)
        
        // Simulate dividend calculation (simplified)
        const dividendAmount = newFlow.amount * 0.1 // 10% dividend
        setTotalDividends(prev => prev + dividendAmount)
        
        // Mark flow as completed after animation
        setTimeout(() => {
          setActiveFlows(prev => prev.filter(id => id !== newFlow.id))
        }, 3000)
      }
      
      // Auto-advance steps
      if (Math.random() < 0.1) {
        setCurrentStep(prev => (prev + 1) % steps.length)
      }
    }

    animationRef.current = setInterval(animate, 1000)
    
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current)
      }
    }
  }, [isOpen, steps.length])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl h-[80vh] bg-black/90 border border-white/20 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500/20 p-3 rounded-xl">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Real-time Dividend Flow Demo</h2>
              <p className="text-gray-400">Watch micropayments flow from POS to shareholders instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Left Panel - Flow Steps */}
          <div className="w-1/3 p-6 border-r border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Flow Steps</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border transition-all duration-500 ${
                    currentStep === index
                      ? 'bg-blue-500/20 border-blue-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {step.icon}
                    <div>
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm opacity-80">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 space-y-4">
              <div className="bg-green-500/20 p-4 rounded-xl border border-green-400/30">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Total Revenue</span>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
              
              <div className="bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Dividends Distributed</span>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  ${totalDividends.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Animation */}
          <div className="flex-1 p-6 relative overflow-hidden">
            <h3 className="text-lg font-semibold text-white mb-4">Live Payment Flow</h3>
            
            {/* POS Terminal */}
            <div className="absolute top-20 left-8 bg-green-500/20 p-4 rounded-xl border border-green-400/30">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">POS Terminal</span>
              </div>
            </div>

            {/* Company Revenue */}
            <div className="absolute top-20 right-8 bg-yellow-500/20 p-4 rounded-xl border border-yellow-400/30">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">Company Revenue</span>
              </div>
            </div>

            {/* Shareholders */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-purple-500/20 p-4 rounded-xl border border-purple-400/30">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Shareholders</span>
              </div>
            </div>

            {/* Animated Payment Flows */}
            {paymentFlows.map((flow) => (
              <div
                key={flow.id}
                className={`absolute transition-all duration-3000 ease-out ${
                  activeFlows.includes(flow.id) ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  left: activeFlows.includes(flow.id) ? '50%' : '8px',
                  top: activeFlows.includes(flow.id) ? '50%' : '120px',
                  transform: activeFlows.includes(flow.id) ? 'translate(-50%, -50%)' : 'translate(0, 0)'
                }}
              >
                <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  flow.currency === 'USD' 
                    ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                    : 'bg-orange-500/20 text-orange-400 border border-orange-400/30'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4" />
                    <span>{flow.currency === 'USD' ? '$' : '₿'}{flow.amount}</span>
                  </div>
                  <div className="text-xs opacity-80 mt-1">
                    {flow.from} → {flow.to}
                  </div>
                </div>
              </div>
            ))}

            {/* Flow Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* POS to Revenue */}
              <line
                x1="120"
                y1="140"
                x2="600"
                y2="140"
                stroke="rgba(34, 197, 94, 0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* Revenue to Shareholders */}
              <line
                x1="600"
                y1="140"
                x2="400"
                y2="400"
                stroke="rgba(168, 85, 247, 0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              
              {/* Animated flow particles */}
              {activeFlows.map((flowId) => (
                <circle
                  key={`particle-${flowId}`}
                  cx="120"
                  cy="140"
                  r="3"
                  fill="#22c55e"
                  className="animate-pulse"
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="1"
                    path="M 480 0 L 0 260"
                  />
                </circle>
              ))}
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/50 backdrop-blur-sm border-t border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Live Transactions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Real-time Processing</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Close Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
