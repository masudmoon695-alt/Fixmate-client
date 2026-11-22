'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

export default function AdminTransactions() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/payments')
      .then((json) => setPayments(json?.data || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = (payments || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Admin Transactions</h1>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Total Revenue</p>
        <p className="font-heading text-3xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
        <p className="mt-1 text-xs text-muted-foreground">{payments.length} payment(s) recorded</p>
      </div>

      {payments.length === 0 ? (
        <EmptyState title="No transactions yet" description="Completed payments will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Technician</th>
                <th className="px-4 py-3 font-semibold">Transaction ID</th>
                <th className="px-4 py-3 font-semibold">Payment Date</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{p.serviceTitle}</td>
                  <td className="px-4 py-3">{p.customerEmail}</td>
                  <td className="px-4 py-3">{p.technicianName}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.transactionId || p.stripeSessionId || 'N/A'}</td>
                  <td className="px-4 py-3">{p.paidAt ? new Date(p.paidAt).toLocaleString() : 'N/A'}</td>
                  <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
