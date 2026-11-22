import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EmptyState({ title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-10 text-center', className)}>
      <Inbox className="h-10 w-10 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action}
    </div>
  );
}
