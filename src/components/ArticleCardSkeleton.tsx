'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Card } from './ui/Card';

export function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex gap-4">
        {/* Thumbnail skeleton */}
        <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
          <Skeleton height="100%" />
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-4 min-w-0">
          <Skeleton height={24} width="80%" className="mb-2" />
          <Skeleton count={2} className="mb-3" />
          <Skeleton height={16} width="60%" className="mb-3" />
          <div className="flex gap-2">
            <Skeleton height={24} width={80} />
            <Skeleton height={24} width={80} />
          </div>
        </div>
      </div>
    </Card>
  );
}

interface ArticleCardSkeletonListProps {
  count?: number;
}

export function ArticleCardSkeletonList({ count = 5 }: ArticleCardSkeletonListProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <ArticleCardSkeleton key={index} />
      ))}
    </div>
  );
}
