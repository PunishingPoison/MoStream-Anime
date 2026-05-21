'use client';

import { cn } from '@/utils/helpers';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { IoChevronBack, IoLayersOutline } from 'react-icons/io5';

interface MoviePlayerHeaderProps {
  id: number;
  movieName: string;
  season?: number;
  episode?: number;
  onOpenSource: () => void;
  hidden: boolean;
}

const MoviePlayerHeader: React.FC<MoviePlayerHeaderProps> = ({ id, movieName, season, episode, onOpenSource, hidden }) => {
  return (
    <div
      className={cn(
        'fixed left-0 right-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/60 to-transparent px-4 py-4 transition-opacity duration-500',
        hidden ? 'opacity-0 pointer-events-none' : 'opacity-100',
      )}
    >
      <div className="flex items-center gap-3">
        <Button isIconOnly size="sm" variant="light" className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20" as={Link} href={`/movie/${id}`}>
          <IoChevronBack size={24} />
        </Button>
        <span className="text-sm font-semibold text-white drop-shadow-sm truncate max-w-[200px] md:max-w-md">
          {movieName}{season && episode ? ` - S${season}:E${episode}` : ''}
        </span>
      </div>
      <Button
        size="sm"
        variant="flat"
        className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-medium"
        startContent={<IoLayersOutline size={16} />}
        onPress={onOpenSource}
      >
        Source
      </Button>
    </div>
  );
};

export default MoviePlayerHeader;
