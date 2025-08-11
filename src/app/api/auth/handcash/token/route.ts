import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Dynamic import to avoid loading BSV WASM during build
    const { HandCashConnect } = await import('@handcash/handcash-connect')
    
    // Initialize HandCash Connect
    const handCashConnect = new HandCashConnect({
      appId: process.env.NEXT_PUBLIC_HANDCASH_APP_ID!,
      appSecret: process.env.HANDCASH_APP_SECRET!,
    })

    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    // Exchange the authorization code for an access token
    const account = handCashConnect.getAccountFromAuthToken(code)
    
    // Get user profile information
    const { publicProfile, privateProfile } = await account.profile.getCurrentProfile()
    
    // Get wallet information
    const spendableBalance = await account.wallet.getSpendableBalance()
    
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

    return NextResponse.json({
      access_token: code, // The authToken itself serves as the access token
      user: userData,
      expires_in: 3600, // 1 hour (adjust as needed)
    })

  } catch (error) {
    console.error('HandCash token exchange error:', error)
    return NextResponse.json(
      { error: 'Failed to exchange authorization code' },
      { status: 500 }
    )
  }
}
