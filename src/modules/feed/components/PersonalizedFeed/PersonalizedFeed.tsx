'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/ui/Footer';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { RefreshCw } from 'lucide-react';
import { useGetPersonalizedFeedQuery } from '@/modules/feed/state/queries';
import { LatestNews } from '../shared/LatestNews/LatestNews';
import { CategoriesGrid } from '../shared/CategoriesGrid/CategoriesGrid';
import { LatestArticles } from '../shared/LatestArticles/LatestArticles';
import { FeedContentLoading } from '../shared/FeedContentLoading/FeedContentLoading';
import { NoAggregatedContent } from './NoAggregatedContent/NoAggregatedContent';

export function PersonalizedFeed() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const { data: feedData, isLoading, isError, error, refetch, isRefetching } = useGetPersonalizedFeedQuery();

  const hasNoContent = feedData && 
    feedData.carousel.length === 0 && 
    feedData.topCategories.length === 0 && 
    feedData.latestArticles.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isAuthenticated={isAuthenticated} 
        onRefresh={() => refetch()} 
        refreshing={isRefetching}
        showRefresh={true}
      />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {isLoading ? (
          <FeedContentLoading />
        ) : isError ? (
          <ErrorMessage
            message={error instanceof Error ? error.message : 'Failed to load feed'}
            Icon={RefreshCw}
            actionLabel="Try Again"
            onAction={() => refetch()}
          />
        ) : hasNoContent ? (
          <NoAggregatedContent onRefresh={() => refetch()} />
        ) : feedData ? (
          <>
            <LatestNews articles={feedData.carousel} title="Latest Personalized News" />
            <CategoriesGrid categories={feedData.topCategories} title="Your Preferred Categories" />
            <LatestArticles articles={feedData.latestArticles} title="Latest from Popular Categories" />
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
