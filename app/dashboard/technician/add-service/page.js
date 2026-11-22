'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { apiFetch, ApiError } from '@/lib/api';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/shared/image-upload';
import { CATEGORIES, SERVICE_MODES } from '@/lib/constants';

export default function AddServicePage() {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('1-2 hours');
  const [serviceMode, setServiceMode] = useState(SERVICE_MODES[0]);
  const [serviceArea, setServiceArea] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (title.trim().length < 3) nextErrors.title = 'Title must be at least 3 characters';
    if (description.trim().length < 20) nextErrors.description = 'Description must be at least 20 characters';
    const price = Number(basePrice);
    if (!Number.isFinite(price) || price <= 0) nextErrors.basePrice = 'Base price must be a positive number';
    if (!image) nextErrors.image = 'Please upload a service image before submitting';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/services', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          image,
          basePrice: price,
          estimatedDuration,
          serviceMode,
          serviceArea,
        }),
      });
      toast.success(res?.message || 'Service submitted for admin approval');
      setTitle('');
      setDescription('');
      setImage('');
      setBasePrice('');
      setServiceArea('');
      setEstimatedDuration('1-2 hours');
      setServiceMode(SERVICE_MODES[0]);
      setCategory(CATEGORIES[0]);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to create service');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Add Service</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {session?.user?.name || session?.user?.email}. The service will be reviewed by an admin before
          it goes live.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-card p-6">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          {errors.title ? <p className="mt-1 text-xs text-red-600">{errors.title}</p> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Category</Label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Service Mode</Label>
            <select value={serviceMode} onChange={(e) => setServiceMode(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {SERVICE_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          {errors.description ? <p className="mt-1 text-xs text-red-600">{errors.description}</p> : null}
        </div>
        <div>
          <Label>Service Image (ImgBB upload)</Label>
          <ImageUpload onUploaded={setImage} />
          {errors.image ? <p className="mt-1 text-xs text-red-600">{errors.image}</p> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Base Price (USD)</Label>
            <Input type="number" min={0.01} step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
            {errors.basePrice ? <p className="mt-1 text-xs text-red-600">{errors.basePrice}</p> : null}
          </div>
          <div>
            <Label>Estimated Duration</Label>
            <Input value={estimatedDuration} onChange={(e) => setEstimatedDuration(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Service Area</Label>
          <Input value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit for Approval'}
        </Button>
      </form>
    </div>
  );
}
