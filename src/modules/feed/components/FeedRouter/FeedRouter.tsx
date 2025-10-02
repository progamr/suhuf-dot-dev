'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useGetOnboardingStatusQuery } from '../../state/queries/getOnboardingStatusQuery';
import { PersonalizedFeed } from '../PersonalizedFeed/PersonalizedFeed';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { RefreshCw } from 'lucide-react';

export function FeedRouter() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useGetOnboardingStatusQuery();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (data && !data.hasCompletedOnboarding && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace('/onboarding'); // Use replace to avoid adding to history
    }
  }, [data, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Failed to load'}
        Icon={RefreshCw}
        actionLabel="Try Again"
        onAction={() => refetch()}
      />
    );
  }

  if (!data?.hasCompletedOnboarding) {
    // Redirecting (should only happen once due to ref)
    return null;
  }

  return <PersonalizedFeed />;
}
