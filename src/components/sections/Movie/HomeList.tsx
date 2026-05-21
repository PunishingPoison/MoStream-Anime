'use client';

import MoviePosterCard from '@/components/sections/Movie/Cards/Poster';
import SectionTitle from '@/components/ui/other/SectionTitle';
import Carousel from '@/components/ui/wrapper/Carousel';
import { QueryList } from '@/types';
import { Link, Skeleton } from '@heroui/react';
import { useInViewport } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { kebabCase } from 'string-ts';

const MovieHomeListSkeleton = () => (
  <div className="flex w-full flex-col gap-3">
    <div className="flex items-center gap-3">
      <Skeleton className="h-6 w-1 rounded-full md:h-7" />
      <Skeleton className="h-6 w-44 rounded-full md:h-7" />
      <div className="grow" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <div className="flex gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex shrink-0 flex-col gap-2" style={{ width: 'calc(100% / 3 - 8px)' }}>
          <Skeleton className="aspect-2/3 w-full rounded-lg md:min-w-[175px]" />
        </div>
      ))}
    </div>
  </div>
);

const MovieHomeList: React.FC<QueryList<any>> = ({ query, name, param }) => {
  const key = kebabCase(name) + '-list';
  const { ref, inViewport } = useInViewport();
  const { data, isPending } = useQuery({
    queryFn: query,
    queryKey: [key],
    enabled: inViewport,
  });

  return (
    <section id={key} className="min-h-[200px] overflow-hidden" ref={ref}>
      {isPending ? (
        <MovieHomeListSkeleton />
      ) : (
        <div className="z-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 shrink">
              <SectionTitle className="truncate">{name}</SectionTitle>
            </div>
            <Link
              size="sm"
              href={`/discover?type=${param}`}
              isBlock
              color="foreground"
              className="shrink-0 flex items-center gap-1.5 rounded-full text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:gap-3"
            >
              See All
              <span className="text-primary transition-transform duration-200">&rarr;</span>
            </Link>
          </div>
          <Carousel>
            {data?.results.map((movie: any) => (
              <div
                key={movie.id}
                className="embla__slide flex min-h-fit items-center px-1 py-2 min-w-[150px] sm:min-w-[175px] md:min-w-[200px]"
              >
                <MoviePosterCard movie={movie} />
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </section>
  );
};

export default MovieHomeList;
