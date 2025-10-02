import { NextResponse } from 'next/server';
import { getEM } from '@/infrastructure/db/initDb';
import { Author } from '@/infrastructure/entities/Author';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const em = await getEM();
    
    const authors = await em.find(
      Author,
      {},
      {
        orderBy: { name: 'ASC' },
        limit,
        populate: ['source'],
      }
    );

    return NextResponse.json({
      success: true,
      data: authors.map(author => ({
        id: author.id,
        name: author.name,
        source: {
          id: author.source.id,
          name: author.source.name,
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch authors',
      },
      { status: 500 }
    );
  }
}
