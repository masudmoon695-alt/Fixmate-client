'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Image as ImageIcon, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ButtonLink } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export function ServiceCard({ service }) {
  const [imgError, setImgError] = useState(false);
  const serviceId = service?._id;
  const href = serviceId ? `/services/${serviceId}` : '/services';

  return (
    <Card className="flex flex-col overflow-hidden border border-border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <Link href={href} className="relative block aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-muted">
        {service?.image && !imgError ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
      </Link>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-base leading-tight truncate font-semibold text-foreground">{service?.title}</h3>
          <span className="whitespace-nowrap text-sm font-semibold text-primary">{formatCurrency(service?.basePrice)}</span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{service?.description}</p>
        {typeof service?.rating === 'number' ? (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {Number(service.rating).toFixed(1)} ·{' '}
            {service.reviewCount || 0} review(s)
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">No reviews yet</p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">{service?.category}</span>
          <span className="text-xs text-muted-foreground">{service?.serviceMode}</span>
        </div>
        {service?.technicianName ? (
          <p className="text-xs text-muted-foreground">Technician: {service.technicianName}</p>
        ) : null}
        <ButtonLink href={href} variant="outline" size="sm" className="w-full mt-auto border-border hover:bg-primary hover:text-primary-foreground">
          View Details
        </ButtonLink>
      </CardContent>
    </Card>
  );
}
