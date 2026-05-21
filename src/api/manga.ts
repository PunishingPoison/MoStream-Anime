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
    title: ch.title || `Chapter ${ch.chapterNumber}`,
    chapterNumber: ch.chapterNumber ?? 0,
  }));
}

export async function getChapterPages(chapterId: string, provider?: string): Promise<string[]> {
  const url = provider ? `${API_BASE}/chapter?id=${encodeURIComponent(chapterId)}&provider=${provider}` : `${API_BASE}/chapter?id=${encodeURIComponent(chapterId)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data || []).map((p: any) => p.img).filter(Boolean);
}

export async function getChapterPagesByNumber(
  mangaTitle: string,
  chapterNumber: number
) {
  const isServer = typeof window === 'undefined';
  const host = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3005');
  const apiUrl = isServer ? `${host}${API_BASE}/info?id=${encodeURIComponent(mangaTitle)}&isTitle=true` : `${API_BASE}/info?id=${encodeURIComponent(mangaTitle)}&isTitle=true`;

  const infoRes = await fetch(apiUrl);
  if (!infoRes.ok) throw new Error(`Failed to fetch info for "${mangaTitle}"`);
  const info = await infoRes.json();
  if (!info || !info.chapters || info.chapters.length === 0) {
    throw new Error(`No chapters found for "${mangaTitle}"`);
  }

  const chapters = info.chapters;
  
  // exact match first
  let chapter = chapters.find((c: any) => Math.abs(c.chapterNumber - chapterNumber) < 0.001);
  if (!chapter) {
    // nearest match
    const sorted = [...chapters].sort((a, b) => {
      const diff = Math.abs(a.chapterNumber - chapterNumber) - Math.abs(b.chapterNumber - chapterNumber);
      return diff;
    });
    chapter = sorted[0];
  }
  if (!chapter) throw new Error(`Chapter ${chapterNumber} not found for "${mangaTitle}"`);

  const pages = await getChapterPages(chapter.id, info.provider);
  if (!pages.length) throw new Error(`No pages found for chapter ${chapterNumber}`);

  return {
    mangaTitle: info.title || mangaTitle,
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
  try {
    const isServer = typeof window === 'undefined';
    const host = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3005');
    const apiUrl = isServer ? `${host}${API_BASE}/info?id=${encodeURIComponent(mangaTitle)}&isTitle=true` : `${API_BASE}/info?id=${encodeURIComponent(mangaTitle)}&isTitle=true`;
    
    const infoRes = await fetch(apiUrl);
    if (!infoRes.ok) return { prev: null, next: null };
    const info = await infoRes.json();
    if (!info || !info.chapters || info.chapters.length === 0) {
      return { prev: null, next: null };
    }

    const chapters = info.chapters;
    const sorted = [...chapters].sort((a: any, b: any) => a.chapterNumber - b.chapterNumber);
    
    // Find the exact chapter or nearest
    let idx = sorted.findIndex((c) => Math.abs(c.chapterNumber - chapterNumber) < 0.001);
    if (idx === -1) {
      const nearest = [...chapters].sort((a, b) => Math.abs(a.chapterNumber - chapterNumber) - Math.abs(b.chapterNumber - chapterNumber))[0];
      idx = sorted.findIndex(c => c.id === nearest.id);
    }
    
    if (idx === -1) return { prev: null, next: null };

    return {
      prev: idx > 0 ? { id: sorted[idx - 1].id, num: sorted[idx - 1].chapterNumber } : null,
      next: idx < sorted.length - 1 ? { id: sorted[idx + 1].id, num: sorted[idx + 1].chapterNumber } : null,
    };
  } catch {
    return { prev: null, next: null };
  }
}
