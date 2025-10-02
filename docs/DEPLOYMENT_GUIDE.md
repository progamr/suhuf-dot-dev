# Deployment Guide

## 🚀 Quick Start (Development)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your values

# 3. Start PostgreSQL (Docker)
npm run docker:up

# 4. Run migrations
npm run migration:up

# 5. Seed database with articles
npm run seed:run

# 6. Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 📋 Environment Variables

### Required Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/suhuf

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# News API Keys
GUARDIAN_API_KEY=your-guardian-api-key
NEWSAPI_KEY=your-newsapi-key
NYTIMES_API_KEY=your-nytimes-api-key

# Email (Optional - for verification emails)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
```

### Getting API Keys

1. **The Guardian API**
   - Visit: https://open-platform.theguardian.com/access/
   - Register for free API key
   - Free tier: 5,000 requests/day

2. **NewsAPI.org**
   - Visit: https://newsapi.org/register
   - Register for free API key
   - Free tier: 100 requests/day, 1 month old articles

3. **NY Times API**
   - Visit: https://developer.nytimes.com/get-started
   - Register and create an app
   - Enable "Article Search API"
   - Free tier: 4,000 requests/day

4. **Resend (Email)**
   - Visit: https://resend.com
   - Sign up and get API key
   - Free tier: 3,000 emails/month

---

## 🏗️ Production Deployment

### Option 1: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Set environment variables in Vercel dashboard
# Go to: Project Settings > Environment Variables
# Add all variables from .env

# 5. Set up PostgreSQL database
# Recommended: Vercel Postgres, Supabase, or Neon

# 6. Run migrations on production
# Use Vercel CLI or database GUI
```

### Option 2: Docker

```bash
# 1. Build Docker image
docker build -t suhuf .

# 2. Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# 3. Run migrations
docker-compose exec app npm run migration:up

# 4. Seed database
docker-compose exec app npm run seed:run
```

### Option 3: Traditional Server

```bash
# 1. Build application
npm run build

# 2. Start production server
npm start

# 3. Use PM2 for process management
npm install -g pm2
pm2 start npm --name "suhuf" -- start
pm2 save
pm2 startup
```

---

## 🗄️ Database Setup

### PostgreSQL (Production)

**Recommended Providers:**
1. **Vercel Postgres** - Integrated with Vercel
2. **Supabase** - Free tier available
3. **Neon** - Serverless PostgreSQL
4. **Railway** - Easy setup
5. **AWS RDS** - Enterprise solution

### Migration Commands

```bash
# Create new migration
npm run migration:create

# Run migrations
npm run migration:up

# Rollback migration
npm run migration:down

# List migrations
npm run migration:list
```

---

## 🔄 Data Syncing

### Manual Sync

```bash
# Sync all news sources
npm run seed:run
```

### Automated Sync (Cron Job)

**Option 1: Vercel Cron Jobs**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/sync-articles",
    "schedule": "0 */6 * * *"
  }]
}
```

**Option 2: System Cron**
```bash
# Edit crontab
crontab -e

# Add line (sync every 6 hours)
0 */6 * * * cd /path/to/suhuf && npm run seed:run
```

**Option 3: GitHub Actions**
```yaml
# .github/workflows/sync-articles.yml
name: Sync Articles
on:
  schedule:
    - cron: '0 */6 * * *'
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run seed:run
```

---

## 🔒 Security Checklist

- [ ] All environment variables set securely
- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] Database credentials are secure
- [ ] API keys are not committed to git
- [ ] CORS configured properly
- [ ] Rate limiting enabled (if needed)
- [ ] HTTPS enabled in production
- [ ] Security headers configured

---

## 📊 Monitoring

### Recommended Tools

1. **Vercel Analytics** - Built-in for Vercel deployments
2. **Sentry** - Error tracking
3. **LogRocket** - Session replay
4. **New Relic** - Performance monitoring

### Health Checks

```bash
# Check API health
curl https://your-domain.com/api/health

# Check database connection
curl https://your-domain.com/api/health/db
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check DATABASE_URL format
# Should be: postgresql://user:password@host:port/database

# Test connection
psql $DATABASE_URL
```

**2. Migration Errors**
```bash
# Reset database (CAUTION: Deletes all data)
npm run migration:down
npm run migration:up
```

**3. News API Errors**
```bash
# Check API keys are valid
# Check rate limits not exceeded
# Check API endpoints are accessible
```

**4. Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Rebuild
npm run build
```

---

## 📈 Performance Optimization

### Production Checklist

- [ ] Enable Next.js image optimization
- [ ] Configure CDN for static assets
- [ ] Enable gzip/brotli compression
- [ ] Set up database connection pooling
- [ ] Configure Redis for caching (optional)
- [ ] Enable React Query persistence (optional)
- [ ] Optimize bundle size
- [ ] Enable ISR for static pages

### Database Optimization

```sql
-- Add indexes for better query performance
CREATE INDEX idx_articles_published_at ON article(published_at DESC);
CREATE INDEX idx_articles_source ON article(source_id);
CREATE INDEX idx_article_categories ON article_categories(article_id, category_id);
```

---

## 🎯 Post-Deployment

### 1. Verify Deployment
- [ ] Visit homepage
- [ ] Test authentication
- [ ] Test article browsing
- [ ] Test filters
- [ ] Test article details
- [ ] Check responsive design

### 2. Set Up Monitoring
- [ ] Configure error tracking
- [ ] Set up uptime monitoring
- [ ] Configure alerts

### 3. Initial Data Sync
```bash
# Run first sync
npm run seed:run

# Verify articles in database
# Should see articles from all 3 sources
```

### 4. Documentation
- [ ] Update README with production URL
- [ ] Document any custom configurations
- [ ] Share credentials securely with team

---

## 🆘 Support

### Resources
- Next.js Docs: https://nextjs.org/docs
- MikroORM Docs: https://mikro-orm.io/docs
- NextAuth Docs: https://next-auth.js.org
- React Query Docs: https://tanstack.com/query

### Getting Help
1. Check documentation
2. Review error logs
3. Check GitHub issues
4. Contact development team

---

## ✅ Deployment Complete!

Your Suhuf news aggregator is now live and ready to serve users! 🎉
