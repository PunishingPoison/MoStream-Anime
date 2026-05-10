'use client';

import { tmdb } from '@/api/tmdb';
import Rating from '@/components/ui/other/Rating';
import Genres from '@/components/ui/other/Genres';
import { cn, isEmpty } from '@/utils/helpers';
import { Calendar, Clock } from '@/utils/icons';
import { getImageUrl, movieDurationString, mutateMovieTitle } from '@/utils/movies';
import { Button, Link, Skeleton } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const HeroSection = () => {
  const { data, isPending } = useQuery({
    queryKey: ['hero-trending'],
    queryFn: () => tmdb.trending.trending('movie', 'day'),
  });

  const movie = useMemo(() => {
    if (!data?.results?.length) return null;
    const results = data.results;
    const idx = Math.floor(Math.random() * Math.min(5, results.length));
    return results[idx];
  }, [data]);

  const { data: details } = useQuery({
    queryKey: ['hero-details', movie?.id],
    queryFn: () => tmdb.movies.details(movie.id, ['images', 'videos']),
    enabled: !!movie?.id,
  });

  if (isPending) {
    return (
      <div className="relative -mx-4 -mt-6 sm:-mx-8 sm:-mt-8 h-[60dvh] min-h-[400px] md:min-h-[600px] lg:min-h-[700px]">
        <Skeleton className="size-full rounded-none" />
      </div>
    );
  }

  if (!movie || !details) return null;

  const title = mutateMovieTitle(details);
  const backdrop = getImageUrl(details.backdrop_path, 'backdrop');
  const poster = getImageUrl(details.poster_path);
  const releaseYear = details.release_date
    ? new Date(details.release_date).getFullYear()
    : '';
  const titleLogo = !isEmpty(details.images?.logos)
    ? getImageUrl(
        details.images.logos.find((l: any) => l.iso_639_1 === 'en')?.file_path,
        'title',
      )
    : '';
  const trailer = details.videos?.results?.find(
    (v: any) => v.type === 'Trailer' && v.official,
  );

  return (
    <section className="relative -mx-4 -mt-6 sm:-mx-8 sm:-mt-8 h-[60dvh] min-h-[400px] md:min-h-[600px] lg:min-h-[700px]">
      <div className="absolute inset-0 z-0">
        <img
          src={backdrop}
          alt=""
          className="size-full object-cover object-top"
          draggable={false}
        />
      </div>

      <div className="absolute inset-0 z-1 hero-gradient" />
      <div className="absolute inset-0 z-1 hero-side-gradient" />

      <div className="absolute bottom-0 z-2 flex w-full flex-col gap-4 px-4 pb-8 md:flex-row md:items-end md:gap-10 md:px-12 md:pb-16 lg:px-20 lg:pb-20">
        <div className="flex w-full gap-4 md:w-auto md:flex-col">
          <div className="w-24 shrink-0 md:w-44 lg:w-56">
            <img
              src={poster}
              alt={title}
              className="w-full rounded-xl shadow-2xl shadow-black/60 ring-1 ring-white/10"
              draggable={false}
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-end gap-2 md:hidden">
            {titleLogo ? (
              <img
                src={titleLogo}
                alt={title}
                className="h-8 max-w-[200px] object-contain drop-shadow-lg"
                draggable={false}
              />
            ) : (
              <h1 className="text-xl font-black text-shadow-lg">{title}</h1>
            )}
            <Rating rate={details.vote_average || 0} />
          </div>
        </div>

        <div className="flex max-w-2xl flex-col gap-3 max-md:hidden">
          {titleLogo ? (
            <img
              src={titleLogo}
              alt={title}
              className="h-14 max-w-xs object-contain drop-shadow-xl md:h-20 lg:h-24"
              draggable={false}
            />
          ) : (
            <h1 className="text-3xl font-black text-shadow-lg md:text-5xl lg:text-6xl">
              {title}
            </h1>
          )}

          <div className="flex flex-wrap items-center gap-2 text-sm text-white/80 md:text-base">
            <Rating rate={details.vote_average || 0} />
            {details.runtime && (
              <>
                <span className="text-white/30">&bull;</span>
                <div className="flex items-center gap-1">
                  <Clock />
                  <span>{movieDurationString(details.runtime)}</span>
                </div>
              </>
            )}
            {releaseYear && (
              <>
                <span className="text-white/30">&bull;</span>
                <div className="flex items-center gap-1">
                  <Calendar />
                  <span>{releaseYear}</span>
                </div>
              </>
            )}
          </div>

          <Genres genres={details.genres} type="movie" />

          <p className="line-clamp-3 text-sm leading-relaxed text-white/60 md:text-base max-w-xl">
            {details.overview}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 max-md:pt-2">
          <Button
            as={Link}
            href={`/movie/${details.id}/player`}
            size="md"
            color="primary"
            variant="shadow"
            radius="full"
            className="min-w-0 bg-primary px-7 font-bold text-white play-button-hover md:size-lg md:px-10 md:text-base"
            startContent={<Icon icon="solar:play-circle-bold" fontSize={24} />}
          >
            Play Now
          </Button>
          <Button
            as={Link}
            href={`/movie/${details.id}`}
            size="md"
            variant="flat"
            radius="full"
            className="min-w-0 glass-effect px-6 font-semibold text-white hover:bg-white/15 md:size-lg md:px-8"
            startContent={<Icon icon="solar:info-circle-bold" fontSize={22} />}
          >
            More Info
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
