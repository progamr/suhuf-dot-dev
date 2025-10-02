#!/usr/bin/env tsx
/**
 * Initial seed script - Run once to populate database with articles
 * Usage: npm run seed:initial
 */

import { SyncService } from '../src/infrastructure/services/syncService';
import { closeORM } from '../src/infrastructure/db/initDb';

async function main() {
  console.log('🌱 Starting initial database seed...\n');

  try {
    const result = await SyncService.initialSeed();

    if (result.success) {
      console.log('\n✅ Initial seed completed successfully!');
      console.log(`📊 Articles added: ${result.articlesAdded}`);
      console.log(`⏱️  Duration: ${result.duration}ms`);
      
      if (result.errors.length > 0) {
        console.log(`⚠️  Warnings: ${result.errors.length}`);
        result.errors.forEach(err => console.log(`   - ${err}`));
      }
    } else {
      console.log('\n❌ Seed failed');
      result.errors.forEach(err => console.error(`   - ${err}`));
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Seed error:', error);
    process.exit(1);
  } finally {
    await closeORM();
  }
}

main();
