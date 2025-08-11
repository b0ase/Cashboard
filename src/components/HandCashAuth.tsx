'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, LogOut, Wallet } from 'lucide-react'

export const HandCashAuthButton = () => {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSignIn = async () => {
    try {
      setSigningIn(true)
      setError('')
      
      // Clear any old session data first
      localStorage.removeItem('handcash_session')
      
      // Get the authorization URL and redirect directly
      const response = await fetch('/api/auth/handcash/redirect')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get authorization URL')
      }
      
      // Just redirect to HandCash - no popup bullshit
      window.location.href = data.authorization_url
      
    } catch (error: any) {
      console.error('Sign in failed:', error)
      let errorMessage = 'Sign in failed. Please try again.'
      
      // Handle specific error cases
      if (error.message?.includes('Failed to get authorization URL') || 
          error.message?.includes('HandCash App ID not configured')) {
        errorMessage = 'HandCash authentication temporarily unavailable. Please try again later.'
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
      setSigningIn(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
        <span className="text-sm text-gray-300">Loading...</span>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg p-2">
        <div className="flex items-center space-x-2 flex-1">
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.displayName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{user.displayName}</span>
            <span className="text-xs text-gray-400">@{user.handle}</span>
          </div>
        </div>
        
        {user.spendableBalance !== undefined && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 rounded">
            <Wallet className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400">
              {user.spendableBalance} {user.localCurrencyCode}
            </span>
          </div>
        )}
        
        <button
          onClick={signOut}
          className="p-1 hover:bg-red-500/20 rounded transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-gray-400 hover:text-red-400" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <button
        onClick={handleSignIn}
        disabled={signingIn}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-3 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg"
      >
        {signingIn ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            <span className="font-medium text-sm">Signing in...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="font-medium text-sm">Sign in with HandCash</span>
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-xs">
          {error}
        </div>
      )}
    </div>
  )
}

export const UserProfileCard = () => {
  const { user, isAuthenticated, refreshProfile } = useAuth()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await refreshProfile()
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    } finally {
      setRefreshing(false)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">HandCash Profile</h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="text-green-400 hover:text-green-300 disabled:opacity-50"
        >
          {refreshing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
          ) : (
            'Refresh'
          )}
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {user.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt={user.displayName}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        )}
        
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-white">{user.displayName}</h4>
          <p className="text-green-400">@{user.handle}</p>
          {user.paymail && (
            <p className="text-sm text-gray-400">{user.paymail}</p>
          )}
        </div>
      </div>

      {user.spendableBalance !== undefined && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">Spendable Balance</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">
            {user.spendableBalance} {user.localCurrencyCode}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-400">User ID:</span>
          <p className="text-white font-mono text-xs break-all">{user.id}</p>
        </div>
        {user.email && (
          <div>
            <span className="text-gray-400">Email:</span>
            <p className="text-white">{user.email}</p>
          </div>
        )}
        {user.phoneNumber && (
          <div>
            <span className="text-gray-400">Phone:</span>
            <p className="text-white">{user.phoneNumber}</p>
          </div>
        )}
        <div>
          <span className="text-gray-400">Currency:</span>
          <p className="text-white">{user.localCurrencyCode}</p>
        </div>
      </div>
    </div>
  )
}
