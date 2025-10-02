import { ENDPOINTS } from '@/infrastructure/constants/api';
import { VerifyEmailInput } from '../../validation/authSchemas';

export interface VerifyEmailResponse {
  success: boolean;
  data?: {
    message: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function verifyEmailRequest(data: VerifyEmailInput): Promise<VerifyEmailResponse> {
  const response = await fetch(ENDPOINTS.AUTH_VERIFY_EMAIL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || 'Email verification failed');
  }

  return result;
}
