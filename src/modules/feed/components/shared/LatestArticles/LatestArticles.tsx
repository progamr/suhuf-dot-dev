'use client';

import { useRouter } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { Button } from '@/components/ui/Button';
import { Article } from '@/types/feed';

interface LatestArticlesProps {
  articles: Article[];
  title?: string;
}

export function LatestArticles({ articles, title = 'Latest Articles' }: LatestArticlesProps) {
  const router = useRouter();

  if (articles.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button
          variant="ghost"
          onClick={() => router.push('/articles')}
          className="text-primary hover:text-primary/80"
        >
          See All →
        </Button>
      </div>
      <div className="space-y-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
