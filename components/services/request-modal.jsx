'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiFetch, ApiError } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function RequestModal({ open, onOpenChange, service }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPhone(session?.user?.phone || '');
    setAddress(session?.user?.area ? `${session.user.area}, Dhaka` : '');
    setPreferredDate(todayISO());
    setProblemDescription('');
    setErrors({});
  }, [open, session]);

  function validate() {
    const next = {};
    if (!phone || phone.trim().length < 6) next.phone = 'Enter a valid phone number';
    if (!address || address.trim().length < 5) next.address = 'Enter a valid address';
    if (!preferredDate) next.preferredDate = 'Preferred date is required';
    else if (preferredDate < todayISO()) next.preferredDate = 'Preferred date must be today or in the future';
    if (!problemDescription || problemDescription.trim().length < 20) next.problemDescription = 'Problem description must be at least 20 characters';
    return next;
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    if (!service?._id) return;
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service._id,
          customerPhone: phone.trim(),
          address: address.trim(),
          preferredDate,
          problemDescription: problemDescription.trim(),
        }),
      });
      toast.success(res?.message || 'Repair request sent');
      onOpenChange(false);
      router.push('/dashboard/customer/bookings');
    } catch (error) {
      const err = error instanceof ApiError ? error : null;
      if (err?.status === 409) {
        toast.error(err?.message || 'You already have an active request for this service');
      } else if (err?.status) {
        toast.error(err?.message || 'Failed to send request');
      } else {
        toast.error('Failed to send request');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Repair — {service?.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Name</Label>
            <Input value={session?.user?.name || ''} disabled readOnly />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={session?.user?.email || ''} disabled readOnly />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01700000000" />
            {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
          </div>
          <div>
            <Label>Address</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Area, Dhaka" />
            {errors.address ? <p className="mt-1 text-xs text-red-600">{errors.address}</p> : null}
          </div>
          <div>
            <Label>Preferred Date</Label>
            <Input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
            {errors.preferredDate ? <p className="mt-1 text-xs text-red-600">{errors.preferredDate}</p> : null}
          </div>
          <div>
            <Label>Problem Description (min 20 characters)</Label>
            <Textarea value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)} />
            {errors.problemDescription ? <p className="mt-1 text-xs text-red-600">{errors.problemDescription}</p> : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
