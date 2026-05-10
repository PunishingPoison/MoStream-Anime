'use client';

import BackToTopButton from '@/components/ui/button/BackToTopButton';
import { tmdb } from '@/api/tmdb';
import { Params } from '@/types';
import { Button, Skeleton } from '@heroui/react';
import { useScrollIntoView } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';
import dynamic from 'next/dynamic';

const PhotosSection = dynamic(() => import('@/components/ui/other/PhotosSection'));
const TvShowRelatedSection = dynamic(() => import('@/components/sections/TV/Details/Related'));
const TvShowCastsSection = dynamic(() => import('@/components/sections/TV/Details/Casts'));
const TvShowBackdropSection = dynamic(() => import('@/components/sections/TV/Details/Backdrop'));
const TvShowOverviewSection = dynamic(() => import('@/components/sections/TV/Details/Overview'));
const TvShowsSeasonsSelection = dynamic(() => import('@/components/sections/TV/Details/Seasons'));

function TvDetailSkeleton() {
  return (
    <div>
      <Skeleton className="fixed top-0 left-0 right-0 h-[40vh] md:h-[55vh] lg:h-[75vh] rounded-none" />
      <div className="relative z-3 pt-[20vh] md:pt-[40vh]">
        <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] md:gap-10 gap-4">
          <div className="flex gap-4 md:flex-col">
            <Skeleton className="w-24 md:w-56 aspect-2/3 rounded-lg md:rounded-xl shrink-0" />
            <div className="flex flex-1 flex-col gap-2 md:hidden">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-7 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-full" />
              <div className="flex gap-2 mt-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="hidden md:flex flex-col gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-10 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-1/2 rounded-full" />
              <div className="flex gap-2 mt-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-36 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 rounded-full" />
              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-3 w-5/6 rounded-full" />
              <Skeleton className="h-3 w-4/6 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TVShowDetailPage({ params }: Params<{ id: number }>) {
  const { id } = use(params);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ duration: 500 });

  const { data: tv, isPending, error, refetch } = useQuery<any>({
    queryFn: () =>
      tmdb.tvShows.details(id, ['images', 'videos', 'credits', 'recommendations', 'similar']),
    queryKey: ['tv-show-detail', id],
  });

  if (isPending) return <TvDetailSkeleton />;

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-xl text-muted-foreground">Failed to load TV show details.</p>
        <Button color="warning" variant="flat" onPress={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!tv) return notFound();

  return (
    <div>
      <Suspense fallback={<TvDetailSkeleton />}>
        <div className="flex flex-col gap-8 md:gap-10">
          <TvShowBackdropSection tv={tv} />
          <TvShowOverviewSection
            onViewEpisodesClick={() => scrollIntoView({ alignment: 'center' })}
            tv={tv}
          />
          <TvShowCastsSection casts={tv?.credits?.cast || []} />
          <PhotosSection images={tv?.images?.backdrops || []} type="tv" />
          <TvShowsSeasonsSelection ref={targetRef} id={id} seasons={tv?.seasons || []} />
          <TvShowRelatedSection tv={tv} />
        </div>
      </Suspense>
      <BackToTopButton />
    </div>
  );
}
