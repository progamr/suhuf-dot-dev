import { useMutation } from '@tanstack/react-query';
import { SignupInput } from '../utils/validation';

interface SignupResponse {
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

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (data: SignupInput): Promise<SignupResponse> => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Signup failed');
      }

      return result;
    },
  });
};
