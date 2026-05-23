import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/config/site';
import { Poppins } from 'next/font/google';
import '@/styles/globals.css';
import Providers from './providers';
import TopNavbar from '@/components/ui/layout/TopNavbar';
import BottomNavbar from '@/components/ui/layout/BottomNavbar';
import Sidebar from '@/components/ui/layout/Sidebar';
import { SpacingClasses } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import dynamic from 'next/dynamic';
const Disclaimer = dynamic(() => import('@/components/ui/overlay/Disclaimer'));

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: siteConfig.name,
  applicationName: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: [
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico?v=2', sizes: 'any' },
    ],
    apple: { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
  },
  manifest: '/site.webmanifest?v=2',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0D0C0F' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning className={cn('bg-background min-h-dvh antialiased select-none', poppins.variable)}>
        <Suspense>
          <NuqsAdapter>
            <Providers>
              <Disclaimer />
              <TopNavbar />
              <Sidebar>
                <main className={cn('container mx-auto max-w-full', SpacingClasses.main)}>
                  {children}
                </main>
              </Sidebar>
              <BottomNavbar />
            </Providers>
          </NuqsAdapter>
        </Suspense>
      </body>
    </html>
  );
}
