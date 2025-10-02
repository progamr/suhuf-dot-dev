'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Newspaper } from 'lucide-react';
import { Card } from './ui/Card';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    publishedAt: string | Date;
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
  };
  variant?: 'default' | 'compact' | 'carousel';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const publishedDate = new Date(article.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  if (variant === 'carousel') {
    return (
      <Link href={`/articles/${article.id}`} className="block group">
        <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
              quality={90}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Newspaper className="h-24 w-24 text-white opacity-50" />
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 px-12 md:px-16 py-6 md:py-8 text-white">
            {article.categories && article.categories.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {article.categories.slice(0, 2).map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
            
            <h2 className="text-xl md:text-3xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h2>
            
            {article.description && (
              <p className="text-sm md:text-base text-gray-200 mb-4 line-clamp-2">
                {article.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="font-medium">{article.source.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-muted relative overflow-hidden">
            {article.imageUrl ? (
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 128px, 160px"
                quality={85}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Newspaper className="h-12 w-12 text-white opacity-50" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4 min-w-0">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
            
            {article.description && variant !== 'compact' && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {article.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{article.source.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {timeAgo}
              </span>
            </div>
            
            {article.categories && article.categories.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {article.categories.slice(0, 2).map((category) => (
                  <span
                    key={category.id}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
