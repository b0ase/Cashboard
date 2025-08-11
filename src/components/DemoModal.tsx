'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { X, DollarSign, Users, Building2, Zap, TrendingUp, CreditCard, Coins, User, GitBranch, AlertTriangle, XOctagon } from 'lucide-react'

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
  const [recentPayouts, setRecentPayouts] = useState<Record<string, number>>({})
  const [shareholderBalances, setShareholderBalances] = useState({
    'Alice (15%)': 0,
    'Bob (25%)': 0,
    'Charlie (20%)': 0,
    'Diana (40%)': 0
  })
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  // Canvas node positions (px) - zoomed out view with more compact layout
  // Key canvas nodes (scaled down for better overview)
  const SRC = useMemo(() => ({ x: 80, y: 60 }), []) // YouTube Ad Revenue
  const SPLIT = useMemo(() => ({ x: 220, y: 80 }), []) // Split 70/20/10
  const POOL = useMemo(() => ({ x: 360, y: 80 }), []) // Royalty Pool (70%)
  const OPS = useMemo(() => ({ x: 360, y: 160 }), []) // Ops (20%)
  const RESERVE = useMemo(() => ({ x: 360, y: 220 }), []) // Reserve (10%)
  const GUARD = useMemo(() => ({ x: 500, y: 80 }), []) // Runway Guardrail
  const DIV = useMemo(() => ({ x: 640, y: 80 }), []) // Dividend Distributor
  const SHAREHOLDER_POS = useMemo(
    () => ({
      'Alice (15%)': { x: 120, y: 280 },
      'Bob (25%)': { x: 280, y: 320 },
      'Charlie (20%)': { x: 440, y: 280 },
      'Diana (40%)': { x: 600, y: 320 },
    }),
    []
  )

  const steps = [
    {
      title: 'YouTube Ad Revenue',
      description: 'AdSense receipts detected for AUDEX channel',
      icon: <CreditCard className="w-8 h-8 text-green-400" />,
    },
    {
      title: 'Split 70/20/10',
      description: '70% Royalty Pool, 20% Ops, 10% Reserve',
      icon: <GitBranch className="w-8 h-8 text-yellow-400" />,
    },
    {
      title: 'Runway Guardrail',
      description: 'Proceed only if runway ≥ 6 months',
      icon: <AlertTriangle className="w-8 h-8 text-blue-400" />,
    },
    {
      title: 'Distribute Dividends',
      description: 'Weekly pro‑rata to AUDEX holders',
      icon: <Users className="w-8 h-8 text-purple-400" />,
    },
  ]

  // Generate random payment flows
  const generatePaymentFlow = () => {
    const currencies: ('USD' | 'BSV')[] = ['USD']
    const amounts = [125.00, 240.00, 510.25, 820.40, 1090.00, 1475.75]
    const currency: 'USD' = 'USD'
    const amount = amounts[Math.floor(Math.random() * amounts.length)]
    const customer = 'YouTube AdSense'
    
    // Generate flows to ALL shareholders with different proportions
    const flows: PaymentFlow[] = []
    const shareholders = [
      { name: 'Alice (15%)', percentage: 0.15 },
      { name: 'Bob (25%)', percentage: 0.25 },
      { name: 'Charlie (20%)', percentage: 0.20 },
      { name: 'Diana (40%)', percentage: 0.40 }
    ]
    
    shareholders.forEach((shareholder, index) => {
      const dividendAmount = amount * shareholder.percentage
      const flow: PaymentFlow = {
        id: `${Date.now()}-${index}`,
        from: customer,
        to: shareholder.name,
        amount: dividendAmount,
        currency,
        timestamp: new Date(),
        status: 'pending'
      }
      flows.push(flow)
    })
    
    return { flows, totalAmount: amount }
  }

  // Animation loop
  useEffect(() => {
    if (!isOpen) return

    const animate = () => {
      // Generate new payment flows every 2-4 seconds
      if (Math.random() < 0.3) {
        const { flows, totalAmount } = generatePaymentFlow()
        setPaymentFlows(prev => [...prev.slice(-5), ...flows]) // Keep last 5 flows to reduce overlap
        setActiveFlows(prev => [...prev, ...flows.map(f => f.id)])
        
        // Update totals
        setTotalRevenue(prev => prev + totalAmount)
        
        // Update individual shareholder balances
        flows.forEach(flow => {
          setShareholderBalances(prev => ({
            ...prev,
            [flow.to]: prev[flow.to as keyof typeof prev] + flow.amount
          }))
          // Trigger brief glow on recipient
          setRecentPayouts(prev => ({ ...prev, [flow.to]: Date.now() }))
          setTimeout(() => {
            setRecentPayouts(prev => {
              const next = { ...prev }
              delete next[flow.to]
              return next
            })
          }, 900)
        })
        
        // Update total dividends
        const totalDividendAmount = flows.reduce((sum, flow) => sum + flow.amount, 0)
        setTotalDividends(prev => prev + totalDividendAmount)
        
        // Mark flows as completed after animation (faster cleanup)
        setTimeout(() => {
          setActiveFlows(prev => prev.filter(id => !flows.map(f => f.id).includes(id)))
        }, 1500)
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
      <div className="relative w-[92vw] max-w-7xl h-[85vh] bg-black/90 border border-white/20 rounded-2xl overflow-hidden">
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
            <h3 className="text-lg font-semibold text-white mb-4">AUDEX Royalty Flow</h3>
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
          <div className="flex-1 p-6 pb-8 relative overflow-auto" style={{ minHeight: '500px' }}>
            <h3 className="text-lg font-semibold text-white mb-4">Live Workflow Canvas</h3>
            
            {/* Canvas container with zoomed out dimensions */}
            <div className="relative" style={{ width: '800px', height: '400px', transform: 'scale(1)', transformOrigin: 'top left' }}>
            
            {/* n1: YouTube Ad Revenue */}
            <div className="absolute" style={{ left: SRC.x - 50, top: SRC.y - 16 }}>
              <div className="bg-green-500/20 p-2 rounded-lg border border-green-400/30 w-32">
                <div className="flex items-center space-x-1">
                  <CreditCard className="w-3 h-3 text-green-400" />
                  <span className="text-white font-medium text-xs">YouTube Ad</span>
                </div>
              </div>
            </div>

            {/* n2: Split 70/20/10 */}
            <div className="absolute" style={{ left: SPLIT.x - 40, top: SPLIT.y - 16 }}>
              <div className="bg-yellow-500/20 p-2 rounded-lg border border-yellow-400/30 w-24">
                <div className="flex items-center space-x-1">
                  <GitBranch className="w-3 h-3 text-yellow-400" />
                  <span className="text-white font-medium text-xs">Split</span>
                </div>
              </div>
            </div>

            {/* n3: Royalty Pool (70%) */}
            <div className="absolute" style={{ left: POOL.x - 40, top: POOL.y - 16 }}>
              <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-400/30 w-32">
                <div className="flex items-center space-x-1">
                  <Coins className="w-3 h-3 text-purple-400" />
                  <span className="text-white font-medium text-xs">Pool (70%)</span>
                </div>
              </div>
            </div>

            {/* n3b: Ops (20%) */}
            <div className="absolute" style={{ left: OPS.x - 32, top: OPS.y - 16 }}>
              <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-400/30 w-24">
                <div className="flex items-center space-x-1">
                  <Building2 className="w-3 h-3 text-blue-400" />
                  <span className="text-white font-medium text-xs">Ops</span>
                </div>
              </div>
            </div>

            {/* n3c: Reserve (10%) */}
            <div className="absolute" style={{ left: RESERVE.x - 36, top: RESERVE.y - 16 }}>
              <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-400/30 w-28">
                <div className="flex items-center space-x-1">
                  <Building2 className="w-3 h-3 text-blue-400" />
                  <span className="text-white font-medium text-xs">Reserve</span>
                </div>
              </div>
            </div>

            {/* n4: Guardrail */}
            <div className="absolute" style={{ left: GUARD.x - 40, top: GUARD.y - 16 }}>
              <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-400/30 w-32">
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-blue-400" />
                  <span className="text-white font-medium text-xs">Guardrail</span>
                </div>
              </div>
            </div>

            {/* n5: Dividend Distributor */}
            <div className="absolute" style={{ left: DIV.x - 44, top: DIV.y - 16 }}>
              <div className="bg-green-500/20 p-2 rounded-lg border border-green-400/30 w-36">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  <span className="text-white font-medium text-xs">Distributor</span>
                </div>
              </div>
            </div>

            {/* Exceptions node (failure path) */}
            <div className="absolute" style={{ left: GUARD.x - 28, top: GUARD.y + 60 }}>
              <div className="bg-red-500/20 p-2 rounded-lg border border-red-400/30 w-28">
                <div className="flex items-center space-x-1">
                  <XOctagon className="w-3 h-3 text-red-400" />
                  <span className="text-white font-medium text-xs">Exceptions</span>
                </div>
              </div>
            </div>

            {/* Individual Shareholders (compact, zoomed out) */}
            {(['Alice (15%)','Bob (25%)','Charlie (20%)','Diana (40%)'] as const).map((name) => (
              <div key={name} className="absolute" style={{ left: SHAREHOLDER_POS[name].x - 40, top: SHAREHOLDER_POS[name].y - 16 }}>
                <div className={`p-2 rounded-lg border ${recentPayouts[name] ? 'animate-pulse-glow bg-purple-500/30 border-purple-300/60' : 'bg-purple-500/20 border-purple-400/30' }`}>
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-purple-400" />
                    <span className="text-white text-xs font-medium">{name.split(' ')[0]}</span>
                  </div>
                  <div className="text-xs text-purple-300 mt-1">
                    ${shareholderBalances[name].toFixed(0)}
                  </div>
                </div>
              </div>
            ))}

            {/* Animated Payment Flows (labels spread out to avoid overlap) */}
            {paymentFlows.map((flow, index) => {
              // Spread out the positions to avoid overlap (scaled for zoomed out view)
              const offsetX = (index % 3 - 1) * 80 // -80, 0, 80
              const offsetY = Math.floor(index / 3) * 30 - 15 // Vertical spacing
              return (
                <div
                  key={flow.id}
                  className={`absolute transition-all duration-2000 ease-out ${
                    activeFlows.includes(flow.id) ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    left: activeFlows.includes(flow.id) ? `${350 + offsetX}px` : `${DIV.x}px`,
                    top: activeFlows.includes(flow.id) ? `${150 + offsetY}px` : `${DIV.y}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                >
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  flow.currency === 'USD' 
                    ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
                    : 'bg-orange-500/20 text-orange-400 border border-orange-400/30'
                }`}>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-3 h-3" />
                    <span>{flow.currency === 'USD' ? '$' : '₿'}{flow.amount}</span>
                  </div>
                  <div className="text-xs opacity-80 mt-1">
                    {flow.from.split(' ')[0]} → {flow.to.split(' ')[0]}
                  </div>
                </div>
              </div>
              )
            })}

            {/* Flow Lines & Particles */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* n1 → n2: Revenue to Split */}
              <line x1={SRC.x} y1={SRC.y} x2={SPLIT.x} y2={SPLIT.y} stroke="rgba(34, 197, 94, 0.45)" strokeWidth="2" strokeDasharray="6,6">
                <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite" />
              </line>

              {/* n2 → n3/ops/reserve: Split branches */}
              <line x1={SPLIT.x} y1={SPLIT.y} x2={POOL.x} y2={POOL.y} stroke="rgba(234, 179, 8, 0.45)" strokeWidth="2" strokeDasharray="6,6">
                <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite" />
              </line>
              <line x1={SPLIT.x} y1={SPLIT.y} x2={OPS.x} y2={OPS.y} stroke="rgba(59, 130, 246, 0.35)" strokeWidth="2" strokeDasharray="6,6" />
              <line x1={SPLIT.x} y1={SPLIT.y} x2={RESERVE.x} y2={RESERVE.y} stroke="rgba(59, 130, 246, 0.35)" strokeWidth="2" strokeDasharray="6,6" />
              <text x={(SPLIT.x+POOL.x)/2} y={POOL.y - 8} fill="rgba(255,255,255,0.7)" fontSize="12" textAnchor="middle">70%</text>
              <text x={(SPLIT.x+OPS.x)/2 - 8} y={(SPLIT.y+OPS.y)/2 - 6} fill="rgba(255,255,255,0.7)" fontSize="12">20%</text>
              <text x={(SPLIT.x+RESERVE.x)/2 - 8} y={(SPLIT.y+RESERVE.y)/2 - 6} fill="rgba(255,255,255,0.7)" fontSize="12">10%</text>

              {/* n3 → n4: Royalty Pool to Guardrail */}
              <line x1={POOL.x} y1={POOL.y} x2={GUARD.x} y2={GUARD.y} stroke="rgba(59, 130, 246, 0.45)" strokeWidth="2" strokeDasharray="4,6">
                <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite" />
              </line>

              {/* Guardrail success → Dividend */}
              <line x1={GUARD.x} y1={GUARD.y} x2={DIV.x} y2={DIV.y} stroke="rgba(34, 197, 94, 0.5)" strokeWidth="2" strokeDasharray="6,6">
                <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite" />
              </line>

              {/* Guardrail failure → Exceptions */}
              <line x1={GUARD.x} y1={GUARD.y} x2={GUARD.x} y2={GUARD.y + 90} stroke="rgba(239, 68, 68, 0.45)" strokeWidth="2" strokeDasharray="4,6" />

              {/* Animated flow particles: Dividend → each Shareholder */}
              {paymentFlows.filter(f => activeFlows.includes(f.id)).map((flow) => {
                const target = SHAREHOLDER_POS[flow.to as keyof typeof SHAREHOLDER_POS]
                const path = `M ${DIV.x} ${DIV.y} L ${target.x} ${target.y}`
                const color = '#a855f7'
                return (
                  <circle key={`particle-${flow.id}`} r="3" fill={color}>
                    <animateMotion dur="2.2s" repeatCount="1" path={path} />
                  </circle>
                )
              })}

              {/* Animated particles for source → split and split → pool (once per group) */}
              {Array.from(new Set(paymentFlows.filter(f => activeFlows.includes(f.id)).map(f => f.id.split('-')[0]))).map((groupId) => (
                <g key={`group-${groupId}`}>
                  <circle r="4" fill="#22c55e">
                    <animateMotion dur="1.0s" repeatCount="1" path={`M ${SRC.x} ${SRC.y} L ${SPLIT.x} ${SPLIT.y}`} />
                  </circle>
                  <circle r="4" fill="#eab308">
                    <animateMotion dur="1.0s" begin="0.8s" repeatCount="1" path={`M ${SPLIT.x} ${SPLIT.y} L ${POOL.x} ${POOL.y}`} />
                  </circle>
                </g>
              ))}
            </svg>
            </div>
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
