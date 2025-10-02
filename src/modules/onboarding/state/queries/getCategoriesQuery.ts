import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getCategoriesRequest } from '../requests/getCategoriesRequest';
import { Category } from '@/types/feed';

export function useGetCategoriesQuery(): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesRequest,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
