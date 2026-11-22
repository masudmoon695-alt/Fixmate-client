'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  ClipboardList,
  Users,
  CreditCard,
  Settings,
  LifeBuoy,
  Home,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/shared/theme-toggle';

const TECHNICIAN_LINKS = [
  { href: '/dashboard/technician', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/technician/add-service', label: 'Add Service', icon: Wrench },
  { href: '/dashboard/technician/my-services', label: 'My Services', icon: ClipboardList },
  { href: '/dashboard/technician/requests', label: 'Requests', icon: LifeBuoy },
  { href: '/dashboard/profile', label: 'Profile', icon: Settings },
];

const ADMIN_LINKS = [
  { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/services', label: 'Services', icon: ClipboardList },
  { href: '/dashboard/admin/bookings', label: 'Bookings', icon: ClipboardList },
  { href: '/dashboard/admin/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/dashboard/profile', label: 'Profile', icon: Settings },
];

const CUSTOMER_LINKS = [
  { href: '/dashboard/customer', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/customer/bookings', label: 'My Bookings', icon: ClipboardList },
  { href: '/dashboard/customer/payments', label: 'Payments', icon: CreditCard },
  { href: '/dashboard/profile', label: 'Profile', icon: Settings },
];

export function DashboardLayout({ children, role }) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeRole = role || session?.user?.role || 'customer';
  const user = session?.user;

  const links =
    activeRole === 'technician'
      ? TECHNICIAN_LINKS
      : activeRole === 'admin'
        ? ADMIN_LINKS
        : CUSTOMER_LINKS;

  if (isPending) {
    return (
      <div className="flex h-screen bg-background overflow-hidden">
        <div className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card">
          <div className="flex h-16 items-center px-4 border-b border-border">
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="p-3 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
          <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur px-4 sm:px-6 shrink-0">
            <Skeleton className="h-8 w-20" />
          </div>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Skeleton className="h-8 w-64" />
          </main>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const linkIsActive = (href) => pathname === href;

  /* ---- Sidebar nav content (shared between desktop & mobile drawer) ---- */
  const navContent = (
    <>
      {/* Logo header */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-4 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-5 w-5" />
          </span>
          {!collapsed && <span className="font-heading text-xl font-bold text-foreground">FixMate</span>}
        </Link>
      </div>

      {/* Nav links — takes all remaining space */}
      <nav className="flex-1 overflow-y-auto space-y-1 p-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = linkIsActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                collapsed && 'justify-center',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && link.label}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button — pinned at bottom */}
      <div className="mt-auto shrink-0 border-t border-border p-3">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ---- Desktop sidebar: sticky, full viewport height ---- */}
      <aside
        className={cn(
          'hidden lg:flex sticky top-0 h-full shrink-0 flex-col border-r border-border bg-card transition-[width] duration-300',
          collapsed ? 'w-[72px]' : 'w-64',
        )}
      >
        {navContent}
      </aside>

      {/* ---- Mobile drawer overlay ---- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute inset-y-0 left-0 z-50 flex w-64 flex-col bg-card shadow-xl">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {navContent}
          </aside>
        </div>
      )}

      {/* ---- Main content area ---- */}
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground sm:flex">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium leading-none text-foreground">{user?.name || user?.email}</p>
                <Badge className="mt-1 text-[10px] uppercase">{activeRole}</Badge>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Page content - scrolls inside main */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
