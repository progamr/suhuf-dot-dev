'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Calendar, User, ImageIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '@/types/feed';

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  const [imageError, setImageError] = useState(false);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  return (
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
  );
}
