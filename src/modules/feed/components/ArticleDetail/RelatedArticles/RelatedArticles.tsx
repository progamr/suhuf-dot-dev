'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Calendar, ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/types/feed';

interface RelatedArticlesProps {
  articles: Article[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  const router = useRouter();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">More News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => router.push(`/articles/${article.id}`)}
          >
            {/* Article Image */}
            {article.imageUrl && (
              <div className="relative w-full h-48 bg-muted flex items-center justify-center">
                {!imageErrors[article.id] ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={() => {
                      setImageErrors(prev => ({
                        ...prev,
                        [article.id]: true
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
                {article.source.name}
              </div>
              <h3 className="font-semibold text-lg line-clamp-2 leading-tight">
                {article.title}
              </h3>
              {article.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(article.publishedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
