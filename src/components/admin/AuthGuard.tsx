'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      } else if (!isAdmin) {
        // Logged in but not admin, redirect to public home
        router.push('/');
      }
    }
  }, [user, loading, isAdmin, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-500 font-mono text-sm animate-pulse">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // If we are on login page, let them through
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Only render children if user is logged in and is admin
  if (user && isAdmin) {
    return <>{children}</>;
  }

  // Otherwise show nothing (the useEffect will handle redirect)
  return null;
}
