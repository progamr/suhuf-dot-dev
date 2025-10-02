import { NextResponse } from 'next/server';
import { auth } from '@/infrastructure/auth/auth';
import { getEM } from '@/infrastructure/db/initDb';
import { User } from '@/infrastructure/entities/User';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // Check for server-side call with user ID in header
    const headersList = await headers();
    const userIdFromHeader = headersList.get('x-user-id');
    
    let userId: string | undefined;
    
    if (userIdFromHeader) {
      // Server-side call
      userId = userIdFromHeader;
    } else {
      // Client-side call - check session
      const session = await auth();
      userId = session?.user?.id;
    }
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const em = await getEM();
    const user = await em.findOne(
      User,
      { id: userId },
      { 
        populate: [
          'preference.preferredSources',
          'preference.preferredCategories',
        ] 
      }
    );

    // If no preferences, onboarding not completed
    if (!user?.preference) {
      return NextResponse.json({
        success: true,
        data: {
          hasCompletedOnboarding: false,
          sourcesCount: 0,
          categoriesCount: 0,
        }
      });
    }

    const preferredSources = user.preference.preferredSources.getItems();
    const preferredCategories = user.preference.preferredCategories.getItems();

    const hasCompletedOnboarding = preferredSources.length >= 2 && preferredCategories.length >= 2;

    return NextResponse.json({
      success: true,
      data: {
        hasCompletedOnboarding,
        sourcesCount: preferredSources.length,
        categoriesCount: preferredCategories.length,
      }
    });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check onboarding status' },
      { status: 500 }
    );
  }
}
