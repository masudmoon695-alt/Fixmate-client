'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { StatsCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingsStatusChart } from '@/components/dashboard/bookings-chart';
import { ClipboardList, CheckCircle2, Clock } from 'lucide-react';

export default function TechnicianDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/services/stats')
      .then((json) => setStats(json?.data || null))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const serviceStats = stats?.services || {};
  const bookingStats = stats?.bookings || {};
  const earnings = stats?.earnings || {};

  const statusRows = Object.keys(bookingStats || {})
    .filter((key) => ['requested', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'].includes(key))
    .map((key) => ({ status: key, count: Number(bookingStats[key]) || 0 }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Technician Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, technician</p>
      </div>

      {loading ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-72 w-full" />
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard title="Total Services" value={serviceStats.total ?? 0} icon={ClipboardList} />
            <StatsCard title="Approved Services" value={serviceStats.approved ?? 0} icon={CheckCircle2} />
            <StatsCard title="Pending Requests" value={bookingStats.requested ?? 0} icon={Clock} />
          </div>

          <BookingsStatusChart data={statusRows} />

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="font-heading text-lg font-semibold">Earnings</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Total earned from paid jobs: <span className="font-semibold text-foreground">${Number(earnings?.total || 0).toFixed(2)}</span>{' '}
              across {Number(earnings?.paidBookings || 0)} completed payment(s).
            </p>
          </div>
        </>
      )}
    </div>
  );
}
