# Quick Start Guide

This guide will help you quickly test and verify your PocketBase setup.

## Step 1: Install Dependencies

```powershell
npm install
```

## Step 2: Create Environment File

Create `.env.local` in the project root:

```env
VITE_POCKETBASE_URL=https://pb.muazhazali.me
VITE_APP_URL=http://localhost:5173
```

## Step 3: Test Connection

Test that your app can connect to PocketBase:

```powershell
npm run test:connection
```

**Expected Result:**
- ✅ Health check passes
- ✅ Collections are listed
- ✅ Required collections exist

**If connection fails:**
- Check that PocketBase is running at `pb.muazhazali.me`
- Verify Cloudflare tunnel is active
- Check firewall/network settings

## Step 4: Verify Schema

Check that your PocketBase collections match the expected schema:

```powershell
npm run test:schema
```

**Expected Result:**
- ✅ All required collections exist
- ✅ All required fields are present
- ✅ Field types match expected types

**If schema doesn't match:**
- Follow the setup guide in `docs/POCKETBASE_SETUP.md`
- Create missing collections in PocketBase Admin Panel
- Update field types as needed

## Step 5: Configure Google OAuth (Optional)

If you want to enable Google sign-in:

1. Follow the guide in `docs/GOOGLE_OAUTH_SETUP.md`
2. Create OAuth credentials in Google Cloud Console
3. Configure in PocketBase Admin Panel

## Step 6: Test Submission Workflow

Test the end-to-end submission process:

```powershell
npm run test:submission
```

This interactive script will:
1. Ask for user credentials
2. Create a test submission
3. Verify it was created
4. Optionally test admin approval

**Prerequisites:**
- A test user account in PocketBase
- (Optional) An admin account for approval testing

## Step 7: Start Development

Once everything is set up:

```powershell
npm run dev
```

The app will be available at `http://localhost:5173`

## Troubleshooting

### Connection Issues

**Error: "Failed to fetch" or "Network error"**
- Verify PocketBase URL is correct
- Check Cloudflare tunnel status
- Test URL in browser: `https://pb.muazhazali.me/api/health`

**Error: "CORS policy"**
- Configure CORS in PocketBase Admin Panel
- Add `http://localhost:5173` to allowed origins

### Schema Issues

**Missing Collections**
- Create them manually in PocketBase Admin Panel
- Reference `docs/POCKETBASE_SETUP.md` for field definitions

**Field Type Mismatches**
- Update field types in Admin Panel
- Be careful: changing types may require data migration

### Authentication Issues

**OAuth not working**
- Verify redirect URIs match exactly
- Check Google OAuth credentials
- Ensure PocketBase OAuth provider is enabled

## Next Steps

- Read the full setup guide: `docs/POCKETBASE_SETUP.md`
- Configure Google OAuth: `docs/GOOGLE_OAUTH_SETUP.md`
- Start building features!

