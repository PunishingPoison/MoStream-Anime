'use client';

import { tmdb } from '@/api/tmdb';
import MoviePlayer from '@/components/sections/Movie/Player/Player';
import { Params } from '@/types';
import { isEmpty } from '@/utils/helpers';
import { Button, Skeleton } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { use } from 'react';

export default function MoviePlayerPage({ params }: Params<{ id: number }>) {
  const { id } = use(params);

  const { data: movie, isPending, error, refetch } = useQuery<any>({
    queryFn: () => tmdb.movies.details(id),
    queryKey: ['movie-player-detail', id],
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
        <p className="text-xl text-muted-foreground">Failed to load anime.</p>
        <Button color="primary" variant="flat" onPress={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (isEmpty(movie)) return notFound();

  return <MoviePlayer movie={movie} />;
}
