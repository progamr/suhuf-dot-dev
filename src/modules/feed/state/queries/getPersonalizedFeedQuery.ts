import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getPersonalizedFeedRequest } from '@/modules/feed/state/requests/getPersonalizedFeedRequest';
import { FeedData } from '@/types/feed';

export function useGetPersonalizedFeedQuery(): UseQueryResult<FeedData, Error> {
  return useQuery({
    queryKey: ['personalizedFeed'],
    queryFn: getPersonalizedFeedRequest,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
