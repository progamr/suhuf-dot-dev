'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export function OnboardingLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <Skeleton height={48} width="60%" className="mx-auto" />
        <Skeleton height={28} width="80%" className="mx-auto" />
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <Skeleton circle width={40} height={40} />
          <Skeleton width={80} height={20} />
        </div>
        <Skeleton width={64} height={2} />
        <div className="flex items-center gap-2">
          <Skeleton circle width={40} height={40} />
          <Skeleton width={100} height={20} />
        </div>
        <Skeleton width={64} height={2} />
        <div className="flex items-center gap-2">
          <Skeleton circle width={40} height={40} />
          <Skeleton width={80} height={20} />
        </div>
      </div>

      {/* Main Card */}
      <div className="border rounded-lg p-8 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Skeleton height={32} width="50%" />
          <Skeleton height={20} width="70%" />
        </div>

        {/* Grid of Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border-2 rounded-lg p-6">
              <div className="space-y-3">
                <Skeleton height={24} width="80%" />
                <Skeleton height={16} width="60%" />
              </div>
            </div>
          ))}
        </div>

        {/* Counter */}
        <Skeleton height={16} width="40%" className="mx-auto" />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton width={120} height={40} />
        <Skeleton width={120} height={40} />
      </div>
    </div>
  );
}
