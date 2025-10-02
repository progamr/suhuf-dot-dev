# News Sync System Guide

## Overview

The sync system fetches news articles from multiple sources and stores them in the database. It supports three modes of operation:

1. **Initial Seed** - First-time database population
2. **Manual Trigger** - On-demand sync via API
3. **Scheduled Sync** - Automated periodic updates

## Quick Start

### 1. Initial Database Seed

Run once after setting up the database to populate it with articles:

```bash
npm run seed:initial
```

This will:
- Fetch 50 articles from each news source (Guardian, NewsAPI, NY Times)
- Create sources, categories, and authors automatically
- Skip if database already has articles

### 2. Manual Sync (API Trigger)

Trigger sync manually via API endpoint:

```bash
curl -X POST http://localhost:3000/api/sync \
  -H "x-api-key: your-sync-api-key"
```

**Check sync status:**
```bash
curl http://localhost:3000/api/sync
```

### 3. Scheduled Sync (Cron)

Run periodically to fetch new articles:

```bash
npm run sync:cron
```

**Setup with system cron:**
```bash
# Edit crontab
crontab -e

# Add this line to run every hour
0 * * * * cd /path/to/suhuf && npm run sync:cron >> /var/log/suhuf-sync.log 2>&1
```

## Configuration

### Environment Variables

```env
# API Keys (required)
GUARDIAN_API_KEY=your-guardian-key
NEWSAPI_KEY=your-newsapi-key
NYTIMES_API_KEY=your-nytimes-key

# Sync API Key (for manual trigger)
SYNC_API_KEY=your-secure-random-key

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/suhuf
```

### Get API Keys

1. **Guardian**: https://open-platform.theguardian.com/access/
2. **NewsAPI**: https://newsapi.org/register
3. **NY Times**: https://developer.nytimes.com/get-started

## Features

### Error Handling

✅ **Retry Logic**
- 3 retry attempts with exponential backoff
- Handles rate limiting (429 errors)
- Continues even if one source fails

✅ **Duplicate Prevention**
- Checks `source + externalId` before inserting
- Updates `lastSyncedAt` for existing articles

✅ **Data Validation**
- Filters out incomplete articles
- Handles missing authors/categories gracefully

### Sync Statistics

Each sync provides detailed stats:
```json
{
  "success": true,
  "stats": {
    "articlesAdded": 142,
    "articlesUpdated": 0,
    "errors": 0,
    "duration": "15234ms"
  },
  "errors": []
}
```

## Usage Examples

### Initial Setup Workflow

```bash
# 1. Run migrations
npm run migration:up

# 2. Seed database with articles
npm run seed:initial

# 3. Start the app
npm run dev
```

### Manual Sync from Code

```typescript
import { SyncService } from '@/infrastructure/services/syncService';

// Trigger sync
const result = await SyncService.syncAllSources();

// Check if running
const isRunning = SyncService.isSyncRunning();

// Initial seed
const seedResult = await SyncService.initialSeed();
```

### Production Deployment

**Option 1: System Cron**
```bash
# Run every hour
0 * * * * cd /var/www/suhuf && npm run sync:cron
```

**Option 2: Node Cron (in app)**
```typescript
import cron from 'node-cron';
import { SyncService } from '@/infrastructure/services/syncService';

// Run every hour
cron.schedule('0 * * * *', async () => {
  await SyncService.syncAllSources();
});
```

**Option 3: External Service**
- Use services like GitHub Actions, Vercel Cron, or AWS EventBridge
- Call the `/api/sync` endpoint with the API key

## Monitoring

### Logs

All sync operations log to console:
```
🔄 Starting news sync...
📰 Syncing guardian...
✅ guardian: 50 articles fetched
📰 Syncing newsapi...
✅ newsapi: 50 articles fetched
📰 Syncing nytimes...
✅ nytimes: 42 articles fetched
✅ Sync completed in 15234ms
📊 Stats: 142 saved, 0 duplicates, 0 errors
```

### Error Handling

Errors are logged but don't stop the sync:
```
❌ Error syncing nytimes: Rate limit exceeded
✅ Sync completed in 12000ms
📊 Stats: 100 saved, 0 duplicates, 1 errors
```

## Troubleshooting

### "Sync is already running"
- Only one sync can run at a time
- Wait for current sync to complete
- Check status: `GET /api/sync`

### "Database already seeded"
- `seed:initial` only runs if database is empty
- Use `sync:cron` for updates

### API Rate Limits
- Guardian: 5,000 requests/day
- NewsAPI: 100 requests/day (free tier)
- NY Times: 500 requests/day

**Solution**: Reduce sync frequency or upgrade API plans

### Missing Articles
- Check API keys are valid
- Check API rate limits
- Review error logs

## Best Practices

1. **Initial Setup**: Run `seed:initial` once
2. **Regular Updates**: Schedule `sync:cron` every 1-6 hours
3. **Manual Trigger**: Use API endpoint for immediate updates
4. **Monitor**: Check logs for errors and rate limits
5. **API Keys**: Keep them secure, never commit to git

## Next Steps

After seeding the database:
1. ✅ Articles are available in the database
2. ✅ Users can browse news on the homepage
3. ✅ Users can set preferences (sources, categories)
4. ✅ Personalized feed based on preferences
