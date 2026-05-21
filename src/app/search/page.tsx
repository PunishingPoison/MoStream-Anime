import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SearchList = dynamic(() => import('@/components/sections/Search/List'));

export const metadata: Metadata = {
  title: `Search Anime | ${siteConfig.name}`,
};

export default function SearchPage() {
  return (
    <Suspense>
      <SearchList />
    </Suspense>
  );
}
