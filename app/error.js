'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    // Surface the error message without keeping debug noise in the console.
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <Skeleton className="h-16 w-16 rounded-full" />
      <h2 className="font-heading text-2xl font-bold">Something went wrong</h2>
      <p className="max-w-md text-muted-foreground">{error?.message || 'Unexpected error. Please try again.'}</p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => router.push('/')}>Back to Home</Button>
      </div>
    </div>
  );
}
