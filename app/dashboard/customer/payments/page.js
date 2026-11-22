'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { PaymentBadge } from '@/components/shared/payment-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

export default function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/payments/my')
      .then((json) => setPayments(json?.data || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">My Payments</h1>
      {payments.length === 0 ? (
        <EmptyState title="No payments yet" description="Payments appear after a completed service." />
      ) : (
        payments.map((p) => (
          <div key={p._id} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{p.serviceTitle}</p>
                <p className="text-sm text-muted-foreground">
                  Technician: {p.technicianName || 'FixMate Technician'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {p.transactionId ? `Transaction ID: ${p.transactionId}` : 'Transaction pending'} ·{' '}
                  {p.paidAt ? new Date(p.paidAt).toLocaleString() : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-primary">{formatCurrency(p.amount)}</span>
                <PaymentBadge paymentStatus={p.paymentStatus} />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
