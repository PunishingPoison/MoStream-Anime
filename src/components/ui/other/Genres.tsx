import { Chip } from '@heroui/react';

interface GenresProps {
  genres?: { id: number; name: string }[];
  type?: 'movie' | 'tv';
}

const Genres: React.FC<GenresProps> = ({ genres, type = 'movie' }) => {
  if (!genres?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {genres.slice(0, 3).map((genre) => (
        <Chip
          key={genre.id}
          size="sm"
          variant="flat"
          color={type === 'movie' ? 'primary' : 'warning'}
          className="text-xs font-medium"
          classNames={{
            base: 'backdrop-blur-sm',
          }}
        >
          {genre.name}
        </Chip>
      ))}
    </div>
  );
};

export default Genres;
