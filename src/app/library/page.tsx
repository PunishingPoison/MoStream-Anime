import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LibraryList = dynamic(() => import('@/components/sections/Library/List'));

export const metadata: Metadata = {
  title: `Library | ${siteConfig.name}`,
};

export default function LibraryPage() {
  return (
    <Suspense>
      <LibraryList />
    </Suspense>
  );
}
