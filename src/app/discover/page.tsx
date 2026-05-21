import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DiscoverListGroup = dynamic(() => import('@/components/sections/Discover/ListGroup'));

export const metadata: Metadata = {
  title: `Discover Anime | ${siteConfig.name}`,
};

export default function DiscoverPage() {
  return (
    <Suspense>
      <DiscoverListGroup />
    </Suspense>
  );
}
