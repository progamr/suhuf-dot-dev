import { useMutation } from '@tanstack/react-query';
import { ResendVerificationInput } from '../utils/validation';

interface ResendVerificationResponse {
  success: boolean;
  data?: {
    message: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export const useResendVerificationMutation = () => {
  return useMutation({
    mutationFn: async (data: ResendVerificationInput): Promise<ResendVerificationResponse> => {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to resend verification');
      }

      return result;
    },
  });
};
