import { ENDPOINTS } from '@/infrastructure/constants/api';

export interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  sourcesCount: number;
  categoriesCount: number;
}

export async function getOnboardingStatusRequest(): Promise<OnboardingStatus> {
  const response = await fetch(ENDPOINTS.USER_ONBOARDING_STATUS);
  
  if (!response.ok) {
    throw new Error('Failed to fetch onboarding status');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch onboarding status');
  }
  
  return data.data;
}
