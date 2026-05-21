'use client';

import { tmdb } from '@/api/tmdb';
import { queryClient } from '@/app/providers';
import TvShowPosterCard from '@/components/sections/TV/Cards/Poster';
import useDiscoverFilters from '@/hooks/useDiscoverFilters';
import { isEmpty } from '@/utils/helpers';
import { getLoadingLabel } from '@/utils/movies';
import { Spinner } from '@heroui/react';
import { useInViewport } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import MoviePosterCard from '@/components/sections/Movie/Cards/Poster';
import SearchFilter from './Filter';

const SearchList = () => {
  const { content } = useDiscoverFilters();
  const { ref, inViewport } = useInViewport();
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState('');
  const triggered = !isEmpty(submittedSearchQuery);

  const { data, isFetching, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<any, Error, any, any[], number>({
      enabled: triggered,
      queryKey: ['search-list', content, submittedSearchQuery],
      queryFn: async ({ pageParam }) => {
        if (content === 'movie') return tmdb.search.movies(submittedSearchQuery, pageParam);
        return tmdb.search.tvShows(submittedSearchQuery, pageParam);
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage: any) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    });

  useEffect(() => {
    if (inViewport) fetchNextPage();
  }, [inViewport]);

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ['search-list'] });
  }, [content]);

  const resultsContent = useMemo(() => {
    if (isEmpty(data?.pages[0]?.results)) {
      return (
        <div className="mt-32 flex flex-col items-center gap-6">
          <div className="rounded-2xl bg-secondary-background p-8 ring-1 ring-white/10">
            <BiSearchAlt2 className="size-16 text-muted-foreground/30" />
          </div>
          <div className="text-center">
            <h5 className="text-xl font-semibold text-muted-foreground">
              No {content === 'movie' ? 'anime' : 'manga'} found
            </h5>
            <p className="mt-1 text-sm text-muted-foreground/50">
              No results for &ldquo;<span className="text-warning font-medium">{submittedSearchQuery}</span>&rdquo;
            </p>
          </div>
        </div>
      );
    }
    return (
      <>
        <div className="text-center">
          <p className="text-base text-muted-foreground">
            Found{' '}
            <span className="font-semibold text-success">{data?.pages[0]?.total_results?.toLocaleString()}</span>{' '}
            {content === 'movie' ? 'anime' : 'manga'} for &ldquo;
            <span className="font-semibold text-warning">{submittedSearchQuery}</span>&rdquo;
          </p>
        </div>
        <div className="movie-grid">
          {data?.pages.map((page: any) =>
            page.results.map((item: any) =>
              content === 'movie' ? (
                <MoviePosterCard key={item.id} movie={item} variant="bordered" />
              ) : (
                <TvShowPosterCard key={item.id} tv={item} variant="bordered" />
              ),
            ),
          )}
        </div>
      </>
    );
  }, [content, data?.pages, submittedSearchQuery]);

  return (
    <div className="flex flex-col items-center gap-8">
      <SearchFilter
        isLoading={isFetching}
        onSearchSubmit={(value) => setSubmittedSearchQuery(value)}
      />
      {triggered && (
        <>
          <div className="relative flex flex-col gap-8 w-full">
            {isPending ? (
              <Spinner size="lg" className="absolute-center mt-56" color={content === 'movie' ? 'primary' : 'warning'} variant="simple" />
            ) : (
              resultsContent
            )}
          </div>
          <div ref={ref} className="flex h-24 items-center justify-center">
            {isFetchingNextPage && (
              <Spinner color={content === 'movie' ? 'primary' : 'warning'} size="lg" variant="wave" label={getLoadingLabel()} />
            )}
            {!isEmpty(data?.pages[0]?.results) && !hasNextPage && !isPending && (
              <p className="text-center text-sm text-muted-foreground/50">You've reached the end</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchList;
