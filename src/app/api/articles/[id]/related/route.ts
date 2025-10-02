import { NextResponse } from 'next/server';
import { getEM } from '@/infrastructure/db/initDb';
import { Article } from '@/infrastructure/entities/Article';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryIds = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const sourceId = searchParams.get('source') || '';

    const em = await getEM();

    // Get related articles from same categories or source
    const relatedArticles = await em.find(
      Article,
      {
        $and: [
          { id: { $ne: params.id } }, // Exclude current article
          {
            $or: [
              ...(categoryIds.length > 0 ? [{ categories: { $in: categoryIds } }] : []),
              ...(sourceId ? [{ source: sourceId }] : []),
            ],
          },
        ],
      },
      {
        orderBy: { publishedAt: 'DESC' },
        limit: 6,
        populate: ['source', 'categories', 'author'],
      }
    );

    // Transform articles
    const transformedArticles = relatedArticles.map((article: any) => ({
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
      data: transformedArticles,
    });
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch related articles',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
