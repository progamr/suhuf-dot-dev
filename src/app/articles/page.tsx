import { Suspense } from 'react';
import { getEM } from '@/infrastructure/db/initDb';
import { Category } from '@/infrastructure/entities/Category';
import { Source } from '@/infrastructure/entities/Source';
import { Author } from '@/infrastructure/entities/Author';
import { ArticlesListClient } from './ArticlesListClient';
import { ArticleCardSkeletonList } from '@/components/ArticleCardSkeleton';
import { Option } from '@/components/filters/MultiSelect';

export const metadata = {
  title: 'Articles - Suhuf',
  description: 'Browse and search news articles from multiple sources',
};

async function getFilterOptions() {
  const em = await getEM();

  // Fetch filter options
  const [categories, sources, authors] = await Promise.all([
    em.find(Category, {}, { orderBy: { name: 'ASC' } }),
    em.find(Source, { isActive: true }, { orderBy: { name: 'ASC' } }),
    em.find(Author, {}, { orderBy: { name: 'ASC' }, limit: 100 }),
  ]);

  // Remove duplicates using Map
  const uniqueCategories = Array.from(
    new Map(categories.map((cat: any) => [cat.id, cat])).values()
  );
  const uniqueSources = Array.from(
    new Map(sources.map((source: any) => [source.id, source])).values()
  );
  const uniqueAuthors = Array.from(
    new Map(authors.map((author: any) => [author.id, author])).values()
  );

  // Transform to options and sort alphabetically
  const categoryOptions: Option[] = uniqueCategories
    .map((cat: any) => ({
      value: cat.id,
      label: cat.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const sourceOptions: Option[] = uniqueSources
    .map((source: any) => ({
      value: source.id,
      label: source.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const authorOptions: Option[] = uniqueAuthors
    .map((author: any) => ({
      value: author.id,
      label: author.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    categoryOptions,
    sourceOptions,
    authorOptions,
  };
}

export default async function ArticlesPage() {
  const options = await getFilterOptions();

  return (
    <Suspense fallback={<ArticleCardSkeletonList count={20} />}>
      <ArticlesListClient
        categoryOptions={options.categoryOptions}
        sourceOptions={options.sourceOptions}
        authorOptions={options.authorOptions}
      />
    </Suspense>
  );
}
