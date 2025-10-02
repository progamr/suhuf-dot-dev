import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getArticlesFilterOptionsRequest, ArticlesFilterOptions } from '../requests/getArticlesFilterOptionsRequest';

export function useGetArticlesFilterOptionsQuery(): UseQueryResult<ArticlesFilterOptions, Error> {
  return useQuery({
    queryKey: ['articlesFilterOptions'],
    queryFn: getArticlesFilterOptionsRequest,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
