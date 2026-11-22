'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { StatusBadge } from '@/components/shared/status-badge';
import { PaymentBadge } from '@/components/shared/payment-badge';
import { formatCurrency } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { BOOKING_STATUSES } from '@/lib/constants';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
    apiFetch(`/api/admin/bookings${qs}`)
      .then((json) => setBookings(json?.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Admin Bookings</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          <option value="">All Statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {bookings.length === 0 ? (
        <EmptyState title="No bookings" description="No bookings match this filter." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Technician</th>
                <th className="px-4 py-3 font-semibold">Preferred Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{booking.serviceTitle}</td>
                  <td className="px-4 py-3">{booking.customerName}<br /><span className="text-xs text-muted-foreground">{booking.customerEmail}</span></td>
                  <td className="px-4 py-3">{booking.technicianName}<br /><span className="text-xs text-muted-foreground">{booking.technicianEmail}</span></td>
                  <td className="px-4 py-3">{booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3"><StatusBadge status={booking.status} /></td>
                  <td className="px-4 py-3"><PaymentBadge paymentStatus={booking.paymentStatus} /></td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(booking.finalAmount ?? booking.basePrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
