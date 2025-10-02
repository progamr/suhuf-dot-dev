#!/usr/bin/env tsx
/**
 * Cron sync script - Run periodically to fetch new articles
 * Usage: npm run sync:cron
 * 
 * Can be scheduled with cron:
 * 0 * * * * cd /path/to/app && npm run sync:cron
 */

import { SyncService } from '../src/infrastructure/services/syncService';
import { closeORM } from '../src/infrastructure/db/initDb';

async function main() {
  console.log(`🔄 [${new Date().toISOString()}] Starting scheduled sync...\n`);

  try {
    const result = await SyncService.syncAllSources();

    if (result.success) {
      console.log(`\n✅ [${new Date().toISOString()}] Sync completed`);
      console.log(`📊 Stats:`);
      console.log(`   - Articles added: ${result.articlesAdded}`);
      console.log(`   - Duration: ${result.duration}ms`);
      
      if (result.errors.length > 0) {
        console.log(`   - Errors: ${result.errors.length}`);
        result.errors.forEach(err => console.log(`     • ${err}`));
      }
    } else {
      console.log(`\n❌ [${new Date().toISOString()}] Sync failed`);
      result.errors.forEach(err => console.error(`   - ${err}`));
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ [${new Date().toISOString()}] Sync error:`, error);
    process.exit(1);
  } finally {
    await closeORM();
  }
}

main();
