import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getPublicFeedRequest } from '@/modules/feed/state/requests/getPublicFeedRequest';
import { FeedData } from '@/types/feed';

export function useGetPublicFeedQuery(): UseQueryResult<FeedData, Error> {
  return useQuery({
    queryKey: ['publicFeed'],
    queryFn: getPublicFeedRequest,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
