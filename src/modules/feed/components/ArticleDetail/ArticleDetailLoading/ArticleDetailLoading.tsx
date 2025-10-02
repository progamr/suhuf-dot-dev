'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

export function ArticleDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button Skeleton */}
      <Skeleton width={100} height={40} className="mb-6" />

      {/* Article Card */}
      <Card className="overflow-hidden">
        {/* Source Label */}
        <div className="bg-primary/10 px-6 py-3 border-b">
          <div className="flex items-center justify-between">
            <Skeleton width={120} height={20} />
            <Skeleton width={150} height={20} />
          </div>
        </div>

        {/* Article Image */}
        <Skeleton width="100%" height={384} className="md:h-96" />

        {/* Article Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Title */}
          <div className="space-y-3">
            <Skeleton width="100%" height={40} />
            <Skeleton width="80%" height={40} />
          </div>

          {/* Meta Information */}
          <div className="flex gap-4">
            <Skeleton width={120} height={20} />
            <Skeleton width={150} height={20} />
          </div>

          {/* Categories */}
          <div className="flex gap-2">
            <Skeleton width={80} height={28} className="rounded-full" />
            <Skeleton width={100} height={28} className="rounded-full" />
            <Skeleton width={90} height={28} className="rounded-full" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton width="100%" height={24} />
            <Skeleton width="100%" height={24} />
            <Skeleton width="100%" height={24} />
            <Skeleton width="70%" height={24} />
          </div>

          {/* Button */}
          <Skeleton width={250} height={44} />
        </div>
      </Card>

      {/* Related Articles Section */}
      <section className="mt-12">
        <Skeleton width={150} height={32} className="mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton width="100%" height={192} />
              <div className="p-4 space-y-2">
                <Skeleton width={80} height={16} />
                <Skeleton width="100%" height={24} />
                <Skeleton width="100%" height={20} />
                <Skeleton width="60%" height={20} />
                <Skeleton width={120} height={16} />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
