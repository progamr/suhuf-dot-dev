import { NextRequest, NextResponse } from 'next/server';
import { SyncService } from '@/infrastructure/services/syncService';

/**
 * POST /api/sync - Manually trigger news sync
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

    // Check if sync is already running
    if (SyncService.isSyncRunning()) {
      return NextResponse.json(
        { error: 'Sync is already running' },
        { status: 409 }
      );
    }

    // Trigger sync
    const result = await SyncService.syncAllSources();

    return NextResponse.json({
      success: result.success,
      message: 'Sync completed',
      stats: {
        articlesAdded: result.articlesAdded,
        articlesUpdated: result.articlesUpdated,
        errors: result.errors.length,
        duration: `${result.duration}ms`,
      },
      errors: result.errors,
    });
  } catch (error) {
    console.error('Sync API error:', error);
    return NextResponse.json(
      { 
        error: 'Sync failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sync - Check sync status
 */
export async function GET() {
  return NextResponse.json({
    isRunning: SyncService.isSyncRunning(),
  });
}
