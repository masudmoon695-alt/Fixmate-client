'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession, signIn } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get('redirect') || '';

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(redirectTo || `/dashboard/${session.user.role || 'customer'}`);
    }
  }, [isPending, session, router, redirectTo]);

  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!email || !EMAIL_RE.test(email.trim())) nextErrors.email = 'Enter a valid email address';
    if (!password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const { error } = await signIn.email({
        email: email.trim(),
        password,
        callbackURL: redirectTo || undefined,
      });
      if (error) {
        toast.error(error.message || 'Invalid email or password');
        return;
      }
      toast.success('Welcome back!');
      router.push(redirectTo || '/dashboard/customer');
      router.refresh();
    } catch (error) {
      toast.error(error?.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  const fieldError = (key) =>
    errors[key] ? <p className="mt-1 text-xs text-red-600">{errors[key]}</p> : null;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="font-heading text-2xl font-bold">Sign In</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back to FixMate.</p>
        <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            {fieldError('email')}
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            {fieldError('password')}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="font-medium text-primary hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Skeleton className="h-10 w-64" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
