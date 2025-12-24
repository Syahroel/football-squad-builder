# Deployment Guide - Vercel

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Turso database setup and credentials

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Football Squad Builder"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/football-squad-builder.git
git branch -M main
git push -u origin main
```

### 2. Setup Turso Production Database

```bash
# Create production database
turso db create football-squad-builder-prod

# Get database URL
turso db show football-squad-builder-prod --url

# Create auth token
turso db tokens create football-squad-builder-prod

# Save these credentials - you'll need them for Vercel
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

5. Add Environment Variables:
   ```
   TURSO_DATABASE_URL=libsql://your-prod-database.turso.io
   TURSO_AUTH_TOKEN=your-production-token
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked

# Deploy to production
vercel --prod
```

### 4. Initialize Production Database

After deployment, you need to push the schema to your production database:

```bash
# Set production environment variables locally
export TURSO_DATABASE_URL="your-prod-url"
export TURSO_AUTH_TOKEN="your-prod-token"

# Push schema
npm run db:push
```

Or use Turso CLI:

```bash
turso db shell football-squad-builder-prod < drizzle/schema.sql
```

### 5. Test Your Deployment

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Test adding a player
3. Test generating recommendations
4. Test export functionality

### 6. Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `TURSO_DATABASE_URL` | Turso database connection URL | `libsql://db-name.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso authentication token | `eyJhbGc...` |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | `https://your-app.vercel.app` |

## Troubleshooting

### Build Fails

**Error: Cannot find module**
- Check all imports are correct
- Ensure all dependencies are in `package.json`
- Try: `npm install` locally and commit `package-lock.json`

**Error: Type errors**
- Run `npm run build` locally first
- Fix all TypeScript errors before deploying

### Database Connection Issues

**Error: Failed to connect to database**
- Verify `TURSO_DATABASE_URL` is correct
- Verify `TURSO_AUTH_TOKEN` is valid
- Check token hasn't expired
- Ensure database exists: `turso db list`

**Error: Table doesn't exist**
- Run `npm run db:push` with production credentials
- Or manually create tables using Turso CLI

### Runtime Errors

**Error: 500 Internal Server Error**
- Check Vercel function logs
- Verify environment variables are set
- Check API routes for errors

**Error: API route not found**
- Ensure all API files are committed
- Check file naming (must be `route.ts`)
- Verify folder structure is correct

## Monitoring & Maintenance

### View Logs
```bash
# Using Vercel CLI
vercel logs

# Or visit Vercel Dashboard → Your Project → Logs
```

### Update Deployment
```bash
# Push changes to GitHub
git add .
git commit -m "Update: description"
git push

# Vercel will auto-deploy
```

### Rollback
1. Go to Vercel Dashboard → Your Project → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Performance Optimization

### Enable Caching
Add to `next.config.js`:
```javascript
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Add caching headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=120' },
        ],
      },
    ];
  },
}
```

### Database Optimization
- Add indexes to frequently queried columns
- Use Turso's edge replication for global performance
- Monitor query performance in Turso dashboard

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Rotate tokens regularly** - Create new Turso tokens monthly
3. **Use environment variables** - Never hardcode credentials
4. **Enable Vercel Authentication** - For admin features (future)
5. **Monitor usage** - Check Turso and Vercel dashboards

## Cost Estimation

### Free Tier Limits
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Turso**: 9GB storage, 1 billion row reads/month
- **Total**: $0/month for most use cases

### Scaling
- Both services have generous free tiers
- Upgrade only when you exceed limits
- Monitor usage in dashboards

## Support

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **Turso Issues**: [discord.gg/turso](https://discord.gg/turso)
- **App Issues**: Open GitHub issue

---

## Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]

# Check environment variables
vercel env ls
```

---

**Congratulations! Your Football Squad Builder is now live! 🎉⚽**
