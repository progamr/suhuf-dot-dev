'use client';

import { CategoryCard } from '@/components/CategoryCard';
import { Category } from '@/types/feed';

interface CategoriesGridProps {
  categories: Category[];
  title: string;
}

export function CategoriesGrid({ categories, title }: CategoriesGridProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
