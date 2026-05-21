'use client';

import { tmdb } from '@/api/tmdb';
import SectionTitle from '@/components/ui/other/SectionTitle';
import { getImageUrl } from '@/utils/movies';
import { Button } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { forwardRef, useState } from 'react';
import Link from 'next/link';
import { FaCirclePlay } from 'react-icons/fa6';
import Carousel from '@/components/ui/wrapper/Carousel';

interface TvShowsSeasonsSelectionProps {
  id: number;
  seasons: any[];
}

const TvShowsSeasonsSelection = forwardRef<HTMLDivElement, TvShowsSeasonsSelectionProps>(
  ({ id, seasons }, ref) => {
    const [activeSeason, setActiveSeason] = useState(
      seasons?.find((s) => s.season_number > 0)?.season_number || 1,
    );

    const { data: seasonData } = useQuery<any>({
      queryFn: () => tmdb.tvShows.seasonDetails(id, activeSeason),
      queryKey: ['tv-season-detail', id, activeSeason],
      enabled: !!activeSeason,
    });

    const validSeasons = seasons?.filter((s) => s.season_number > 0) || [];

    return (
      <section id="seasons" ref={ref} className="relative z-3">
        <SectionTitle color="warning">Chapters</SectionTitle>
        <div className="mt-4">
          {validSeasons.length > 0 && (
            <Carousel options={{ align: 'start', dragFree: true, slidesToScroll: 2 }}>
              {validSeasons.map((season: any) => (
                <div key={season.season_number} className="embla__slide shrink-0 flex items-center px-1 py-2">
                  <Button
                    size="sm"
                    variant={activeSeason === season.season_number ? 'solid' : 'flat'}
                    color="warning"
                    onPress={() => setActiveSeason(season.season_number)}
                    className={
                      activeSeason === season.season_number
                        ? 'font-semibold shadow-lg shadow-warning/30 scale-105'
                        : 'font-semibold opacity-70 hover:opacity-100'
                    }
                  >
                    {season.name || `Volume ${season.season_number}`}
                  </Button>
                </div>
              ))}
            </Carousel>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-4">
          {seasonData?.episodes?.map((episode: any) => (
            <div key={episode.id} className="group flex gap-4 rounded-xl bg-secondary-background/50 p-3 transition-all duration-300 hover:bg-secondary-background hover:ring-1 hover:ring-warning/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
              <div className="relative shrink-0 overflow-hidden rounded-lg">
                <img
                  src={getImageUrl(episode.still_path, 'title')}
                  alt={episode.name}
                  className="h-20 w-36 object-cover transition-all duration-300 group-hover:scale-105 md:h-24 md:w-40"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex size-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                    <FaCirclePlay className="text-white" size={16} />
                  </div>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="truncate text-sm font-bold md:text-base">
                    <span className="text-muted-foreground">Ch.{episode.episode_number}</span> {episode.name}
                  </h4>
                  {episode.air_date && (
                    <span className="shrink-0 text-xs text-muted-foreground/60">
                      {new Date(episode.air_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground/80 md:text-sm">
                  {episode.overview || 'No description available.'}
                </p>
                <div className="mt-auto flex items-center gap-2 pt-1">
                  <Button
                    as={Link}
                    href={`/tv/${id}/player?season=${episode.season_number}&episode=${episode.episode_number}`}
                    size="sm"
                    color="warning"
                    variant="flat"
                    startContent={<FaCirclePlay size={12} />}
                    className="font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-warning/20"
                  >
                    Read Chapter
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {seasonData?.episodes?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">No chapters available for this volume.</p>
            </div>
          )}
        </div>
      </section>
    );
  },
);

TvShowsSeasonsSelection.displayName = 'TvShowsSeasonsSelection';
export default TvShowsSeasonsSelection;
