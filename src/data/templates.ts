// Shared accessors for dashboard template data. These try to read the live
// arrays exposed by the app (assigned to window.__templates in page.tsx).
// They fall back to small stubs in dev if not present.

export type TemplateItem = { id?: string; name: string; description?: string }

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
    { name: 'Delaware C‑Corp' },
    { name: 'Wyoming LLC' },
    { name: 'Nonprofit' },
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
    { name: 'Common Stock' },
    { name: 'Access Token' },
    { name: 'Royalty Share' },
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


