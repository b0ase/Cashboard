import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Dynamic import to avoid loading BSV WASM during build
    const { HandCashConnect } = await import('@handcash/handcash-connect')
    
         const handCashConnect = new HandCashConnect({
       appId: process.env.NEXT_PUBLIC_HANDCASH_APP_ID!,
       appSecret: process.env.HANDCASH_APP_SECRET!,
     })

    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      )
    }

    const authToken = authHeader.substring(7) // Remove 'Bearer ' prefix
    const account = handCashConnect.getAccountFromAuthToken(authToken)
    
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

    return NextResponse.json({ user: userData })

  } catch (error) {
    console.error('HandCash profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}
