'use client';

import SectionTitle from '@/components/ui/other/SectionTitle';
import { getImageUrl } from '@/utils/movies';
import { isEmpty } from '@/utils/helpers';
import Carousel from '@/components/ui/wrapper/Carousel';

const TvShowCastsSection: React.FC<{ casts: any[] }> = ({ casts }) => {
  if (isEmpty(casts)) return null;

  return (
    <section id="casts" className="relative z-3">
      <SectionTitle color="warning">Top Casts</SectionTitle>
      <Carousel>
        {casts.slice(0, 10).map((cast: any) => (
          <div key={cast.id} className="embla__slide shrink-0 flex flex-col items-center gap-1 text-center px-1 py-2 min-w-[100px] max-w-[100px] transition duration-200 hover:scale-105">
            <div className="overflow-hidden rounded-full ring-2 ring-white/10 transition-all duration-300 hover:ring-warning/60 hover:ring-3">
              <img
                src={getImageUrl(cast.profile_path, 'title')}
                alt={cast.name}
                className="h-20 w-20 object-cover rounded-full"
              />
            </div>
            <p className="truncate text-xs font-semibold w-full">{cast.name}</p>
            <p className="truncate text-[10px] text-muted-foreground/70 w-full">{cast.character}</p>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default TvShowCastsSection;
