'use client';

import { getChapterPagesByNumber, getAdjacentChapters } from '@/api/mangadex';
import { Button, Skeleton } from '@heroui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prevChapter, setPrevChapter] = useState<{ id: string; num: number } | null>(null);
  const [nextChapter, setNextChapter] = useState<{ id: string; num: number } | null>(null);
  const [loadingAdjacent, setLoadingAdjacent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pageErrors, setPageErrors] = useState<Set<number>>(new Set());
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      setPageErrors(new Set());
      setPrevChapter(null);
      setNextChapter(null);
      setCurrentPage(1);
      try {
        const result = await getChapterPagesByNumber(mangaTitle, chapterNumber);
        if (cancelled) return;
        setPages(result.pages);
        setTotalPages(result.totalPages);
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

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || pageRefs.current.length === 0) return;
    const mid = container.scrollTop + container.clientHeight / 2;
    for (let i = pageRefs.current.length - 1; i >= 0; i--) {
      const el = pageRefs.current[i];
      if (el && el.offsetTop <= mid) {
        setCurrentPage(i + 1);
        break;
      }
    }
  }, []);

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
    <div ref={scrollRef} onScroll={handleScroll} className="min-h-screen bg-black overflow-y-auto">
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
          <span className="text-sm font-semibold text-white drop-shadow-sm truncate max-w-[180px] md:max-w-md">
            {mangaTitle} - Ch.{chapterNumber}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {totalPages > 0 && (
            <span className="hidden sm:inline text-xs text-white/60">
              {currentPage}/{totalPages}
            </span>
          )}
          <div className="flex items-center gap-1">
            {prevChapter && (
              <Button
                size="sm"
                isIconOnly
                variant="flat"
                className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                as={Link}
                href={`/tv/${mangaId}/player?season=1&episode=${Math.floor(prevChapter.num)}`}
                isDisabled={loadingAdjacent}
              >
                <FaChevronLeft size={14} />
              </Button>
            )}
            {nextChapter && (
              <Button
                size="sm"
                isIconOnly
                variant="flat"
                className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                as={Link}
                href={`/tv/${mangaId}/player?season=1&episode=${Math.floor(nextChapter.num)}`}
                isDisabled={loadingAdjacent}
              >
                <FaChevronRight size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 pb-12">
        {pages.map((pageUrl, index) => (
          <div
            key={index}
            ref={(el) => { pageRefs.current[index] = el; }}
            className="w-full max-w-4xl"
          >
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
      <div className="sticky bottom-0 z-30 flex flex-col items-center gap-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-4">
        <span className="sm:hidden text-xs text-white/60">
          Page {currentPage}/{totalPages}
        </span>
        <div className="flex items-center justify-center gap-4">
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
              Previous
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
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
