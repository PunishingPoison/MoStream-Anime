'use client';

import ContentTypeSelection from '@/components/ui/other/ContentTypeSelection';
import { Button, Input } from '@heroui/react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { useState } from 'react';

interface SearchFilterProps {
  isLoading: boolean;
  onSearchSubmit: (value: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ isLoading, onSearchSubmit }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearchSubmit(query.trim());
  };

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-6">
      <div className="flex items-center gap-3 self-start">
        <div className="h-7 w-1 rounded-full bg-primary shadow-sm shadow-primary/50 md:h-8" />
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">Search</h1>
      </div>
      <ContentTypeSelection />
      <form onSubmit={handleSubmit} className="flex w-full gap-3">
        <Input
          placeholder="Search anime & manga..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          startContent={<BiSearchAlt2 className="text-muted-foreground/40" size={20} />}
          className="flex-1"
          size="lg"
          radius="full"
          classNames={{
            input: 'text-base',
            inputWrapper: 'bg-secondary-background border border-white/10 data-[hover=true]:border-primary/30 data-[focus=true]:border-primary/50 data-[focus=true]:ring-1 data-[focus=true]:ring-primary/20 transition-all duration-300',
          }}
        />
        <Button type="submit" color="primary" isLoading={isLoading} radius="full" className="px-6 font-semibold shadow-lg shadow-primary/30">
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchFilter;
