import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { verifyEmailRequest, VerifyEmailResponse } from '../requests/verifyEmailRequest';
import { VerifyEmailInput } from '../../validation/authSchemas';

export function useVerifyEmailMutation(): UseMutationResult<VerifyEmailResponse, Error, VerifyEmailInput> {
  return useMutation({
    mutationFn: verifyEmailRequest,
  });
}
