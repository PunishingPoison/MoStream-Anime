'use client';

import { getChapterPagesByNumber, getAdjacentChapters } from '@/api/mangadex';
import { Button, Skeleton } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { IoChevronBack } from 'react-icons/io5';

interface MangaReaderProps {
  mangaTitle: string;
  mangaId: number;
  chapterNumber: number;
}

export default function MangaReader({ mangaTitle, mangaId, chapterNumber }: MangaReaderProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prevChapter, setPrevChapter] = useState<{ id: string; num: number } | null>(null);
  const [nextChapter, setNextChapter] = useState<{ id: string; num: number } | null>(null);
  const [loadingAdjacent, setLoadingAdjacent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pageErrors, setPageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      setPageErrors(new Set());
      setPrevChapter(null);
      setNextChapter(null);
      try {
        const result = await getChapterPagesByNumber(mangaTitle, chapterNumber);
        if (cancelled) return;
        setPages(result.pages);
        setLoadingAdjacent(true);
        getAdjacentChapters(mangaTitle, chapterNumber).then((adj) => {
          if (!cancelled) {
            setPrevChapter(adj.prev);
            setNextChapter(adj.next);
            setLoadingAdjacent(false);
          }
        });
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || 'Failed to load manga chapter');
          setLoading(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    return () => { cancelled = true; };
  }, [mangaTitle, chapterNumber]);

  function handlePageError(index: number) {
    setPageErrors((prev) => new Set(prev).add(index));
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[300px] w-full max-w-3xl rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">{error}</p>
        <Button as={Link} href={`/tv/${mangaId}`} color="warning" variant="flat">
          Back to Manga
        </Button>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="min-h-screen bg-black">
      <div className="sticky top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/60 to-transparent px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
            as={Link}
            href={`/tv/${mangaId}`}
          >
            <IoChevronBack size={24} />
          </Button>
          <span className="text-sm font-semibold text-white drop-shadow-sm truncate max-w-[200px] md:max-w-md">
            {mangaTitle} - Ch.{chapterNumber}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {prevChapter && (
            <Button
              size="sm"
              variant="flat"
              className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
              as={Link}
              href={`/tv/${mangaId}/player?season=1&episode=${Math.floor(prevChapter.num)}`}
              startContent={<FaChevronLeft size={14} />}
              isDisabled={loadingAdjacent}
            >
              Prev
            </Button>
          )}
          {nextChapter && (
            <Button
              size="sm"
              variant="flat"
              className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
              as={Link}
              href={`/tv/${mangaId}/player?season=1&episode=${Math.floor(nextChapter.num)}`}
              endContent={<FaChevronRight size={14} />}
              isDisabled={loadingAdjacent}
            >
              Next
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 pb-12">
        {pages.map((pageUrl, index) => (
          <div key={index} className="w-full max-w-4xl">
            {pageErrors.has(index) ? (
              <div className="flex h-[200px] items-center justify-center bg-[#111] text-sm text-muted-foreground">
                Failed to load page {index + 1}
              </div>
            ) : (
              <img
                src={pageUrl}
                alt={`Page ${index + 1}`}
                className="w-full h-auto"
                loading="lazy"
                onError={() => handlePageError(index)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 z-30 flex items-center justify-center gap-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-4">
        {prevChapter && (
          <Button
            size="sm"
            variant="flat"
            color="warning"
            as={Link}
            href={`/tv/${mangaId}/player?season=1&episode=${Math.floor(prevChapter.num)}`}
            startContent={<FaChevronLeft size={14} />}
            isDisabled={loadingAdjacent}
          >
            Previous Chapter
          </Button>
        )}
        {nextChapter && (
          <Button
            size="sm"
            variant="flat"
            color="warning"
            as={Link}
            href={`/tv/${mangaId}/player?season=1&episode=${Math.floor(nextChapter.num)}`}
            endContent={<FaChevronRight size={14} />}
            isDisabled={loadingAdjacent}
          >
            Next Chapter
          </Button>
        )}
      </div>
    </div>
  );
}
