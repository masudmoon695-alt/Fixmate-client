'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch, ApiError } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmModal } from '@/components/shared/confirm-modal';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CATEGORIES, SERVICE_MODES, APPROVAL_STATUSES } from '@/lib/constants';

export default function TechnicianMyServices() {
  const { data: session } = useSession();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    apiFetch('/api/services/my')
      .then((json) => setServices(json?.data || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  function startEdit(service) {
    setEditing(service);
    setForm({
      title: service.title || '',
      category: service.category || CATEGORIES[0],
      description: service.description || '',
      basePrice: service.basePrice ?? '',
      estimatedDuration: service.estimatedDuration || '',
      serviceMode: service.serviceMode || SERVICE_MODES[0],
      serviceArea: service.serviceArea || '',
      image: service.image || '',
    });
  }

  async function handleSaveEdit(e) {
    e?.preventDefault?.();
    if (!editing) return;
    const nextErrors = {};
    if ((form.title || '').trim().length < 3) nextErrors.title = 'Title must be at least 3 characters';
    if ((form.description || '').trim().length < 20) nextErrors.description = 'Description must be at least 20 characters';
    const price = Number(form.basePrice);
    if (!Number.isFinite(price) || price <= 0) nextErrors.basePrice = 'Base price must be a positive number';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const res = await apiFetch(`/api/services/${editing._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          description: form.description.trim(),
          image: form.image,
          basePrice: price,
          estimatedDuration: form.estimatedDuration,
          serviceMode: form.serviceMode,
          serviceArea: form.serviceArea,
        }),
      });
      toast.success(res?.message || 'Service updated and sent for re-approval');
      setEditing(null);
      const json = await apiFetch('/api/services/my');
      setServices(json.data || []);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to update service');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await apiFetch(`/api/services/${deleting._id}`, { method: 'DELETE' });
      toast.success('Service deleted');
      setDeleting(null);
      const json = await apiFetch('/api/services/my');
      setServices(json.data || []);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to delete service');
      setDeleting(null);
    }
  }

  async function handleToggle(service) {
    setTogglingId(service._id);
    try {
      const res = await apiFetch(`/api/services/${service._id}/availability`, {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: !service.isAvailable }),
      });
      toast.success(res?.message || 'Availability updated');
      const json = await apiFetch('/api/services/my');
      setServices(json.data || []);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to update availability');
    } finally {
      setTogglingId(null);
    }
  }

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (services.length === 0) {
    return (
      <EmptyState
        title="No services yet"
        description="Add your first repair service to start receiving requests."
        action={<ButtonLink href="/dashboard/technician/add-service">Add Service</ButtonLink>}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">My Services</h1>
        <ButtonLink href="/dashboard/technician/add-service">Add Service</ButtonLink>
      </div>
      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service._id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-start gap-3">
                {service.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={service.image} alt={service.title} className="h-16 w-16 rounded-lg object-cover" />
                ) : null}
                <div>
                  <p className="font-medium">{service.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.category} · {service.serviceMode} · {service.basePrice ? `$${service.basePrice}` : ''} · {service.serviceArea}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={service.approvalStatus} />
                <span className="text-sm text-muted-foreground">Availability: {service.isAvailable ? 'Available' : 'Unavailable'}</span>
                <Button size="sm" variant="outline" onClick={() => startEdit(service)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setDeleting(service)}>
                  Delete
                </Button>
                <Button size="sm" onClick={() => handleToggle(service)} disabled={togglingId === service._id}>
                  {service.isAvailable ? 'Make Unavailable' : 'Make Available'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service — {editing?.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="grid gap-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              {errors.title ? <p className="mt-1 text-xs text-red-600">{errors.title}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Category</Label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Service Mode</Label>
                <select value={form.serviceMode} onChange={(e) => setForm({ ...form, serviceMode: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {SERVICE_MODES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Base Price (USD)</Label>
                <Input type="number" min={0.01} step="0.01" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} />
                {errors.basePrice ? <p className="mt-1 text-xs text-red-600">{errors.basePrice}</p> : null}
              </div>
              <div>
                <Label>Estimated Duration</Label>
                <Input value={form.estimatedDuration} onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Service Area</Label>
              <Input value={form.serviceArea} onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} />
            </div>
            <div>
              <Label>Service Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save & Resubmit'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        description={`Delete "${deleting?.title}"? This cannot be undone.`}
        confirmText="Delete"
        loading={false}
      />
    </div>
  );
}
