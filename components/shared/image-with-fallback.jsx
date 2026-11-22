'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ImageWithFallback({ src, alt, sizes, className, containerClassName }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={cn('flex h-full w-full items-center justify-center bg-muted', containerClassName)}>
        <ImageIcon className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return <Image src={src} alt={alt} fill sizes={sizes} className={className} onError={() => setError(true)} />;
}
