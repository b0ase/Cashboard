"use client"

import React, { useMemo } from 'react'
import ReactFlow, { Background, Controls, MiniMap, addEdge, useEdgesState, useNodesState, Connection, Edge } from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'YouTube Revenue' } },
  { id: '2', position: { x: 350, y: 100 }, data: { label: 'Split 70/20/10' } },
  { id: '3', position: { x: 600, y: 80 }, data: { label: 'Royalty Pool (70%)' } },
  { id: '4', position: { x: 600, y: 140 }, data: { label: 'Ops (20%)' } },
  { id: '5', position: { x: 600, y: 200 }, data: { label: 'Reserve (10%)' } },
  { id: '6', position: { x: 850, y: 100 }, data: { label: 'Guardrail' } },
  { id: '7', position: { x: 1100, y: 100 }, data: { label: 'Dividend Distributor' } },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e2-5', source: '2', target: '5' },
  { id: 'e3-6', source: '3', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
]

export default function ReactFlowDemoPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds))

  const nodeTypes = useMemo(() => ({}), [])

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">React Flow Demo</h1>
        <div className="h-[70vh] bg-black/50 border border-white/20 rounded-lg overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}


