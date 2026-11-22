'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2 } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [failed, setFailed] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setFailed(true);
      return;
    }
    if (calledRef.current) return;
    calledRef.current = true;

    let cancelled = false;
    apiFetch(`/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((json) => {
        if (cancelled) return;
        setData(json?.data || null);
        setLoading(false);
      })
      .catch((error) => {
        if (cancelled) return;
        setFailed(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
      ) : failed ? (
        <>
          <h1 className="font-heading text-3xl font-bold">Payment Verification Failed</h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            We could not verify this payment session. Please contact support or try again.
          </p>
          <div className="mt-8">
            <Button onClick={() => router.push('/dashboard/customer/bookings')}>Back to My Bookings</Button>
          </div>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <h1 className="mt-4 font-heading text-3xl font-bold">Payment Successful!</h1>
          {data ? (
            <p className="mt-4 text-muted-foreground">
              Amount paid: <span className="font-semibold text-foreground">{formatCurrency(data.amount)}</span>
              {data.transactionId ? (
                <>
                  {' '}
                  · Transaction ID: <span className="font-mono text-xs">{data.transactionId}</span>
                </>
              ) : null}
            </p>
          ) : (
            <p className="mt-4 text-muted-foreground">Your payment could not be verified.</p>
          )}
          <div className="mt-8">
            <Button onClick={() => router.push('/dashboard/customer/bookings')}>Go to My Bookings</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Skeleton className="h-8 w-64" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
