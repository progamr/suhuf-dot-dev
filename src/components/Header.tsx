'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/Button';
import { RefreshCw, LogOut } from 'lucide-react';

interface HeaderProps {
  isAuthenticated?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  showRefresh?: boolean;
}

export function Header({ 
  isAuthenticated = false, 
  onRefresh, 
  refreshing = false,
  showRefresh = false 
}: HeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      // Clear all React Query cache
      queryClient.clear();
      
      // Sign out from NextAuth
      await signOut({ 
        redirect: true,
        redirectTo: '/login' 
      });
      
      // Redirect to login
      // router.push('/login');
      // router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Suhuf
          </h1>
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {showRefresh && onRefresh && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRefresh}
                  disabled={refreshing}
                  title="Refresh feed"
                >
                  <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
