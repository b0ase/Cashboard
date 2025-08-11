"use client"

import React, { useState, useCallback, useRef } from 'react'
import { X, Edit2, Check, Plus, Play, Pause, Zap, ZoomOut, ZoomIn, ArrowRight } from 'lucide-react'
import WorkflowReactFlowCanvas from './WorkflowReactFlowCanvas'
import { getOrganizationTemplates, getRoleTemplates, getAgentTemplates, getInstrumentTemplates } from '../data/templates'

export interface CanvasTab {
  id: string
  title: string
  workflow: {
    nodes: any[]
    connections: any[]
  }
  templates: any[]
  isTemplate?: boolean
  templateData?: any
  nodeCanvasData?: any
}

interface CanvasTabsProps {
  initialTabs?: CanvasTab[]
}

export default function CanvasTabs({ initialTabs }: CanvasTabsProps) {
  // Get all templates
  const allTemplates = [
    ...getOrganizationTemplates(),
    ...getRoleTemplates(),
    ...getAgentTemplates(),
    ...getInstrumentTemplates()
  ]

  // Initialize with default main tab
  const defaultTabs: CanvasTab[] = initialTabs || [{
    id: 'main',
    title: 'Organisation : AUDEX',
    workflow: {
      nodes: [
        { id: 1, name: 'YouTube Ad Revenue', type: 'revenue', x: 100, y: 100 },
        { id: 2, name: 'Split 70/20/10', type: 'decision', x: 300, y: 100 },
        { id: 3, name: 'Royalty Pool (70%)', type: 'pool', x: 500, y: 50 },
        { id: 4, name: 'Dividend Distributor', type: 'distributor', x: 700, y: 50 },
        { id: 5, name: 'Ops (20%)', type: 'ops', x: 500, y: 150 },
        { id: 6, name: 'Reserve (10%)', type: 'reserve', x: 500, y: 250 }
      ],
      connections: [
        { from: 1, to: 2, type: 'payment' },
        { from: 2, to: 3, type: 'payment' },
        { from: 2, to: 5, type: 'payment' },
        { from: 2, to: 6, type: 'payment' },
        { from: 3, to: 4, type: 'payment' }
      ]
    },
    templates: allTemplates
  }]

  const [tabs, setTabs] = useState<CanvasTab[]>(defaultTabs)
  const [activeTabId, setActiveTabId] = useState<string>('main')
  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState<string>('')
  const editInputRef = useRef<HTMLInputElement>(null)

  // Canvas controls state
  const [isRunning, setIsRunning] = useState(false)
  const [autoMode, setAutoMode] = useState(false)
  const [canvasScale, setCanvasScale] = useState(35)

  // Get active tab
  const activeTab = tabs.find(tab => tab.id === activeTabId)

  // Tab management functions
  const createNewTab = useCallback((template?: any) => {
    const newTabId = `tab-${Date.now()}`
    const newTab: CanvasTab = {
      id: newTabId,
      title: template ? template.name : 'New Canvas',
      workflow: { nodes: [], connections: [] },
      templates: allTemplates,
      isTemplate: !!template,
      templateData: template
    }

    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTabId)
  }, [])

  const createNodeCanvasTab = useCallback((node: any) => {
    const newTabId = `node-${node.id}-${Date.now()}`
    const newTab: CanvasTab = {
      id: newTabId,
      title: `${node.data.label} Details`,
      workflow: { nodes: [], connections: [] },
      templates: allTemplates,
      isTemplate: false,
      nodeCanvasData: node
    }

    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTabId)
  }, [])

  const closeTab = useCallback((tabId: string) => {
    if (tabId === 'main') return // Don't allow closing main tab

    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)
      // If we're closing the active tab, switch to main
      if (activeTabId === tabId) {
        setActiveTabId('main')
      }
      return newTabs
    })
  }, [activeTabId])

  // Title editing functions
  const startEditingTitle = useCallback((tabId: string, currentTitle: string) => {
    setEditingTabId(tabId)
    setEditingTitle(currentTitle)
    setTimeout(() => editInputRef.current?.focus(), 0)
  }, [])

  const saveTitle = useCallback(() => {
    if (editingTabId && editingTitle.trim()) {
      setTabs(prev => prev.map(tab => 
        tab.id === editingTabId 
          ? { ...tab, title: editingTitle.trim() }
          : tab
      ))
    }
    setEditingTabId(null)
    setEditingTitle('')
  }, [editingTabId, editingTitle])

  const cancelEdit = useCallback(() => {
    setEditingTabId(null)
    setEditingTitle('')
  }, [])

  // Canvas control handlers
  const toggleWorkflowStatus = () => setIsRunning(!isRunning)
  const toggleAutoMode = () => setAutoMode(!autoMode)
  const zoomOut = () => setCanvasScale(Math.max(10, canvasScale - 10))
  const zoomIn = () => setCanvasScale(Math.min(200, canvasScale + 10))
  const resetView = () => setCanvasScale(35)

  // Handle tab switching
  const handleTabClick = useCallback((tabId: string) => {
    console.log('🔄 Tab clicked:', tabId, 'Current active:', activeTabId)
    setActiveTabId(tabId)
    console.log('🔄 Active tab set to:', tabId)
  }, [activeTabId])

  // Debug logging
  React.useEffect(() => {
    console.log('🔄 Active tab changed to:', activeTabId, activeTab?.title)
  }, [activeTabId, activeTab])

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="flex items-center bg-black/40 backdrop-blur-sm border-b border-white/10 px-3 py-2 min-h-[52px] overflow-x-auto">
        {/* Tabs */}
        <div className="flex items-center gap-2 flex-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer group relative ${
                activeTabId === tab.id
                  ? 'bg-white/15 text-white border border-white/30 shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/8 border border-transparent'
              }`}
              onClick={() => handleTabClick(tab.id)}
            >
              {/* Tab Title - Editable */}
              {editingTabId === tab.id ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveTitle()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    onBlur={saveTitle}
                    className="bg-white/20 text-white px-2 py-1 rounded text-sm min-w-[100px] max-w-[200px]"
                  />
                  <button onClick={saveTitle} className="text-green-400 hover:text-green-300">
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  <span 
                    className="whitespace-nowrap max-w-[140px] truncate font-medium" 
                    title={tab.title}
                  >
                    {tab.title}
                  </span>
                  {activeTabId === tab.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditingTitle(tab.id, tab.title)
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Close Button */}
              {tab.id !== 'main' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                  className="w-5 h-5 rounded-full hover:bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all ml-1 flex-shrink-0"
                >
                  <X className="w-3 h-3 text-red-400" />
                </button>
              )}
              
              {/* Active Tab Indicator */}
              {activeTabId === tab.id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-400 rounded-full" />
              )}
            </div>
          ))}
          
          {/* Add Tab Button */}
          <button
            onClick={() => createNewTab()}
            className="flex items-center gap-1 px-2 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-2 ml-4 border-l border-white/20 pl-4">
          <button
            onClick={toggleWorkflowStatus}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
              isRunning 
                ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isRunning ? 'Paused' : 'Running'}
          </button>
          
          <button
            onClick={toggleAutoMode}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
              autoMode 
                ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
            }`}
          >
            <Zap className="w-3 h-3" />
            {autoMode ? 'Auto' : 'Manual'}
          </button>
          
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <button onClick={zoomOut} className="hover:text-white transition-colors">
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="min-w-[30px] text-center">{canvasScale}%</span>
            <button onClick={zoomIn} className="hover:text-white transition-colors">
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
          
          <button
            onClick={resetView}
            className="px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 relative">
        {activeTab ? (
          <WorkflowReactFlowCanvas
            key={`canvas-${activeTabId}`} // Force re-render when tab changes
            workflow={activeTab.workflow}
            templates={activeTab.templates}
            onTemplateSelect={createNewTab}
            onNodeCanvasSelect={createNodeCanvasTab}
            tabTitle={activeTab.title}
            nodeCanvasData={activeTab.nodeCanvasData}
            onAddNode={(type: string) => true}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No active canvas
          </div>
        )}
      </div>
    </div>
  )
}