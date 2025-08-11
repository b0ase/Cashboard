'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function HandCashCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const authToken = searchParams.get('authToken')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        // Check for HandCash errors
        if (error) {
          setStatus('error')
          setMessage(errorDescription || `HandCash Error: ${error}`)
          return
        }

        if (!authToken) {
          setStatus('error')
          setMessage('No authToken received from HandCash')
          return
        }

        console.log('Using authToken for authentication:', authToken.substring(0, 10) + '...')
        
        // Use the real HandCash API endpoint (not mock)
        const tokenResponse = await fetch('/api/auth/handcash/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ authToken }),
        })
        
        console.log('Token response status:', tokenResponse.status)

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json()
          setStatus('error')
          setMessage(errorData.error || 'Failed to exchange authToken')
          return
        }

        const tokenData = await tokenResponse.json()
        console.log('Token data received:', tokenData)
        
        // Store user session
        const sessionData = {
          accessToken: tokenData.access_token,
          user: tokenData.user,
          expiresAt: Date.now() + (tokenData.expires_in * 1000),
        }
        console.log('Storing session:', sessionData)
        localStorage.setItem('handcash_session', JSON.stringify(sessionData))

        setStatus('success')
        setMessage('Successfully authenticated with HandCash!')

        // Trigger a custom event to notify the main window
        window.dispatchEvent(new CustomEvent('handcash-auth-success'))

        // Redirect to main app after 1 second
        setTimeout(() => {
          router.push('/')
        }, 1000)

      } catch (error) {
        console.error('HandCash callback error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred during authentication')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <h2 className="text-xl font-semibold text-white mb-2">Processing HandCash Authentication</h2>
              <p className="text-gray-400">Please wait while we complete your sign-in...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Authentication Successful!</h2>
              <p className="text-gray-400 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting you back to the app...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Authentication Failed</h2>
              <p className="text-gray-400 mb-4">{message}</p>
              <button
                onClick={() => {
                  // Try multiple ways to close/redirect
                  try {
                    // First try to close the window (works if opened by JavaScript)
                    window.close()
                    
                    // If window.close() doesn't work, redirect to main page after a short delay
                    setTimeout(() => {
                      if (!window.closed) {
                        window.location.href = '/'
                      }
                    }, 100)
                  } catch (error) {
                    // Fallback: redirect to main page
                    window.location.href = '/'
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HandCashCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-full max-w-md text-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">Loading Authentication</h2>
            <p className="text-gray-400">Please wait...</p>
          </div>
        </div>
      </div>
    }>
      <HandCashCallbackContent />
    </Suspense>
  )
}
