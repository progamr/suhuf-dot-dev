'use client';

import { useRouter } from 'next/navigation';
import { HeroCarousel } from '@/components/HeroCarousel';
import { Button } from '@/components/ui/Button';
import { Article } from '@/types/feed';

interface LatestNewsProps {
  articles: Article[];
  title?: string;
}

export function LatestNews({ articles, title = 'Latest News' }: LatestNewsProps) {
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
      <HeroCarousel articles={articles} />
    </section>
  );
}
