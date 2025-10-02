'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MultiSelect, Option } from './MultiSelect';
import { DateRangePicker } from './DateRangePicker';

export interface FilterValues {
  categories: Option[];
  sources: Option[];
  authors: Option[];
  dateFrom: Date | null;
  dateTo: Date | null;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterValues;
  onApply: (filters: FilterValues) => void;
  categoryOptions: Option[];
  sourceOptions: Option[];
  authorOptions: Option[];
}

export function FilterPanel({
  isOpen,
  onClose,
  filters,
  onApply,
  categoryOptions,
  sourceOptions,
  authorOptions,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleClearAll = () => {
    const clearedFilters: FilterValues = {
      categories: [],
      sources: [],
      authors: [],
      dateFrom: null,
      dateTo: null,
    };
    setLocalFilters(clearedFilters);
    onApply(clearedFilters);
    onClose();
  };

  const hasActiveFilters =
    localFilters.categories.length > 0 ||
    localFilters.sources.length > 0 ||
    localFilters.authors.length > 0 ||
    localFilters.dateFrom !== null ||
    localFilters.dateTo !== null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <Card className="absolute top-full left-0 right-0 md:right-0 md:left-auto mt-2 w-full md:w-96 z-50 shadow-xl">
        <div className="flex flex-col max-h-[calc(100vh-180px)]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 pb-4 border-b flex-shrink-0">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filter Options - Scrollable */}
          <div className="overflow-y-auto p-4 md:p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 420px)' }}>
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Categories
            </label>
            <MultiSelect
              options={categoryOptions}
              value={localFilters.categories}
              onChange={(selected) =>
                setLocalFilters({ ...localFilters, categories: selected })
              }
              placeholder="Select categories..."
            />
          </div>

          {/* Sources */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Sources
            </label>
            <MultiSelect
              options={sourceOptions}
              value={localFilters.sources}
              onChange={(selected) =>
                setLocalFilters({ ...localFilters, sources: selected })
              }
              placeholder="Select sources..."
            />
          </div>

          {/* Authors */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Authors
            </label>
            <MultiSelect
              options={authorOptions}
              value={localFilters.authors}
              onChange={(selected) =>
                setLocalFilters({ ...localFilters, authors: selected })
              }
              placeholder="Select authors..."
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Date Range
            </label>
            <DateRangePicker
              dateFrom={localFilters.dateFrom}
              dateTo={localFilters.dateTo}
              onDateFromChange={(date) =>
                setLocalFilters({ ...localFilters, dateFrom: date })
              }
              onDateToChange={(date) =>
                setLocalFilters({ ...localFilters, dateTo: date })
              }
            />
          </div>
        </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex gap-3 p-4 md:p-6 pt-4 border-t bg-background flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={!hasActiveFilters}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
