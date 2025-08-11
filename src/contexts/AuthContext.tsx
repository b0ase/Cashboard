'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { HandCashAuth, HandCashUser, HandCashAuthResult } from '@/lib/handcash'

interface AuthContextType {
  user: HandCashUser | null
  isAuthenticated: boolean
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<HandCashUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      const session = HandCashAuth.getStoredSession()
      if (session) {
        setUser(session.user)
      }
      setIsLoading(false)
    }

    checkExistingSession()
  }, [])

  const signIn = async () => {
    try {
      setIsLoading(true)
      const authResult: HandCashAuthResult = await HandCashAuth.signInWithHandCash()
      HandCashAuth.storeUserSession(authResult)
      setUser(authResult.user)
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    HandCashAuth.clearSession()
    setUser(null)
  }

  const refreshProfile = async () => {
    const session = HandCashAuth.getStoredSession()
    if (!session) return

    try {
      const updatedUser = await HandCashAuth.getUserProfile(session.accessToken)
      const updatedSession = {
        ...session,
        user: updatedUser,
      }
      localStorage.setItem('handcash_session', JSON.stringify(updatedSession))
      setUser(updatedUser)
    } catch (error) {
      console.error('Failed to refresh profile:', error)
      // If refresh fails, sign out the user
      signOut()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
