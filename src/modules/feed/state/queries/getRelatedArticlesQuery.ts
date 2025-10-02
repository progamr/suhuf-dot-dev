import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getRelatedArticlesRequest } from '../requests/getRelatedArticlesRequest';
import { Article } from '@/types/feed';

interface UseGetRelatedArticlesQueryParams {
  articleId: string;
  categoryIds?: string;
  sourceId?: string;
  enabled?: boolean;
}

export function useGetRelatedArticlesQuery({ 
  articleId, 
  categoryIds, 
  sourceId,
  enabled = true 
}: UseGetRelatedArticlesQueryParams): UseQueryResult<Article[], Error> {
  return useQuery({
    queryKey: ['relatedArticles', articleId, categoryIds, sourceId],
    queryFn: () => getRelatedArticlesRequest({ articleId, categoryIds, sourceId }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
