'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useGetArticleByIdQuery } from '../../state/queries/getArticleByIdQuery';
import { useGetRelatedArticlesQuery } from '../../state/queries/getRelatedArticlesQuery';
import { ArticleContent } from './ArticleContent/ArticleContent';
import { RelatedArticles } from './RelatedArticles/RelatedArticles';
import { ArticleDetailLoading } from './ArticleDetailLoading/ArticleDetailLoading';

interface ArticleDetailProps {
  articleId: string;
}

export function ArticleDetail({ articleId }: ArticleDetailProps) {
  const router = useRouter();
  const { status } = useSession();

  const isAuthenticated = status === 'authenticated';

  // Fetch article
  const { 
    data: article, 
    isLoading: articleLoading, 
    isError: articleError, 
    error: articleErrorMsg,
    refetch: refetchArticle 
  } = useGetArticleByIdQuery(articleId);

  // Fetch related articles
  const categoryIds = article?.categories?.map(c => c.id).join(',') || '';
  const sourceId = article?.source.id || '';

  const { 
    data: relatedArticles = []
  } = useGetRelatedArticlesQuery({
    articleId,
    categoryIds,
    sourceId,
    enabled: !!article, // Only fetch when article is loaded
  });

  // Update document title for SEO
  useEffect(() => {
    if (article) {
      document.title = `${article.title} - Suhuf`;
    }
  }, [article]);

  // Loading state
  if (articleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={isAuthenticated} />
        <ArticleDetailLoading />
      </div>
    );
  }

  // Error state
  if (articleError || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAuthenticated={isAuthenticated} />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="text-destructive text-lg font-semibold">
              {articleErrorMsg instanceof Error && articleErrorMsg.message === 'Article not found' 
                ? 'Article Not Found' 
                : 'Failed to Load Article'}
            </div>
            <p className="text-muted-foreground">
              {articleErrorMsg instanceof Error 
                ? articleErrorMsg.message 
                : 'An error occurred while loading the article'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button variant="outline" onClick={() => refetchArticle()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header isAuthenticated={isAuthenticated} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Article Content */}
        <ArticleContent article={article} />

        {/* Related Articles */}
        <RelatedArticles articles={relatedArticles} />
      </main>

      <Footer />
    </div>
  );
}
