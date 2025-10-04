import { NextResponse } from 'next/server';
import { getEM } from '@/infrastructure/db/initDb';
import { Article } from '@/infrastructure/entities/Article';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const em = await getEM();

    const article = await em.findOne(
      Article,
      { id: resolvedParams.id },
      {
        populate: ['source', 'categories', 'author'],
      }
    );

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: 'Article not found',
        },
        { status: 404 }
      );
    }

    // Transform article
    const transformedArticle = {
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
    };

    return NextResponse.json({
      success: true,
      data: transformedArticle,
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch article',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
