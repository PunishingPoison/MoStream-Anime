'use client';

import { SpacingClasses } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import { mutateMovieTitle } from '@/utils/movies';
import { getMoviePlayers } from '@/utils/players';
import { Card, Skeleton } from '@heroui/react';
import { useDisclosure, useDocumentTitle, useIdle, useLocalStorage } from '@mantine/hooks';
import dynamic from 'next/dynamic';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import MoviePlayerHeader from './Header';
import MoviePlayerSourceSelection from './SourceSelection';
import { siteConfig } from '@/config/site';
import { ADS_WARNING_STORAGE_KEY } from '@/utils/constants';
const AdsWarning = dynamic(() => import('@/components/ui/overlay/AdsWarning'));

interface MoviePlayerProps {
  movie: any;
  startAt?: number;
}

const MoviePlayer: React.FC<MoviePlayerProps> = ({ movie, startAt }) => {
  const [seen] = useLocalStorage<boolean>({
    key: ADS_WARNING_STORAGE_KEY,
    getInitialValueInEffect: false,
  });

  const players = getMoviePlayers(movie.id, startAt);
  const title = mutateMovieTitle(movie);
  const idle = useIdle(3000);
  const [opened, handlers] = useDisclosure(false);
  const [selectedSource, setSelectedSource] = useQueryState<number>(
    'src',
    parseAsInteger.withDefault(0),
  );

  useDocumentTitle(`Play ${title} | ${siteConfig.name}`);

  const PLAYER = useMemo(() => players[selectedSource] || players[0], [players, selectedSource]);

  return (
    <>
      <AdsWarning />
      <div className={cn('relative', SpacingClasses.reset)}>
        <MoviePlayerHeader
          id={movie.id}
          movieName={title}
          onOpenSource={handlers.open}
          hidden={idle}
        />
        <Card shadow="md" radius="none" className="relative h-screen bg-black">
          <Skeleton className="absolute h-full w-full" />
          <iframe
            allowFullScreen
            key={PLAYER.title}
            src={PLAYER.source}
            className={cn('z-10 h-full w-full', { 'pointer-events-none': idle || !seen })}
          />
        </Card>
      </div>
      <MoviePlayerSourceSelection
        opened={opened}
        onClose={handlers.close}
        players={players}
        selectedSource={selectedSource}
        setSelectedSource={setSelectedSource}
      />
    </>
  );
};

export default MoviePlayer;
