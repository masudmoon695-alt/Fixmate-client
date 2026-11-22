import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold">About FixMate</h1>
          <p className="mt-4 text-muted-foreground">
            FixMate is an on-demand smart device and home appliance repair platform. Customers book vetted
            technicians for on-site or shop-drop-off repairs, and pay only after the service is completed.
          </p>
          <p className="mt-4 text-muted-foreground">
            Our network covers categories like smartphones, laptops, ACs, refrigerators, TVs, washing machines and
            electrical fixes across Dhaka.
          </p>
          <p className="mt-4 text-muted-foreground">
            The platform connects customers who need help with devices to technicians who love fixing them — with
            transparent pricing, verified experts and a pay-after-completion promise.
          </p>
          <div className="mt-8">
            <Link href="/services" className="font-medium text-primary hover:underline">Browse services →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
