import { NextResponse } from 'next/server';
import { getEM } from '@/infrastructure/db/initDb';
import { Category } from '@/infrastructure/entities/Category';
import { Source } from '@/infrastructure/entities/Source';
import { Author } from '@/infrastructure/entities/Author';

export async function GET() {
  try {
    const em = await getEM();

    // Fetch filter options
    const [categories, sources, authors] = await Promise.all([
      em.find(Category, {}, { orderBy: { name: 'ASC' } }),
      em.find(Source, { isActive: true }, { orderBy: { name: 'ASC' } }),
      em.find(Author, {}, { orderBy: { name: 'ASC' }, limit: 100 }),
    ]);

    // Remove duplicates using Map
    const uniqueCategories = Array.from(
      new Map(categories.map((cat) => [cat.id, cat])).values()
    );
    const uniqueSources = Array.from(
      new Map(sources.map((source) => [source.id, source])).values()
    );
    const uniqueAuthors = Array.from(
      new Map(authors.map((author) => [author.id, author])).values()
    );

    // Transform to options and sort alphabetically
    const categoryOptions = uniqueCategories
      .map((cat) => ({
        value: cat.id,
        label: cat.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const sourceOptions = uniqueSources
      .map((source) => ({
        value: source.id,
        label: source.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const authorOptions = uniqueAuthors
      .map((author) => ({
        value: author.id,
        label: author.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return NextResponse.json({
      success: true,
      data: {
        categoryOptions,
        sourceOptions,
        authorOptions,
      },
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}
