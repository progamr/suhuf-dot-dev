'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVerifyEmailMutation } from '@/modules/auth/state/mutations/verifyEmailMutation';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const verifyEmailMutation = useVerifyEmailMutation();

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate({ token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          {verifyEmailMutation.isPending && (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
          {verifyEmailMutation.isSuccess && (
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          )}
          {verifyEmailMutation.isError && (
            <div className="rounded-full bg-red-100 dark:bg-red-900 p-3">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          )}
        </div>
        <CardTitle>
          {verifyEmailMutation.isPending && 'Verifying your email...'}
          {verifyEmailMutation.isSuccess && 'Email Verified!'}
          {verifyEmailMutation.isError && 'Verification Failed'}
        </CardTitle>
        <CardDescription>
          {verifyEmailMutation.isSuccess && 'Your email has been verified successfully!'}
          {verifyEmailMutation.isError && (verifyEmailMutation.error instanceof Error ? verifyEmailMutation.error.message : 'Verification failed')}
          {!token && 'Invalid verification link'}
        </CardDescription>
      </CardHeader>
      {!verifyEmailMutation.isPending && (
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push('/login')}>
            {verifyEmailMutation.isSuccess ? 'Go to Login' : 'Back to Login'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
