import { ENDPOINTS } from '@/infrastructure/constants/api';
import { OnboardingPreferences } from '@/types/onboarding';

export async function savePreferencesRequest(preferences: OnboardingPreferences): Promise<void> {
  const response = await fetch(ENDPOINTS.USER_PREFERENCES, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save preferences');
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to save preferences');
  }
}
