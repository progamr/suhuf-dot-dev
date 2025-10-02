import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getSourcesRequest } from '../../requests/getSourcesRequest';
import { Source } from '@/types/onboarding';

export function useGetSourcesQuery(): UseQueryResult<Source[], Error> {
  return useQuery({
    queryKey: ['sources'],
    queryFn: getSourcesRequest,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
