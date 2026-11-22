'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Wrench, Phone, CheckCircle2 } from 'lucide-react';

export function HeroVisual() {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
      {!hasError ? (
        <Image
          src="/images/hero-technician.jpg"
          alt="Technician repairing device"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted">
          <Wrench className="h-16 w-16 text-primary/60" />
          <span className="font-heading text-lg font-bold tracking-wide text-foreground">
            FixMate
          </span>
        </div>
      )}

      {/* Subtle bottom gradient overlay so chips stay readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Floating chip: Top-right "Paid after completion" */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-foreground">Paid after completion</span>
      </div>

      {/* Floating chip: Bottom-left "Technician on the way" */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Phone className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-foreground">Technician on the way</span>
      </div>
    </div>
  );
}
