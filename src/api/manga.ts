const API_BASE = '/api/manga';

interface MangaChapter {
  id: string;
  title: string;
  chapterNumber: number;
}

interface MangaResult {
  id: string;
  title: string;
  image?: string;
}

function extractChapterNumber(title: string): number {
  const match = title.match(/(?:Ch\.|Chapter|Chapitre|Capítulo|Capitulo)\s*(\d+(?:\.\d+)?)/i);
  if (match) return parseFloat(match[1]);
  const numMatch = title.match(/^(\d+(?:\.\d+)?)/);
  if (numMatch) return parseFloat(numMatch[1]);
  return 0;
}

async function searchManga(query: string): Promise<MangaResult | null> {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return null;
  const data = await res.json();
  const results: MangaResult[] = (data.results || []).map((r: any) => ({
    id: r.id,
    title: typeof r.title === 'string' ? r.title : r.title?.userPreferred || r.title?.english || r.title?.romaji || '',
    image: r.image || '',
  }));
  const lower = query.toLowerCase();
  const exact = results.find(
    (r) => r.title.toLowerCase() === lower || r.title.toLowerCase().includes(lower)
  );
  return exact || results[0] || null;
}

async function getMangaChapters(mangaId: string): Promise<MangaChapter[]> {
  const res = await fetch(`${API_BASE}/info?id=${encodeURIComponent(mangaId)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.chapters || []).map((ch: any) => ({
    id: ch.id,
    title: ch.title || '',
    chapterNumber: extractChapterNumber(ch.title || ''),
  }));
}

async function getChapterPages(chapterId: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}/chapter?id=${encodeURIComponent(chapterId)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data || []).map((p: any) => p.img).filter(Boolean);
}

export async function getChapterPagesByNumber(
  mangaTitle: string,
  chapterNumber: number
) {
  const manga = await searchManga(mangaTitle);
  if (!manga) throw new Error(`Manga "${mangaTitle}" not found`);

  const chapters = await getMangaChapters(manga.id);
  if (!chapters.length) throw new Error(`No chapters found for "${mangaTitle}"`);

  const sorted = [...chapters].sort((a, b) => {
    const diff = Math.abs(a.chapterNumber - chapterNumber) - Math.abs(b.chapterNumber - chapterNumber);
    return diff;
  });
  const chapter = sorted[0];
  if (!chapter) throw new Error(`Chapter ${chapterNumber} not found for "${mangaTitle}"`);

  const pages = await getChapterPages(chapter.id);
  if (!pages.length) throw new Error(`No pages found for chapter ${chapterNumber}`);

  return {
    mangaTitle: manga.title,
    chapterId: chapter.id,
    chapterNumber: chapter.chapterNumber,
    chapterTitle: chapter.title || `Chapter ${chapter.chapterNumber}`,
    pages,
    totalPages: pages.length,
  };
}

export async function getAdjacentChapters(
  mangaTitle: string,
  chapterNumber: number
): Promise<{ prev: { id: string; num: number } | null; next: { id: string; num: number } | null }> {
  const manga = await searchManga(mangaTitle);
  if (!manga) return { prev: null, next: null };

  const chapters = await getMangaChapters(manga.id);
  if (!chapters.length) return { prev: null, next: null };

  const sorted = [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber);
  const idx = sorted.findIndex((c) => c.chapterNumber === chapterNumber);
  if (idx === -1) return { prev: null, next: null };

  return {
    prev: idx > 0 ? { id: sorted[idx - 1].id, num: sorted[idx - 1].chapterNumber } : null,
    next: idx < sorted.length - 1 ? { id: sorted[idx + 1].id, num: sorted[idx + 1].chapterNumber } : null,
  };
}
