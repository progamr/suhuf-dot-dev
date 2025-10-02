'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function CallToAction() {
  const router = useRouter();

  return (
    <section className="text-center py-12 space-y-6">
      <h2 className="text-3xl font-bold">Get Personalized News</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Sign up to customize your news feed based on your interests and preferences
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => router.push('/signup')} size="lg">
          Sign Up Now
        </Button>
        <Button onClick={() => router.push('/login')} variant="outline" size="lg">
          Sign In
        </Button>
      </div>
    </section>
  );
}
