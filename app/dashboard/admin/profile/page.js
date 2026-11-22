'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession, authClient } from '@/lib/auth-client';
import { apiFetch, ApiError } from '@/lib/api';
import ProfileForm from '@/components/dashboard/profile-form';
import ProfileFormSkeleton from '@/components/dashboard/profile-form-skeleton';

export default function AdminProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Guard: ensure admin role
  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.replace('/sign-in?redirect=/dashboard/admin/profile');
      return;
    }
    if (session.user.role && session.user.role !== 'admin') {
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
    email: session?.user?.email || '',
    phone: session?.user?.phone || '',
    area: session?.user?.area || '',
    bio: session?.user?.bio || '',
    image: session?.user?.image || '',
    role: session?.user?.role || 'admin',
  };

  return <ProfileForm initialData={initialData} role="admin" onSubmit={handleSubmit} />;
}
