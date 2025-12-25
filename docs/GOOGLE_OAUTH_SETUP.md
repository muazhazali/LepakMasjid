# Google OAuth Setup for PocketBase

This guide will help you configure Google OAuth authentication in your PocketBase instance at `pb.muazhazali.me`.

## Prerequisites

1. Access to PocketBase Admin Panel at `https://pb.muazhazali.me/_/`
2. A Google Cloud Project with OAuth 2.0 credentials

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless you have a Google Workspace)
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`
   - Add test users if needed
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `LepakMasjid OAuth`
   - Authorized JavaScript origins:
     - `https://pb.muazhazali.me`
     - `http://localhost:5173` (for local development)
   - Authorized redirect URIs:
     - `https://pb.muazhazali.me/api/oauth2-redirect`
     - `http://localhost:5173/api/oauth2-redirect` (for local development)
7. Copy the **Client ID** and **Client Secret**

## Step 2: Configure PocketBase

1. Log in to PocketBase Admin Panel at `https://pb.muazhazali.me/_/`
2. Navigate to **Settings** > **Auth providers**
3. Find **Google** in the list and click to configure
4. Enable the provider
5. Fill in the following:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
   - **Redirect URL**: `https://pb.muazhazali.me/api/oauth2-redirect`
6. Save the configuration

## Step 3: Update Frontend Code

The frontend code should already be set up to use Google OAuth. Verify in `src/components/Auth/GoogleAuthButton.tsx` that it's using the correct redirect URL.

The OAuth flow should work as follows:
1. User clicks "Sign in with Google"
2. Redirects to Google OAuth consent screen
3. User authorizes the app
4. Google redirects back to PocketBase
5. PocketBase creates/updates user session
6. User is redirected back to the app

## Step 4: Test the OAuth Flow

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. Verify that you're logged in and can access protected routes

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Ensure the redirect URI in Google Console exactly matches: `https://pb.muazhazali.me/api/oauth2-redirect`
- Check for trailing slashes or protocol mismatches

### Error: "invalid_client"
- Verify Client ID and Client Secret are correct
- Ensure the OAuth consent screen is published (if required)

### Error: "access_denied"
- Check that the OAuth consent screen is configured
- Verify test users are added (if app is in testing mode)

### OAuth works but user is not created
- Check PocketBase user collection permissions
- Verify PocketBase auth settings allow OAuth registration

## Additional Notes

- For production, ensure your OAuth consent screen is published
- Consider adding your production domain to authorized origins/redirects
- Keep your Client Secret secure and never commit it to version control
- The redirect URL format is: `{POCKETBASE_URL}/api/oauth2-redirect`

## Cloudflare Tunnel Considerations

Since your PocketBase is behind a Cloudflare tunnel:
- Ensure the tunnel is properly configured to forward requests
- The redirect URI should use the public domain (`pb.muazhazali.me`)
- Test that the OAuth callback can reach PocketBase through the tunnel

