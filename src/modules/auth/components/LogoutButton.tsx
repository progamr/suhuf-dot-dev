'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <Button onClick={handleLogout} variant="outline" className="gap-2">
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
}
