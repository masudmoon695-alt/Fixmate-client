'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { ButtonLink } from '@/components/ui/button';

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();
  const role = session?.user?.role;

  useEffect(() => {
    if (session?.user) {
      router.replace(`/dashboard/${role || 'customer'}`);
    }
  }, [session, role, router]);

  return <p className="text-muted-foreground">Redirecting to your dashboard...</p>;
}
