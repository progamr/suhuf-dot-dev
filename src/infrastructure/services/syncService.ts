import { getEM } from '../db/initDb';
import { NewsClientFactory } from '../api/newsClientFactory';
import { Article } from '../entities/Article';
import { Source } from '../entities/Source';
import { Category } from '../entities/Category';
import { Author } from '../entities/Author';

interface SyncResult {
  success: boolean;
  articlesAdded: number;
  articlesUpdated: number;
  errors: string[];
  duration: number;
}

interface SyncStats {
  totalFetched: number;
  totalSaved: number;
  duplicates: number;
  errors: number;
}

export class SyncService {
  private static isRunning = false;

  /**
   * Main sync function - fetches news from all sources and saves to DB
   */
  static async syncAllSources(): Promise<SyncResult> {
    if (this.isRunning) {
      throw new Error('Sync is already running');
    }

    this.isRunning = true;
    const startTime = Date.now();
    const stats: SyncStats = {
      totalFetched: 0,
      totalSaved: 0,
      duplicates: 0,
      errors: 0,
    };
    const errors: string[] = [];

    try {
      console.log('🔄 Starting news sync...');
      const em = await getEM();

      // Get all news clients
      const clients = NewsClientFactory.getAllClients();

      // Sync each source
      for (const client of clients) {
        try {
          const sourceId = client.getSourceIdentifier();
          console.log(`📰 Syncing ${sourceId}...`);

          // Ensure source exists in DB
          const source = await this.ensureSource(em, sourceId);

          // Fetch articles from API
          const response = await client.fetchNews({
            pageSize: 50, // Fetch 50 articles per source
          });

          stats.totalFetched += response.articles.length;

          // Save articles to DB
          for (const articleData of response.articles) {
            try {
              const saved = await this.saveArticle(em, articleData, source);
              if (saved) {
                stats.totalSaved++;
              } else {
                stats.duplicates++;
              }
            } catch (error) {
              stats.errors++;
              const errorMsg = `Error saving article: ${error instanceof Error ? error.message : 'Unknown error'}`;
              errors.push(errorMsg);
              console.error(errorMsg);
            }
          }

          await em.flush();
          console.log(`✅ ${sourceId}: ${response.articles.length} articles fetched`);
        } catch (error) {
          stats.errors++;
          const errorMsg = `Error syncing ${client.getSourceIdentifier()}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      const duration = Date.now() - startTime;
      console.log(`✅ Sync completed in ${duration}ms`);
      console.log(`📊 Stats: ${stats.totalSaved} saved, ${stats.duplicates} duplicates, ${stats.errors} errors`);

      return {
        success: stats.errors < clients.length, // Success if at least one source worked
        articlesAdded: stats.totalSaved,
        articlesUpdated: 0,
        errors,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error('❌ Sync failed:', error);
      return {
        success: false,
        articlesAdded: stats.totalSaved,
        articlesUpdated: 0,
        errors: [...errors, error instanceof Error ? error.message : 'Unknown error'],
        duration,
      };
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Ensure source exists in database
   */
  private static async ensureSource(em: any, sourceId: string): Promise<any> {
    const sourceNames: Record<string, string> = {
      guardian: 'The Guardian',
      newsapi: 'NewsAPI',
      nytimes: 'The New York Times',
    };

    let source = await em.findOne(Source, { apiIdentifier: sourceId });

    if (!source) {
      source = em.create(Source, {
        name: sourceNames[sourceId] || sourceId,
        slug: sourceId,
        apiIdentifier: sourceId,
        isActive: true,
      });
      await em.persistAndFlush(source);
      console.log(`✨ Created source: ${source.name}`);
    }

    return source;
  }

  /**
   * Save article to database (skip if duplicate)
   */
  private static async saveArticle(em: any, articleData: any, source: any): Promise<boolean> {
    // Check if article already exists
    const existing = await em.findOne(Article, {
      source: source,
      externalId: articleData.externalId,
    });

    if (existing) {
      // Update if needed (e.g., view count, last synced)
      existing.lastSyncedAt = new Date();
      return false; // Not a new article
    }

    // Handle author
    let author = null;
    if (articleData.author) {
      author = await em.findOne(Author, {
        source: source,
        name: articleData.author,
      });

      if (!author) {
        author = em.create(Author, {
          name: articleData.author,
          source: source,
        });
        await em.persist(author);
      }
    }

    // Handle categories
    const categories = [];
    for (const categoryName of articleData.categories || []) {
      let category = await em.findOne(Category, { slug: this.slugify(categoryName) });

      if (!category) {
        category = em.create(Category, {
          name: categoryName,
          slug: this.slugify(categoryName),
        });
        await em.persist(category);
      }

      categories.push(category);
    }

    // Create article
    const article = em.create(Article, {
      title: articleData.title,
      description: articleData.description,
      url: articleData.url,
      imageUrl: articleData.imageUrl,
      publishedAt: articleData.publishedAt,
      source: source,
      author: author,
      externalId: articleData.externalId,
      lastSyncedAt: new Date(),
    });

    // Add categories
    if (categories.length > 0) {
      article.categories.add(...categories);
    }

    await em.persist(article);
    return true; // New article saved
  }

  /**
   * Create URL-friendly slug
   */
  private static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Initial seed - populate database with articles
   */
  static async initialSeed(): Promise<SyncResult> {
    console.log('🌱 Starting initial seed...');
    const em = await getEM();

    // Check if already seeded
    const articleCount = await em.count(Article);
    if (articleCount > 0) {
      console.log('⚠️  Database already has articles. Skipping seed.');
      return {
        success: true,
        articlesAdded: 0,
        articlesUpdated: 0,
        errors: ['Database already seeded'],
        duration: 0,
      };
    }

    // Run sync to populate
    return this.syncAllSources();
  }

  /**
   * Check if sync is currently running
   */
  static isSyncRunning(): boolean {
    return this.isRunning;
  }
}
