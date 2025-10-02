import { NextResponse } from 'next/server';
import { getEM } from '@/infrastructure/db/initDb';
import { Source } from '@/infrastructure/entities/Source';

export async function GET() {
  try {
    const em = await getEM();
    
    const sources = await em.find(
      Source,
      { isActive: true },
      {
        orderBy: { name: 'ASC' },
      }
    );

    return NextResponse.json({
      success: true,
      data: sources.map(source => ({
        id: source.id,
        name: source.name,
        slug: source.slug,
        apiIdentifier: source.apiIdentifier,
      })),
    });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch sources',
      },
      { status: 500 }
    );
  }
}
