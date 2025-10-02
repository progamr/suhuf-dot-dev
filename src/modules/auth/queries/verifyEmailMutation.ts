import { useMutation } from '@tanstack/react-query';

interface VerifyEmailResponse {
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

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: async (token: string): Promise<VerifyEmailResponse> => {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Verification failed');
      }

      return result;
    },
  });
};
