'use client';

import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="font-heading text-3xl font-bold">Payment Cancelled</h1>
      <p className="max-w-md text-muted-foreground">
        Your payment was cancelled. No charge was made. You can try again whenever you are ready.
      </p>
      <Link
        href="/dashboard/customer/bookings"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Try Again
      </Link>
    </div>
  );
}
