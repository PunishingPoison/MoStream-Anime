'use client';

import { useWindowScroll } from '@mantine/hooks';
import { getImageUrl } from '@/utils/movies';
import { useState } from 'react';

const TvShowBackdropSection: React.FC<{ tv: any }> = ({ tv }) => {
  const [{ y }] = useWindowScroll();
  const opacity = Math.min((y / 800) * 2, 1);
  const backdropImage = getImageUrl(tv?.backdrop_path, 'backdrop');
  const titleImage = tv?.images?.logos
    ? getImageUrl(tv.images.logos.find((logo: any) => logo.iso_639_1 === 'en')?.file_path, 'title')
    : '';
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <section id="backdrop" className="fixed top-0 left-0 right-0 h-[40vh] md:h-[55vh] lg:h-[75vh] overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      <div className="absolute inset-0 bg-background pointer-events-none" style={{ opacity, zIndex: 10 }} />
      <div className="absolute inset-0 bg-linear-to-b from-background from-1% via-transparent via-35% pointer-events-none" style={{ zIndex: 2 }} />
      <div className="absolute inset-0 translate-y-px bg-linear-to-t from-background from-1% via-transparent via-60% pointer-events-none" style={{ zIndex: 2 }} />
      {titleImage && (
        <img
          alt={tv?.name}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent w-[28vh] max-w-80 drop-shadow-2xl md:w-[60vh] pointer-events-none"
          style={{ zIndex: 1 }}
          src={titleImage}
        />
      )}
      {!imgLoaded && !imgError && (
        <div className="absolute inset-0 bg-secondary-background animate-pulse pointer-events-none" style={{ zIndex: 0 }} />
      )}
      {!imgError && (
        <img
          alt={tv?.name || ''}
          className="h-full w-full object-cover object-center pointer-events-none"
          style={{ zIndex: 0 }}
          src={backdropImage}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}
    </section>
  );
};

export default TvShowBackdropSection;
