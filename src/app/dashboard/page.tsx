'use client'

import Link from 'next/link'
import {
  BookOpen,
  Globe,
  Users,
  Building2,
  DollarSign,
  Tag,
  MessageSquare,
  HelpCircle,
  Home,
  ExternalLink,
} from 'lucide-react'

const cards = [
  {
    title: 'Canvas',
    description: 'Visual workflow canvas and demos',
    href: '/',
    icon: Home,
    external: false,
  },
  {
    title: 'Cash Handles',
    description: 'Manage and explore cash handles',
    href: '/cash-handles',
    icon: Users,
    external: false,
  },
  {
    title: 'Organizations',
    description: 'Organize entities and roles',
    href: '/organizations',
    icon: Building2,
    external: false,
  },
  {
    title: 'Dividends',
    description: 'Distribute payouts to holders',
    href: '/dividends',
    icon: DollarSign,
    external: false,
  },
  {
    title: 'Labels',
    description: 'Tag and categorize items',
    href: '/labels',
    icon: Tag,
    external: false,
  },
  {
    title: 'Product Docs',
    description: 'Guides and concepts for Cashboard',
    href: '/PRODUCT_DOCUMENTATION.md',
    icon: BookOpen,
    external: true,
  },
  {
    title: 'Workflow System',
    description: 'Architecture and flow diagrams',
    href: '/WORKFLOW_SYSTEM.md',
    icon: Globe,
    external: true,
  },
  {
    title: 'HandCash Setup',
    description: 'Connect HandCash and authenticate',
    href: '/HANDCASH_SETUP.md',
    icon: HelpCircle,
    external: true,
  },
  {
    title: 'Community & Feedback',
    description: 'Join discussions and share ideas',
    href: 'https://github.com/b0ase/cashboard/discussions',
    icon: MessageSquare,
    external: true,
  },
]

export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto">
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">CashBoard Dashboard</h1>
        <p className="text-gray-300 mt-2">Your home base for navigation, docs, and community.</p>
      </section>

      {/* Video Demo Section */}
      <section className="mb-12">
        <div className="glass-card p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <span className="text-blue-400">🎬</span>
            Cashboard Demo Video
          </h2>
          <p className="text-gray-300 mb-6">
            Watch a demonstration of Cashboard's workflow management and canvas features.
          </p>
          <div className="relative w-full max-w-4xl mx-auto">
            <video
              controls
              className="w-full rounded-lg shadow-2xl"
              poster="/cashboard.png"
              preload="metadata"
            >
              <source src="/cashboard.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                Click play to watch the full Cashboard demonstration
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          const content = (
            <div className="glass-card p-5 h-full transition-transform duration-200 hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <p className="text-sm text-gray-300">{card.description}</p>
                  </div>
                </div>
                {card.external && <ExternalLink className="w-4 h-4 text-gray-400" />}
              </div>
            </div>
          )

          if (card.external) {
            return (
              <a key={card.title} href={card.href} target="_blank" rel="noreferrer" className="block">
                {content}
              </a>
            )
          }

          return (
            <Link key={card.title} href={card.href} className="block">
              {content}
            </Link>
          )
        })}
      </section>
    </main>
  )
}


