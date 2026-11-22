import Link from 'next/link';
import { Search, ClipboardList, Wrench as WrenchIcon, CreditCard, ShieldCheck, Star, MapPin, Building2 } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { CATEGORIES, SERVICE_MODES } from '@/lib/constants';
import { ServiceCard } from '@/components/services/service-card';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { Button, ButtonLink } from '@/components/ui/button';
import { HeroVisual } from '@/components/home/hero-visual';

async function getFeaturedServices() {
  try {
    const res = await fetch(`${API_URL}/api/services?limit=6&sort=newest`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const featured = await getFeaturedServices();

  const steps = [
    { icon: Search, title: 'Find a Service', text: 'Browse or search repair services by category, device and budget.' },
    { icon: ClipboardList, title: 'Send a Request', text: 'Tell the technician what is wrong with your device.' },
    { icon: WrenchIcon, title: 'Technician Fixes It', text: 'A verified technician completes the repair with care.' },
    { icon: CreditCard, title: 'Pay After Completion', text: 'Release the final payment only once the job is done.' },
  ];

  const trustPoints = [
    { icon: ShieldCheck, title: 'Verified Technicians', text: 'Background-checked, rated experts.' },
    { icon: Star, title: 'Quality Work', text: 'Transparent pricing, no hidden fees.' },
    { icon: MapPin, title: 'Home Service', text: 'On-site or shop drop-off across Dhaka.' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <section className="relative overflow-hidden bg-background">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 lg:py-24 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground shadow-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Verified technicians · Pay after the job</span>
              </div>
              <h1 className="mt-2 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
                Broken Device? Get It Fixed by <span className="text-primary">Verified Technicians</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl leading-relaxed">
                Book a trusted technician for your smartphone, laptop, AC, refrigerator, TV, washing machine or
                electrical fix — and pay only after the job is completed.
              </p>
              <form action="/services" method="get" className="mt-8 flex w-full max-w-md flex-col sm:flex-row gap-2">
                <div className="flex w-full items-center rounded-lg border border-border bg-card text-foreground focus-within:ring-2 focus-within:ring-primary">
                  <Search className="h-5 w-5 pl-3 text-muted-foreground" />
                  <input
                    type="search"
                    name="search"
                    placeholder="Search smartphone, AC, laptop…"
                    className="h-12 w-full rounded-none border-none bg-transparent px-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none"
                    aria-label="Search services"
                  />
                </div>
                <Button type="submit" size="sm" className="h-12 px-6 rounded-lg font-medium">
                  Search
                </Button>
              </form>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/services" size="sm" className="h-11 px-5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                  Browse Services
                </ButtonLink>
                <ButtonLink href="/sign-up" size="sm" className="h-11 px-5 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors">
                  Become a Technician
                </ButtonLink>
              </div>
              <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
                {[['500+', 'Repairs'], ['4.8', 'Avg rating'], ['Verified', 'Techs']].map(([big, label], i) => (
                  <span key={i} className="flex flex-col gap-0.5">
                    <span className="font-semibold text-foreground">{big}</span>
                    <span>{label}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="relative w-full">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold">Featured Services</h2>
          <ButtonLink href="/services" variant="outline">View all</ButtonLink>
        </div>
        {featured.length === 0 ? (
          <p className="mt-6 text-muted-foreground">No services available right now. Check back soon.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-card border-y">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold">How FixMate Works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-xl border bg-background p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-accent">{index + 1}</span>
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold">Popular Categories</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/services?category=${encodeURIComponent(category)}`}
              className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-medium">{category}</p>
              <p className="mt-1 text-sm text-muted-foreground">Expert repairs & fixes</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-2xl border bg-card p-8 sm:grid-cols-3">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-heading font-semibold">{point.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{point.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
