'use client';

import { Search, Newspaper } from 'lucide-react';
import { Button } from './ui/Button';

interface EmptyStateProps {
  type: 'no-results' | 'no-articles';
  onClearFilters?: () => void;
}

export function EmptyState({ type, onClearFilters }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No articles found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
        </p>
        {onClearFilters && (
          <Button onClick={onClearFilters} variant="outline">
            Clear All Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Newspaper className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-bold mb-2">No articles available</h3>
      <p className="text-muted-foreground max-w-md">
        There are no articles in the database yet. Check back later for updates!
      </p>
    </div>
  );
}
