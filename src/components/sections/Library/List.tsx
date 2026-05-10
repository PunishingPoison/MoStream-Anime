'use client';

import BackToTopButton from '@/components/ui/button/BackToTopButton';
import ContentTypeSelection from '@/components/ui/other/ContentTypeSelection';
import useDiscoverFilters from '@/hooks/useDiscoverFilters';
import { LIBRARY_STORAGE_KEY } from '@/utils/constants';
import { cn, isEmpty } from '@/utils/helpers';
import { Trash } from '@/utils/icons';
import { TbFolder } from 'react-icons/tb';
import { Button, Select, SelectItem, Spinner } from '@heroui/react';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import MoviePosterCard from '@/components/sections/Movie/Cards/Poster';
import TvShowPosterCard from '@/components/sections/TV/Cards/Poster';
import ConfirmationModal from '@/components/ui/overlay/ConfirmationModal';
import { SavedItem } from '@/types';

const SORT_OPTIONS: { key: string; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'release_date', label: 'Release Date' },
  { key: 'vote_average', label: 'Rating' },
  { key: 'saved_date', label: 'Date Added' },
];

const LibraryList = () => {
  const { content } = useDiscoverFilters();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>('saved_date');
  const [opened, { open, close }] = useDisclosure(false);

  const loadItems = useCallback(() => {
    setLoading(true);
    try {
      const raw = localStorage.getItem(LIBRARY_STORAGE_KEY);
      const all: SavedItem[] = raw ? JSON.parse(raw) : [];
      setItems(all.filter((i) => i.type === content));
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, [content]);

  useEffect(() => {
    loadItems();
    const handler = () => loadItems();
    window.addEventListener('library-update', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('library-update', handler);
      window.removeEventListener('storage', handler);
    };
  }, [loadItems]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      switch (sortOption) {
        case 'vote_average':
        case 'release_date':
          return b[sortOption] > a[sortOption] ? 1 : -1;
        case 'saved_date':
          return new Date(b.saved_date).getTime() - new Date(a.saved_date).getTime();
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });
  }, [items, sortOption]);

  const clearAll = () => {
    try {
      const raw = localStorage.getItem(LIBRARY_STORAGE_KEY);
      const all: SavedItem[] = raw ? JSON.parse(raw) : [];
      const filtered = all.filter((i) => i.type !== content);
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(filtered));
      setItems([]);
      window.dispatchEvent(new Event('library-update'));
    } catch {}
    close();
  };

  if (loading) {
    return <Spinner size="lg" variant="simple" className="absolute-center mt-[30vh]" color={content === 'movie' ? 'primary' : 'warning'} />;
  }

  return (
    <>
      <div className="relative flex flex-col items-center justify-center gap-10">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex w-full items-center gap-3">
            <div className={cn('h-7 w-1 rounded-full md:h-8', content === 'movie' ? 'bg-primary shadow-sm shadow-primary/50' : 'bg-warning shadow-sm shadow-warning/50')} />
            <h1 className="text-2xl font-black tracking-tight md:text-3xl">My Library</h1>
            <div className="grow" />
            <ContentTypeSelection />
          </div>
          {!isEmpty(sortedItems) && (
            <div className="flex w-full flex-wrap items-center justify-center gap-3">
              <Select
                label="Sort by"
                size="sm"
                placeholder="Select sort"
                className="max-w-[180px]"
                selectedKeys={[sortOption]}
                onChange={({ target }) => setSortOption(target.value)}
                classNames={{
                  trigger: 'bg-secondary-background border border-white/10 data-[hover=true]:border-primary/30',
                  popoverContent: 'bg-secondary-background border border-white/10',
                }}
              >
                {SORT_OPTIONS.map(({ key, label }) => (
                  <SelectItem key={key} className="data-[hover=true]:bg-white/10 text-foreground">{label}</SelectItem>
                ))}
              </Select>
              <Button startContent={<Trash />} color="danger" variant="flat" onPress={open} className="font-medium">
                Clear All {content === 'movie' ? 'Movies' : 'TV Shows'}
              </Button>
            </div>
          )}
        </div>
        {isEmpty(sortedItems) ? (
          <div className="flex h-[50vh] flex-col items-center justify-center gap-6">
            <div className="rounded-2xl bg-secondary-background p-8 ring-1 ring-white/10">
              <TbFolder className="size-16 text-muted-foreground/30" />
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-muted-foreground">Your library is empty</p>
              <p className="mt-1 text-sm text-muted-foreground/50">Bookmark movies & TV shows to add them here</p>
            </div>
          </div>
        ) : (
          <div className="movie-grid">
            {sortedItems.map((item) =>
              item.type === 'tv' ? (
                <TvShowPosterCard
                  key={`tv-${item.id}`}
                  variant="bordered"
                  tv={{
                    adult: item.adult,
                    backdrop_path: item.backdrop_path,
                    first_air_date: item.release_date,
                    id: item.id,
                    name: item.title,
                    poster_path: item.poster_path || '',
                    vote_average: item.vote_average,
                  }}
                />
              ) : (
                <MoviePosterCard
                  key={`movie-${item.id}`}
                  variant="bordered"
                  movie={{
                    adult: item.adult,
                    backdrop_path: item.backdrop_path,
                    id: item.id,
                    poster_path: item.poster_path || '',
                    release_date: item.release_date,
                    title: item.title,
                    vote_average: item.vote_average,
                  }}
                />
              ),
            )}
          </div>
        )}
      </div>
      <BackToTopButton />
      <ConfirmationModal
        title={`Clear ${content === 'movie' ? 'Movies' : 'TV Shows'}?`}
        isOpen={opened}
        onClose={close}
        onConfirm={clearAll}
        confirmLabel="Clear All"
      >
        <p>Are you sure you want to remove all {content === 'movie' ? 'movies' : 'TV shows'} from your library?</p>
        <p className="text-muted-foreground text-sm">{sortedItems.length} {sortedItems.length === 1 ? 'item' : 'items'} will be removed.</p>
      </ConfirmationModal>
    </>
  );
};

export default LibraryList;
