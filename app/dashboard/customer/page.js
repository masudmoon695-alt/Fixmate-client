'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { StatsCard } from '@/components/ui/stat-card';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/shared/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingsStatusChart } from '@/components/dashboard/bookings-chart';
import { ClipboardList, Activity, CheckCircle2 } from 'lucide-react';

export default function CustomerDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role && session.user.role !== 'customer') {
      router.replace(`/dashboard/${session.user.role}`);
    }
  }, [session, router]);

  useEffect(() => {
    apiFetch('/api/bookings/stats')
      .then((json) => setStats(json?.data || null))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));

    apiFetch('/api/bookings/my')
      .then((json) => setBookings(json?.data || []))
      .catch(() => setBookings([]));
  }, []);

  const bookingStats = stats?.bookings || {};
  const total = Number(bookingStats.total) || 0;
  const active = Number(bookingStats.requested || 0) + Number(bookingStats.accepted || 0) + Number(bookingStats['in-progress'] || 0) || 0;
  const completed = Number(bookingStats.completed) || 0;
  const statusRows = Object.keys(bookingStats)
    .filter((key) => ['requested', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'].includes(key))
    .map((key) => ({ status: key, count: Number(bookingStats[key]) || 0 }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Customer Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {session?.user?.name || session?.user?.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Total Requests" value={total} icon={ClipboardList} />
        <StatsCard title="Active Jobs" value={active} icon={Activity} />
        <StatsCard title="Completed Jobs" value={completed} icon={CheckCircle2} />
      </div>

      {loading ? (
        <Skeleton className="h-72 w-full" />
      ) : (
        <BookingsStatusChart data={statusRows} />
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Recent Bookings</h2>
            <ButtonLink href="/dashboard/customer/bookings">View all</ButtonLink>
          </div>
          {bookings.length === 0 ? (
            <EmptyState title="No bookings yet" description="Book a repair service to get started." />
          ) : (
            <div className="mt-4 space-y-3">
              {bookings.slice(0, 5).map((b) => (
                <div key={b._id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{b.serviceTitle}</p>
                    <p className="text-xs text-muted-foreground">{b.technicianName}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
