import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getAuthorsRequest } from '../requests/getAuthorsRequest';
import { Author } from '@/types/onboarding';

export function useGetAuthorsQuery(limit: number = 50): UseQueryResult<Author[], Error> {
  return useQuery({
    queryKey: ['authors', limit],
    queryFn: () => getAuthorsRequest(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
