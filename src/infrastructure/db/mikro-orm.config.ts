import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import * as dotenv from 'dotenv';

// Import entities explicitly
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

// In production mode, explicitly disable dynamic file access
// This is critical for Next.js production builds
const isProd = process.env.NODE_ENV === 'production';

// Configure MikroORM with production-ready settings
const config = defineConfig({
  // Explicitly set discovery options for production
  discovery: {
    // This is critical for Next.js production builds
    disableDynamicFileAccess: isProd,
    // Required for production builds
    requireEntitiesArray: isProd,
  },
  // List entities explicitly instead of using glob patterns
  entities: [User, VerificationToken, Source, Category, Author, Article, UserPreference, Favorite, ArticleView],
  
  // Use separate connection parameters instead of a URL
  clientUrl: process.env.DATABASE_URL,
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

export default config;
