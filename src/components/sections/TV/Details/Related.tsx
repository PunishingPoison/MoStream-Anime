'use client';

import TvShowPosterCard from '@/components/sections/TV/Cards/Poster';
import SectionTitle from '@/components/ui/other/SectionTitle';
import Carousel from '@/components/ui/wrapper/Carousel';
import { isEmpty } from '@/utils/helpers';

const TvShowRelatedSection: React.FC<{ tv: any }> = ({ tv }) => {
  const recommendations = tv.recommendations?.results?.slice(0, 10) || tv.similar?.results?.slice(0, 10) || [];
  if (isEmpty(recommendations)) return null;

  return (
    <section id="related" className="relative z-3">
      <SectionTitle color="warning">More Like This</SectionTitle>
      <Carousel>
        {recommendations.map((rec: any) => (
          <div key={rec.id} className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2">
            <TvShowPosterCard tv={rec} />
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default TvShowRelatedSection;
