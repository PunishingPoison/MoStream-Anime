'use client';

import { tmdb } from '@/api/tmdb';
import MangaReader from '@/components/sections/Manga/Reader/Reader';
import { Params } from '@/types';
import { isEmpty } from '@/utils/helpers';
import { Button, Skeleton } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { parseAsFloat, useQueryState } from 'nuqs';
import { mutateTvShowTitle } from '@/utils/movies';

export default function TvPlayerPage({ params }: Params<{ id: number }>) {
  const { id } = use(params);
  const [episode] = useQueryState('episode', parseAsFloat.withDefault(1));

  const { data: tv, isPending, error, refetch } = useQuery<any>({
    queryFn: () => tmdb.tvShows.details(id),
    queryKey: ['tv-player-detail', id],
  });

  if (isPending) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Skeleton className="h-8 w-48 rounded-full" />
        <Skeleton className="h-4 w-32 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-xl text-muted-foreground">Failed to load manga.</p>
        <Button color="warning" variant="flat" onPress={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (isEmpty(tv)) return notFound();

  const mangaTitle = mutateTvShowTitle(tv);

  return <MangaReader mangaTitle={mangaTitle} mangaId={id} chapterNumber={episode} />;
}
