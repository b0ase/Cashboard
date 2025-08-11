import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Dynamic import to avoid loading BSV WASM during build
    const { HandCashConnect } = await import('@handcash/handcash-connect')
    
    const handCashConnect = new HandCashConnect({
      appId: process.env.HANDCASH_APP_ID!,
      appSecret: process.env.HANDCASH_APP_SECRET!,
    })

    const { searchParams } = new URL(request.url)
    const redirectUrl = searchParams.get('redirect_url') || `${request.nextUrl.origin}/auth/handcash/callback`
    
    // Generate the HandCash authorization URL
    const authorizationUrl = handCashConnect.getRedirectionUrl({
      redirectUrl,
    })

    return NextResponse.json({ 
      authorization_url: authorizationUrl 
    })

  } catch (error) {
    console.error('HandCash redirect URL generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    )
  }
}
