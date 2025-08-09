# Cashboard – Contextual Knowledge

## What Cashboard Is

Cashboard is an AI‑assisted business operations platform that helps teams visualize, automate, and audit money and work flows. It combines four core concepts:

- Cash handles (people/accounts you pay or receive from)
- Organizations (groups of cash handles with roles and share allocations)
- Dividends (revenue sharing and payouts)
- Visual flows (diagrammed processes for payments, tasks, and decisions)

The long‑term vision is a system where natural‑language instructions can create and operate workflows (e.g., “Split 30% of weekly revenue across marketing team, pay monthly dividends to shareholders pro‑rata, pause if cash runway < 6 months”).

## How It Compares (n8n → Cashboard)

- n8n focuses on automating app‑to‑app integrations and data pipes. Cashboard operates one level higher: the organization itself is the primary model.
- In Cashboard, workflows are anchored to organizational structure (roles, members, equity) and to money movement (payments, revenue, dividends).
- n8n uses generic nodes; Cashboard introduces business‑native nodes (Payments, Contracts, Dividends, Teams, Milestones) with built‑in policy and audit.
- AI is first‑class in Cashboard: users describe business logic in natural language; the system drafts flows and contracts.

## Why It Exists

Modern teams juggle payments, roles, contracts, and operational steps across many tools. Cashboard aligns these into one surface:

- See how money flows through the business
- Assign work and permissions by role and organization
- Automate recurring payments and dividend distributions
- Eventually: describe operations in plain English and let AI build and run them

## Key Product Concepts

- Cash Handle: A person/account identified by a handle (e.g., HandCash `$alice`) with attributes like role, labels, and balance.
- Organization: A collection of handles with role‑based permissions and optional token/share allocation.
- Dividends: Payouts to members or shareholders, manual or automated, with history and status.
- Labels: Lightweight tagging to categorize handles across orgs.
- Visual Flow: A canvas of nodes and connections modeling tasks, decisions, contracts, payments, and milestones.

## Tabs and Canvas: How the UI Fits Together

- Dashboard (planned): High‑level KPIs and recent activity.
- Cash Handles: People/accounts (e.g., HandCash `$alice`) with roles, labels, and balances.
- Organizations: Groups of handles, token/share allocations, role‑based permissions.
- Dividends: Compose and track payouts to members/shareholders.
- Labels: Cross‑org categorization and filtering.
- Canvas (planned): Visual editor/executor for flows; today, the Demo Modal simulates revenue → dividend distribution as a preview of real‑time micropayment flows.

## Current Implementation (MVP Status)

Implemented (UI with mock data):
- Cash Handles: searchable list with roles, labels, balances
- Organizations: dashboard with stats and member handles
- Dividends: quick‑send UI, transaction list with statuses
- Labels: tag management UI with usage counts
- Demo Modal: live animated demonstration of real‑time revenue → dividend distribution

Planned/Spec’d (not yet implemented in code):
- Full visual flow editor and executor (nodes and connections as described in Flow Diagram Features)
- AI assistant for natural‑language creation and operations
- On‑chain token/share integration and automated contract generation
- CRM/CMS/Sheets, Google OAuth, Stripe integrations

## Contracts, Instruments, and Tokenized Equity

- Dual‑format contracts: AI drafts human‑readable contracts with machine‑readable metadata (clauses, KPIs, triggers) to drive automation.
- Instruments: Reusable primitives (e.g., revenue split, vesting schedule, milestone escrow) that slot into flows like lego blocks.
- Tokenized equity: Organizations can issue shares on‑chain; dividend and vesting nodes reference the cap table to enforce payouts.

## UX and Visual Language

- App Router Next.js app styled with Tailwind.
- Glassmorphism cards and buttons (`glass`, `glass-card`, `glass-button`).
- Dark theme baseline; responsive layouts.

## Technical Snapshot

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Lucide icons
- State: Local component state for MVP and demo; centralized state planned
- Styling: Tailwind utilities with a small components layer; CSS simplified to avoid variable/@apply conflicts

## Composability and Integrations

- Adaptors: Payment rails (e.g., HandCash/BSV, cards), identity (Google), billing (Stripe), CRM/CMS/Sheets.
- Policy layer: Role/permission checks and guardrails on every execution step.
- Deterministic core with idempotent side‑effects; audit trail for decisions and money movement.

## Non‑Goals (for now)

- On‑chain execution in MVP (design/spec only)
- Legal enforceability of generated contracts (future integration)
- Multi‑tenant enterprise/security controls (planned later)

## How to Talk About Cashboard

- Elevator: “Cashboard lets teams see and automate how money and work move through their business—even distributing dividends in real‑time—today as a guided UI, tomorrow by describing it in plain English.”
- Benefits: Single surface for ops; fewer tools; clearer money flow; automation without code; future AI co‑pilot

## Source of Truth for Features

- Product overview and roadmap: `PRODUCT_DOCUMENTATION.md`
- Visual flows spec and terminology: `FLOW_DIAGRAM_FEATURES.md`
- CSS and design system guidance: `CSS_ISSUES_ANALYSIS.md` (now includes the resolved approach)
 - Project entry point and documentation map: `README.md`

## Open Questions to Resolve Next

- Data model and persistence (where to store orgs/handles/dividends/flows)
- Permission model granularity across orgs and roles
- Declarative flow runtime and scheduler design
- HandCash and tokenization integration boundaries in MVP vs. later

## Documentation Map

- Context and positioning: `CONTEXTUAL_KNOWLEDGE.md`
- Product overview and roadmap: `PRODUCT_DOCUMENTATION.md`
- Flow editor specification: `FLOW_DIAGRAM_FEATURES.md`
- CSS/design system guidance: `CSS_ISSUES_ANALYSIS.md`
- Entry point and links: `README.md`


