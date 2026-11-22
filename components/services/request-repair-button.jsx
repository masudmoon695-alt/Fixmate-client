'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { Button, ButtonLink } from '@/components/ui/button';
import { RequestModal } from './request-modal';

export function RequestRepairButton({ service }) {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const role = session?.user?.role;

  if (role && (role === 'technician' || role === 'admin')) {
    return (
      <Button disabled className="w-full">
        Only customers can request a repair
      </Button>
    );
  }

  if (!session?.user) {
    return (
      <ButtonLink href={`/sign-in?redirect=${encodeURIComponent(`/services/${service?._id}`)}`} className="w-full">
        Sign In to Request Repair
      </ButtonLink>
    );
  }

  if (isPending) {
    return <Button disabled className="w-full">Loading…</Button>;
  }

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)}>
        Request Repair
      </Button>
      <RequestModal open={open} onOpenChange={setOpen} service={service} />
    </>
  );
}
