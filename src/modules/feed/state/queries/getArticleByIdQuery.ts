import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getArticleByIdRequest } from '@/modules/feed/state/requests/getArticleByIdRequest';
import { Article } from '@/types/feed';

export function useGetArticleByIdQuery(articleId: string): UseQueryResult<Article, Error> {
  return useQuery({
    queryKey: ['article', articleId],
    queryFn: () => getArticleByIdRequest(articleId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
