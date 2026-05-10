'use client';

import useDiscoverFilters from '@/hooks/useDiscoverFilters';
import { cn } from '@/utils/helpers';
import { Button } from '@heroui/react';

interface ContentTypeSelectionProps {
  className?: string;
}

const ContentTypeSelection: React.FC<ContentTypeSelectionProps> = ({ className }) => {
  const { content, setContent } = useDiscoverFilters();

  return (
    <div className={cn('inline-flex rounded-full bg-secondary-background p-0.5 ring-1 ring-white/10', className)}>
      <Button
        size="sm"
        variant={content === 'movie' ? 'solid' : 'light'}
        color="primary"
        onPress={() => setContent('movie')}
        className={cn(
          'min-w-0 rounded-full px-5 font-semibold transition-all duration-300',
          content === 'movie'
            ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-105'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        Movies
      </Button>
      <Button
        size="sm"
        variant={content === 'tv' ? 'solid' : 'light'}
        color="warning"
        onPress={() => setContent('tv')}
        className={cn(
          'min-w-0 rounded-full px-5 font-semibold transition-all duration-300',
          content === 'tv'
            ? 'bg-warning text-white shadow-lg shadow-warning/40 scale-105'
            : 'text-muted-foreground hover:text-foreground',
        )}
      >
        TV Shows
      </Button>
    </div>
  );
};

export default ContentTypeSelection;
