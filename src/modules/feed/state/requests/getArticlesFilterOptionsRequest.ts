import { ENDPOINTS } from '@/infrastructure/constants/api';
import { Option } from '@/components/filters/MultiSelect';

export interface ArticlesFilterOptions {
  categoryOptions: Option[];
  sourceOptions: Option[];
  authorOptions: Option[];
}

export async function getArticlesFilterOptionsRequest(): Promise<ArticlesFilterOptions> {
  const response = await fetch(ENDPOINTS.ARTICLES_FILTER_OPTIONS);
  
  if (!response.ok) {
    throw new Error('Failed to fetch filter options');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch filter options');
  }
  
  return data.data;
}
