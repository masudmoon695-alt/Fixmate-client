import './globals.css';
import { Space_Grotesk, Inter } from 'next/font/google';
import { Providers } from './providers';

const heading = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: { default: 'FixMate', template: '%s | FixMate' },
  description: 'FixMate — on-demand smart device & home appliance repair booking platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`} suppressHydrationWarning>
      <body className={`${body.variable} font-body bg-background text-foreground antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
