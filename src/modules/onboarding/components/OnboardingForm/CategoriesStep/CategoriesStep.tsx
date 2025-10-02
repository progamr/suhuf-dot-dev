'use client';

import { Card } from '@/components/ui/Card';
import { CheckCircle2, Circle } from 'lucide-react';
import { Category } from '@/types/feed';

interface CategoriesStepProps {
  categories: Category[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function CategoriesStep({ categories, selectedIds, onToggle }: CategoriesStepProps) {
  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Select Your Favorite Categories</h2>
          <p className="text-muted-foreground">Choose at least 2 categories (minimum 2 required)</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            const isSelected = selectedIds.includes(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onToggle(category.id)}
                className={`relative p-4 rounded-lg border-2 transition-all text-center ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {isSelected ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-sm text-muted-foreground text-center">
          {selectedIds.length} of {categories.length} categories selected
          {selectedIds.length < 2 && ' (minimum 2 required)'}
        </div>
      </div>
    </Card>
  );
}
