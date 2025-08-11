import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { authToken } = await request.json()

    if (!authToken) {
      return NextResponse.json(
        { error: 'authToken is required' },
        { status: 400 }
      )
    }

    console.log('Attempting to exchange authToken:', authToken.substring(0, 10) + '...')

    // Try to use the HandCash Connect SDK with proper error handling
    try {
      console.log('Attempting to load HandCash Connect SDK...')
      
      // Dynamic import with better error handling
      const { HandCashConnect } = await import('@handcash/handcash-connect')
      console.log('HandCash Connect SDK loaded successfully')
      
      // Initialize HandCash Connect
      const handCashConnect = new HandCashConnect({
        appId: process.env.NEXT_PUBLIC_HANDCASH_APP_ID!,
        appSecret: process.env.HANDCASH_APP_SECRET!,
      })
      console.log('HandCash Connect initialized')

      // Get account from authToken
      const account = handCashConnect.getAccountFromAuthToken(authToken)
      console.log('Account object created from authToken')
      
      // Get user profile information
      const { publicProfile, privateProfile } = await account.profile.getCurrentProfile()
      console.log('Profile data retrieved:', { publicProfile, privateProfile })
      
      // Get wallet information
      const spendableBalance = await account.wallet.getSpendableBalance()
      console.log('Wallet balance retrieved:', spendableBalance)
      
      const userData = {
        id: publicProfile.id,
        handle: publicProfile.handle,
        displayName: publicProfile.displayName,
        avatarUrl: publicProfile.avatarUrl,
        localCurrencyCode: publicProfile.localCurrencyCode,
        paymail: privateProfile?.paymail,
        phoneNumber: privateProfile?.phoneNumber,
        email: privateProfile?.email,
        spendableBalance,
      }

      console.log('Returning real HandCash user data:', userData)

      return NextResponse.json({
        access_token: authToken,
        user: userData,
        expires_in: 3600, // 1 hour
      })

    } catch (sdkError) {
      console.error('HandCash Connect SDK failed:', sdkError)
      console.error('SDK Error details:', {
        name: sdkError.name,
        message: sdkError.message,
        stack: sdkError.stack
      })
      
      // If SDK fails, return an error - no mock data
      return NextResponse.json(
        { 
          error: 'HandCash authentication failed',
          details: 'Unable to authenticate with HandCash. Please ensure your wallet is properly connected.',
          authToken: authToken.substring(0, 10) + '...'
        },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('HandCash token exchange error:', error)
    return NextResponse.json(
      { error: 'Failed to exchange authToken' },
      { status: 500 }
    )
  }
}
