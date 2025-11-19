'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAccessToken } from '@/lib/auth/client';

interface PanelAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'hotelier' | 'admin';
}

export function PanelAuthGuard({ children, requiredRole = 'hotelier' }: PanelAuthGuardProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const { user, isLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = getAccessToken();
    const isAuthenticated = !!token || !!user;

    if (!isLoading) {
      // Not authenticated at all
      if (!isAuthenticated) {
        console.log('🚫 PanelAuthGuard: User not authenticated, redirecting to login');
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/${locale}/login?returnUrl=${encodeURIComponent(currentPath)}`);
        return;
      }

      // Authenticated but wrong role
      if (user) {
        const hasPermission = 
          user.role === 'admin' || 
          (requiredRole === 'hotelier' && (user.role === 'hotelier' || user.role === 'admin'));

        if (!hasPermission) {
          console.log('🚫 PanelAuthGuard: User does not have required role', {
            userRole: user.role,
            requiredRole,
          });
          router.push(`/${locale}`);
          return;
        }
      }

      setIsChecking(false);
    }
  }, [user, isLoading, router, locale, requiredRole]);

  // Show loading state
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Zugriff wird überprüft...</p>
        </div>
      </div>
    );
  }

  // User is authenticated and has permission
  return <>{children}</>;
}
