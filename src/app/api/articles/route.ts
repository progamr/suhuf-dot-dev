import { NextResponse } from 'next/server';
import { getEM } from '@/infrastructure/db/initDb';
import { Article } from '@/infrastructure/entities/Article';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const search = searchParams.get('search') || '';
    const categoryIds = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const sourceIds = searchParams.get('sources')?.split(',').filter(Boolean) || [];
    const authorIds = searchParams.get('authors')?.split(',').filter(Boolean) || [];
    const dateFrom = searchParams.get('from') || '';
    const dateTo = searchParams.get('to') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const em = await getEM();

    // Build query with OR logic for filters
    const where: any = {};
    const orConditions: any[] = [];

    // Search in title and description
    if (search) {
      where.$or = [
        { title: { $ilike: `%${search}%` } },
        { description: { $ilike: `%${search}%` } },
      ];
    }

    // Build OR conditions for filters
    if (categoryIds.length > 0) {
      orConditions.push({ categories: { $in: categoryIds } });
    }

    if (sourceIds.length > 0) {
      orConditions.push({ source: { $in: sourceIds } });
    }

    if (authorIds.length > 0) {
      orConditions.push({ author: { $in: authorIds } });
    }

    // Apply OR logic if we have multiple filter types
    if (orConditions.length > 0) {
      if (where.$or) {
        // If search exists, combine with AND
        where.$and = [
          { $or: where.$or },
          { $or: orConditions }
        ];
        delete where.$or;
      } else {
        where.$or = orConditions;
      }
    }

    // Filter by date range (applied with AND logic)
    if (dateFrom || dateTo) {
      where.publishedAt = {};
      if (dateFrom) {
        where.publishedAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        // Include the entire day
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        where.publishedAt.$lte = toDate;
      }
    }

    // Get total count (use countDistinct for many-to-many)
    let total: number;
    if (categoryIds.length > 0) {
      // When filtering by categories, we need to count distinct articles
      const countResult = await em.getConnection().execute(
        `SELECT COUNT(DISTINCT a.id) as count 
         FROM article a 
         LEFT JOIN article_categories ac ON a.id = ac.article_id 
         WHERE ${categoryIds.length > 0 ? `ac.category_id IN (${categoryIds.map((id: string) => `'${id}'`).join(',')})` : '1=1'}`
      );
      total = parseInt(countResult[0].count);
    } else {
      total = await em.count(Article, where);
    }

    // Get articles with pagination
    // Use a Set to deduplicate by ID
    const allArticles = await em.find(
      Article,
      where,
      {
        orderBy: { publishedAt: 'DESC' },
        populate: ['source', 'categories', 'author'],
      }
    );

    // Deduplicate and paginate manually
    const uniqueArticles = Array.from(
      new Map(allArticles.map(article => [article.id, article])).values()
    );
    
    const articles = uniqueArticles.slice(
      (page - 1) * limit,
      page * limit
    );

    // Transform articles
    const transformedArticles = articles.map((article: any) => ({
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
    }));

    return NextResponse.json({
      success: true,
      data: {
        articles: transformedArticles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch articles',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
