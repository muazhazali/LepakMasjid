# Connecting to Remote PocketBase Instance

This guide explains how to connect your local development environment to a remote PocketBase instance running on your server.

## Overview

Your application is configured to connect to a PocketBase instance at `pb.muazhazali.me`. The connection is handled through the PocketBase JavaScript SDK, which communicates with the remote server via HTTP/HTTPS.

## Step 1: Environment Configuration

Create a `.env.local` file in the project root (if it doesn't exist):

```env
VITE_POCKETBASE_URL=https://pb.muazhazali.me
VITE_APP_URL=http://localhost:8080
```

**Note:** The `VITE_` prefix is required for Vite to expose these variables to your frontend code.

## Step 2: Verify Connection

Test that your local app can connect to the remote PocketBase instance:

```powershell
pnpm run test:connection
```

**Expected Output:**
```
🔍 Testing PocketBase Connection...
📍 URL: https://pb.muazhazali.me

1️⃣ Testing health endpoint...
   ✅ Health check passed: { code: 200, message: "ok" }

2️⃣ Testing authentication endpoint...
   ✅ Auth methods available:
      - Email/Password
      - OAuth providers: google

3️⃣ Checking collections access...
   ℹ️  Collection listing requires authentication.

4️⃣ Verifying API endpoints...
   ✅ API is accessible and responding

✅ Connection test completed successfully!
```

## Step 3: Create Collections

If your PocketBase instance doesn't have the required collections yet, create them programmatically:

```powershell
pnpm run setup:collections
```

This script will:
1. Prompt for your PocketBase admin credentials (or use environment variables)
2. Create all required collections:
   - `mosques` - Mosque directory entries
   - `amenities` - Available amenities list
   - `mosque_amenities` - Junction table for mosque amenities
   - `activities` - Mosque activities and events
   - `submissions` - User submissions for review
   - `audit_logs` - Audit trail for admin actions

**Using Environment Variables (Optional):**

You can set admin credentials in `.env.local` to avoid prompts:

```env
VITE_POCKETBASE_URL=https://pb.muazhazali.me
POCKETBASE_ADMIN_EMAIL=your-admin@email.com
POCKETBASE_ADMIN_PASSWORD=your-admin-password
```

**Note:** `POCKETBASE_ADMIN_EMAIL` and `POCKETBASE_ADMIN_PASSWORD` are not prefixed with `VITE_` because they're only used in Node.js scripts, not in the browser.

## Step 4: Verify Schema

After creating collections, verify they match the expected schema:

```powershell
pnpm run test:schema
```

This will check:
- ✅ All required collections exist
- ✅ All required fields are present
- ✅ Field types match expected types

## How It Works

### Client-Side Connection

The application uses the PocketBase JavaScript SDK to connect to your remote instance:

```typescript
// src/lib/pocketbase.ts
const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://pb.muazhazali.me';
const pb = new PocketBase(POCKETBASE_URL);
```

### Authentication

The SDK handles authentication automatically:
- **Token Storage**: Auth tokens are stored in `localStorage`
- **Auto-Refresh**: Tokens are automatically refreshed when needed
- **Persistent Sessions**: User sessions persist across page reloads

### API Requests

All API requests are made directly from the browser to your remote PocketBase instance:
- **CORS**: Your PocketBase instance must have CORS configured to allow requests from your frontend domain
- **HTTPS**: Use HTTPS in production for secure connections
- **Authentication**: Requests include auth tokens in headers automatically

## Troubleshooting

### Connection Issues

**Error: "Failed to fetch" or Network Error**
- Check that PocketBase is running at `pb.muazhazali.me`
- Verify the URL is accessible from your network
- Check firewall/proxy settings
- Ensure Cloudflare tunnel (if used) is active

**Error: "CORS policy"**
- Configure CORS in PocketBase Admin Panel
- Add your frontend URL to allowed origins
- For development: Add `http://localhost:8080` to CORS settings

**Error: "401 Unauthorized"**
- This is normal for protected endpoints
- Authenticate first using login/OAuth
- Check that auth tokens are being stored correctly

### Collection Creation Issues

**Error: "Collection already exists"**
- The script will skip existing collections
- To recreate, delete the collection in PocketBase Admin Panel first
- Or manually update the collection schema

**Error: "Invalid collection ID"**
- Ensure collections are created in the correct order
- Some collections depend on others (e.g., `mosque_amenities` depends on `mosques` and `amenities`)
- The script handles dependencies automatically

### Authentication Issues

**Cannot authenticate as admin**
- Verify admin credentials are correct
- Check that the `_superusers` collection exists
- Ensure you're using the correct email/password

**OAuth not working**
- Verify OAuth is configured in PocketBase Admin Panel
- Check redirect URIs match exactly
- Ensure Google OAuth credentials are set up (see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md))

## Security Considerations

### Environment Variables

- **Never commit `.env.local`** to version control
- Add `.env.local` to `.gitignore`
- Use different credentials for development and production

### API Keys

- Admin credentials should only be used in scripts, never in frontend code
- Use API keys for server-side operations when possible
- Rotate credentials regularly

### CORS Configuration

- Only allow trusted origins in CORS settings
- Use HTTPS in production
- Restrict admin endpoints to specific IPs if possible

## Next Steps

1. ✅ **Test Connection**: `pnpm run test:connection`
2. ✅ **Create Collections**: `pnpm run setup:collections`
3. ✅ **Verify Schema**: `pnpm run test:schema`
4. ✅ **Configure OAuth**: See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
5. ✅ **Start Development**: `pnpm run dev`

## Additional Resources

- [PocketBase Documentation](https://pocketbase.io/docs/)
- [PocketBase JavaScript SDK](https://github.com/pocketbase/js-sdk)
- [PocketBase Admin Panel](https://pb.muazhazali.me/_/)
- [PocketBase Setup Guide](./POCKETBASE_SETUP.md)

