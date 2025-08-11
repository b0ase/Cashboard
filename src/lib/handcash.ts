// Client-side HandCash authentication utilities
// Note: HandCash Connect is only used server-side in API routes to avoid BSV WASM issues

export interface HandCashUser {
  id: string
  handle: string
  displayName: string
  avatarUrl?: string
  localCurrencyCode: string
  paymail?: string
  phoneNumber?: string
  email?: string
  spendableBalance?: number
}

export interface HandCashAuthResult {
  access_token: string
  user: HandCashUser
  expires_in: number
}

// Client-side authentication functions
export const HandCashAuth = {
  /**
   * Get the HandCash authorization URL
   */
  async getAuthorizationUrl(redirectUrl?: string): Promise<string> {
    const response = await fetch('/api/auth/handcash/redirect?' + new URLSearchParams({
      redirect_url: redirectUrl || `${window.location.origin}/auth/handcash/callback`
    }))
    
    if (!response.ok) {
      throw new Error('Failed to get authorization URL')
    }
    
    const { authorization_url } = await response.json()
    return authorization_url
  },

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<HandCashAuthResult> {
    const response = await fetch('/api/auth/handcash/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to exchange code for token')
    }

    return response.json()
  },

  /**
   * Get user profile using access token
   */
  async getUserProfile(accessToken: string): Promise<HandCashUser> {
    const response = await fetch('/api/auth/handcash/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch user profile')
    }

    const { user } = await response.json()
    return user
  },

  /**
   * Sign in with HandCash (opens popup window)
   */
  async signInWithHandCash(): Promise<HandCashAuthResult> {
    return new Promise(async (resolve, reject) => {
      try {
        const authUrl = await this.getAuthorizationUrl()
        
        // Generate state for security
        const state = Math.random().toString(36).substring(7)
        sessionStorage.setItem('handcash_oauth_state', state)
        
        // Add state to the auth URL
        const urlWithState = `${authUrl}&state=${state}`
        
        const popup = window.open(
          urlWithState,
          'handcash-auth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        )

        if (!popup) {
          reject(new Error('Failed to open popup window'))
          return
        }

        // Listen for messages from the popup
        const messageHandler = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return
          
          if (event.data.type === 'HANDCASH_AUTH_SUCCESS') {
            window.removeEventListener('message', messageHandler)
            popup.close()
            resolve(event.data.data)
          } else if (event.data.type === 'HANDCASH_AUTH_ERROR') {
            window.removeEventListener('message', messageHandler)
            popup.close()
            reject(new Error(event.data.error))
          }
        }

        window.addEventListener('message', messageHandler)

        // Check if popup was closed manually
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed)
            window.removeEventListener('message', messageHandler)
            reject(new Error('Authentication cancelled'))
          }
        }, 1000)
      } catch (error) {
        reject(error)
      }
    })
  },

  /**
   * Store user session in localStorage
   */
  storeUserSession(authResult: HandCashAuthResult): void {
    const sessionData = {
      accessToken: authResult.access_token,
      user: authResult.user,
      expiresAt: Date.now() + (authResult.expires_in * 1000),
    }
    localStorage.setItem('handcash_session', JSON.stringify(sessionData))
  },

  /**
   * Get stored user session
   */
  getStoredSession(): { accessToken: string; user: HandCashUser; expiresAt: number } | null {
    try {
      const stored = localStorage.getItem('handcash_session')
      if (!stored) return null
      
      const session = JSON.parse(stored)
      
      // Check if session is expired
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem('handcash_session')
        return null
      }
      
      return session
    } catch {
      return null
    }
  },

  /**
   * Clear stored session
   */
  clearSession(): void {
    localStorage.removeItem('handcash_session')
  },
}

// Note: Server-side HandCash Connect is initialized in API routes with dynamic imports
