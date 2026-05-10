'use client';

import TvShowPosterCard from '@/components/sections/TV/Cards/Poster';
import BackToTopButton from '@/components/ui/button/BackToTopButton';
import useDiscoverFilters from '@/hooks/useDiscoverFilters';
import { tmdb } from '@/api/tmdb';
import { Spinner } from '@heroui/react';
import { useInViewport } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getLoadingLabel } from '@/utils/movies';
import { isEmpty } from '@/utils/helpers';

const TvShowDiscoverList = () => {
  const { queryType, genresString } = useDiscoverFilters();
  const { ref, inViewport } = useInViewport();

  const fetchTvShows = async ({ pageParam = 1 }: { pageParam: number }) => {
    if (queryType === 'discover') {
      const params: Record<string, string> = {
        sort_by: 'popularity.desc',
        page: String(pageParam),
      };
      if (genresString) params.with_genres = genresString;
      return tmdb.discover.tv(params);
    }
    const queryMap: Record<string, () => Promise<any>> = {
      todayTrending: () => tmdb.trending.trending('tv', 'day'),
      thisWeekTrending: () => tmdb.trending.trending('tv', 'week'),
      popular: () => tmdb.tvShows.popular(pageParam),
      onTheAir: () => tmdb.tvShows.onTheAir(pageParam),
      topRated: () => tmdb.tvShows.topRated(pageParam),
    };
    const fn = queryMap[queryType];
    if (!fn) return tmdb.discover.tv({ sort_by: 'popularity.desc', page: String(pageParam) });
    return fn();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery<any, Error, any, any[], number>({
    queryKey: ['discover-tv-shows', queryType, genresString],
    queryFn: fetchTvShows,
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  useEffect(() => {
    if (inViewport && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inViewport]);

  if (status === 'pending') {
    return <Spinner size="lg" className="absolute-center mt-20" variant="simple" color="warning" />;
  }

  const allResults = data?.pages.flatMap((p: any) => p.results) || [];

  return (
    <>
      {isEmpty(allResults) ? (
        <div className="flex h-[40vh] flex-col items-center justify-center gap-3">
          <svg className="size-12 text-muted-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
          <p className="text-base text-muted-foreground">No TV shows found. Try different filters.</p>
        </div>
      ) : (
        <div className="movie-grid">
          {allResults.map((tv: any) => (
            <TvShowPosterCard key={tv.id} tv={tv} variant="bordered" />
          ))}
        </div>
      )}
      <div ref={ref} className="flex h-24 items-center justify-center">
        {isFetchingNextPage && (
          <Spinner size="lg" variant="wave" label={getLoadingLabel()} color="warning" />
        )}
        {!hasNextPage && !isEmpty(allResults) && (
          <p className="text-center text-sm text-muted-foreground/50">You've reached the end</p>
        )}
      </div>
      <BackToTopButton />
    </>
  );
};

export default TvShowDiscoverList;
