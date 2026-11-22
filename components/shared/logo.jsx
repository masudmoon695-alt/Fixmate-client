import { Wrench } from 'lucide-react';

export function Logo({ className }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wrench className="h-5 w-5" />
      </span>
      <span className="font-heading text-xl font-bold">FixMate</span>
    </span>
  );
}

export default Logo;
