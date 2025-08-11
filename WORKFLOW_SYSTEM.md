# 📊 Cashboard Workflow System

## Overview

The Cashboard Workflow System provides a standardized JSON format for modeling complex business workflows, asset flows, and organizational structures. This system enables you to create, organize, and visualize workflows for multiple companies across different industries.

## 🗂️ File Structure

```
src/
├── schemas/
│   └── workflow.schema.json          # JSON Schema definition
├── workflows/                        # Workflow JSON files organized by industry
│   ├── technology/
│   │   ├── fintech/
│   │   │   └── stripe-inc.json
│   │   ├── saas-platforms/
│   │   ├── ai-ml/
│   │   └── blockchain/
│   ├── media-entertainment/
│   │   ├── music-platforms/
│   │   │   └── audex-corporation.json
│   │   ├── streaming-services/
│   │   └── gaming/
│   ├── healthcare/
│   │   ├── pharmaceuticals/
│   │   │   └── pfizer-inc.json
│   │   └── biotech/
│   └── financial-services/
├── lib/
│   └── workflowManager.ts           # Workflow management utilities
└── components/
    └── WorkflowDashboard.tsx        # Dashboard UI component
```

## 🔧 JSON Schema Structure

### Core Properties

```json
{
  "id": "unique_workflow_identifier",
  "name": "Human-readable workflow name",
  "version": "1.0.0",
  "metadata": {
    "company": {
      "name": "Company Legal Name",
      "ticker": "TICKER",
      "jurisdiction": "US",
      "website": "https://company.com",
      "description": "Company description"
    },
    "industry": "Technology",
    "type": "asset_monetary_flow",
    "created": "2024-01-20T00:00:00Z",
    "updated": "2024-01-20T00:00:00Z",
    "tags": ["tag1", "tag2"],
    "folder": "technology/fintech"
  },
  "nodes": [...],
  "connections": [...],
  "layout": {...},
  "validation": {...}
}
```

### Node Structure

```json
{
  "id": 1,
  "name": "Node Display Name",
  "type": "payment",
  "position": { "x": 100, "y": 100 },
  "handcashHandle": "Handle_Name",
  "tokenAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "properties": {
    "percentage": 25,
    "amount": 1000,
    "currency": "USD",
    "status": "active",
    "walletType": "multisig",
    "multisigThreshold": 3
  },
  "metadata": {
    "tier": "revenue_source",
    "category": "streaming",
    "comments": "Additional notes"
  }
}
```

### Connection Structure

```json
{
  "id": "connection_identifier",
  "from": 1,
  "to": 2,
  "type": "payment",
  "properties": {
    "weight": 50,
    "label": "Connection Label",
    "conditions": "When X happens"
  }
}
```

## 📁 Folder Organization

### Industry Categories

- **Technology**: `saas-platforms`, `fintech`, `ai-ml`, `blockchain`, `cybersecurity`, `cloud-infrastructure`
- **Media & Entertainment**: `music-platforms`, `streaming-services`, `gaming`, `content-creation`, `social-media`, `publishing`
- **Financial Services**: `banking`, `insurance`, `investment-management`, `payment-processing`, `cryptocurrency`, `real-estate-finance`
- **Healthcare**: `pharmaceuticals`, `medical-devices`, `telehealth`, `biotech`, `health-insurance`, `clinical-research`
- **Manufacturing**: `automotive`, `aerospace`, `electronics`, `consumer-goods`, `industrial-equipment`, `textiles`
- **Retail**: `e-commerce`, `fashion`, `grocery`, `luxury-goods`, `marketplace`, `supply-chain`
- **Energy**: `renewable-energy`, `oil-gas`, `utilities`, `energy-storage`, `smart-grid`, `carbon-markets`
- **Real Estate**: `commercial`, `residential`, `reit`, `property-management`, `construction`, `real-estate-tech`
- **Agriculture**: `farming`, `food-processing`, `agtech`, `livestock`, `aquaculture`, `vertical-farming`
- **Transportation**: `logistics`, `airlines`, `shipping`, `ride-sharing`, `autonomous-vehicles`, `public-transport`

## 🎯 Workflow Types

### 1. Asset & Monetary Flow (`asset_monetary_flow`)
Maps revenue sources, distribution mechanisms, and shareholder allocations.

**Example**: AUDEX Corporation
- Revenue sources (streaming, NFT sales, subscriptions)
- Revenue aggregation pool
- Distribution to stakeholders (treasury, artists, operations)
- Token-based dividend distribution

### 2. Revenue Model (`revenue_model`)
How the company generates and processes revenue.

**Example**: Stripe Inc.
- Transaction processing fees
- Subscription revenue
- Platform fees
- Cost allocation (operations, R&D, profit)

### 3. Organizational Structure (`organizational_structure`)
Company hierarchy, roles, and reporting relationships.

### 4. Supply Chain (`supply_chain`)
End-to-end supply chain and logistics mapping.

### 5. Governance (`governance`)
Corporate governance, compliance, and decision-making processes.

### 6. Compliance (`compliance`)
Regulatory compliance and risk management processes.

### 7. Operational Process (`operational_process`)
Core business processes and operational workflows.

## 🚀 Usage Examples

### Loading a Workflow

```typescript
import { loadWorkflow, validateWorkflow } from '@/lib/workflowManager'

const workflow = await loadWorkflow('/workflows/media-entertainment/audex-corporation.json')
if (workflow && validateWorkflow(workflow)) {
  // Use the workflow
}
```

### Organizing Workflows

```typescript
import { organizeWorkflowsByFolder } from '@/lib/workflowManager'

const folders = organizeWorkflowsByFolder(workflows)
// Returns hierarchical folder structure with workflow counts
```

### Searching Workflows

```typescript
import { searchWorkflows } from '@/lib/workflowManager'

const results = searchWorkflows(workflows, 'music streaming')
// Returns workflows matching the search term
```

### Creating New Workflow

```typescript
import { createWorkflowFromTemplate } from '@/lib/workflowManager'

const newWorkflow = createWorkflowFromTemplate('asset_monetary_flow', {
  name: 'My Company Inc.',
  ticker: 'MYCO',
  industry: 'Technology',
  jurisdiction: 'US',
  description: 'My company description'
})
```

## 🎨 Node Types

### Business Nodes
- `organization` - Companies, subsidiaries
- `role` - Job roles, departments
- `member` - People, team members
- `workflow` - Business processes
- `instrument` - Financial instruments, assets
- `contract` - Legal contracts, agreements
- `integration` - System integrations
- `trigger` - Event triggers
- `decision` - Decision points
- `splitter` - Resource distribution
- `payment` - Payment flows
- `wallets` - Cryptocurrency wallets
- `ai-agent` - AI/ML systems

### sCrypt Smart Contracts
- `scrypt-multisig` - Multi-signature contracts
- `scrypt-escrow` - Escrow contracts
- `scrypt-token` - Token contracts
- `scrypt-auction` - Auction contracts
- `scrypt-oracle` - Oracle contracts
- `scrypt-voting` - Voting contracts
- `scrypt-timelock` - Time-locked contracts
- `scrypt-nft` - NFT contracts

### Bitcoin Schema
- `schema-post` - Social media posts
- `schema-profile` - User profiles
- `schema-like` - Like interactions
- `schema-follow` - Follow relationships
- `schema-media` - Media content

## 🔍 Validation Rules

The system includes built-in validation:

- **Required Fields**: All workflows must have id, name, version, metadata, nodes, connections
- **Node References**: Connections must reference valid node IDs
- **Percentage Validation**: Distribution percentages can be validated to sum to 100%
- **Schema Compliance**: Nodes must use valid types from the enum
- **BSV Address Format**: Token addresses must be valid BSV Type 1 addresses

## 📊 Dashboard Features

The WorkflowDashboard component provides:

- **Folder Navigation**: Hierarchical folder browsing
- **Search & Filter**: Search by company, tags, industry, type
- **Grid/List Views**: Toggle between visual layouts
- **Statistics**: Overview of workflows, industries, nodes
- **Export Options**: JSON, YAML, CSV export formats

## 🔮 Future Enhancements

1. **Visual Editor**: Drag-and-drop workflow builder
2. **Real-time Collaboration**: Multi-user editing
3. **Version Control**: Git-like versioning for workflows
4. **Template Marketplace**: Share and discover workflow templates
5. **Analytics**: Workflow performance metrics
6. **Integration APIs**: Connect with external data sources
7. **Compliance Checking**: Automated regulatory compliance validation

## 📝 Adding New Companies

To add a new company workflow:

1. **Choose Industry Folder**: Select appropriate `industry/subcategory` folder
2. **Create JSON File**: Use company name format: `company-name.json`
3. **Follow Schema**: Use the JSON schema structure
4. **Validate**: Ensure all required fields are present
5. **Test**: Load in dashboard to verify structure

## 🤝 Contributing

When adding new workflows:

1. Follow the established folder structure
2. Use consistent naming conventions
3. Include comprehensive metadata
4. Add relevant tags for searchability
5. Validate against the JSON schema
6. Test in the dashboard

This system provides a scalable foundation for managing complex business workflow mappings across your 24+ companies! 🚀
