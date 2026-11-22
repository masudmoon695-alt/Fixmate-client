'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { StatsCard } from '@/components/ui/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingsStatusChart } from '@/components/dashboard/bookings-chart';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { Users, Wrench, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/stats')
      .then((json) => setStats(json?.data || null))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const users = stats?.users || {};
  const services = stats?.services || {};
  const bookings = stats?.bookings || {};
  const revenue = stats?.revenue || {};

  const statusRows = Object.keys(bookings.byStatus || {})
    .filter((key) => ['requested', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'].includes(key))
    .map((key) => ({ status: key, count: Number(bookings.byStatus[key]) || 0 }));

  const monthlyRevenue = (revenue.monthly || []).map((row) => ({ month: row.month, total: Number(row.total) || 0, count: Number(row.count) || 0 }));

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Total Users" value={users.total ?? 0} icon={Users} />
        <StatsCard title="Total Technicians" value={Number(users.byRole?.technician) || 0} icon={Wrench} />
        <StatsCard title="Pending Services" value={services.byApproval?.pending || 0} icon={Clock} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BookingsStatusChart data={statusRows} />
        <RevenueChart data={monthlyRevenue} />
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold">Revenue Overview</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Total revenue from {Number(revenue.payments) || 0} paid payment(s):{' '}
          <span className="font-semibold text-foreground">${Number(revenue.total || 0).toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
