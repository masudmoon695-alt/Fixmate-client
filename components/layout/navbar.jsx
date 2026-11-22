'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Wrench, LayoutDashboard, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { clearToken } from '@/lib/api';
import { toast } from 'sonner';
import { Button, ButtonLink } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export function Navbar() {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const user = session?.user;
  const role = user?.role || 'customer';

  useEffect(() => {
    function onClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleSignOut() {
    setAccountOpen(false);
    try {
      await signOut();
      clearToken();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error(error?.message || 'Sign out failed');
    }
    router.push('/sign-in');
    router.refresh();
  }

  const navLinkClass = (href, exact = false) => {
    const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
    return `text-sm transition-colors ${isActive ? 'font-medium text-primary bg-primary/10 rounded-lg px-3 py-1' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-5 w-5" />
          </span>
          <span className="font-heading text-xl font-bold">FixMate</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className={navLinkClass('/', true)}>Home</Link>
          <Link href="/services" className={navLinkClass('/services')}>Services</Link>
          <Link href="/about" className={navLinkClass('/about', true)}>About</Link>
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                aria-label="Account menu"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name || 'User'} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
              {accountOpen ? (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-lg">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.name || user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <div className="my-1 h-px border-border" />
                  <Link
                    href={`/dashboard/${role}`}
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted hover:text-primary"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted hover:text-primary"
                  >
                    <UserIcon className="h-4 w-4" /> Update Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <ButtonLink variant="ghost" size="sm" href="/sign-in" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                Sign In
              </ButtonLink>
              <ButtonLink size="sm" href="/sign-up" className="bg-primary text-primary-foreground hover:bg-primaryHover">
                Sign Up
              </ButtonLink>
            </>
          )}
          <div className="md:hidden">
            <Button size="sm" variant="outline" onClick={() => setOpen((v) => !v)}>
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />} Menu
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>
      {open ? (
        <div className="border-t border-border bg-background px-4 py-2 md:hidden">
          <Link href="/" onClick={() => setOpen(false)} className="block py-2 text-muted-foreground hover:text-foreground">Home</Link>
          <Link href="/services" onClick={() => setOpen(false)} className="block py-2 text-muted-foreground hover:text-foreground">Services</Link>
          <Link href="/about" onClick={() => setOpen(false)} className="block py-2 text-muted-foreground hover:text-foreground">About</Link>
          {user ? (
            <Link href={`/dashboard/${role}`} onClick={() => setOpen(false)} className="block py-2 text-muted-foreground hover:text-foreground">Dashboard</Link>
          ) : (
            <>
              <Link href="/sign-in" onClick={() => setOpen(false)} className="block py-2 text-muted-foreground hover:text-foreground">Sign In</Link>
              <Link href="/sign-up" onClick={() => setOpen(false)} className="block py-2 text-muted-foreground hover:text-foreground">Sign Up</Link>
            </>
          )}
        </div>
      ) : null}
    </header>
  );
}
