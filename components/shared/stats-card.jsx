import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

export function StatsCard({ className, title, value, description, icon: Icon }) {
  return (
    <div className={cn('rounded-xl border bg-card p-6 text-card-foreground shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="font-heading mt-2 text-2xl font-bold">{value}</p>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {Icon ? <Icon className="h-8 w-8 text-primary" /> : null}
      </div>
    </div>
  );
}

export { formatCurrency };
