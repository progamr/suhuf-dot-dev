import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { signupRequest, SignupResponse } from '../requests/signupRequest';
import { SignupInput } from '../../validation/authSchemas';

export function useSignupMutation(): UseMutationResult<SignupResponse, Error, SignupInput> {
  return useMutation({
    mutationFn: signupRequest,
  });
}
