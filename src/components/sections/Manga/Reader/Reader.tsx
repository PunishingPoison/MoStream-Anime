'use client';

import { getChapterPagesByNumber, getAdjacentChapters } from '@/api/mangadex';
import { Button, Skeleton } from '@heroui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa6';
import { IoChevronBack } from 'react-icons/io5';
import { BiError } from 'react-icons/bi';

const PRELOAD_COUNT = 3;

interface MangaReaderProps {
  mangaTitle: string;
  mangaId: number;
  chapterNumber: number;
}

export default function MangaReader({ mangaTitle, mangaId, chapterNumber }: MangaReaderProps) {
  const [chapterData, setChapterData] = useState<{
    pages: string[];
    baseUrl: string;
    totalPages: number;
  } | null>(null);
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prevChapter, setPrevChapter] = useState<{ id: string; num: number } | null>(null);
  const [nextChapter, setNextChapter] = useState<{ id: string; num: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [failedPages, setFailedPages] = useState<Set<number>>(new Set());
  const [retrying, setRetrying] = useState<Set<number>>(new Set());
  const [loadedCount, setLoadedCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterIdRef = useRef<string | null>(null);
  const qualityRef = useRef<string>('data');

  const loadChapter = useCallback(async (title: string, chNum: number) => {
    setLoading(true);
    setError('');
    setFailedPages(new Set());
    setRetrying(new Set());
    setChapterData(null);
    setChapterId(null);
    setLoadedCount(0);
    setCurrentPage(1);
    chapterIdRef.current = null;

    try {
      const result = await getChapterPagesByNumber(title, chNum);
      setChapterData({
        pages: result.pages,
        baseUrl: result.baseUrl || '',
        totalPages: result.totalPages,
      });
      setChapterId(result.chapterId);
      chapterIdRef.current = result.chapterId;
      qualityRef.current = 'data';
      setLoading(false);

      getAdjacentChapters(title, chNum).then((adj) => {
        setPrevChapter(adj.prev);
        setNextChapter(adj.next);
      });
    } catch (e: any) {
      setError(e.message || 'Failed to load manga chapter');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChapter(mangaTitle, chapterNumber);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [mangaTitle, chapterNumber, loadChapter]);

  const retryPages = useCallback(async (failedIndices: number[]) => {
    const cid = chapterIdRef.current;
    if (!cid) return;

    setRetrying((prev) => {
      const next = new Set(prev);
      failedIndices.forEach((i) => next.add(i));
      return next;
    });

    try {
      const res = await fetch(`/api/manga/at-home/${cid}?quality=${qualityRef.current}`);
      if (!res.ok) return;
      const data = await res.json();

      setChapterData((prev) => {
        if (!prev) return prev;
        const newPages = [...prev.pages];
        for (const idx of failedIndices) {
          if (idx < newPages.length && idx < data.pages.length) {
            newPages[idx] = data.pages[idx];
          }
        }
        return { ...prev, pages: newPages, baseUrl: data.baseUrl };
      });
    } catch {
      // retry failed
    } finally {
      setRetrying(new Set());
    }
  }, []);

  const handleImageError = useCallback(
    (index: number) => {
      setFailedPages((prev) => new Set(prev).add(index));
      retryPages([index]);
    },
    [retryPages]
  );

  const handleImageLoad = useCallback(
    (index: number) => {
      setLoadedCount((prev) => Math.max(prev, index + 1));
    },
    []
  );

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
        <BiError size={48} className="text-muted-foreground/40" />
        <p className="text-lg text-muted-foreground">{error}</p>
        <Button as={Link} href={`/tv/${mangaId}`} color="warning" variant="flat">
          Back to Manga
        </Button>
      </div>
    );
  }

  if (!chapterData) return null;

  const { pages, totalPages } = chapterData;

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
          <span className="hidden sm:inline text-xs text-white/60 tabular-nums">
            {currentPage}/{totalPages}
          </span>
          <div className="flex items-center gap-1">
            {prevChapter && (
              <Button
                size="sm"
                isIconOnly
                variant="flat"
                className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                as={Link}
                href={`/tv/${mangaId}/player?season=1&episode=${Math.floor(prevChapter.num)}`}
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
              >
                <FaChevronRight size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 pb-12">
        {pages.map((pageUrl, index) => {
          const isPreload = index <= loadedCount + PRELOAD_COUNT;
          const isFailed = failedPages.has(index);
          const isRetrying = retrying.has(index);

          return (
            <div
              key={index}
              ref={(el) => { pageRefs.current[index] = el; }}
              className="w-full max-w-4xl"
            >
              {isFailed && !isRetrying ? (
                <div className="flex flex-col items-center justify-center gap-3 h-[300px] bg-[#111] text-sm text-muted-foreground">
                  <BiError size={32} className="text-red-400/60" />
                  <p>Failed to load page {index + 1}</p>
                  <Button
                    size="sm"
                    variant="flat"
                    className="text-xs"
                    onPress={() => retryPages([index])}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  {isRetrying && (
                    <div className="flex items-center justify-center h-[300px] bg-[#111]">
                      <Skeleton className="h-full w-full rounded-none" />
                    </div>
                  )}
                  <img
                    src={pageUrl}
                    alt={`Page ${index + 1}`}
                    className={`w-full h-auto ${isRetrying ? 'hidden' : ''}`}
                    loading={isPreload ? 'eager' : 'lazy'}
                    onError={() => handleImageError(index)}
                    onLoad={() => handleImageLoad(index)}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 z-30 flex flex-col items-center gap-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-4">
        <span className="sm:hidden text-xs text-white/60 tabular-nums">
          <FaCheck className="inline mr-1 text-green-400" size={10} />
          Page {currentPage}/{totalPages}
        </span>
        <div className="flex items-center justify-center gap-3">
          {prevChapter && (
            <Button
              size="sm"
              variant="flat"
              color="warning"
              as={Link}
              href={`/tv/${mangaId}/player?season=1&episode=${Math.floor(prevChapter.num)}`}
              startContent={<FaChevronLeft size={14} />}
            >
              Prev
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
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
