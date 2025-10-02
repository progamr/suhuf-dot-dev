import { NextResponse } from 'next/server';
import { auth } from '@/infrastructure/auth/auth';
import { getEM } from '@/infrastructure/db/initDb';
import { User } from '@/infrastructure/entities/User';
import { Article } from '@/infrastructure/entities/Article';
import { Category } from '@/infrastructure/entities/Category';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const em = await getEM();
    
    // Get user with preferences
    const user = await em.findOne(
      User,
      { id: session.user.id },
      { 
        populate: [
          'preference.preferredSources',
          'preference.preferredCategories',
          'preference.preferredAuthors'
        ] 
      }
    );

    if (!user || !user.preference) {
      return NextResponse.json(
        { success: false, error: 'User preferences not found' },
        { status: 404 }
      );
    }

    const preferredSources = user.preference.preferredSources.getItems();
    const preferredCategories = user.preference.preferredCategories.getItems();
    const preferredAuthors = user.preference.preferredAuthors.getItems();

    // Get IDs for filtering
    const sourceIds = preferredSources.map((s: any) => s.id);
    const categoryIds = preferredCategories.map((c: any) => c.id);
    const authorIds = preferredAuthors.map((a: any) => a.id);

    // SECTION 1: Get carousel articles (5 latest personalized)
    const carouselQuery: any = {
      source: { $in: sourceIds },
    };

    // Add category filter if user has preferred categories
    if (categoryIds.length > 0) {
      carouselQuery.categories = { $in: categoryIds };
    }

    // Add author filter if user has preferred authors
    if (authorIds.length > 0) {
      carouselQuery.$or = [
        { categories: { $in: categoryIds } },
        { author: { $in: authorIds } }
      ];
    }

    const carouselArticles = await em.find(
      Article,
      carouselQuery,
      {
        orderBy: { publishedAt: 'DESC' },
        limit: 5,
        populate: ['source', 'categories', 'author'],
      }
    );

    // SECTION 2: Get top 6 most popular categories (by article count)
    let topCategories: any[] = [];
    let topCategoryIds: string[] = [];

    if (categoryIds.length > 0) {
      // Get all preferred categories with their articles
      const categories = await em.find(
        Category,
        { id: { $in: categoryIds } },
        { populate: ['articles'] }
      );

      // Count articles per category and sort
      const categoriesWithCounts = categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        imageUrl: cat.imageUrl || null,
        articleCount: cat.articles ? cat.articles.length : 0,
      }));

      // Sort by article count and take top 6
      topCategories = categoriesWithCounts
        .sort((a, b) => b.articleCount - a.articleCount)
        .slice(0, 6);

      topCategoryIds = topCategories.map(cat => cat.id);
    }

    // SECTION 3: Get latest 10 articles from top 6 categories
    const latestArticlesQuery: any = {
      source: { $in: sourceIds },
    };

    if (topCategoryIds.length > 0) {
      latestArticlesQuery.categories = { $in: topCategoryIds };
    }

    const latestArticles = await em.find(
      Article,
      latestArticlesQuery,
      {
        orderBy: { publishedAt: 'DESC' },
        limit: 10,
        populate: ['source', 'categories', 'author'],
      }
    );

    // Transform articles to include only necessary data
    const transformArticle = (article: any) => ({
      id: article.id,
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.imageUrl,
      publishedAt: article.publishedAt,
      source: {
        id: article.source.id,
        name: article.source.name,
        slug: article.source.slug,
      },
      categories: article.categories.getItems().map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })),
      author: article.author ? {
        id: article.author.id,
        name: article.author.name,
      } : null,
    });

    return NextResponse.json({
      success: true,
      data: {
        carousel: carouselArticles.map(transformArticle),
        topCategories: topCategories,
        latestArticles: latestArticles.map(transformArticle),
      },
    });
  } catch (error) {
    console.error('Error fetching personalized feed:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch personalized feed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
