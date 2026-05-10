'use client';

import ContentTypeSelection from '@/components/ui/other/ContentTypeSelection';
import BackToTopButton from '@/components/ui/button/BackToTopButton';
import { siteConfig } from '@/config/site';
import { Spinner } from '@heroui/react';
import dynamic from 'next/dynamic';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { Suspense } from 'react';
const MovieHomeList = dynamic(() => import('@/components/sections/Movie/HomeList'));
const TvShowHomeList = dynamic(() => import('@/components/sections/TV/HomeList'));

const HomePageList: React.FC = () => {
  const { movies, tvShows } = siteConfig.queryLists;
  const [content] = useQueryState(
    'content',
    parseAsStringLiteral(['movie', 'tv']).withDefault('movie'),
  );

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <div className="flex items-center gap-4">
        <ContentTypeSelection />
      </div>
      <div className="relative flex min-h-32 flex-col gap-8 md:gap-10">
        <Suspense
          fallback={
            <Spinner
              size="lg"
              variant="simple"
              className="absolute-center"
              color={content === 'movie' ? 'primary' : 'warning'}
            />
          }
        >
          {content === 'movie' &&
            movies.map((movie) => <MovieHomeList key={movie.name} {...movie} />)}
          {content === 'tv' && tvShows.map((tv) => <TvShowHomeList key={tv.name} {...tv} />)}
        </Suspense>
      </div>
      <BackToTopButton />
    </div>
  );
};

export default HomePageList;
