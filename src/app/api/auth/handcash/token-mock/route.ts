import { NextRequest, NextResponse } from 'next/server'

// Mock token exchange for testing (without HandCash Connect dependency)
export async function POST(request: NextRequest) {
  try {
    const { authToken } = await request.json()

    if (!authToken) {
      return NextResponse.json(
        { error: 'authToken is required' },
        { status: 400 }
      )
    }

    console.log('Mock token exchange for authToken:', authToken)

    // Mock user data for testing
    const mockUserData = {
      id: 'mock-user-id-123',
      handle: 'testuser',
      displayName: 'Test User',
      avatarUrl: 'https://via.placeholder.com/64',
      localCurrencyCode: 'USD',
      paymail: 'testuser@handcash.io',
      phoneNumber: '+1234567890',
      email: 'testuser@example.com',
      spendableBalance: 100.50,
    }

    return NextResponse.json({
      access_token: authToken, // The authToken itself serves as the access token
      user: mockUserData,
      expires_in: 3600, // 1 hour
    })

  } catch (error) {
    console.error('Mock token exchange error:', error)
    return NextResponse.json(
      { error: 'Failed to exchange authorization code' },
      { status: 500 }
    )
  }
}
