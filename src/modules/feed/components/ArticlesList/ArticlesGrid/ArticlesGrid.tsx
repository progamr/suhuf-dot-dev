'use client';

import { ArticleCard } from '@/components/ArticleCard';
import { ArticleCardSkeletonList } from '@/components/ArticleCardSkeleton';
import { Article } from '@/types/feed';

interface ArticlesGridProps {
  articles: Article[];
  isFetchingMore?: boolean;
  hasMore?: boolean;
  loadMoreRef?: (node?: Element | null) => void;
}

export function ArticlesGrid({ 
  articles, 
  isFetchingMore, 
  hasMore, 
  loadMoreRef 
}: ArticlesGridProps) {
  return (
    <>
      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* Loading more indicator */}
      {isFetchingMore && (
        <div className="mt-8">
          <ArticleCardSkeletonList count={5} />
        </div>
      )}

      {/* Intersection observer trigger */}
      {hasMore && !isFetchingMore && loadMoreRef && (
        <div ref={loadMoreRef} className="h-20" />
      )}

      {/* No more articles */}
      {!hasMore && articles.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No more articles to load
        </div>
      )}
    </>
  );
}
