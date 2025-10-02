import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getOnboardingStatusRequest, OnboardingStatus } from '../../requests/getOnboardingStatusRequest';

export function useGetOnboardingStatusQuery(): UseQueryResult<OnboardingStatus, Error> {
  return useQuery({
    queryKey: ['onboardingStatus'],
    queryFn: getOnboardingStatusRequest,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
