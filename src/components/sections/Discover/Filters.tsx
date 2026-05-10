'use client';

import ContentTypeSelection from '@/components/ui/other/ContentTypeSelection';
import useDiscoverFilters from '@/hooks/useDiscoverFilters';
import { cn } from '@/utils/helpers';
import { Button, Select, SelectItem } from '@heroui/react';
import { useEffect, useState } from 'react';
import { tmdb } from '@/api/tmdb';

const DiscoverFilters = () => {
  const { types, content, genres, queryType, setQueryType, setGenres, resetFilters } =
    useDiscoverFilters();
  const [genreList, setGenreList] = useState<{ id: number; name: string }[]>([]);
  const isFiltered = queryType !== 'discover' || (genres && genres.size > 0);

  useEffect(() => {
    (async () => {
      try {
        const g: any = content === 'movie' ? await tmdb.genres.movie() : await tmdb.genres.tv();
        setGenreList(g.genres || []);
      } catch {}
    })();
  }, [content]);

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex w-full items-center gap-3">
        <div className={cn('h-7 w-1 rounded-full md:h-8 shrink-0', content === 'movie' ? 'bg-primary shadow-sm shadow-primary/50' : 'bg-warning shadow-sm shadow-warning/50')} />
        <h1 className="text-2xl md:text-3xl font-black tracking-tight whitespace-nowrap">Discover</h1>
        <div className="grow" />
        <ContentTypeSelection />
      </div>
      <div className="flex flex-row gap-3 w-full">
        <Select
          disallowEmptySelection
          selectionMode="single"
          size="sm"
          label="Type"
          placeholder="Select type"
          selectedKeys={[queryType]}
          onChange={({ target }) => {
            setQueryType(target.value as any);
            setGenres(null);
          }}
          classNames={{
            trigger: 'bg-secondary-background border border-white/10 data-[hover=true]:border-primary/30 h-10 min-h-10',
            value: 'text-foreground text-sm truncate',
            label: 'text-muted-foreground text-xs',
            popoverContent: 'bg-secondary-background border border-white/10 rounded-lg shadow-xl shadow-black/30',
            listboxWrapper: 'bg-secondary-background',
          }}
        >
          {types.map(({ name, key }) => (
            <SelectItem key={key} className="data-[hover=true]:bg-white/10 data-[selectable=true]:focus:bg-white/10 text-foreground text-sm">{name}</SelectItem>
          ))}
        </Select>
        <Select
          selectionMode="multiple"
          size="sm"
          label="Genres"
          placeholder="Select genres"
          selectedKeys={genres || new Set()}
          onSelectionChange={(keys) => {
            setGenres(new Set(Array.from(keys as Set<string>).filter(Boolean)));
            setQueryType('discover');
          }}
          classNames={{
            trigger: 'bg-secondary-background border border-white/10 data-[hover=true]:border-warning/30 h-10 min-h-10',
            value: 'text-foreground text-sm truncate',
            label: 'text-muted-foreground text-xs',
            popoverContent: 'bg-secondary-background border border-white/10 rounded-lg shadow-xl shadow-black/30',
            listboxWrapper: 'bg-secondary-background',
          }}
        >
          {genreList.map((g) => (
            <SelectItem key={String(g.id)} className="data-[hover=true]:bg-white/10 data-[selectable=true]:focus:bg-white/10 text-foreground text-sm">{g.name}</SelectItem>
          ))}
        </Select>
      </div>
      {isFiltered && (
        <Button size="sm" variant="flat" onPress={resetFilters} className="text-muted-foreground hover:text-foreground">
          Reset Filters
        </Button>
      )}
    </div>
  );
};

export default DiscoverFilters;
