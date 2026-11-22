// components/dashboard/profile-form-skeleton.jsx
'use client';

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * Visual placeholder while profile data loads.
 * Mirrors the structure of ProfileForm but shows animated skeletons.
 */
export default function ProfileFormSkeleton() {
  return (
    <Card className="rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6">
        <CardTitle className="text-xl font-semibold">Your profile</CardTitle>
        <Skeleton className="h-5 w-24" /> {/* role badge placeholder */}
      </CardHeader>
      <CardContent className="p-6">
        {/* Photo upload */}
        <div className="mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
        {/* Input rows */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="col-span-2 h-10 w-full" />
          <Skeleton className="col-span-2 h-32 w-full" />
          <Skeleton className="col-span-2 h-4 w-20" /> {/* character counter */}
        </div>
        {/* Technician‑only placeholders – rendered conditionally in real UI */}
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* Submit button */}
        <div className="flex items-center justify-end border-t border-border pt-4 mt-6">
          <ButtonSkeleton />
        </div>
      </CardContent>
    </Card>
  );
}

function ButtonSkeleton() {
  return (
    <Skeleton
      className={cn('h-10 w-32 rounded-lg', {
        // placeholder styles already inside Skeleton
      })}
    />
  );
}
