'use client';

import { SearchBar } from '@/components/SearchBar';

interface ArticlesSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick: () => void;
  filterCount: number;
}

export function ArticlesSearchBar({ 
  value, 
  onChange, 
  onFilterClick, 
  filterCount 
}: ArticlesSearchBarProps) {
  return (
    <div className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">Articles</h1>
        <SearchBar
          value={value}
          onChange={onChange}
          onFilterClick={onFilterClick}
          filterCount={filterCount}
        />
      </div>
    </div>
  );
}
