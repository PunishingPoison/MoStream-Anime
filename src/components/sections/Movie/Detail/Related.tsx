'use client';

import MoviePosterCard from '@/components/sections/Movie/Cards/Poster';
import SectionTitle from '@/components/ui/other/SectionTitle';
import Carousel from '@/components/ui/wrapper/Carousel';
import { isEmpty } from '@/utils/helpers';

const RelatedSection: React.FC<{ movie: any }> = ({ movie }) => {
  const recommendations = movie.recommendations?.results?.slice(0, 10) || movie.similar?.results?.slice(0, 10) || [];
  if (isEmpty(recommendations)) return null;

  return (
    <section id="related" className="relative z-3">
      <SectionTitle>More Like This</SectionTitle>
      <Carousel>
        {recommendations.map((rec: any) => (
          <div key={rec.id} className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2">
            <MoviePosterCard movie={rec} />
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default RelatedSection;
