import { auth } from '@/infrastructure/auth/auth';
import { redirect } from 'next/navigation';
import { OnboardingForm } from '@/modules/onboarding/components/OnboardingForm/OnboardingForm';

export const metadata = {
  title: 'Setup Your Preferences - Suhuf',
  description: 'Customize your news feed by selecting your preferred sources and categories',
};

async function checkOnboardingStatus(userId: string): Promise<boolean> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/user/onboarding-status`, {
      headers: {
        'x-user-id': userId,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.success && data.data.hasCompletedOnboarding;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Check if user has already completed onboarding
  const hasCompletedOnboarding = await checkOnboardingStatus(session.user.id);
  
  if (hasCompletedOnboarding) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <OnboardingForm userId={session.user.id} />
    </div>
  );
}
