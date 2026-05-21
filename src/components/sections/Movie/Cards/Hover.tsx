'use client';

import { tmdb } from '@/api/tmdb';
import BookmarkButton from '@/components/ui/button/BookmarkButton';
import Genres from '@/components/ui/other/Genres';
import Rating from '@/components/ui/other/Rating';
import { SavedItem } from '@/types';
import { cn, isEmpty } from '@/utils/helpers';
import { Calendar, Clock } from '@/utils/icons';
import { getImageUrl, movieDurationString, mutateMovieTitle } from '@/utils/movies';
import { Button, Chip, Image, Link, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';

const HoverPosterCard: React.FC<{ id: number; fullWidth?: boolean; type?: 'movie' | 'tv' }> = ({
  id,
  fullWidth,
  type = 'movie',
}) => {
  const { data: movie, isPending } = useQuery<any>({
    queryFn: () =>
      type === 'movie'
        ? tmdb.movies.details(id, ['images'])
        : tmdb.tvShows.details(id, ['images']),
    queryKey: [type === 'movie' ? 'get-movie-detail-on-hover-poster' : 'get-tv-detail-on-hover-poster', id],
  });

  if (isPending) {
    return (
      <div className="h-96 w-80">
        <Spinner size="lg" variant="simple" className="absolute-center" />
      </div>
    );
  }

  if (!movie) return null;

  const title = mutateMovieTitle(movie);
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : movie.first_air_date
      ? new Date(movie.first_air_date).getFullYear()
      : undefined;
  const backdropImage = getImageUrl(movie.backdrop_path, 'backdrop');
  const titleImage = !isEmpty(movie.images?.logos)
    ? getImageUrl(
        movie.images.logos.find((logo: any) => logo.iso_639_1 === 'en')?.file_path,
        'title',
      )
    : '';
  const bookmarkData: SavedItem = {
    type,
    adult: movie.adult || false,
    backdrop_path: movie.backdrop_path,
    id: movie.id,
    poster_path: movie.poster_path,
    release_date: movie.release_date || movie.first_air_date || '',
    title,
    vote_average: movie.vote_average,
    saved_date: new Date().toISOString(),
  };

  return (
    <div className={cn('w-80', { 'w-full': fullWidth })}>
      <div className="relative">
        <div className="absolute aspect-video h-fit w-full">
          <div className="absolute z-2 h-full w-full bg-linear-to-t from-secondary-background from-5%"></div>
          {!isEmpty(titleImage) && (
            <Image
              isBlurred
              radius="none"
              alt={title}
              classNames={{ wrapper: 'absolute-center z-1 bg-transparent' }}
              className="h-full max-h-32 w-full drop-shadow-xl"
              src={titleImage}
            />
          )}
          <Image
            radius="none"
            alt={title}
            loading="lazy"
            className="z-0 aspect-video rounded-t-lg object-cover object-center"
            src={backdropImage}
          />
        </div>
        <div className="flex flex-col gap-2 p-4 pt-[40%] *:z-10">
          <div className="flex gap-2">
            <Chip size="sm" color={type === 'movie' ? 'primary' : 'warning'} variant="faded" className="text-xs font-bold">
              {type === 'movie' ? 'Anime' : 'Manga'}
            </Chip>
            {movie.adult && (
              <Chip size="sm" color="danger" variant="faded">18+</Chip>
            )}
          </div>
          <h4 className="text-lg font-bold">{title}</h4>
          <div className="flex flex-wrap gap-1 text-xs *:z-10">
            <div className="flex items-center gap-1">
              <Clock />
              <span>{movieDurationString(movie.runtime)}</span>
            </div>
            <p className="text-muted-foreground/50">&bull;</p>
            <div className="flex items-center gap-1">
              <Calendar />
              <span>{releaseYear}</span>
            </div>
            <p className="text-muted-foreground/50">&bull;</p>
            <Rating rate={movie.vote_average || 0} />
          </div>
          <Genres genres={movie.genres} type={type} />
          <div className="flex w-full justify-between gap-2 py-1">
            <Button
              as={Link}
              href={type === 'movie' ? `/movie/${movie.id}/player` : `/tv/${movie.id}/player`}
              fullWidth
              color={type === 'movie' ? 'primary' : 'warning'}
              variant="shadow"
              startContent={<Icon icon="solar:play-circle-bold" fontSize={24} />}
              className="font-semibold"
            >
              Play Now
            </Button>
            <BookmarkButton data={bookmarkData} isTooltipDisabled />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default HoverPosterCard;
