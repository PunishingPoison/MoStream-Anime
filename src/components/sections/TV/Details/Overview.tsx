'use client';

import { Image, Chip, Button } from '@heroui/react';
import { getImageUrl, mutateTvShowTitle } from '@/utils/movies';
import BookmarkButton from '@/components/ui/button/BookmarkButton';
import { SavedItem } from '@/types';
import Rating from '@/components/ui/other/Rating';
import Genres from '@/components/ui/other/Genres';
import SectionTitle from '@/components/ui/other/SectionTitle';
import Trailer from '@/components/ui/overlay/Trailer';
import { Calendar, List, Season } from '@/utils/icons';
import Link from 'next/link';
import { FaCirclePlay } from 'react-icons/fa6';
import { useDocumentTitle } from '@mantine/hooks';
import { siteConfig } from '@/config/site';

interface TvShowOverviewSectionProps {
  tv: any;
  onViewEpisodesClick: () => void;
}

const TvShowOverviewSection: React.FC<TvShowOverviewSectionProps> = ({ tv, onViewEpisodesClick }) => {
  const firstReleaseYear = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : '';
  const lastReleaseYear = tv.last_air_date ? new Date(tv.last_air_date).getFullYear() : '';
  const releaseYears = `${firstReleaseYear}${firstReleaseYear !== lastReleaseYear ? ` - ${lastReleaseYear}` : ''}`;
  const posterImage = getImageUrl(tv.poster_path);
  const title = mutateTvShowTitle(tv);
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

  useDocumentTitle(`${title} | ${siteConfig.name}`);

  return (
    <section id="overview" className="relative z-3 flex flex-col gap-6 md:gap-8 pt-[20vh] md:pt-[40vh]">
      <div className="flex flex-col md:grid md:grid-cols-[auto_1fr] md:gap-10">
        <div className="flex gap-4 md:gap-0 md:flex-col">
          <div className="w-24 shrink-0 md:hidden">
            <Image isBlurred alt={title} classNames={{ wrapper: 'aspect-2/3 shadow-xl' }} className="rounded-lg object-cover object-center ring-1 ring-white/10" src={posterImage} />
          </div>
          <div className="hidden md:block">
            <Image isBlurred alt={title} classNames={{ wrapper: 'w-56 max-h-min aspect-2/3 shadow-2xl' }} className="rounded-xl object-cover object-center ring-1 ring-white/10" src={posterImage} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-end gap-2 md:hidden">
            <div className="flex gap-2">
              <Chip color="warning" variant="faded" className="text-xs font-bold">Manga</Chip>
              {tv.adult && <Chip color="danger" variant="faded">18+</Chip>}
            </div>
            <h2 className="text-xl font-black">{title}</h2>
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <Season /><span>{tv.number_of_seasons} Volume{tv.number_of_seasons > 1 ? 's' : ''}</span>
              <span className="text-muted-foreground/50 mx-0.5">&bull;</span>
              <List /><span>{tv.number_of_episodes} Chapter{tv.number_of_episodes > 1 ? 's' : ''}</span>
              <span className="text-muted-foreground/50 mx-0.5">&bull;</span>
              <Calendar /><span>{releaseYears}</span>
              <span className="text-muted-foreground/50 mx-0.5">&bull;</span>
              <Rating rate={tv.vote_average || 0} />
            </div>
            <Genres genres={tv.genres} type="tv" />
          </div>
        </div>
        <div className="flex flex-col gap-6 mt-4 md:mt-0">
          <div id="title" className="flex-col gap-1 md:gap-2 hidden md:flex">
            <div className="flex gap-2">
              <Chip color="warning" variant="faded" className="text-xs font-bold">Manga</Chip>
              {tv.adult && <Chip color="danger" variant="faded">18+</Chip>}
            </div>
            <h2 className="text-2xl font-black md:text-4xl md:mt-1">{title}</h2>
            <div className="flex flex-wrap gap-1 text-xs md:text-sm md:gap-2">
              <div className="flex items-center gap-1"><Season /><span>{tv.number_of_seasons} Volume{tv.number_of_seasons > 1 ? 's' : ''}</span></div>
              <p className="text-muted-foreground/50">&bull;</p>
              <div className="flex items-center gap-1"><List /><span>{tv.number_of_episodes} Chapter{tv.number_of_episodes > 1 ? 's' : ''}</span></div>
              <p className="text-muted-foreground/50">&bull;</p>
              <div className="flex items-center gap-1"><Calendar /><span>{releaseYears}</span></div>
              <p className="text-muted-foreground/50">&bull;</p>
              <Rating rate={tv.vote_average} count={tv.vote_count} />
            </div>
            <Genres genres={tv.genres} type="tv" />
          </div>
          <div id="action" className="flex w-full flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Button color="warning" variant="shadow" onPress={onViewEpisodesClick} startContent={<FaCirclePlay size={22} />} className="font-semibold px-6 play-button-hover">View Chapters</Button>
              <Trailer color="warning" videos={tv.videos?.results} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
                  <Button as={Link} href={`/tv/${tv.id}/player`} variant="flat" color="warning" startContent={<FaCirclePlay size={14} />} className="font-medium">Read from Start</Button>
              <BookmarkButton data={bookmarkData} />
            </div>
          </div>
          <div id="story" className="flex flex-col gap-2">
            <SectionTitle color="warning">Story Line</SectionTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">{tv.overview}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TvShowOverviewSection;
