import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { SyncService } from '../services/syncService';
import { closeORM } from '../db/initDb';

export class DatabaseSeeder extends Seeder {
  async run(_em: EntityManager): Promise<void> {
    console.log('🌱 Starting initial database seed...\n');

    try {
      const result = await SyncService.syncAllSources();

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
      }

      // Close the database connection
      await closeORM();
      process.exit(0);
    } catch (error) {
      console.error('\n❌ Seed error:', error);
      await closeORM();
      process.exit(1);
    }
  }
}
