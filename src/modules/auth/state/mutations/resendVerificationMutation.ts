import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { resendVerificationRequest, ResendVerificationResponse } from '../requests/resendVerificationRequest';
import { ResendVerificationInput } from '../../validation/authSchemas';

export function useResendVerificationMutation(): UseMutationResult<ResendVerificationResponse, Error, ResendVerificationInput> {
  return useMutation({
    mutationFn: resendVerificationRequest,
  });
}
