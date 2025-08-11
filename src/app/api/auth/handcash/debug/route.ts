import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      handcashAppId: process.env.NEXT_PUBLIC_HANDCASH_APP_ID ? 'SET' : 'NOT SET',
      handcashSecret: process.env.HANDCASH_APP_SECRET ? 'SET' : 'NOT SET',
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin'),
    }

    // Test HandCash Connect SDK loading
    let sdkStatus = 'NOT_LOADED'
    let sdkError = null

    try {
      const { HandCashConnect } = await import('@handcash/handcash-connect')
      sdkStatus = 'LOADED'
      
      // Try to initialize
      try {
        const handCashConnect = new HandCashConnect({
          appId: process.env.NEXT_PUBLIC_HANDCASH_APP_ID!,
          appSecret: process.env.HANDCASH_APP_SECRET!,
        })
        sdkStatus = 'INITIALIZED'
      } catch (initError: any) {
        sdkStatus = 'LOAD_SUCCESS_INIT_FAILED'
        sdkError = {
          name: initError.name,
          message: initError.message,
          stack: initError.stack?.substring(0, 500) // Truncate stack trace
        }
      }
    } catch (loadError: any) {
      sdkStatus = 'LOAD_FAILED'
      sdkError = {
        name: loadError.name,
        message: loadError.message,
        stack: loadError.stack?.substring(0, 500) // Truncate stack trace
      }
    }

    return NextResponse.json({
      debug,
      sdk: {
        status: sdkStatus,
        error: sdkError
      }
    })

  } catch (error: any) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json(
      { 
        error: 'Debug endpoint failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
