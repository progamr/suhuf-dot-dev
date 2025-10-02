'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/Button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick: () => void;
  filterCount: number;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onFilterClick,
  filterCount,
  placeholder = 'Search articles...',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange
  const handleChange = (newValue: string) => {
    setLocalValue(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, 500);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Button */}
      <Button
        variant="outline"
        onClick={onFilterClick}
        className="relative min-w-[120px] justify-center"
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Filters
        {filterCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
            {filterCount}
          </span>
        )}
      </Button>
    </div>
  );
}
