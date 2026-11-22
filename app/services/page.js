'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { apiFetch, ApiError } from '@/lib/api';
import { CATEGORIES, SERVICE_MODES, SORT_OPTIONS } from '@/lib/constants';
import { ServiceFilters } from '@/components/services/service-filters';
import { ServiceCard } from '@/components/services/service-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Button, ButtonLink } from '@/components/ui/button';

const PAGE_SIZE = 6;

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const serviceMode = searchParams.get('serviceMode') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (serviceMode) params.set('serviceMode', serviceMode);
    if (sort) params.set('sort', sort);
    if (page > 1) params.set('page', String(page));

    apiFetch(`/api/services?${params.toString()}`)
      .then((json) => {
        if (cancelled) return;
        setServices(json?.data || []);
        setTotal(Number(json?.total) || 0);
      })
      .catch(() => {
        if (!cancelled) {
          setServices([]);
          setTotal(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, category, serviceMode, sort, page]);

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);

  function goToPage(nextPage) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (serviceMode) params.set('serviceMode', serviceMode);
    if (sort) params.set('sort', sort);
    if (nextPage > 1) params.set('page', String(nextPage));
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const pageNumbers = [];
  const maxVisible = 5;
  let start = Math.max(1, Math.min(page - Math.floor(maxVisible / 2), totalPages - maxVisible + 1));
  let end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i += 1) pageNumbers.push(i);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Our Services</h1>
        <p className="text-sm text-muted-foreground">{total} service(s) found</p>
      </div>
      <div className="mt-6">
        <ServiceFilters />
      </div>
      {loading ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No services found"
            description="Try adjusting your search or filters."
            action={
              <ButtonLink href="/services" variant="outline">Clear Filters</ButtonLink>
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
          {totalPages > 1 ? (
            <div className="mt-10 flex items-center justify-between gap-4">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {pageNumbers.map((n) => (
                  <Button key={n} variant={n === page ? 'default' : 'outline'} size="sm" onClick={() => goToPage(n)}>
                    {n}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
                Next
              </Button>
            </div>
          ) : null}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
        </>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <ServicesContent />
    </Suspense>
  );
}
