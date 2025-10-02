import { ENDPOINTS } from '@/infrastructure/constants/api';
import { SignupInput } from '../../validation/authSchemas';

export interface SignupResponse {
  success: boolean;
  data?: {
    message: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function signupRequest(data: SignupInput): Promise<SignupResponse> {
  const response = await fetch(ENDPOINTS.AUTH_SIGNUP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || 'Signup failed');
  }

  return result;
}
