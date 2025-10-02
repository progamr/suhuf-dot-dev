import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { LoginInput } from '../utils/validation';

interface SignInResponse {
  ok: boolean;
  error?: string;
}

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginInput): Promise<SignInResponse> => {
      try {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          // Map NextAuth errors to user-friendly messages
          const errorMessage = result.error === 'CredentialsSignin' 
            ? 'Invalid email or password'
            : result.error;
          throw new Error(errorMessage);
        }

        return { ok: result?.ok || false };
      } catch (error) {
        console.error('Sign in error:', error);
        throw error;
      }
    },
  });
};
