import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { EmblaOptionsType } from 'embla-carousel';

export const useCustomCarousel = (options?: EmblaOptionsType) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const id = requestAnimationFrame(() => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    });
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
    return () => {
      cancelAnimationFrame(id);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const safeEmblaRef = useCallback((node: HTMLDivElement | null) => {
    emblaRef(node);
  }, [emblaRef]);

  return { emblaRef: safeEmblaRef, canScrollPrev, canScrollNext, scrollPrev, scrollNext };
};
