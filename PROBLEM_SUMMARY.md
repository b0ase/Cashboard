# Add Nodes Palette Modal Issues - Problem Summary

## Problem Description
The Add Nodes Palette in both the main CASHBOARD dashboard and the Workflow Canvas is not working correctly for the "People" (member) button.

## Current Issues

### 1. Workflow Canvas Add Nodes Palette
- **Button**: "People" button in Business category
- **Expected**: Should show actual team members (Alice, Bob, Sarah, Mike, Emma, David)
- **Actual**: Shows AI agents instead:
  - Marketing AI Agent
  - Trading Bot  
  - Customer Service AI
  - Content Generator AI
  - Data Analysis AI
  - SEO Optimization AI
  - Lead Generation AI
  - Inventory Management AI
  - Financial Advisor AI
  - Quality Assurance AI
  - HR Recruitment AI
  - Competitive Analysis AI
  - Social Media AI Manager
  - Email Marketing AI
  - Fraud Detection AI

### 2. CASHBOARD Dashboard Add Nodes Palette
- **Button**: "People" button in Business category  
- **Expected**: Should show actual team members with detailed profiles
- **Actual**: Shows nothing (empty modal)

## Root Cause Analysis

### Data Source Mismatch
- **Workflow Canvas**: Somehow using `agentTemplates` array instead of `organizations.flatMap(o => o.members)`
- **Main Dashboard**: Modal logic exists but data not displaying correctly

### Modal Structure
- Only one modal (`showBusinessModal`) exists
- Used by both dashboard contexts
- Modal logic includes special handling for `member` type
- Should show detailed member profiles with wallet badges, KYC status, etc.

## Expected Behavior
When "People" button is clicked, modal should show:
- Alice Johnson (HandCash, ✓ Approved)
- Bob Smith (Phantom, ⏳ Pending)  
- Sarah Wilson (MetaMask, ✓ Approved)
- Mike Chen (HandCash, ✗ Rejected)
- Emma Davis (Bitcoin, ✓ Approved)
- David Wilson (Ethereum, ⏳ Pending)

## Files Involved
- `src/app/page.tsx` - Main modal logic and data arrays
- Modal rendering around line 8489
- `agentTemplates` array around line 8707
- `organizations` array around line 738

## Next Steps
1. Identify why Workflow Canvas uses wrong data source
2. Fix modal data source selection logic
3. Ensure both contexts show actual team members
4. Test modal functionality in both environments
