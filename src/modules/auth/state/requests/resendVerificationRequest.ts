import { ENDPOINTS } from '@/infrastructure/constants/api';
import { ResendVerificationInput } from '../../validation/authSchemas';

export interface ResendVerificationResponse {
  success: boolean;
  data?: {
    message: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function resendVerificationRequest(data: ResendVerificationInput): Promise<ResendVerificationResponse> {
  const response = await fetch(ENDPOINTS.AUTH_RESEND_VERIFICATION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || 'Resend verification failed');
  }

  return result;
}
