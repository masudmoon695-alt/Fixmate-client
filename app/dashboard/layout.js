'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import { DashboardLayout as DashboardLayoutShell } from '@/components/layout/dashboard-layout';
import { Skeleton } from '@/components/ui/skeleton';

const ROLE_ROUTES = {
  customer: ['/dashboard/customer', '/dashboard/customer/bookings', '/dashboard/customer/payments', '/dashboard/profile'],
  technician: [
    '/dashboard/technician',
    '/dashboard/technician/add-service',
    '/dashboard/technician/my-services',
    '/dashboard/technician/requests',
    '/dashboard/profile',
  ],
  admin: [
    '/dashboard/admin',
    '/dashboard/admin/users',
    '/dashboard/admin/services',
    '/dashboard/admin/bookings',
    '/dashboard/admin/transactions',
    '/dashboard/profile',
  ],
};

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace('/sign-in?redirect=/dashboard');
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) return;
    const role = session.user.role || 'customer';
    const allowed = ROLE_ROUTES[role] || ROLE_ROUTES.customer;
    const isAllowed = pathname === '/dashboard' || allowed.includes(pathname);
    if (!isAllowed) {
      toast.error('You do not have permission to access this area.');
      router.replace(`/dashboard/${role}`);
    }
  }, [isPending, session, pathname, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden w-64 border-r p-4 md:block">
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-64" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const role = session.user.role || 'customer';

  return <DashboardLayoutShell role={role}>{children}</DashboardLayoutShell>;
}
