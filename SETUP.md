# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd football-squad-builder
npm install
```

## Step 2: Setup Turso Database

### Option A: Using Turso CLI (Recommended)

1. Install Turso CLI:
```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (PowerShell)
irm get.tur.so/install.ps1 | iex
```

2. Sign up/Login:
```bash
turso auth signup
# or
turso auth login
```

3. Create database:
```bash
turso db create football-squad-builder
```

4. Get credentials:
```bash
# Get database URL
turso db show football-squad-builder --url

# Create auth token
turso db tokens create football-squad-builder
```

### Option B: Using Turso Web Dashboard

1. Go to [turso.tech](https://turso.tech)
2. Sign up for free account
3. Create new database named "football-squad-builder"
4. Copy database URL and create auth token

## Step 3: Configure Environment Variables

Create `.env.local` file in project root:

```env
TURSO_DATABASE_URL=libsql://[your-database-name]-[your-org].turso.io
TURSO_AUTH_TOKEN=eyJhbGc...your-token-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Initialize Database Schema

```bash
npm run db:push
```

This will create all necessary tables in your Turso database.

## Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Start Building Your Squad!

1. Click "Get Started" or "Squad Builder"
2. Add players (minimum 11 for recommendations)
3. Click "Get AI Recommendations"
4. Export your tactical guide

## Troubleshooting

### Database Connection Issues

- Verify `.env.local` has correct credentials
- Check Turso database is active: `turso db list`
- Regenerate auth token if expired: `turso db tokens create football-squad-builder`

### Build Errors

- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Port Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

## Deployment to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)
5. Deploy!

## Need Help?

- Check the main README.md for detailed documentation
- Open an issue on GitHub
- Review Turso docs: [docs.turso.tech](https://docs.turso.tech)
- Review Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
