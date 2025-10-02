'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Settings, RefreshCw } from 'lucide-react';

interface NoAggregatedContentProps {
  onRefresh: () => void;
}

export function NoAggregatedContent({ onRefresh }: NoAggregatedContentProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="text-center space-y-6 max-w-md">
        <h2 className="text-2xl font-bold">No Articles Found</h2>
        <p className="text-muted-foreground">
          We couldn't find any articles matching your preferences. Try updating your preferences or check back later.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/onboarding')}>
            <Settings className="mr-2 h-4 w-4" />
            Update Preferences
          </Button>
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
