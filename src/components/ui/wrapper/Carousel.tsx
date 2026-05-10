'use client';

import { useCustomCarousel } from '@/hooks/useCustomCarousel';
import { ScrollShadow } from '@heroui/react';
import IconButton from '../button/IconButton';
import { EmblaOptionsType } from 'embla-carousel';
import { cn } from '@/utils/helpers';
import styles from '@/styles/embla-carousel.module.css';
import { ChevronLeft, ChevronRight } from '@/utils/icons';
import { useState } from 'react';

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  withScrollShadow?: boolean;
  isButtonDisabled?: boolean;
  options?: EmblaOptionsType;
  classNames?: {
    container?: string;
    viewport?: string;
    wrapper?: string;
  };
}

const Carousel = ({
  children,
  withScrollShadow = true,
  isButtonDisabled = false,
  options = { dragFree: true, slidesToScroll: 'auto' },
  classNames,
}: CarouselProps) => {
  const c = useCustomCarousel(options);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ScrollShadow
      isEnabled={withScrollShadow}
      orientation="horizontal"
      visibility={c.canScrollPrev && c.canScrollNext ? 'both' : c.canScrollPrev ? 'left' : c.canScrollNext ? 'right' : 'none'}
      size={60}
      hideScrollBar
    >
      <div
        className={cn(styles.wrapper, classNames?.wrapper, {
          'relative flex w-full flex-col justify-center': !isButtonDisabled,
        })}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isButtonDisabled && (
          <>
            <div className={cn(
              'absolute left-0 top-0 z-10 flex h-full items-center opacity-0 transition-all duration-300',
              isHovered && 'opacity-100',
            )}>
              <IconButton
                onPress={c.scrollPrev}
                size="sm"
                radius="full"
                disableRipple
                icon={<ChevronLeft size={22} />}
                className={cn(
                  'ml-1.5 size-10 bg-primary text-white shadow-lg shadow-primary/30 backdrop-blur-sm transition-all duration-200 hover:bg-primary/90 hover:scale-110 md:size-12',
                  { hidden: !c.canScrollPrev },
                )}
              />
            </div>
            <div className={cn(
              'absolute right-0 top-0 z-10 flex h-full items-center opacity-0 transition-all duration-300',
              isHovered && 'opacity-100',
            )}>
              <IconButton
                onPress={c.scrollNext}
                size="sm"
                radius="full"
                disableRipple
                icon={<ChevronRight size={22} />}
                className={cn(
                  'mr-1.5 size-10 bg-primary text-white shadow-lg shadow-primary/30 backdrop-blur-sm transition-all duration-200 hover:bg-primary/90 hover:scale-110 md:size-12',
                  { hidden: !c.canScrollNext },
                )}
              />
            </div>
          </>
        )}
        <div className={cn(styles.viewport, classNames?.viewport)} ref={c.emblaRef}>
          <div className={cn(styles.container, classNames?.container)}>{children}</div>
        </div>
      </div>
    </ScrollShadow>
  );
};

export default Carousel;
