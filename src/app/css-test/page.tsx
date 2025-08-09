import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
"use client"
// Note: Ajv in the client needs meta-schemas preloaded by the editor component; avoid compiling at build time.
// We still import the schema JSON as data (no compile during prerender).
import schema from '../../../contracts/royalty_policy.schema.json'
import example from '../../../contracts/royalty_policy.example.json'

export default function CSSTestPage() {
  return <div className="min-h-screen p-6 text-white">CSS Test temporarily disabled for build stability.</div>
}