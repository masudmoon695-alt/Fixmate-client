'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession, authClient } from '@/lib/auth-client';
import { apiFetch, ApiError } from '@/lib/api';
import ProfileForm from '@/components/dashboard/profile-form';
import ProfileFormSkeleton from '@/components/dashboard/profile-form-skeleton';

export default function CustomerProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Guard: ensure correct role, redirect if needed
  useEffect(() => {
    if (status === 'loading') return; // wait for session
    if (!session?.user) {
      router.replace('/sign-in?redirect=/dashboard/customer/profile');
      return;
    }
    if (session.user.role && session.user.role !== 'customer') {
      // wrong role – redirect to own dashboard and show toast
      toast.error('Forbidden: redirecting to your dashboard');
      router.replace(`/dashboard/${session.user.role}`);
      return;
    }
    setLoading(false);
  }, [session, status, router]);

  const handleSubmit = async (payload) => {
    try {
      const json = await apiFetch('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      toast.success(json?.message || 'Profile updated');
      // Refresh BetterAuth session so UI (navbar, avatar) updates immediately
      await authClient.getSession();
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to update profile';
      toast.error(message);
      throw err;
    }
  };

  if (loading) {
    return <ProfileFormSkeleton />;
  }

  const initialData = {
    name: session?.user?.name || '',
    email: session?.user?.email || '', // read‑only, not sent back
    phone: session?.user?.phone || '',
    area: session?.user?.area || '',
    bio: session?.user?.bio || '',
    image: session?.user?.image || '',
    role: session?.user?.role || 'customer',
  };

  return <ProfileForm initialData={initialData} role="customer" onSubmit={handleSubmit} />;
}
