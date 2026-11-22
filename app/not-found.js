import Link from 'next/link';

function RepairIllustration() {
  return (
    <svg viewBox="0 0 320 220" className="h-40 w-full max-w-md" fill="none" aria-hidden>
      <circle cx="160" cy="110" r="96" fill="#f59e0b" />
      <path
        d="M118 62 L158 102 L138 122 L98 82 Z"
        fill="#fff7ed"
        stroke="#7c2d12"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M138 62 L178 102 L158 122 L118 82 Z"
        fill="#ffedd5"
        stroke="#7c2d12"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M182 148 L222 188"
        stroke="#7c2d12"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M212 168 L252 208"
        stroke="#0f766e"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="182" cy="148" r="10" fill="#7c2d12" />
      <circle cx="212" cy="168" r="10" fill="#0f766e" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <RepairIllustration />
      <h2 className="font-heading text-3xl font-bold">Page not found</h2>
      <p className="max-w-md text-muted-foreground">The page you are looking for does not exist or has been moved.</p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}
