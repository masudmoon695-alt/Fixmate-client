import { cn } from '@/lib/utils';

export function PageHeader({ title, description, children, className }) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
