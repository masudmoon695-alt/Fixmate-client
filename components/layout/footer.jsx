import Link from 'next/link';
import { Wrench, Github, Linkedin, Youtube } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

function XLogo({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L2.8 2h6.4l4.4 5.9L18.9 2zm-1.1 18h1.7L7.6 3.9H5.8L17.8 20z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Wrench className="h-5 w-5" />
              </span>
              <span className="font-heading text-xl font-bold">FixMate</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              On-demand smart device & home appliance repair booking platform. Technicians you trust, at your
              doorstep.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold">Quick Links</h3>
            <div className="mt-3 space-y-2 text-sm">
              <Link href="/" className="block text-muted-foreground hover:text-foreground">Home</Link>
              <Link href="/services" className="block text-muted-foreground hover:text-foreground">Services</Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground">About</Link>
              <Link href="/sign-up" className="block text-muted-foreground hover:text-foreground">Become a Technician</Link>
            </div>
          </div>
          <div>
            <h3 className="font-heading font-semibold">Popular Categories</h3>
            <div className="mt-3 space-y-2 text-sm">
              {CATEGORIES.slice(0, 5).map((category) => (
                <Link
                  key={category}
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className="block text-muted-foreground hover:text-foreground"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-heading font-semibold">Contact</h3>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>Email: support@fixmate.com</p>
              <p>Phone: +880 1700-000000</p>
              <p>Address: Gulshan, Dhaka</p>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://x.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="X (Twitter)">
              <XLogo className="h-5 w-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="YouTube">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
