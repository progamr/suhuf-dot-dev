import { NextResponse } from 'next/server';
import { getEM } from '@/infrastructure/db/initDb';
import { Article } from '@/infrastructure/entities/Article';
import { Category } from '@/infrastructure/entities/Category';

export async function GET() {
  try {
    const em = await getEM();

    // Get latest 10 articles for carousel
    const carouselArticles = await em.find(
      Article,
      {},
      {
        orderBy: { publishedAt: 'DESC' },
        limit: 10,
        populate: ['source', 'categories', 'author'],
      }
    );

    // Get top categories with article counts
    const categories = await em.find(Category, {}, { orderBy: { name: 'ASC' } });
    
    // Get article counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await em.count(Article, {
          categories: category.id,
        });
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          articleCount: count,
        };
      })
    );

    // Sort by article count and take top 6
    const topCategories = categoriesWithCounts
      .filter(c => c.articleCount > 0)
      .sort((a, b) => b.articleCount - a.articleCount)
      .slice(0, 6);

    // Get latest 10 articles from popular categories
    const latestArticles = await em.find(
      Article,
      {},
      {
        orderBy: { publishedAt: 'DESC' },
        limit: 10,
        populate: ['source', 'categories', 'author'],
      }
    );

    // Transform carousel articles
    const transformedCarousel = carouselArticles.map((article: any) => ({
      id: article.id,
      title: article.title,
      description: article.description,
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
    }));

    // Transform latest articles
    const transformedLatest = latestArticles.map((article: any) => ({
      id: article.id,
      title: article.title,
      description: article.description,
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
    }));

    return NextResponse.json({
      success: true,
      data: {
        carousel: transformedCarousel,
        topCategories,
        latestArticles: transformedLatest,
      },
    });
  } catch (error) {
    console.error('Error fetching public feed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch public feed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
