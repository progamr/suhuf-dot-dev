'use client';

import { X } from 'lucide-react';
import { Option } from './filters/MultiSelect';

interface ActiveFiltersProps {
  categories: Option[];
  sources: Option[];
  authors: Option[];
  dateFrom: Date | null;
  dateTo: Date | null;
  onRemoveCategory: (id: string) => void;
  onRemoveSource: (id: string) => void;
  onRemoveAuthor: (id: string) => void;
  onRemoveDateFrom: () => void;
  onRemoveDateTo: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  categories,
  sources,
  authors,
  dateFrom,
  dateTo,
  onRemoveCategory,
  onRemoveSource,
  onRemoveAuthor,
  onRemoveDateFrom,
  onRemoveDateTo,
  onClearAll,
}: ActiveFiltersProps) {
  const hasFilters =
    categories.length > 0 ||
    sources.length > 0 ||
    authors.length > 0 ||
    dateFrom !== null ||
    dateTo !== null;

  if (!hasFilters) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <span className="text-sm text-muted-foreground">Active filters:</span>

      {/* Category chips */}
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onRemoveCategory(cat.value)}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          {cat.label}
          <X className="h-3 w-3" />
        </button>
      ))}

      {/* Source chips */}
      {sources.map((source) => (
        <button
          key={source.value}
          onClick={() => onRemoveSource(source.value)}
          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-sm rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
        >
          {source.label}
          <X className="h-3 w-3" />
        </button>
      ))}

      {/* Author chips */}
      {authors.map((author) => (
        <button
          key={author.value}
          onClick={() => onRemoveAuthor(author.value)}
          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 text-sm rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
        >
          {author.label}
          <X className="h-3 w-3" />
        </button>
      ))}

      {/* Date from chip */}
      {dateFrom && (
        <button
          onClick={onRemoveDateFrom}
          className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 text-sm rounded-full hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
        >
          From: {formatDate(dateFrom)}
          <X className="h-3 w-3" />
        </button>
      )}

      {/* Date to chip */}
      {dateTo && (
        <button
          onClick={onRemoveDateTo}
          className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 text-sm rounded-full hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
        >
          To: {formatDate(dateTo)}
          <X className="h-3 w-3" />
        </button>
      )}

      {/* Clear all button */}
      <button
        onClick={onClearAll}
        className="text-sm text-destructive hover:underline ml-2"
      >
        Clear all
      </button>
    </div>
  );
}
