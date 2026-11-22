'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch, ApiError } from '@/lib/api';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmModal } from '@/components/shared/confirm-modal';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { APPROVAL_STATUSES } from '@/lib/constants';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvalFilter, setApprovalFilter] = useState('pending');
  const [action, setAction] = useState(null); // { service, approvalStatus }
  const [processing, setProcessing] = useState(false);

  async function loadServices() {
    const qs = approvalFilter ? `?approvalStatus=${encodeURIComponent(approvalFilter)}` : '';
    const json = await apiFetch(`/api/admin/services${qs}`);
    setServices(json?.data || []);
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiFetch(`/api/admin/services${approvalFilter ? `?approvalStatus=${encodeURIComponent(approvalFilter)}` : ''}`)
      .then((json) => {
        if (cancelled) return;
        setServices(json?.data || []);
      })
      .catch(() => !cancelled && setServices([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [approvalFilter]);

  async function handleApproval() {
    if (!action) return;
    setProcessing(true);
    try {
      const json = await apiFetch(`/api/admin/services/${action.service._id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ approvalStatus: action.approvalStatus }),
      });
      toast.success(json?.message || `Service ${action.approvalStatus}`);
      setAction(null);
      await loadServices();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to update approval');
      setAction(null);
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Admin Services</h1>
        <select
          value={approvalFilter}
          onChange={(e) => setApprovalFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {services.length === 0 ? (
        <EmptyState title="No services found" description="No services match this filter." />
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <Card key={service._id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">{service.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.category} · {service.basePrice ? `$${service.basePrice}` : ''} · by {service.technicianEmail}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={service.approvalStatus} />
                  {service.approvalStatus !== 'approved' ? (
                    <Button
                      size="sm"
                      onClick={() => setAction({ service, approvalStatus: 'approved' })}
                    >
                      Approve
                    </Button>
                  ) : null}
                  {service.approvalStatus !== 'rejected' ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setAction({ service, approvalStatus: 'rejected' })}
                    >
                      Reject
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(action)}
        onOpenChange={(open) => !open && setAction(null)}
        onConfirm={handleApproval}
        title={action?.approvalStatus === 'rejected' ? 'Reject Service' : 'Approve Service'}
        description={
          action?.approvalStatus === 'rejected'
            ? `Reject "${action?.service?.title}"? The technician will be notified and the service will not be listed publicly.`
            : `Approve "${action?.service?.title}"? It will become available for booking.`
        }
        confirmText={action?.approvalStatus === 'rejected' ? 'Reject Service' : 'Approve Service'}
        loading={processing}
      />
    </div>
  );
}
