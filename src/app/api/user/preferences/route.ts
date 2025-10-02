import { NextResponse } from 'next/server';
import { auth } from '@/infrastructure/auth/auth';
import { getEM } from '@/infrastructure/db/initDb';
import { User } from '@/infrastructure/entities/User';
import { UserPreference } from '@/infrastructure/entities/UserPreference';
import { Source } from '@/infrastructure/entities/Source';
import { Category } from '@/infrastructure/entities/Category';
import { Author } from '@/infrastructure/entities/Author';

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
    const user = await em.findOne(
      User,
      { id: session.user.id },
      { populate: ['preference.preferredSources', 'preference.preferredCategories', 'preference.preferredAuthors'] }
    );

    if (!user || !user.preference) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        sources: user.preference.preferredSources.getItems().map((s: any) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
        })),
        categories: user.preference.preferredCategories.getItems().map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        })),
        authors: user.preference.preferredAuthors.getItems().map((a: any) => ({
          id: a.id,
          name: a.name,
        })),
        theme: user.preference.theme,
      },
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sourceIds, categoryIds, authorIds } = body;

    // Validate minimum selections
    if (!sourceIds || sourceIds.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please select at least 2 sources' },
        { status: 400 }
      );
    }

    if (!categoryIds || categoryIds.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please select at least 2 categories' },
        { status: 400 }
      );
    }

    const em = await getEM();
    
    // Get user with preference
    const user = await em.findOne(
      User,
      { id: session.user.id },
      { populate: ['preference'] }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Create or get preference
    let preference = user.preference;
    if (!preference) {
      preference = em.create(UserPreference, {
        user: user,
      });
      user.preference = preference;
    }

    // Fetch sources
    const sources = await em.find(Source, { id: { $in: sourceIds } });
    if (sources.length !== sourceIds.length) {
      return NextResponse.json(
        { success: false, error: 'Some sources not found' },
        { status: 400 }
      );
    }

    // Fetch categories
    const categories = await em.find(Category, { id: { $in: categoryIds } });
    if (categories.length !== categoryIds.length) {
      return NextResponse.json(
        { success: false, error: 'Some categories not found' },
        { status: 400 }
      );
    }

    // Fetch authors (optional)
    let authors: any[] = [];
    if (authorIds && authorIds.length > 0) {
      authors = await em.find(Author, { id: { $in: authorIds } });
    }

    // Clear existing preferences
    preference.preferredSources.removeAll();
    preference.preferredCategories.removeAll();
    preference.preferredAuthors.removeAll();

    // Set new preferences
    preference.preferredSources.add(...sources);
    preference.preferredCategories.add(...categories);
    if (authors.length > 0) {
      preference.preferredAuthors.add(...authors);
    }

    await em.persistAndFlush(preference);

    const response = NextResponse.json({
      success: true,
      message: 'Preferences saved successfully',
    });

    // Set cookie to mark onboarding as completed
    response.cookies.set('onboarding_completed', 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  // Same as POST for now
  return POST(request);
}
