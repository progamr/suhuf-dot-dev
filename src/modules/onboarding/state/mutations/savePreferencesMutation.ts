import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { savePreferencesRequest } from '../requests/savePreferencesRequest';
import { OnboardingPreferences } from '@/types/onboarding';

export function useSavePreferencesMutation(): UseMutationResult<void, Error, OnboardingPreferences> {
  return useMutation({
    mutationFn: savePreferencesRequest,
  });
}
