import { LoginForm } from '@/modules/auth/components/LoginForm';

export const metadata = {
  title: 'Login - Suhuf',
  description: 'Sign in to your Suhuf account',
};

export default function LoginPage() {
  return <LoginForm />;
}
