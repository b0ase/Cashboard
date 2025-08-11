import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const redirectUrl = searchParams.get('redirect_url') || `${request.nextUrl.origin}/auth/handcash/callback`
    
    const appId = process.env.NEXT_PUBLIC_HANDCASH_APP_ID
    if (!appId) {
      console.error('HandCash App ID not configured. NEXT_PUBLIC_HANDCASH_APP_ID:', process.env.NEXT_PUBLIC_HANDCASH_APP_ID)
      return NextResponse.json(
        { error: 'HandCash App ID not configured' },
        { status: 500 }
      )
    }
    
    // Generate the HandCash authorization URL (HandCash uses a different format)
    const authorizationUrl = `https://app.handcash.io/#/authorizeApp?appId=${appId}`

    console.log('Generated HandCash auth URL:', authorizationUrl)

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
