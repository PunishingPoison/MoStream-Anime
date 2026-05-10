'use client';

import Rating from '@/components/ui/other/Rating';
import VaulDrawer from '@/components/ui/overlay/VaulDrawer';
import useBreakpoints from '@/hooks/useBreakpoints';
import useDeviceVibration from '@/hooks/useDeviceVibration';
import { cn } from '@/utils/helpers';
import { getImageUrl, mutateTvShowTitle } from '@/utils/movies';
import { Card, CardBody, CardFooter, CardHeader, Chip, Image, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useDisclosure, useHover } from '@mantine/hooks';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useLongPress } from 'use-long-press';
import TvShowHoverCard from './Hover';

interface TvShowPosterCardProps {
  tv: any;
  variant?: 'full' | 'bordered';
}

const TvShowPosterCard: React.FC<TvShowPosterCardProps> = ({ tv, variant = 'full' }) => {
  const { hovered, ref } = useHover();
  const [opened, handlers] = useDisclosure(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const releaseYear = tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : '';
  const posterImage = getImageUrl(tv.poster_path);
  const title = mutateTvShowTitle(tv);
  const { mobile } = useBreakpoints();
  const { startVibration } = useDeviceVibration();

  const callback = useCallback(() => {
    handlers.open();
    setTimeout(() => startVibration([100]), 300);
  }, []);

  const longPress = useLongPress(mobile ? callback : null, {
    cancelOnMovement: true,
    threshold: 300,
  });

  return (
    <>
      <Tooltip
        isDisabled={mobile}
        showArrow
        className="bg-secondary-background p-0 border border-white/10"
        shadow="lg"
        delay={1000}
        placement="right-start"
        content={<TvShowHoverCard id={tv.id} />}
      >
        <Link href={`/tv/${tv.id}`} ref={ref} {...longPress()}>
          {variant === 'full' && (
            <div className="group relative aspect-2/3 overflow-hidden rounded-lg border-[2px] border-transparent text-foreground netflix-card hover:border-warning/50 hover:shadow-2xl hover:shadow-warning/30 hover:-translate-y-1">
              <div className={cn(
                'absolute-center z-20 text-white transition-all duration-300',
                hovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
              )}>
                <div className="flex size-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm ring-1 ring-white/20 md:size-20">
                  <Icon icon="line-md:play-filled" width="40" height="40" className="md:w-[56px] md:h-[56px]" />
                </div>
              </div>
              {tv.adult && (
                <Chip color="danger" size="sm" variant="flat" className="absolute left-1.5 top-1.5 z-20 bg-danger/80 backdrop-blur-sm">18+</Chip>
              )}
              <div className="absolute inset-x-0 bottom-0 z-2 h-2/3 w-full poster-gradient" />
              <div className="absolute bottom-0 z-3 flex w-full flex-col gap-1 px-2.5 py-2 md:gap-1.5 md:px-4 md:py-3">
                <h6 className="truncate text-xs font-bold drop-shadow-sm md:text-base">{title}</h6>
                <div className="flex justify-between text-[10px] md:text-xs">
                  <p className="text-white/60">{releaseYear}</p>
                  <Rating rate={tv?.vote_average} />
                </div>
              </div>
              <div className={cn('z-0 aspect-2/3 w-full', !imgLoaded && 'bg-secondary-background animate-pulse')}>
                <img
                  alt={title}
                  src={posterImage}
                  onLoad={() => setImgLoaded(true)}
                  className="z-0 aspect-2/3 h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-110"
                  style={{ opacity: imgLoaded ? 1 : 0 }}
                />
              </div>
            </div>
          )}

          {variant === 'bordered' && (
            <Card isHoverable fullWidth shadow="sm" className="group h-full border border-white/10 bg-secondary-background transition-all duration-300 hover:-translate-y-1.5 hover:border-warning/40 hover:shadow-xl hover:shadow-warning/20">
              <CardHeader className="flex items-center justify-center pb-0">
                <div className="relative size-full">
                  <div className={cn(
                    'absolute-center z-20 text-white transition-all duration-300',
                    hovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0',
                  )}>
                    <div className="flex size-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm ring-1 ring-white/20">
                      <Icon icon="line-md:play-filled" width="32" height="32" />
                    </div>
                  </div>
                  {tv.adult && (
                    <Chip color="danger" size="sm" variant="shadow" className="absolute left-2 top-2 z-20">18+</Chip>
                  )}
                  <div className="relative overflow-hidden rounded-large">
                    <Image isBlurred alt={title} className="aspect-2/3 rounded-lg object-cover object-center transition duration-500 group-hover:scale-110" src={posterImage} />
                  </div>
                </div>
              </CardHeader>
              <CardBody className="justify-end pb-1">
                <p className="text-md truncate font-bold">{title}</p>
              </CardBody>
              <CardFooter className="justify-between pt-0 text-xs">
                <p className="text-white/60">{releaseYear}</p>
                <Rating rate={tv.vote_average} />
              </CardFooter>
            </Card>
          )}
        </Link>
      </Tooltip>

      {mobile && (
        <VaulDrawer backdrop="blur" open={opened} onOpenChange={handlers.toggle} title={title} hiddenTitle>
          <TvShowHoverCard id={tv.id} fullWidth />
        </VaulDrawer>
      )}
    </>
  );
};

export default TvShowPosterCard;
