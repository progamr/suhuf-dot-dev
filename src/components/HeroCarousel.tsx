'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArticleCard } from './ArticleCard';
import { Button } from './ui/Button';

interface Article {
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
}

interface HeroCarouselProps {
  articles: Article[];
  autoRotate?: boolean;
  interval?: number;
}

export function HeroCarousel({ 
  articles, 
  autoRotate = true, 
  interval = 5000 
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === articles.length - 1 ? 0 : prevIndex + 1
    );
  }, [articles.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? articles.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate || articles.length <= 1) return;

    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [autoRotate, interval, goToNext, articles.length]);

  if (!articles || articles.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">No articles available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {articles.map((article) => (
            <div key={article.id} className="min-w-full">
              <ArticleCard article={article} variant="carousel" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10 h-10 w-10 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10 h-10 w-10 md:h-12 md:w-12"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </>
      )}

      {/* Pagination Dots */}
      {articles.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
