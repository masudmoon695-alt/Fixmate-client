'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch, ApiError } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmModal } from '@/components/shared/confirm-modal';
import { Button } from '@/components/ui/button';

export default function AdminUsers() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(null);
  const [newRole, setNewRole] = useState('');

  async function loadUsers() {
    const json = await apiFetch('/api/admin/users?limit=200');
    setUsers(json?.data || []);
  }

  useEffect(() => {
    apiFetch('/api/admin/users?limit=200')
      .then((json) => setUsers(json?.data || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleRoleChange() {
    if (!changing) return;
    try {
      const json = await apiFetch(`/api/admin/users/${changing._id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      toast.success(json?.message || `Role updated to ${newRole}`);
      setChanging(null);
      await loadUsers();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to update role');
      setChanging(null);
    }
  }

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (users.length === 0) {
    return <EmptyState title="No users" description="No registered users found yet." />;
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Admin Users</h1>
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              )}
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{user.role}</Badge>
              <span className="text-sm text-muted-foreground">
                Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
              </span>
              {user._id !== session?.user?._id && user._id !== session?.user?.id ? (
                <div className="flex items-center gap-2">
                  <select
                    value={user.role}
                    onChange={(e) => {
                      setChanging(user);
                      setNewRole(e.target.value);
                    }}
                    className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                  >
                    <option value="customer">customer</option>
                    <option value="technician">technician</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">This is you</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={Boolean(changing)}
        onOpenChange={(open) => !open && setChanging(null)}
        onConfirm={handleRoleChange}
        title="Change Role"
        description={`Change ${changing?.name}'s role to ${newRole}?`}
        confirmText="Confirm Change"
        loading={false}
      />
    </div>
  );
}
