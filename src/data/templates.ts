// Shared accessors for dashboard template data. These try to read the live
// arrays exposed by the app (assigned to window.__templates in page.tsx).
// They fall back to small stubs in dev if not present.

export type TemplateItem = { id?: string; name: string; description?: string; icon?: string; country?: string; type?: string; code?: string; size?: string; category?: string }

type TemplateBag = {
  organizationTemplates?: TemplateItem[]
  roleTemplates?: TemplateItem[]
  agentTemplates?: TemplateItem[]
  instrumentTemplates?: TemplateItem[]
  contractTemplates?: TemplateItem[]
  integrationTemplates?: TemplateItem[]
}

function readBag(): TemplateBag | null {
  if (typeof window === 'undefined') return null
  const bag = (window as any).__templates as TemplateBag | undefined
  if (bag) return bag
  try {
    const raw = localStorage.getItem('__templates')
    return raw ? (JSON.parse(raw) as TemplateBag) : null
  } catch {
    return null
  }
}

const stubs = {
  organizationTemplates: [
    // Corporations
    { id: 'tech-corp', name: 'Technology Corporation', description: 'Software development and technology services company', icon: '🏢', country: 'US', type: 'CORPORATION', code: 'TECH', size: 'medium', category: 'Technology' },
    { id: 'manu-corp', name: 'Manufacturing Corp', description: 'Industrial manufacturing and production company', icon: '🏭', country: 'US', type: 'CORPORATION', code: 'MANU', size: 'large', category: 'Manufacturing' },
    { id: 'fins-corp', name: 'Financial Services Inc', description: 'Banking and financial services corporation', icon: '🏦', country: 'US', type: 'CORPORATION', code: 'FINS', size: 'enterprise', category: 'Financial Services' },
    { id: 'hlth-corp', name: 'Healthcare Systems Corp', description: 'Healthcare services and medical technology', icon: '🏥', country: 'US', type: 'CORPORATION', code: 'HLTH', size: 'large', category: 'Healthcare' },
    
    // LLCs
    { id: 'crtv-llc', name: 'Creative Studio LLC', description: 'Creative design and marketing agency', icon: '🎨', country: 'US', type: 'LLC', code: 'CRTV', size: 'small', category: 'Creative Services' },
    { id: 'real-llc', name: 'Real Estate Holdings LLC', description: 'Property investment and management company', icon: '🏠', country: 'US', type: 'LLC', code: 'REAL', size: 'medium', category: 'Real Estate' },
    { id: 'cons-llc', name: 'Consulting Group LLC', description: 'Business strategy and management consulting', icon: '💼', country: 'US', type: 'LLC', code: 'CONS', size: 'small', category: 'Consulting' },
    { id: 'food-llc', name: 'Food & Beverage LLC', description: 'Restaurant and food service operations', icon: '🍽️', country: 'US', type: 'LLC', code: 'FOOD', size: 'medium', category: 'Food & Beverage' },
    
    // UK Corporations
    { id: 'inno-ltd', name: 'Innovation Labs Ltd', description: 'R&D and innovation services company', icon: '🔬', country: 'UK', type: 'CORPORATION', code: 'INNO', size: 'medium', category: 'Research & Development' },
    { id: 'digi-ltd', name: 'Digital Marketing Ltd', description: 'Digital marketing and advertising agency', icon: '📱', country: 'UK', type: 'CORPORATION', code: 'DIGI', size: 'small', category: 'Marketing' },
    { id: 'logi-ltd', name: 'Logistics Solutions Ltd', description: 'Supply chain and logistics management', icon: '🚛', country: 'UK', type: 'CORPORATION', code: 'LOGI', size: 'large', category: 'Logistics' },
    { id: 'gren-ltd', name: 'Green Energy Ltd', description: 'Renewable energy solutions provider', icon: '🌱', country: 'UK', type: 'CORPORATION', code: 'GREN', size: 'medium', category: 'Energy' },
    
    // Nonprofits
    { id: 'educ-np', name: 'Education Foundation', description: 'Educational programs and scholarship foundation', icon: '📚', country: 'US', type: 'NONPROFIT', code: 'EDUC', size: 'medium', category: 'Education' },
    { id: 'envr-np', name: 'Environmental Alliance', description: 'Environmental conservation and advocacy organization', icon: '🌍', country: 'US', type: 'NONPROFIT', code: 'ENVR', size: 'large', category: 'Environmental' },
    { id: 'comm-np', name: 'Community Health Network', description: 'Community healthcare services and clinics', icon: '🏥', country: 'US', type: 'NONPROFIT', code: 'COMM', size: 'large', category: 'Healthcare' },
    { id: 'arts-np', name: 'Arts & Culture Society', description: 'Arts education and cultural preservation', icon: '🎭', country: 'US', type: 'NONPROFIT', code: 'ARTS', size: 'medium', category: 'Arts & Culture' },
    
    // Charities
    { id: 'chld-ch', name: 'Children\'s Welfare Charity', description: 'Child welfare and family support services', icon: '👶', country: 'UK', type: 'CHARITY', code: 'CHLD', size: 'large', category: 'Social Services' },
    { id: 'food-ch', name: 'Food Bank Network', description: 'Food distribution and hunger relief', icon: '🍞', country: 'US', type: 'CHARITY', code: 'FOOD', size: 'medium', category: 'Social Services' },
    { id: 'anim-ch', name: 'Animal Rescue Foundation', description: 'Animal rescue and rehabilitation services', icon: '🐕', country: 'CA', type: 'CHARITY', code: 'ANIM', size: 'medium', category: 'Animal Welfare' },
    { id: 'emer-ch', name: 'Disaster Relief Fund', description: 'Emergency response and disaster relief', icon: '🚨', country: 'US', type: 'CHARITY', code: 'EMER', size: 'large', category: 'Emergency Services' },
    
    // Sole Proprietorships
    { id: 'cafe-sp', name: 'Local Coffee Shop', description: 'Neighborhood coffee shop and bakery', icon: '☕', country: 'US', type: 'SOLE_PROPRIETORSHIP', code: 'CAFE', size: 'startup', category: 'Food & Beverage' },
    { id: 'crft-sp', name: 'Handcraft Store', description: 'Handmade crafts and artisan goods', icon: '🧶', country: 'US', type: 'SOLE_PROPRIETORSHIP', code: 'CRFT', size: 'startup', category: 'Retail' },
    { id: 'auto-sp', name: 'Auto Repair Shop', description: 'Automotive repair and maintenance services', icon: '🔧', country: 'US', type: 'LLC', code: 'AUTO', size: 'small', category: 'Automotive' },
    { id: 'fit-sp', name: 'Fitness Studio', description: 'Personal training and fitness classes', icon: '💪', country: 'US', type: 'LLC', code: 'FIT', size: 'small', category: 'Health & Fitness' },
    
    // Partnerships
    { id: 'law-part', name: 'Legal Partnership', description: 'Law firm partnership specializing in corporate law', icon: '⚖️', country: 'US', type: 'PARTNERSHIP', code: 'LAW', size: 'medium', category: 'Legal Services' },
    { id: 'med-part', name: 'Medical Practice', description: 'Multi-physician medical practice', icon: '👩‍⚕️', country: 'US', type: 'PARTNERSHIP', code: 'MED', size: 'medium', category: 'Healthcare' },
    { id: 'cpa-part', name: 'Accounting Firm', description: 'CPA firm providing accounting services', icon: '📊', country: 'US', type: 'PARTNERSHIP', code: 'CPA', size: 'medium', category: 'Professional Services' },
    { id: 'arch-part', name: 'Architecture Studio', description: 'Architectural design and planning services', icon: '🏗️', country: 'US', type: 'PARTNERSHIP', code: 'ARCH', size: 'small', category: 'Architecture' },
    
    // Cooperatives
    { id: 'farm-coop', name: 'Farmers Cooperative', description: 'Agricultural cooperative for local farmers', icon: '🚜', country: 'US', type: 'COOPERATIVE', code: 'FARM', size: 'large', category: 'Agriculture' },
    { id: 'work-coop', name: 'Workers Cooperative', description: 'Worker-owned manufacturing cooperative', icon: '👷', country: 'US', type: 'COOPERATIVE', code: 'WORK', size: 'medium', category: 'Manufacturing' },
    { id: 'home-coop', name: 'Housing Cooperative', description: 'Residential housing cooperative', icon: '🏘️', country: 'US', type: 'COOPERATIVE', code: 'HOME', size: 'large', category: 'Real Estate' },
    { id: 'cred-coop', name: 'Credit Union', description: 'Member-owned financial cooperative', icon: '🏛️', country: 'US', type: 'COOPERATIVE', code: 'CRED', size: 'large', category: 'Financial Services' },
    
    // International
    { id: 'trad-au', name: 'Global Trading Pty Ltd', description: 'International trade and export company', icon: '🌏', country: 'AU', type: 'CORPORATION', code: 'TRAD', size: 'large', category: 'Import/Export' },
    { id: 'euro-de', name: 'European Consulting GmbH', description: 'Management consulting across Europe', icon: '🇪🇺', country: 'DE', type: 'CORPORATION', code: 'EURO', size: 'medium', category: 'Consulting' },
    { id: 'asia-sg', name: 'Asian Holdings Pte Ltd', description: 'Investment holding company in Asia', icon: '🏙️', country: 'SG', type: 'CORPORATION', code: 'ASIA', size: 'large', category: 'Investment' },
    { id: 'frin-fr', name: 'French Innovation SARL', description: 'French technology innovation company', icon: '🇫🇷', country: 'FR', type: 'CORPORATION', code: 'FRIN', size: 'medium', category: 'Technology' },
  ],
  roleTemplates: [
    { name: 'CEO' },
    { name: 'CTO' },
    { name: 'CMO' },
  ],
  agentTemplates: [
    { name: 'Ops Agent' },
    { name: 'Finance Agent' },
  ],
  instrumentTemplates: [
    { name: 'Common Stock', description: 'equity • Equity — Supply: 1,000,000', icon: '📈' },
    { name: 'Preferred Shares', description: 'equity • Equity — Supply: 100,000', icon: '⭐' },
    { name: 'Employee Stock Options', description: 'equity • Equity — Supply: 50,000', icon: '👥' },
    { name: 'Startup Equity', description: 'equity • Equity — Supply: 10,000,000', icon: '🚀' },
    { name: 'Corporate Bond', description: 'debt • Debt — Supply: 1,000', icon: '🏛️' },
    { name: 'Convertible Note', description: 'debt • Debt — Supply: 500', icon: '🔄' },
    { name: 'Revenue Bond', description: 'debt • Debt — Supply: 2,000', icon: '💰' },
    { name: 'Green Bond', description: 'debt • Debt — Supply: 1,500', icon: '🌱' },
    { name: 'Platform Utility Token', description: 'utility • Utility — Supply: 100,000,000', icon: '🔧' },
    { name: 'Gaming Token', description: 'utility • Utility — Supply: 1,000,000,000', icon: '🎮' },
    { name: 'Loyalty Points', description: 'utility • Utility — Supply: 50,000,000', icon: '🎁' },
    { name: 'Access Token', description: 'utility • Utility — Supply: 10,000,000', icon: '🔑' },
    { name: 'DAO Governance Token', description: 'governance • Governance — Supply: 21,000,000', icon: '🗳️' },
    { name: 'Protocol Governance', description: 'governance • Governance — Supply: 100,000,000', icon: '⚖️' },
    { name: 'Community Token', description: 'governance • Governance — Supply: 1,000,000', icon: '🏛️' },
    { name: 'Voting Rights', description: 'governance • Governance — Supply: 500,000', icon: '✅' },
    { name: 'Cashback Rewards', description: 'reward • Reward — Supply: 100,000,000', icon: '💸' },
    { name: 'Staking Rewards', description: 'reward • Reward — Supply: 50,000,000', icon: '📊' },
    { name: 'Achievement Points', description: 'reward • Reward — Supply: 10,000,000', icon: '🏆' },
    { name: 'Referral Bonus', description: 'reward • Reward — Supply: 25,000,000', icon: '🤝' },
    { name: 'Stock Option', description: 'derivative • Derivative — Supply: 100,000' },
    { name: 'Futures Contract', description: 'derivative • Derivative — Supply: 10,000' },
    { name: 'Warrant', description: 'derivative • Derivative — Supply: 50,000' },
    { name: 'Swap Contract', description: 'derivative • Derivative — Supply: 1,000' },
    { name: 'Convertible Preferred', description: 'hybrid • Hybrid — Supply: 75,000' },
    { name: 'Equity-Linked Note', description: 'hybrid • Hybrid — Supply: 5,000' },
    { name: 'Mezzanine Financing', description: 'hybrid • Hybrid — Supply: 25,000' },
    { name: 'REIT Shares', description: 'hybrid • Hybrid — Supply: 200,000' },
    { name: 'Carbon Credits', description: 'utility • Environmental — Supply: 1,000,000' },
    { name: 'Renewable Energy Credits', description: 'utility • Environmental — Supply: 500,000' },
    { name: 'Intellectual Property Rights', description: 'equity • Rights — Supply: 100,000' },
    { name: 'Music Royalties', description: 'equity • Rights — Supply: 1,000,000' },
    { name: 'Stablecoin', description: 'utility • Digital Currency — Supply: 1,000,000,000' },
    { name: 'Central Bank Digital Currency', description: 'utility • Digital Currency — Supply: 10,000,000,000' },
    { name: 'DeFi Protocol Token', description: 'governance • DeFi — Supply: 100,000,000' },
    { name: 'Yield Farming Token', description: 'reward • DeFi — Supply: 50,000,000' },
    { name: 'Cash', description: 'utility • Cash & Equivalents — Supply: 100,000,000' },
    { name: 'Money Market Fund', description: 'utility • Cash & Equivalents — Supply: 10,000,000' },
    { name: 'Treasury Bills', description: 'debt • Cash & Equivalents — Supply: 50,000' },
    { name: 'Commercial Paper', description: 'debt • Cash & Equivalents — Supply: 25,000' },
    { name: 'Discount Coupon', description: 'reward • Coupons — Supply: 1,000,000' },
    { name: 'Gift Voucher', description: 'reward • Coupons — Supply: 100,000' },
    { name: 'Store Credit', description: 'reward • Coupons — Supply: 500,000' },
    { name: 'Promotional Code', description: 'reward • Coupons — Supply: 2,000,000' },
    { name: 'Insurance Policy', description: 'hybrid • Insurance — Supply: 10,000' },
    { name: 'Warranty Token', description: 'hybrid • Insurance — Supply: 100,000' },
    { name: 'Health Insurance', description: 'hybrid • Insurance — Supply: 50,000' },
    { name: 'Life Insurance', description: 'hybrid • Insurance — Supply: 25,000' },
    { name: 'Gold Token', description: 'utility • Commodities — Supply: 1,000,000' },
    { name: 'Silver Token', description: 'utility • Commodities — Supply: 10,000,000' },
    { name: 'Copper Token', description: 'utility • Commodities — Supply: 50,000,000' },
    { name: 'Platinum Token', description: 'utility • Commodities — Supply: 100,000' },
    { name: 'Natural Gas Futures', description: 'derivative • Commodities — Supply: 25,000' },
    { name: 'Wheat Futures', description: 'derivative • Commodities — Supply: 100,000' },
    { name: 'Coffee Futures', description: 'derivative • Commodities — Supply: 50,000' },
    { name: 'Lithium Token', description: 'utility • Commodities — Supply: 1,000,000' },
    { name: 'Real Estate Token', description: 'equity • Alternative — Supply: 100,000' },
    { name: 'Commercial Real Estate', description: 'equity • Alternative — Supply: 50,000' },
    { name: 'Infrastructure Fund', description: 'equity • Alternative — Supply: 25,000' },
    { name: 'Collectible Cars', description: 'equity • Alternative — Supply: 1,000' },
    { name: 'Sports Memorabilia', description: 'equity • Alternative — Supply: 10,000' },
    { name: 'Timber Investment', description: 'equity • Alternative — Supply: 100,000' },
    { name: 'Auto Insurance', description: 'hybrid • Insurance — Supply: 100,000' },
    { name: 'Property Insurance', description: 'hybrid • Insurance — Supply: 75,000' },
    { name: 'Cyber Insurance', description: 'hybrid • Insurance — Supply: 25,000' },
    { name: 'Travel Insurance', description: 'hybrid • Insurance — Supply: 200,000' },
    { name: 'Exchange Traded Fund', description: 'equity • Structured — Supply: 1,000,000' },
    { name: 'Index Fund', description: 'equity • Structured — Supply: 5,000,000' },
    { name: 'Mutual Fund', description: 'equity • Structured — Supply: 2,000,000' },
    { name: 'Solar Energy Credits', description: 'utility • Environmental — Supply: 1,000,000' },
    { name: 'Wind Energy Credits', description: 'utility • Environmental — Supply: 750,000' },
    { name: 'Film Royalties', description: 'equity • Rights — Supply: 100,000' },
    { name: 'Patent Rights', description: 'equity • Rights — Supply: 50,000' },
    { name: 'Software License', description: 'utility • Rights — Supply: 1,000,000' },
  ],
  contractTemplates: [
    { name: 'NDA' },
    { name: 'Service Agreement' },
    { name: 'Licensing' },
  ],
  integrationTemplates: [
    { name: 'DocuSign' },
    { name: 'Payment Gateway' },
    { name: 'Email Notifications' },
  ],
}

export const getOrganizationTemplates = () => readBag()?.organizationTemplates || stubs.organizationTemplates
export const getRoleTemplates = () => readBag()?.roleTemplates || stubs.roleTemplates
export const getAgentTemplates = () => readBag()?.agentTemplates || stubs.agentTemplates
export const getInstrumentTemplates = () => readBag()?.instrumentTemplates || stubs.instrumentTemplates
export const getContractTemplates = () => readBag()?.contractTemplates || stubs.contractTemplates
export const getIntegrationTemplates = () => readBag()?.integrationTemplates || stubs.integrationTemplates


