import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cashboard - Cash Handle Management",
  description: "Manage cash handles, organizations, and send dividends with ease",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <div className="relative">
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-gray-900/30 to-black/50 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="w-full p-6">
                  <Navigation />
                  {children}
                </div>
              </div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}