'use client';

import { Button, Tooltip } from '@heroui/react';
import { TbBookmark, TbBookmarkFilled } from 'react-icons/tb';
import { useState, useEffect } from 'react';
import { SavedItem } from '@/types';
import { LIBRARY_STORAGE_KEY } from '@/utils/constants';

interface BookmarkButtonProps {
  data: SavedItem;
  isTooltipDisabled?: boolean;
}

function getLibrary(): SavedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LIBRARY_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLibrary(items: SavedItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items));
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ data, isTooltipDisabled = false }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const lib = getLibrary();
    setIsSaved(lib.some((i) => i.id === data.id && i.type === data.type));
  }, [data.id, data.type]);

  const toggle = () => {
    const lib = getLibrary();
    const existing = lib.findIndex((i) => i.id === data.id && i.type === data.type);
    if (existing >= 0) {
      lib.splice(existing, 1);
      setIsSaved(false);
    } else {
      lib.push(data);
      setIsSaved(true);
    }
    saveLibrary(lib);
    window.dispatchEvent(new Event('library-update'));
  };

  return (
    <Tooltip isDisabled={isTooltipDisabled} content={isSaved ? 'Remove from Library' : 'Add to Library'}>
      <Button
        isIconOnly
        size="sm"
        variant={isSaved ? 'solid' : 'light'}
        color={isSaved ? 'primary' : 'default'}
        onPress={toggle}
        className={isSaved ? '' : 'text-foreground/70 hover:text-foreground'}
      >
        {isSaved ? <TbBookmarkFilled size={18} /> : <TbBookmark size={18} />}
      </Button>
    </Tooltip>
  );
};

export default BookmarkButton;
