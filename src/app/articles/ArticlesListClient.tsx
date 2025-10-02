'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel, FilterValues } from '@/components/filters/FilterPanel';
import { ActiveFilters } from '@/components/ActiveFilters';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleCardSkeletonList } from '@/components/ArticleCardSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { GoToTopButton } from '@/components/GoToTopButton';
import { Option } from '@/components/filters/MultiSelect';

interface Article {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  publishedAt: string;
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

interface ArticlesListClientProps {
  categoryOptions: Option[];
  sourceOptions: Option[];
  authorOptions: Option[];
}

export function ArticlesListClient({
  categoryOptions,
  sourceOptions,
  authorOptions,
}: ArticlesListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();
  const { status } = useSession();

  const isAuthenticated = status === 'authenticated';

  // Parse initial filters from URL
  const getInitialFilters = (): FilterValues => {
    const categoryIds = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const sourceIds = searchParams.get('sources')?.split(',').filter(Boolean) || [];
    const authorIds = searchParams.get('authors')?.split(',').filter(Boolean) || [];
    const dateFrom = searchParams.get('from');
    const dateTo = searchParams.get('to');

    return {
      categories: categoryOptions.filter((opt) => categoryIds.includes(opt.value)),
      sources: sourceOptions.filter((opt) => sourceIds.includes(opt.value)),
      authors: authorOptions.filter((opt) => authorIds.includes(opt.value)),
      dateFrom: dateFrom ? new Date(dateFrom) : null,
      dateTo: dateTo ? new Date(dateTo) : null,
    };
  };

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState<FilterValues>(getInitialFilters());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Build query string for API
  const buildQueryString = (searchValue: string, filterValues: FilterValues, pageNum: number) => {
    const params = new URLSearchParams();

    if (searchValue) params.set('search', searchValue);
    if (filterValues.categories.length > 0) {
      params.set('categories', filterValues.categories.map((c) => c.value).join(','));
    }
    if (filterValues.sources.length > 0) {
      params.set('sources', filterValues.sources.map((s) => s.value).join(','));
    }
    if (filterValues.authors.length > 0) {
      params.set('authors', filterValues.authors.map((a) => a.value).join(','));
    }
    if (filterValues.dateFrom) {
      params.set('from', filterValues.dateFrom.toISOString().split('T')[0]);
    }
    if (filterValues.dateTo) {
      params.set('to', filterValues.dateTo.toISOString().split('T')[0]);
    }
    params.set('page', pageNum.toString());
    params.set('limit', '20');

    return params.toString();
  };

  // Fetch function for React Query
  const fetchArticles = async ({ pageParam = 1 }) => {
    const queryString = buildQueryString(search, filters, pageParam);
    const response = await fetch(`/api/articles?${queryString}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    
    const data = await response.json();
    return data.data;
  };

  // React Query infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['articles', search, filters],
    queryFn: fetchArticles,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  // Update URL when search/filters change
  const updateURL = (searchValue: string, filterValues: FilterValues) => {
    const params = new URLSearchParams();

    if (searchValue) params.set('search', searchValue);
    if (filterValues.categories.length > 0) {
      params.set('categories', filterValues.categories.map((c) => c.value).join(','));
    }
    if (filterValues.sources.length > 0) {
      params.set('sources', filterValues.sources.map((s) => s.value).join(','));
    }
    if (filterValues.authors.length > 0) {
      params.set('authors', filterValues.authors.map((a) => a.value).join(','));
    }
    if (filterValues.dateFrom) {
      params.set('from', filterValues.dateFrom.toISOString().split('T')[0]);
    }
    if (filterValues.dateTo) {
      params.set('to', filterValues.dateTo.toISOString().split('T')[0]);
    }

    const queryString = params.toString();
    router.push(`/articles${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateURL(value, filters);
  };

  // Handle filter apply
  const handleFilterApply = (newFilters: FilterValues) => {
    setFilters(newFilters);
    updateURL(search, newFilters);
  };

  // Handle remove individual filter
  const handleRemoveCategory = (id: string) => {
    const newFilters = {
      ...filters,
      categories: filters.categories.filter((c) => c.value !== id),
    };
    handleFilterApply(newFilters);
  };

  const handleRemoveSource = (id: string) => {
    const newFilters = {
      ...filters,
      sources: filters.sources.filter((s) => s.value !== id),
    };
    handleFilterApply(newFilters);
  };

  const handleRemoveAuthor = (id: string) => {
    const newFilters = {
      ...filters,
      authors: filters.authors.filter((a) => a.value !== id),
    };
    handleFilterApply(newFilters);
  };

  const handleRemoveDateFrom = () => {
    const newFilters = { ...filters, dateFrom: null };
    handleFilterApply(newFilters);
  };

  const handleRemoveDateTo = () => {
    const newFilters = { ...filters, dateTo: null };
    handleFilterApply(newFilters);
  };

  // Handle clear all filters
  const handleClearAll = () => {
    const clearedFilters: FilterValues = {
      categories: [],
      sources: [],
      authors: [],
      dateFrom: null,
      dateTo: null,
    };
    setSearch('');
    setFilters(clearedFilters);
    updateURL('', clearedFilters);
  };

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Calculate filter count
  const filterCount =
    filters.categories.length +
    filters.sources.length +
    filters.authors.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0);

  const hasActiveFilters = filterCount > 0 || search.length > 0;

  // Flatten all articles from pages
  const articles = data?.pages.flatMap((page) => page.articles) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header isAuthenticated={isAuthenticated} />

      {/* Search & Filter Section */}
      <div className="sticky top-16 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">Articles</h1>

          {/* Search & Filter */}
          <div className="relative">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
              filterCount={filterCount}
            />

            <FilterPanel
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              filters={filters}
              onApply={handleFilterApply}
              categoryOptions={categoryOptions}
              sourceOptions={sourceOptions}
              authorOptions={authorOptions}
            />
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <ActiveFilters
              categories={filters.categories}
              sources={filters.sources}
              authors={filters.authors}
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              onRemoveCategory={handleRemoveCategory}
              onRemoveSource={handleRemoveSource}
              onRemoveAuthor={handleRemoveAuthor}
              onRemoveDateFrom={handleRemoveDateFrom}
              onRemoveDateTo={handleRemoveDateTo}
              onClearAll={handleClearAll}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <ArticleCardSkeletonList count={20} />
        ) : isError ? (
          <EmptyState type="no-articles" />
        ) : articles.length === 0 ? (
          <EmptyState
            type={hasActiveFilters ? 'no-results' : 'no-articles'}
            onClearFilters={hasActiveFilters ? handleClearAll : undefined}
          />
        ) : (
          <>
            <div className="space-y-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Loading more indicator */}
            {isFetchingNextPage && (
              <div className="mt-8">
                <ArticleCardSkeletonList count={5} />
              </div>
            )}

            {/* Intersection observer trigger */}
            {hasNextPage && !isFetchingNextPage && (
              <div ref={ref} className="h-20" />
            )}

            {/* No more articles */}
            {!hasNextPage && articles.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No more articles to load
              </div>
            )}
          </>
        )}
      </main>

      {/* Go to Top Button */}
      <GoToTopButton />
    </div>
  );
}
