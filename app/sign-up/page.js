'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signUp } from '@/lib/auth-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, password, role }) {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Full name is required (min 2 characters)';
  if (!email || !EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) errors.password = 'Password must include at least one uppercase and one lowercase letter';
  if (!role) errors.role = 'Please choose a role';
  return errors;
}

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(`/dashboard/${session.user.role || 'customer'}`);
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (session?.user) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate({ name, email, password, role });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        callbackURL: `/dashboard/${role}`,
      });
      if (error) {
        toast.error(error.message || 'Sign up failed');
        return;
      }
      toast.success('Account created. Welcome to FixMate!');
      router.push(`/dashboard/${role}`);
      router.refresh();
    } catch (error) {
      toast.error(error?.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  }

  const fieldError = (key) =>
    errors[key] ? <p className="mt-1 text-xs text-red-600">{errors[key]}</p> : null;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="font-heading text-2xl font-bold">Create Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign up to book trusted repair technicians.</p>
        <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            {fieldError('name')}
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            {fieldError('email')}
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            {fieldError('password')}
            <p className="mt-1 text-xs text-muted-foreground">At least 6 characters with one uppercase and one lowercase letter.</p>
          </div>
          <fieldset>
            <Label>I am joining FixMate as a…</Label>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {[
                { value: 'customer', label: 'Customer', hint: 'Book repairs for my devices' },
                { value: 'technician', label: 'Technician', hint: 'Fix devices & earn money' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  className={cn(
                    'rounded-lg border p-3 text-left transition-colors',
                    role === option.value ? 'border-primary bg-primary/5' : 'hover:bg-accent',
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{option.hint}</span>
                </button>
              ))}
            </div>
            {fieldError('role')}
          </fieldset>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-medium text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
