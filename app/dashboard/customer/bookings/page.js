'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { apiFetch, ApiError } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { StatusBadge } from '@/components/shared/status-badge';
import { PaymentBadge } from '@/components/shared/payment-badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmModal } from '@/components/shared/confirm-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { Star } from 'lucide-react';

export default function CustomerBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [paying, setPaying] = useState(null);
  const [ratingTarget, setRatingTarget] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingText, setRatingText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadInvoice(booking) {
    setDownloading(true);
    try {
      const doc = new jsPDF();
      const amount = Number(booking.finalAmount ?? booking.basePrice ?? 0);
      const invoiceNumber = String(booking.transactionId || booking._id || '').replace(/[^A-Z0-9]/gi, '').slice(-10).toUpperCase();

      doc.setFontSize(20);
      doc.text('FixMate', 14, 22);
      doc.setFontSize(12);
      doc.text(`Invoice #${invoiceNumber}`, 14, 34);
      doc.text(`Issue Date: ${new Date().toLocaleString()}`, 14, 42);
      doc.text(`Customer: ${booking.customerName || ''} (${booking.customerEmail || ''})`, 14, 50);
      doc.text(`Technician: ${booking.technicianName || 'FixMate Technician'}`, 14, 58);
      doc.text(`Service: ${booking.serviceTitle || ''}`, 14, 66);
      doc.text(`Category: ${booking.category || ''}`, 14, 74);
      doc.text(`Service Mode: ${booking.serviceMode || ''}`, 14, 82);
      doc.text(`Booking Date: ${booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : ''}`, 14, 90);
      doc.text(`Amount Paid: $${amount.toFixed(2)}`, 14, 98);
      doc.text(`Payment Status: ${booking.paymentStatus || 'paid'}`, 14, 106);
      doc.text(`Transaction: ${booking.transactionId || booking.stripeSessionId || 'N/A'}`, 14, 114);
      doc.setFontSize(12);
      doc.text('Thank you for choosing FixMate', 14, 150);
      doc.save(`FixMate-Invoice-${booking._id}.pdf`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to generate invoice');
    } finally {
      setDownloading(false);
    }
  }

  async function handleRateSubmit() {
    if (!ratingTarget) return;
    const value = Number(ratingValue);
    if (!Number.isFinite(value) || value < 1 || value > 5) {
      toast.error('Please select a star rating between 1 and 5');
      return;
    }
    setSubmittingRating(true);
    try {
      const res = await apiFetch(`/api/bookings/${ratingTarget._id}/review`, {
        method: 'POST',
        body: JSON.stringify({ rating: value, review: ratingText.trim() }),
      });
      const updated = {
        ...ratingTarget,
        rating: value,
        review: ratingText.trim(),
        reviewedAt: new Date().toISOString(),
      };
      setBookings((prev) => prev.map((b) => (b._id === ratingTarget._id ? updated : b)));
      toast.success(res?.message || 'Thanks! Your review was submitted.');
      setRatingTarget(null);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to submit review');
      setRatingTarget(null);
    } finally {
      setSubmittingRating(false);
    }
  }

  useEffect(() => {
    apiFetch('/api/bookings/my')
      .then((json) => setBookings(json?.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleCancel() {
    if (!cancelling) return;
    try {
      await apiFetch(`/api/bookings/${cancelling._id}/cancel`, { method: 'PATCH' });
      toast.success('Booking cancelled');
      setCancelling(null);
      const json = await apiFetch('/api/bookings/my');
      setBookings(json.data || []);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to cancel booking');
      setCancelling(null);
    }
  }

  async function handlePayNow(booking) {
    setPaying(booking);
    try {
      const json = await apiFetch('/api/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ bookingId: booking._id }),
      });
      const url = json?.data?.url;
      if (url) {
        window.location.href = url;
        return;
      }
      toast.error('Payment session could not be created');
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to start payment');
    } finally {
      setPaying(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">My Bookings</h1>
        <ButtonLink href="/services">Browse Services</ButtonLink>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Book a repair service to get started."
          action={<ButtonLink href="/services">Browse Services</ButtonLink>}
        />
      ) : (
        bookings.map((booking) => (
          <Card key={booking._id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-start gap-3">
                {booking.serviceImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={booking.serviceImage} alt={booking.serviceTitle} className="h-16 w-16 rounded-lg object-cover" />
                ) : null}
                <div>
                  <p className="font-medium">{booking.serviceTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    Technician: {booking.technicianName || 'FixMate Technician'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Preferred: {booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'N/A'} · {booking.address}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-primary">{formatCurrency(booking.basePrice)}</span>
                {booking.finalAmount ? <span className="text-sm text-muted-foreground">Final: {formatCurrency(booking.finalAmount)}</span> : null}
                <StatusBadge status={booking.status} />
                <PaymentBadge paymentStatus={booking.paymentStatus} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {booking.status === 'requested' ? (
                  <Button size="sm" variant="destructive" onClick={() => setCancelling(booking)}>
                    Cancel Booking
                  </Button>
                ) : null}
                {booking.status === 'completed' && booking.paymentStatus === 'unpaid' ? (
                  <Button size="sm" onClick={() => handlePayNow(booking)} disabled={paying?._id === booking._id}>
                    {paying?._id === booking._id ? 'Starting Payment...' : 'Pay Now'}
                  </Button>
                ) : null}
                {booking.status === 'completed' && booking.paymentStatus === 'paid' ? (
                  <>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Paid</span>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadInvoice(booking)} disabled={downloading}>
                      {downloading ? 'Preparing...' : 'Download Invoice'}
                    </Button>
                  </>
                ) : null}
                {booking.paymentStatus === 'paid' && !booking.rating ? (
                  <Button size="sm" onClick={() => { setRatingValue(booking.rating || 5); setRatingText(''); setRatingTarget(booking); }}>
                    Rate &amp; Review
                  </Button>
                ) : null}
                {booking.rating ? (
                  <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {booking.rating}/5
                  </span>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <ConfirmModal
        open={Boolean(cancelling)}
        onOpenChange={(open) => !open && setCancelling(null)}
        onConfirm={handleCancel}
        title="Cancel Booking"
        description="Are you sure you want to cancel this repair request? This cannot be undone."
        confirmText="Cancel Booking"
        loading={false}
      />

      <Dialog open={Boolean(ratingTarget)} onOpenChange={(open) => !open && setRatingTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate & Review</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRatingValue(n)}
                  className="rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`${n} star${n > 1 ? 's' : ''}`}
                >
                  <Star className={`h-7 w-7 ${n <= ratingValue ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}`} />
                </button>
              ))}
            </div>
            <div>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Share your experience (optional, max 300 characters)"
                value={ratingText}
                maxLength={300}
                onChange={(e) => setRatingText(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">{ratingText.length}/300</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRatingTarget(null)} disabled={submittingRating}>
                Cancel
              </Button>
              <Button onClick={handleRateSubmit} disabled={submittingRating}>
                {submittingRating ? 'Submitting...' : 'Submit Review'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
