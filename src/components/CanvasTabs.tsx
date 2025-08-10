"use client"

import React, { useState, useCallback } from 'react'
import { X, Plus, Play, Pause, Zap, ArrowRight, ZoomOut, ZoomIn } from 'lucide-react'
import WorkflowReactFlowCanvas from './WorkflowReactFlowCanvas'
import { TemplateItem } from '@/data/templates'
import { getOrganizationCanvasTemplate } from '@/data/organizationCanvasTemplates'

export type CanvasTab = {
  id: string
  title: string
  workflow?: any
  templates?: any
  isTemplate?: boolean
  templateData?: TemplateItem
  nodeCanvasData?: any
}

interface CanvasTabsProps {
  initialWorkflow?: any
  initialTemplates?: any
  initialTitle?: string
}

export default function CanvasTabs({ 
  initialWorkflow, 
  initialTemplates, 
  initialTitle = "Main Canvas" 
}: CanvasTabsProps) {
  // Clean up the initial title too
  const cleanInitialTitle = initialTitle === "Main Canvas" 
    ? "Workspace" 
    : initialTitle.replace(/\b(Example|Workflow|Canvas)\b/g, '').replace(/\s+/g, ' ').trim() || initialTitle

  const [tabs, setTabs] = useState<CanvasTab[]>([
    {
      id: 'main',
      title: cleanInitialTitle,
      workflow: initialWorkflow,
      templates: initialTemplates,
      isTemplate: false
    }
  ])
  const [activeTabId, setActiveTabId] = useState('main')
  
  // Canvas control states
  const [isRunning, setIsRunning] = useState(false)
  const [autoMode, setAutoMode] = useState(false)
  const [canvasScale, setCanvasScale] = useState(0.35)
  
  // Canvas control handlers
  const toggleWorkflowStatus = useCallback(() => {
    setIsRunning(prev => !prev)
  }, [])
  
  const toggleAutoMode = useCallback(() => {
    setAutoMode(prev => !prev)
  }, [])
  
  const zoomOut = useCallback(() => {
    setCanvasScale(prev => Math.max(0.1, prev - 0.1))
  }, [])
  
  const zoomIn = useCallback(() => {
    setCanvasScale(prev => Math.min(5, prev + 0.1))
  }, [])
  
  const resetView = useCallback(() => {
    setCanvasScale(0.35)
  }, [])

  const createNodeCanvasTab = useCallback((node: any) => {
    // Create a new tab for the node canvas
    const newTabId = `node-${node.id}-${Date.now()}`
    const cleanTitle = `${node.data.label} Details`
    
    const newTab: CanvasTab = {
      id: newTabId,
      title: cleanTitle,
      workflow: {
        nodes: [], // Will be populated by NodeCanvasModal content
        connections: []
      },
      templates: initialTemplates,
      isTemplate: false,
      nodeCanvasData: node // Store the node data for the canvas
    }

    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTabId)
  }, [initialTemplates])

  const createNewTab = useCallback((template: TemplateItem) => {
    // Check if a tab with this template already exists
    const existingTab = tabs.find(tab => 
      tab.isTemplate && tab.templateData?.id === template.id
    )
    
    if (existingTab) {
      // Just switch to the existing tab
      setActiveTabId(existingTab.id)
      return
    }

    const newTabId = `template-${template.id || template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    const canvasTemplate = getOrganizationCanvasTemplate(template)
    
    // Create a cleaner tab title by removing redundant words
    const cleanTitle = template.name
      .replace(/\b(Corporation|Corp|Inc|LLC|Ltd|Limited|Company|Co\.|Holdings|Group|Services|Systems|Solutions|Network|Foundation|Alliance|Society|Charity|Fund|Studio|Shop|Partnership|Firm|Practice|Cooperative|Union|Pty|GmbH|SARL)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    const newTab: CanvasTab = {
      id: newTabId,
      title: cleanTitle || template.name, // Fallback to original if cleaning removes everything
      workflow: {
        nodes: canvasTemplate.nodes.map(node => ({
          id: node.id,
          name: node.data.label,
          type: node.data.kind,
          x: node.position.x,
          y: node.position.y
        })),
        connections: canvasTemplate.edges.map(edge => ({
          id: edge.id,
          from: edge.source,
          to: edge.target,
          type: edge.animated ? 'payment' : 'connection'
        }))
      },
      templates: initialTemplates,
      isTemplate: true,
      templateData: template
    }

    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTabId)
  }, [initialTemplates, tabs])

  const closeTab = useCallback((tabId: string) => {
    if (tabId === 'main') return // Don't allow closing the main tab
    
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)
      // If we're closing the active tab, switch to the main tab
      if (activeTabId === tabId) {
        setActiveTabId('main')
      }
      return newTabs
    })
  }, [activeTabId])

  const activeTab = tabs.find(tab => tab.id === activeTabId)

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="flex items-center bg-black/40 backdrop-blur-sm border-b border-white/10 px-3 py-2 min-h-[52px] overflow-x-auto">
        <div className="flex items-center gap-2 flex-1">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer group relative ${
                activeTabId === tab.id
                  ? 'bg-white/15 text-white border border-white/30 shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/8 border border-transparent'
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              {/* Tab Icon */}
              {tab.isTemplate && tab.templateData?.icon ? (
                <span className="text-lg">{tab.templateData.icon}</span>
              ) : (
                <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              )}
              
              {/* Tab Title */}
              <span 
                className="whitespace-nowrap max-w-[140px] truncate font-medium" 
                title={tab.templateData?.name || tab.title}
              >
                {tab.title}
              </span>
              
              {/* Template Type Badge */}
              {tab.isTemplate && tab.templateData?.type && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-gray-300 uppercase font-mono">
                  {tab.templateData.type.toLowerCase().replace('_', ' ')}
                </span>
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
        </div>

        {/* Canvas Controls */}
        <div className="flex items-center gap-2 ml-4 border-l border-white/10 pl-4">
          {/* Workflow Controls */}
          <button
            onClick={toggleWorkflowStatus}
            className={`rounded-lg flex items-center space-x-1 transition-all border px-2 py-1 ${
              isRunning
                ? 'bg-green-500/20 text-green-400 border-green-400/30' 
                : 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
            }`}
            title={isRunning ? 'Pause Workflow' : 'Start Workflow'}
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="text-xs font-medium">{isRunning ? 'Running' : 'Paused'}</span>
          </button>
          
          <button
            onClick={toggleAutoMode}
            className={`rounded-lg flex items-center space-x-1 transition-all border px-2 py-1 ${
              autoMode
                ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' 
                : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 border-white/20'
            }`}
            title="Toggle Auto Mode"
          >
            <Zap className="w-3 h-3" />
            <span className="text-xs font-medium">Auto</span>
          </button>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={zoomOut}
              className="rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 border border-white/20 transition-all p-1"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            
            <div className="bg-white/10 border border-white/20 rounded-lg px-2 py-1">
              <span className="text-white font-medium text-xs">
                {Math.round(canvasScale * 100)}%
              </span>
            </div>
            
            <button
              onClick={resetView}
              className="rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 border border-white/20 transition-all px-2 py-1"
              title="Reset View"
            >
              <span className="font-medium text-xs">Reset</span>
            </button>
            
            <button
              onClick={zoomIn}
              className="rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 border border-white/20 transition-all p-1"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 relative">
        {activeTab && (
          <div>
            {console.log('Rendering canvas for tab:', activeTab.id, activeTab.title, 'nodeCanvasData:', !!activeTab.nodeCanvasData)}
            <WorkflowReactFlowCanvas
              key={activeTab.id} // Force re-render when tab changes
              workflow={activeTab.workflow}
              templates={activeTab.templates}
              onTemplateSelect={createNewTab}
              onNodeCanvasSelect={createNodeCanvasTab}
              tabTitle={activeTab.title}
              nodeCanvasData={activeTab.nodeCanvasData}
              onAddNode={(type: string) => true} // Enable the canvas node addition
            />
          </div>
        )}
      </div>
    </div>
  )
}
