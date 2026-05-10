'use client';

import { tmdb } from '@/api/tmdb';
import BookmarkButton from '@/components/ui/button/BookmarkButton';
import Genres from '@/components/ui/other/Genres';
import Rating from '@/components/ui/other/Rating';
import { SavedItem } from '@/types';
import { cn, isEmpty } from '@/utils/helpers';
import { Calendar, List, Season } from '@/utils/icons';
import { getImageUrl, mutateTvShowTitle } from '@/utils/movies';
import { Button, Chip, Image, Link, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useQuery } from '@tanstack/react-query';

const TvShowHoverCard: React.FC<{ id: number; fullWidth?: boolean }> = ({ id, fullWidth }) => {
  const { data: tv, isPending } = useQuery<any>({
    queryFn: () => tmdb.tvShows.details(id, ['images']),
    queryKey: ['get-tv-detail-on-hover-poster', id],
  });

  if (isPending) {
    return (
      <div className="h-96 w-80">
        <Spinner size="lg" variant="simple" className="absolute-center" />
      </div>
    );
  }

  if (!tv) return null;

  const title = mutateTvShowTitle(tv);
  const firstReleaseYear = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : '';
  const lastReleaseYear = tv.last_air_date ? new Date(tv.last_air_date).getFullYear() : '';
  const releaseYears = `${firstReleaseYear}${firstReleaseYear !== lastReleaseYear ? ` - ${lastReleaseYear}` : ''}`;
  const backdropImage = getImageUrl(tv.backdrop_path, 'backdrop');
  const titleImage = !isEmpty(tv.images?.logos)
    ? getImageUrl(tv.images.logos.find((logo: any) => logo.iso_639_1 === 'en')?.file_path, 'title')
    : '';
  const bookmarkData: SavedItem = {
    type: 'tv',
    adult: tv.adult || false,
    backdrop_path: tv.backdrop_path,
    id: tv.id,
    poster_path: tv.poster_path,
    release_date: tv.first_air_date || '',
    title,
    vote_average: tv.vote_average,
    saved_date: new Date().toISOString(),
  };

  return (
    <div className={cn('w-80', { 'w-full': fullWidth })}>
      <div className="relative">
        <div className="absolute aspect-video h-fit w-full">
          <div className="absolute z-2 h-full w-full bg-linear-to-t from-secondary-background from-5%"></div>
          {!isEmpty(titleImage) && (
            <Image isBlurred radius="none" alt={title} classNames={{ wrapper: 'absolute-center z-1 bg-transparent' }} className="h-full max-h-32 w-full drop-shadow-xl" src={titleImage} />
          )}
          <Image radius="none" alt={title} loading="lazy" className="z-0 aspect-video rounded-t-lg object-cover object-center" src={backdropImage} />
        </div>
        <div className="flex flex-col gap-2 p-4 pt-[40%] *:z-10">
          <div className="flex gap-2">
            <Chip size="sm" color="warning" variant="faded" className="text-xs font-bold">TV</Chip>
            {tv.adult && <Chip size="sm" color="danger" variant="faded">18+</Chip>}
          </div>
          <h4 className="text-lg font-bold">{title}</h4>
          <div className="flex flex-wrap gap-1 text-xs *:z-10">
            <div className="flex items-center gap-1"><Season /><span>{tv.number_of_seasons} Season{tv.number_of_seasons > 1 ? 's' : ''}</span></div>
            <p className="text-muted-foreground/50">&bull;</p>
            <div className="flex items-center gap-1"><List /><span>{tv.number_of_episodes} Episode{tv.number_of_episodes > 1 ? 's' : ''}</span></div>
            <p className="text-muted-foreground/50">&bull;</p>
            <div className="flex items-center gap-1"><Calendar /><span>{releaseYears}</span></div>
            <p className="text-muted-foreground/50">&bull;</p>
            <Rating rate={tv.vote_average || 0} />
          </div>
          <Genres genres={tv.genres} type="tv" />
          <div className="flex w-full justify-between gap-2 py-1">
            <Button as={Link} href={`/tv/${tv.id}/player`} fullWidth color="warning" variant="shadow" startContent={<Icon icon="solar:play-circle-bold" fontSize={24} />} className="font-semibold">Play Now</Button>
            <BookmarkButton data={bookmarkData} isTooltipDisabled />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">{tv.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default TvShowHoverCard;
