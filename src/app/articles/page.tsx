import { Suspense } from 'react';
import { ArticlesList } from '@/modules/feed/components/ArticlesList';
import { ArticleCardSkeletonList } from '@/components/ArticleCardSkeleton';

export const metadata = {
  title: 'Articles - Suhuf',
  description: 'Browse and search news articles from multiple sources',
};

export default function ArticlesPage() {
  return (
    <Suspense fallback={<ArticleCardSkeletonList count={20} />}>
      <ArticlesList />
    </Suspense>
  );
}
