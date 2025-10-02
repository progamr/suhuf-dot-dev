import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import * as dotenv from 'dotenv';
import { User } from '../entities/User';
import { VerificationToken } from '../entities/VerificationToken';
import { Source } from '../entities/Source';
import { Category } from '../entities/Category';
import { Author } from '../entities/Author';
import { Article } from '../entities/Article';
import { UserPreference } from '../entities/UserPreference';
import { Favorite } from '../entities/Favorite';
import { ArticleView } from '../entities/ArticleView';

// Load environment variables
dotenv.config();

export default defineConfig({
  entities: [
    User,
    VerificationToken,
    Source,
    Category,
    Author,
    Article,
    UserPreference,
    Favorite,
    ArticleView,
  ],
  clientUrl: process.env.DATABASE_URL || 'postgresql://amr:Prog@mr123@localhost:5432/suhuf_dev',
  debug: process.env.NODE_ENV === 'development',
  migrations: {
    path: './src/infrastructure/migrations',
    pathTs: './src/infrastructure/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: false,
    safe: true,
    emit: 'ts',
  },
  seeder: {
    path: './src/infrastructure/seeders',
    pathTs: './src/infrastructure/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
  extensions: [Migrator, SeedManager],
  allowGlobalContext: true,
  pool: {
    min: 2,
    max: 10,
  },
});
