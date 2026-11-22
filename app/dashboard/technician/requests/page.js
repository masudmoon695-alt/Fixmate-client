'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch, ApiError } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { StatusBadge } from '@/components/shared/status-badge';
import { PaymentBadge } from '@/components/shared/payment-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ConfirmModal } from '@/components/shared/confirm-modal';
import { BOOKING_STATUSES } from '@/lib/constants';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'requested', label: 'Requested' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TechnicianRequests() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [rejecting, setRejecting] = useState(null);
  const [completing, setCompleting] = useState(null);
  const [finalAmount, setFinalAmount] = useState('');

  useEffect(() => {
    apiFetch('/api/bookings/technician')
      .then((json) => setBookings(json?.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  async function updateBooking(id, status, amount) {
    const body = amount ? { status, finalAmount: Number(amount) } : { status };
    const json = await apiFetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    toast.success(json?.message || `Booking ${status}`);
    const list = await apiFetch('/api/bookings/technician');
    setBookings(list.data || []);
  }

  async function handleAccept(booking) {
    try {
      await updateBooking(booking._id, 'accepted');
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to accept request');
    }
  }

  async function handleReject(booking) {
    try {
      await updateBooking(booking._id, 'rejected');
      setRejecting(null);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to reject request');
      setRejecting(null);
    }
  }

  async function handleStart(booking) {
    try {
      await updateBooking(booking._id, 'in-progress');
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to start work');
    }
  }

  async function handleComplete() {
    if (!completing) return;
    const amount = Number(finalAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Final amount must be a number greater than 0');
      return;
    }
    try {
      await updateBooking(completing._id, 'completed', finalAmount);
      setCompleting(null);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to mark job completed');
      setCompleting(null);
    }
  }

  const visible = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (bookings.length === 0) {
    return <EmptyState title="No requests yet" description="New customer repair requests will appear here." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Technician Requests</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No requests found" description="Try a different status filter." />
      ) : (
        visible.map((booking) => (
          <Card key={booking._id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{booking.serviceTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    Customer: {booking.customerName} · {booking.customerPhone} · {booking.address}
                  </p>
                  <p className="text-sm text-muted-foreground">Preferred: {booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : ''}</p>
                  <p className="text-sm text-muted-foreground">Problem: {booking.problemDescription}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={booking.status} />
                  <PaymentBadge paymentStatus={booking.paymentStatus} />
                </div>
              </div>

              {booking.status === 'requested' ? (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => handleAccept(booking)}>Accept</Button>
                  <Button size="sm" variant="destructive" onClick={() => setRejecting(booking)}>Reject</Button>
                </div>
              ) : null}

              {booking.status === 'accepted' ? (
                <Button size="sm" onClick={() => handleStart(booking)}>Start Work</Button>
              ) : null}

              {booking.status === 'in-progress' ? (
                <Button size="sm" onClick={() => { setCompleting(booking); setFinalAmount(String(booking.basePrice ?? '')); }}>
                  Mark Completed
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))
      )}

      <ConfirmModal
        open={Boolean(rejecting)}
        onOpenChange={(open) => !open && setRejecting(null)}
        onConfirm={() => rejecting && handleReject(rejecting)}
        title="Reject Request"
        description="Are you sure you want to reject this repair request? The customer will be notified."
        confirmText="Reject"
        loading={false}
      />

      <Dialog open={Boolean(completing)} onOpenChange={(open) => !open && setCompleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Job Completed</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">Final amount (USD) for the completed job. Must be greater than 0.</p>
            <Input type="number" min={0.01} step="0.01" value={finalAmount} onChange={(e) => setFinalAmount(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleting(null)}>Cancel</Button>
            <Button onClick={handleComplete}>Confirm Completion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
