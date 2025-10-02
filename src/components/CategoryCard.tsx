'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FileText } from 'lucide-react';
import { Card } from './ui/Card';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    articleCount: number;
  };
}

// Generate a consistent color based on category name
const getCategoryColor = (name: string) => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-orange-500 to-orange-600',
    'from-green-500 to-green-600',
    'from-teal-500 to-teal-600',
    'from-indigo-500 to-indigo-600',
    'from-red-500 to-red-600',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export function CategoryCard({ category }: CategoryCardProps) {
  const colorClass = getCategoryColor(category.name);

  return (
    <Link href={`/articles?categories=${category.id}`}>
      <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50">
        <div className="relative h-32 md:h-40">
          {/* Background */}
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={85}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${colorClass} relative overflow-hidden`}>
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full" />
              
              {/* Category initial */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-white/30">
                  {category.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
            <h3 className="font-bold text-base md:text-lg mb-1 text-white drop-shadow-lg group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-xs md:text-sm text-white/90 flex items-center gap-1 drop-shadow">
              <FileText className="h-3 w-3" />
              {category.articleCount} {category.articleCount === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
