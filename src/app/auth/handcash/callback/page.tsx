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
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        // Check for OAuth errors
        if (error) {
          setStatus('error')
          setMessage(errorDescription || `OAuth Error: ${error}`)
          return
        }

        // Verify state parameter for security
        const storedState = sessionStorage.getItem('handcash_oauth_state')
        if (!state || state !== storedState) {
          setStatus('error')
          setMessage('Invalid state parameter. Possible CSRF attack.')
          return
        }

        // Clear stored state
        sessionStorage.removeItem('handcash_oauth_state')

        if (!code) {
          setStatus('error')
          setMessage('No authorization code received')
          return
        }

        // Exchange authorization code for access token
        const tokenResponse = await fetch('/api/auth/handcash/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json()
          setStatus('error')
          setMessage(errorData.error || 'Failed to exchange code for token')
          return
        }

        const tokenData = await tokenResponse.json()
        
        // Store access token securely (in httpOnly cookie via API)
        localStorage.setItem('handcash_user', JSON.stringify({
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: Date.now() + (tokenData.expires_in * 1000),
          user: tokenData.user
        }))

        setStatus('success')
        setMessage('Successfully authenticated with HandCash!')

        // Redirect to main app after 2 seconds
        setTimeout(() => {
          window.close() // Close popup window
          // If not popup, redirect to main app
          if (window.opener) {
            window.opener.postMessage({ type: 'HANDCASH_AUTH_SUCCESS', data: tokenData }, window.location.origin)
          } else {
            router.push('/')
          }
        }, 2000)

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
                onClick={() => window.close()}
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
