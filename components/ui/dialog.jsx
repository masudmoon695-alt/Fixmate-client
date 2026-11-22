'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dialog({ open, onOpenChange, children, className }) {
  if (!open) return null;

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}>
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => onOpenChange?.(false)}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl border bg-card p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({ className, children, onOpenChange }) {
  return <Dialog open onOpenChange={onOpenChange}>{children}</Dialog>;
}

export function DialogHeader({ className, ...props }) {
  return <div className={cn('mb-4 flex flex-col space-y-1.5', className)} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={cn('font-heading text-xl font-semibold', className)} {...props} />;
}

export function DialogDescription({ className, ...props }) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function DialogFooter({ className, ...props }) {
  return <div className={cn('mt-6 flex justify-end gap-2', className)} {...props} />;
}

export function DialogClose({ onOpenChange, children, ...props }) {
  return (
    <button
      onClick={() => onOpenChange?.(false)}
      className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      {...props}
    >
      <X className="h-4 w-4" />
      {children}
    </button>
  );
}
