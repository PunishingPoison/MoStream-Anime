'use client';

import SectionTitle from './SectionTitle';
import { isEmpty } from '@/utils/helpers';
import { getImageUrl } from '@/utils/movies';
import Lightbox from 'yet-another-react-lightbox';
import { useState } from 'react';
import Carousel from '@/components/ui/wrapper/Carousel';

interface PhotosSectionProps {
  images: { file_path: string }[];
  type?: 'movie' | 'tv';
}

const PhotosSection: React.FC<PhotosSectionProps> = ({ images, type = 'movie' }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [errored, setErrored] = useState<Set<number>>(new Set());

  if (isEmpty(images)) return null;

  const slides = images.slice(0, 10).map((img) => ({
    src: getImageUrl(img.file_path, 'backdrop'),
  }));

  return (
    <section id="photos" className="relative z-3">
      <SectionTitle color={type === 'movie' ? 'primary' : 'warning'}>Photos</SectionTitle>
      <Carousel>
        {images.slice(0, 10).map((img, i) => (
          <div key={img.file_path} className="embla__slide shrink-0 flex items-center px-1 py-2">
            <button
              onClick={() => { setIndex(i); setOpen(true); }}
              className="shrink-0 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {errored.has(i) ? (
                <div className="h-24 w-40 md:h-32 md:w-56 bg-secondary-background rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground/40 text-xs">Failed</span>
                </div>
              ) : (
                <img
                  src={getImageUrl(img.file_path, 'backdrop')}
                  alt={`Photo ${i + 1}`}
                  className="h-24 w-40 md:h-32 md:w-56 object-cover transition-all duration-300 hover:scale-105 hover:opacity-80"
                  onError={() => setErrored((prev) => new Set(prev).add(i))}
                />
              )}
            </button>
          </div>
        ))}
      </Carousel>
      <Lightbox open={open} close={() => setOpen(false)} index={index} slides={slides} />
    </section>
  );
};

export default PhotosSection;
