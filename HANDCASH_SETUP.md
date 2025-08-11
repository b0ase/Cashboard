# HandCash Authentication Setup Guide

This guide will help you set up HandCash authentication for your Cashboard application.

## Prerequisites

1. **HandCash Developer Account**: You need to have a HandCash developer account
2. **Application Registration**: Register your application in the HandCash Developer Dashboard

## Step 1: Register Your Application

1. Go to the [HandCash Developer Dashboard](https://dashboard.handcash.io/)
2. Create a new application or select an existing one
3. Configure your application settings:
   - **App Name**: Your application name
   - **Redirect URI**: `http://localhost:3000/auth/handcash/callback` (for development)
   - **Permissions**: Select the permissions your app needs:
     - `user_public_profile`: Access to public profile information
     - `user_private_profile`: Access to private profile information (email, phone)
     - `payments`: Access to payment functionality

## Step 2: Environment Variables

Create a `.env.local` file in your project root and add your HandCash credentials:

```bash
# HandCash Connect Configuration
NEXT_PUBLIC_HANDCASH_APP_ID=your_handcash_app_id_here
HANDCASH_APP_SECRET=your_handcash_app_secret_here
```

**Important**: 
- `NEXT_PUBLIC_HANDCASH_APP_ID` is your App ID from the HandCash Developer Dashboard
- `HANDCASH_APP_SECRET` is your App Secret (keep this secure, never expose it to the client)

## Step 3: Testing the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. Click the "Sign in with HandCash" button

4. You should be redirected to HandCash for authentication

5. After successful authentication, you'll be redirected back to your application

## Features Implemented

### Authentication Components

- **`HandCashAuthButton`**: A button component that handles the sign-in flow
- **`UserProfileCard`**: Displays user information after authentication
- **`AuthContext`**: React context for managing authentication state

### API Routes

- **`/api/auth/handcash/token`**: Exchanges authorization code for access token
- **`/api/auth/handcash/profile`**: Fetches user profile information
- **`/api/auth/handcash/redirect`**: Generates HandCash authorization URL

### User Data Available

After successful authentication, you'll have access to:

- User ID
- Handle (username)
- Display name
- Avatar URL
- Local currency code
- Paymail address
- Phone number (if permission granted)
- Email address (if permission granted)
- Spendable balance

### Authentication Flow

1. **User clicks sign-in button**
2. **Application generates authorization URL** with proper parameters
3. **User is redirected to HandCash** for authentication
4. **User grants permissions** to your application
5. **HandCash redirects back** to your callback URL with authorization code
6. **Your API exchanges the code** for an access token
7. **User profile is fetched** and stored in the application state
8. **User is now authenticated** and can use the application

## Security Features

- **State parameter validation**: Prevents CSRF attacks
- **Secure token storage**: Access tokens are handled securely
- **Session management**: Automatic session expiration handling
- **Error handling**: Comprehensive error handling for auth failures

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**:
   - Ensure your redirect URI in the HandCash Developer Dashboard matches exactly: `http://localhost:3000/auth/handcash/callback`

2. **"Invalid client ID" error**:
   - Verify your `NEXT_PUBLIC_HANDCASH_APP_ID` is correct
   - Make sure you're using the App ID, not the App Secret

3. **"Failed to exchange code for token" error**:
   - Check that your `HANDCASH_APP_SECRET` is correct
   - Ensure your server can make outbound HTTPS requests

4. **Popup blocked**:
   - The authentication flow uses a popup window
   - Ensure your browser allows popups for your development site

### Development vs Production

For production deployment:

1. Update your redirect URI in the HandCash Developer Dashboard to your production URL:
   ```
   https://yourdomain.com/auth/handcash/callback
   ```

2. Update your environment variables for production

3. Ensure your production server has proper HTTPS configuration

## Next Steps

With HandCash authentication set up, you can now:

1. **Access user wallet information**: Get balance, transaction history
2. **Process payments**: Send and receive payments through HandCash
3. **Manage user profiles**: Update user information and preferences
4. **Integrate with your business logic**: Use HandCash data in your application workflows

## Support

- [HandCash Developer Documentation](https://docs.handcash.io/)
- [HandCash Developer Dashboard](https://dashboard.handcash.io/)
- [HandCash Connect SDK Documentation](https://www.npmjs.com/package/@handcash/handcash-connect)
