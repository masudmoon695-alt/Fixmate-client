import { notFound } from 'next/navigation';
import { API_URL } from '@/lib/api';
import { ServiceCard } from '@/components/services/service-card';
import { ImageWithFallback } from '@/components/shared/image-with-fallback';
import { RequestRepairButton } from '@/components/services/request-repair-button';
import { ButtonLink } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default async function ServiceDetailPage({ params }) {
  const { id } = await params;
  const res = await fetch(`${API_URL}/api/services/${id}`, { cache: 'no-store' });
  const json = await res.json().catch(() => null);
  const service = json?.data;

  if (!res.ok || !service) {
    notFound();
  }

  const related = await fetch(
    `${API_URL}/api/services?category=${encodeURIComponent(service.category)}&limit=3&sort=newest`,
    { cache: 'no-store' },
  )
    .then((r) => r.json())
    .catch(() => ({ data: [] }));

  const relatedServices = (related?.data || []).filter((s) => s._id !== service._id).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-card">
          <ImageWithFallback src={service.image} alt={service.title} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">{service.category}</span>
            <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">{service.serviceMode}</span>
            {service.approvalStatus ? <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">Approval: {service.approvalStatus}</span> : null}
          </div>
          <h1 className="font-heading text-3xl font-bold">{service.title}</h1>
          <p className="text-muted-foreground">{service.description}</p>
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Base price</p>
                <p className="font-heading text-3xl font-bold text-primary">{formatCurrency(service.basePrice)}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Duration: {service.estimatedDuration || 'N/A'}</p>
                <p>Area: {service.serviceArea || 'N/A'}</p>
                <p>Technician: {service.technicianName || 'FixMate Technician'}</p>
              </div>
            </div>
          </div>
          <RequestRepairButton service={service} />
          <ButtonLink href="/services" variant="outline">Back to Services</ButtonLink>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="font-heading text-2xl font-bold">Customer Reviews</h2>
        {typeof service.rating === 'number' || typeof service.averageRating === 'number' ? (
          <div className="mt-4 rounded-xl border bg-card p-6">
            <p className="text-lg font-semibold">
              {Number(service.averageRating ?? service.rating).toFixed(1)} / 5
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                from {service.reviewCount || 0} review(s)
              </span>
            </p>
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">No reviews yet.</p>
        )}
        {Array.isArray(service.reviews) && service.reviews.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {service.reviews.map((r, i) => (
              <li key={i} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{r.customerName || 'Customer'}</p>
                  <p className="text-sm font-semibold text-amber-500 dark:text-amber-400">{r.rating}/5</p>
                </div>
                {r.review ? <p className="mt-1 text-sm text-muted-foreground">{r.review}</p> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="mt-14">
        <h2 className="font-heading text-2xl font-bold">More in {service.category}</h2>
        {relatedServices.length === 0 ? (
          <p className="mt-6 text-muted-foreground">No related services yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
