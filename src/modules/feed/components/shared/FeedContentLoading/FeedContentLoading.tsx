'use client';

import { Skeleton } from '@/components/ui/Skeleton';

interface FeedContentLoadingProps {
  showCallToAction?: boolean;
}

export function FeedContentLoading({ showCallToAction = false }: FeedContentLoadingProps) {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Latest News Skeleton */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <Skeleton width={256} height={36} />
          <Skeleton width={96} height={40} />
        </div>
        {/* Carousel Skeleton */}
        <div className="relative">
          <Skeleton height={384} borderRadius={8} />
        </div>
      </section>

      {/* Categories Skeleton */}
      <section>
        <div className="mb-6">
          <Skeleton width={256} height={36} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} height={128} borderRadius={8} />
          ))}
        </div>
      </section>

      {/* Latest Articles Skeleton */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <Skeleton width={320} height={36} />
          <Skeleton width={96} height={40} />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex gap-4">
                <Skeleton width={192} height={128} borderRadius={4} />
                <div className="flex-1 space-y-3">
                  <Skeleton height={24} width="75%" />
                  <Skeleton height={16} count={2} />
                  <div className="flex gap-2 mt-4">
                    <Skeleton width={80} height={24} />
                    <Skeleton width={96} height={24} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Skeleton (for PublicFeed) */}
      {showCallToAction && (
        <section className="text-center py-12 space-y-6">
          <Skeleton width={320} height={36} className="mx-auto" />
          <Skeleton width={480} height={56} className="mx-auto" />
          <div className="flex gap-4 justify-center">
            <Skeleton width={140} height={44} />
            <Skeleton width={120} height={44} />
          </div>
        </section>
      )}
    </div>
  );
}
