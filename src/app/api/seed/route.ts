import { NextRequest, NextResponse } from 'next/server';
import { SyncService } from '@/infrastructure/services/syncService';

/**
 * POST /api/seed - Initial database seed
 * Protected by API key
 */
export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.SYNC_API_KEY;

    if (!expectedKey) {
      return NextResponse.json(
        { error: 'Sync API key not configured' },
        { status: 500 }
      );
    }

    if (apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Run initial seed
    const result = await SyncService.initialSeed();

    return NextResponse.json({
      success: result.success,
      message: result.articlesAdded === 0 ? 'Database already seeded' : 'Seed completed',
      stats: {
        articlesAdded: result.articlesAdded,
        duration: `${result.duration}ms`,
        errors: result.errors.length,
      },
      errors: result.errors,
    });
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { 
        error: 'Seed failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
