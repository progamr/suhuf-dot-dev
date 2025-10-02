import { ENDPOINTS } from '@/infrastructure/constants/api';
import { Article } from '@/types/feed';

interface GetRelatedArticlesParams {
  articleId: string;
  categoryIds?: string;
  sourceId?: string;
}

export async function getRelatedArticlesRequest({ 
  articleId, 
  categoryIds, 
  sourceId 
}: GetRelatedArticlesParams): Promise<Article[]> {
  const params = new URLSearchParams();
  if (categoryIds) params.set('categories', categoryIds);
  if (sourceId) params.set('source', sourceId);
  
  const response = await fetch(`${ENDPOINTS.ARTICLE_RELATED(articleId)}?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch related articles');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch related articles');
  }
  
  return data.data;
}
