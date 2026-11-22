'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CATEGORIES, SERVICE_MODES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const SEARCH_DEBOUNCE_MS = 400;

export function ServiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  // Debounce the search box so we do not spam the URL / API on every keystroke.
  useEffect(() => {
    const query = searchParams.toString();
    const current = new URLSearchParams(query);
    const existing = searchInput;
    const urlValue = current.get('search') || '';
    if (existing === urlValue) return undefined;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(current.toString());
      const value = searchInput.trim();
      if (value) params.set('search', value);
      else params.delete('search');
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput, searchParams, pathname, router]);

  function updateParams(updates) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearFilters() {
    const params = new URLSearchParams();
    router.push(pathname, { scroll: false });
    setSearchInput('');
  }

  const sort = searchParams.get('sort') || 'newest';
  const category = searchParams.get('category') || '';
  const serviceMode = searchParams.get('serviceMode') || '';

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Search services..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-11"
          />
        </div>
        <select
          value={category}
          onChange={(e) => updateParams({ category: e.target.value })}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={serviceMode}
          onChange={(e) => updateParams({ serviceMode: e.target.value })}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All Modes</option>
          {SERVICE_MODES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex justify-end">
        <Button size="sm" variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
