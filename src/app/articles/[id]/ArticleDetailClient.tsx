'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ExternalLink, Calendar, User, ArrowLeft, Loader2, RefreshCw, ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
    slug: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  author?: {
    id: string;
    name: string;
  } | null;
}

interface ArticleDetailClientProps {
  articleId: string;
}

export function ArticleDetailClient({ articleId }: ArticleDetailClientProps) {
  const router = useRouter();
  const { status } = useSession();
  const [imageError, setImageError] = useState(false);
  const [relatedImageErrors, setRelatedImageErrors] = useState<Record<string, boolean>>({});

  const isAuthenticated = status === 'authenticated';

  // Fetch article
  const fetchArticle = async (): Promise<Article> => {
    const response = await fetch(`/api/articles/${articleId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Article not found');
      }
      throw new Error('Failed to fetch article');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch article');
    }
    
    return data.data;
  };

  const { 
    data: article, 
    isLoading: articleLoading, 
    isError: articleError, 
    error: articleErrorMsg,
    refetch: refetchArticle 
  } = useQuery({
    queryKey: ['article', articleId],
    queryFn: fetchArticle,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Fetch related articles
  const fetchRelatedArticles = async (): Promise<Article[]> => {
    if (!article) return [];
    
    const categoryIds = article.categories?.map(c => c.id).join(',') || '';
    const sourceId = article.source.id;
    
    const params = new URLSearchParams();
    if (categoryIds) params.set('categories', categoryIds);
    if (sourceId) params.set('source', sourceId);
    
    const response = await fetch(`/api/articles/${articleId}/related?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch related articles');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch related articles');
    }
    
    return data.data;
  };

  const { 
    data: relatedArticles = [], 
    isLoading: relatedLoading 
  } = useQuery({
    queryKey: ['relatedArticles', articleId, article?.categories, article?.source.id],
    queryFn: fetchRelatedArticles,
    enabled: !!article, // Only fetch when article is loaded
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
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

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

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

        {/* Article Card */}
        <Card className="overflow-hidden">
          {/* Source Label */}
          <div className="bg-primary/10 px-6 py-3 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">
                {article.source.name}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Article Image */}
          {article.imageUrl && (
            <div className="relative w-full h-64 md:h-96 bg-muted flex items-center justify-center">
              {!imageError ? (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <ImageIcon className="h-24 w-24 text-muted-foreground/30" />
              )}
            </div>
          )}

          {/* Article Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{timeAgo}</span>
              </div>
              {article.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author.name}</span>
                </div>
              )}
            </div>

            {/* Categories */}
            {article.categories && article.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.categories.map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {article.description && (
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-foreground/90">
                  {article.description}
                </p>
              </div>
            )}

            {/* Read Full Article Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="w-full md:w-auto"
                onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Read Full Article on Site
              </Button>
            </div>
          </div>
        </Card>

        {/* More News Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">More News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card
                  key={relatedArticle.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/articles/${relatedArticle.id}`)}
                >
                  {/* Article Image */}
                  {relatedArticle.imageUrl && (
                    <div className="relative w-full h-48 bg-muted flex items-center justify-center">
                      {!relatedImageErrors[relatedArticle.id] ? (
                        <Image
                          src={relatedArticle.imageUrl}
                          alt={relatedArticle.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          onError={() => {
                            setRelatedImageErrors(prev => ({
                              ...prev,
                              [relatedArticle.id]: true
                            }));
                          }}
                        />
                      ) : (
                        <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                      )}
                    </div>
                  )}

                  {/* Article Info */}
                  <div className="p-4 space-y-2">
                    <div className="text-xs text-primary font-semibold">
                      {relatedArticle.source.name}
                    </div>
                    <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
                      {relatedArticle.title}
                    </h3>
                    {relatedArticle.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedArticle.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(relatedArticle.publishedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
