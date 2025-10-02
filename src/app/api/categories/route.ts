import { NextResponse } from 'next/server';
import { getEM } from '@/infrastructure/db/initDb';
import { Category } from '@/infrastructure/entities/Category';

export async function GET() {
  try {
    const em = await getEM();
    
    const categories = await em.find(
      Category,
      {},
      {
        orderBy: { name: 'ASC' },
      }
    );

    return NextResponse.json({
      success: true,
      data: categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      })),
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}
