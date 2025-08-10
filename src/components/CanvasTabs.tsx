"use client"

import React, { useState, useCallback } from 'react'
import { X, Plus } from 'lucide-react'
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
  const [tabs, setTabs] = useState<CanvasTab[]>([
    {
      id: 'main',
      title: initialTitle,
      workflow: initialWorkflow,
      templates: initialTemplates,
      isTemplate: false
    }
  ])
  const [activeTabId, setActiveTabId] = useState('main')

  const createNewTab = useCallback((template: TemplateItem) => {
    const newTabId = `template-${template.id || template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    const canvasTemplate = getOrganizationCanvasTemplate(template)
    
    const newTab: CanvasTab = {
      id: newTabId,
      title: template.name,
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
  }, [initialTemplates])

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
      <div className="flex items-center bg-black/40 border-b border-white/10 px-2 py-1 min-h-[48px] overflow-x-auto">
        <div className="flex items-center gap-1 flex-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer group ${
                activeTabId === tab.id
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              {/* Tab Icon */}
              {tab.isTemplate && tab.templateData?.icon && (
                <span className="text-base">{tab.templateData.icon}</span>
              )}
              
              {/* Tab Title */}
              <span className="whitespace-nowrap max-w-[150px] truncate" title={tab.title}>
                {tab.title}
              </span>
              
              {/* Close Button */}
              {tab.id !== 'main' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                  className="w-4 h-4 rounded hover:bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Tab Info */}
        <div className="flex items-center gap-2 text-xs text-gray-500 ml-4">
          <span>{tabs.length} tab{tabs.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 relative">
        {activeTab && (
          <WorkflowReactFlowCanvas
            key={activeTab.id} // Force re-render when tab changes
            workflow={activeTab.workflow}
            templates={activeTab.templates}
            onTemplateSelect={createNewTab}
            tabTitle={activeTab.title}
          />
        )}
      </div>
    </div>
  )
}
