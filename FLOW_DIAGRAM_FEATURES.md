# Cashboard Flow-Diagram Features

## Overview
This document specifies the flow‑diagram system for Cashboard. The current MVP does not ship a full editor/executor yet; this file defines terminology, expected UX, and runtime behavior for implementation. The focus is money flows, contract management, autonomous task routing, and dividend distribution.

Positioning: Unlike generic automation canvases, this canvas is organization‑aware. Nodes can reference roles, members, share allocations, contract clauses, and policy checks. Execution includes audit events and idempotent payment/contract operations.

## Node Types

### 1. Payment Nodes 💰
- **Purpose**: Handle money flows and financial transactions
- **Features**: 
  - Amount tracking
  - Payment status monitoring
  - Automatic fund allocation
- **Color**: Yellow
- **Icon**: Dollar Sign

### 2. Contract Nodes 📄
- **Purpose**: Manage agreements and legal obligations
- **Features**:
  - Deadline tracking
  - Contract status monitoring
  - Automatic milestone triggers
- **Color**: Blue
- **Icon**: File Text

### 3. Task Nodes 🎯
- **Purpose**: Assign and track work items
- **Features**:
  - Team member assignment
  - Progress tracking
  - Automatic handoffs
- **Color**: Green
- **Icon**: Target

### 4. Decision Nodes ⚠️
- **Purpose**: Create conditional logic and branching
- **Features**:
  - Multiple outcome paths
  - Conditional routing
  - Automated decision making
- **Color**: Purple
- **Icon**: Alert Triangle

### 5. Milestone Nodes ✅
- **Purpose**: Mark important project checkpoints
- **Features**:
  - Progress validation
  - Automatic notifications
  - Success criteria tracking
- **Color**: Indigo
- **Icon**: Check Circle

### 6. Team Nodes 👥
- **Purpose**: Manage team assignments and collaboration
- **Features**:
  - Team member management
  - Role assignments
  - Capacity tracking
- **Color**: Pink
- **Icon**: Users

## Connection Types

### 1. Payment Connections 💸
- **Color**: Yellow
- **Purpose**: Show money flow between nodes
- **Features**: Amount display on connection line

### 2. Task Connections 📋
- **Color**: Blue
- **Purpose**: Show work handoffs and dependencies
- **Features**: Automatic task assignment

### 3. Conditional Connections 🔀
- **Color**: Purple
- **Purpose**: Show decision-based routing
- **Features**: Conditional logic execution

### 4. Success Connections ✅
- **Color**: Green
- **Purpose**: Show successful completion paths
- **Features**: Automatic progression

### 5. Failure Connections ❌
- **Color**: Red
- **Purpose**: Show error handling paths
- **Features**: Automatic error recovery

## Workflow States

### Node Status
- **Pending** (Yellow): Waiting to start
- **Active** (Green): Currently in progress
- **Completed** (Blue): Successfully finished
- **Failed** (Red): Encountered an error
- **Paused** (Gray): Temporarily stopped

### Workflow Controls
- **Running**: Workflow is actively executing
- **Paused**: Workflow is temporarily stopped
- **Auto Mode**: Automatic progression enabled
- **Simulate**: Dry‑run with synthetic events and guardrails (no external side effects)

## Key Features

### 1. Visual Flow Design
- Drag and drop node placement
- Real-time connection visualization
- Color-coded status indicators
- Interactive node editing

### 2. Autonomous Processes
- Automatic workflow progression
- Conditional routing based on outcomes
- Automatic task assignment
- Deadline monitoring and alerts
 - Guardrails: pre‑flight checks and policy constraints before executing payments/contracts
 - Policy hooks: role/permission verification against the active organization

### 3. Money Flow Management
- Visual payment tracking
- Automatic fund allocation
- Payment status monitoring
- Financial reporting
 - Dividend distribution primitives (split by percent, waterfall, threshold triggers)
 - Cap table integration for pro‑rata calculations

### 4. Contract Management
- Deadline tracking
- Milestone validation
- Automatic contract progression
- Legal compliance monitoring
 - Template‑driven contract generation (planned)
 - Machine‑readable clause metadata for automation

### 5. Team Coordination
- Visual team assignments
- Task handoff automation
- Capacity management
- Progress tracking

## Use Cases

### 1. Project Management
- Visualize project phases
- Track team assignments
- Monitor milestones
- Automate handoffs

### 2. Financial Workflows
- Payment processing
- Invoice approval
- Budget allocation
- Expense tracking

### 3. Contract Management
- Agreement tracking
- Milestone validation
- Payment triggers
- Compliance monitoring

### 4. Team Coordination
- Task assignment
- Progress tracking
- Resource allocation
- Performance monitoring

## Getting Started

1. **Add Nodes**: Click the node type buttons in the toolbar
2. **Connect Nodes**: Click "Connect" on a node, then click the target node
3. **Configure Nodes**: Double-click nodes to edit their properties
4. **Run Workflow**: Use the play/pause buttons to control execution
5. **Monitor Progress**: Watch the status indicators and connection flows

## Advanced Features

### Auto Mode
When enabled, the workflow automatically progresses through nodes based on:
- Completion criteria
- Time-based triggers
- Conditional logic
- Team availability

### Status Tracking
Real-time monitoring of:
- Node completion status
- Connection flow
- Error handling
- Performance metrics
 - Audit trail entries for money flow and decisions

## Data Model (proposed)

- Node: { id, type, name, config, inputs[], outputs[], policy?: { rolesAllowed?: string[], approvals?: number } }
- Connection: { id, fromNodeId, fromPort, toNodeId, toPort, type }
- Run: { id, flowId, status, startedAt, finishedAt, events[] }
- Event: { at, type, data }

## Execution Semantics (high‑level)

- Deterministic core with external effects abstracted via adaptors
- Idempotent payment/contract operations
- Policy layer for role/permission checks per organization

Implementation note: MVP can start with JSON‑defined flows executed in the client for demo, then move to a server runtime.

## Documentation Links

- Context and positioning: `CONTEXTUAL_KNOWLEDGE.md`
- Product overview and roadmap: `PRODUCT_DOCUMENTATION.md`
- CSS/design system guidance: `CSS_ISSUES_ANALYSIS.md`

### Visual Feedback
- Color-coded connections
- Status indicators
- Progress animations
- Error highlighting

This flow-diagram system transforms Cashboard into a powerful visual workflow automation platform, perfect for managing complex business processes, money flows, and team coordination.
