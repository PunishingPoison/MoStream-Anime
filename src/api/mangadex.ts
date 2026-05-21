const MANGADEX_API = 'https://api.mangadex.org';

const FEED_LIMIT = 500;
const RATE_LIMIT_BACKOFF = 200;

interface MdChapterFeedItem {
  id: string;
  attributes: {
    chapter: string | null;
    title: string | null;
    volume: string | null;
    pages: number;
    translatedLanguage: string;
    publishAt: string;
    readableAt: string;
    createdAt: string;
    updatedAt: string;
    isUnavailable: boolean;
  };
  relationships: { type: string; id: string; attributes?: any }[];
}

interface MdChapterResult {
  id: string;
  chapterNumber: number;
  title: string;
  pages: number;
  volume: string | null;
  language: string;
  publishAt: string;
  groupName: string;
  isUnavailable: boolean;
}

interface MdMangaResult {
  id: string;
  title: string;
  titles: Record<string, string>;
  description: string;
  year: number | null;
  status: string;
  contentRating: string;
  coverFileName: string | null;
}

async function mdFetch<T>(path: string, retries = 2): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(`${MANGADEX_API}${path}`, {
      headers: { 'User-Agent': 'MoStream-Anime/1.0' },
    });
    if (res.ok) return res.json();
    if (res.status === 429 && attempt < retries) {
      await new Promise((r) => setTimeout(r, (attempt + 1) * RATE_LIMIT_BACKOFF));
      continue;
    }
    throw new Error(`MangaDex API error: ${res.status}`);
  }
  throw new Error('MangaDex API error: max retries');
}

export function getCoverUrl(mangaId: string, fileName: string, size: '256' | '512' = '256'): string {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.${size}.jpg`;
}

function pickTitle(titles: Record<string, string>): string {
  return titles.en || titles['ja-ro'] || titles.ja || Object.values(titles)[0] || '';
}

function normalizeChapter(num: string | null | undefined): number {
  if (num == null) return 0;
  const n = parseFloat(num);
  return isNaN(n) ? 0 : n;
}

export async function searchManga(query: string, limit = 20, offset = 0): Promise<{ results: MdMangaResult[]; total: number }> {
  const data = await mdFetch<any>(
    `/manga?title=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[relevance]=desc`
  );
  const results: MdMangaResult[] = (data.data || []).map((m: any) => {
    const coverRel = (m.relationships || []).find((r: any) => r.type === 'cover_art');
    return {
      id: m.id,
      title: pickTitle(m.attributes?.title || {}),
      titles: m.attributes?.title || {},
      description: m.attributes?.description?.en || '',
      year: m.attributes?.year || null,
      status: m.attributes?.status || '',
      contentRating: m.attributes?.contentRating || '',
      coverFileName: coverRel?.attributes?.fileName || null,
    };
  });
  return { results, total: data.total || results.length };
}

export async function getMangaDetails(id: string): Promise<MdMangaResult> {
  const data = await mdFetch<any>(
    `/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`
  );
  const m = data.data;
  const coverRel = (m.relationships || []).find((r: any) => r.type === 'cover_art');
  return {
    id: m.id,
    title: pickTitle(m.attributes?.title || {}),
    titles: m.attributes?.title || {},
    description: m.attributes?.description?.en || '',
    year: m.attributes?.year || null,
    status: m.attributes?.status || '',
    contentRating: m.attributes?.contentRating || '',
    coverFileName: coverRel?.attributes?.fileName || null,
  };
}

export async function getMangaChapters(
  mangaId: string,
  lang = 'en',
  offset = 0,
  limit = FEED_LIMIT
): Promise<{ chapters: MdChapterResult[]; total: number; offset: number; limit: number }> {
  const data = await mdFetch<any>(
    `/manga/${mangaId}/feed?limit=${limit}&offset=${offset}&translatedLanguage[]=${lang}&order[chapter]=desc&includes[]=scanlation_group&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica`
  );
  const chapters: MdChapterResult[] = (data.data || [])
    .filter((c: any) => !c.attributes?.isUnavailable)
    .map((c: any) => {
      const groupRel = (c.relationships || []).find((r: any) => r.type === 'scanlation_group');
      return {
        id: c.id,
        chapterNumber: normalizeChapter(c.attributes?.chapter),
        title: c.attributes?.title || '',
        pages: c.attributes?.pages || 0,
        volume: c.attributes?.volume || null,
        language: c.attributes?.translatedLanguage || lang,
        publishAt: c.attributes?.publishAt || '',
        groupName: groupRel?.attributes?.name || 'Unknown',
        isUnavailable: !!c.attributes?.isUnavailable,
      };
    })
    .filter((c: MdChapterResult) => c.chapterNumber > 0);
  return {
    chapters,
    total: data.total || chapters.length,
    offset,
    limit,
  };
}

export async function getAllChapters(mangaId: string, lang = 'en'): Promise<MdChapterResult[]> {
  const first = await getMangaChapters(mangaId, lang, 0, 100);
  const all = [...first.chapters];
  const total = first.total;
  for (let offset = 100; offset < Math.min(total, 10000); offset += 100) {
    const batch = await getMangaChapters(mangaId, lang, offset, 100);
    all.push(...batch.chapters);
    if (batch.chapters.length === 0) break;
  }
  return all.sort((a, b) => a.chapterNumber - b.chapterNumber);
}

export async function getChapterPages(
  chapterId: string,
  useDataSaver = false
): Promise<{
  pages: string[];
  baseUrl: string;
  chapterHash: string;
  pageFiles: string[];
  totalPages: number;
}> {
  const quality = useDataSaver ? 'data-saver' : 'data';
  const res = await fetch(`/api/manga/at-home/${chapterId}?quality=${quality}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Failed to get chapter pages: ${res.status}`);
  }
  const data = await res.json();
  return {
    baseUrl: data.baseUrl,
    chapterHash: data.hash,
    pageFiles: data.pageFiles,
    totalPages: data.totalPages,
    pages: data.pages,
  };
}

export async function findMangaByTitle(title: string): Promise<MdMangaResult | null> {
  const { results } = await searchManga(title, 10);
  if (!results.length) return null;
  const lower = title.toLowerCase();
  const exact = results.find(
    (m) =>
      Object.values(m.titles).some((t) => t.toLowerCase() === lower) ||
      Object.values(m.titles).some((t) => t.toLowerCase().includes(lower))
  );
  return exact || results[0];
}

export async function findChapterByNumber(
  mangaId: string,
  chapterNumber: number
): Promise<MdChapterResult | null> {
  const allChapters = await getAllChapters(mangaId);
  if (!allChapters.length) return null;
  const sorted = [...allChapters].sort((a, b) => {
    const diff = Math.abs(a.chapterNumber - chapterNumber) - Math.abs(b.chapterNumber - chapterNumber);
    return diff;
  });
  return sorted[0] || null;
}

export async function getChapterPagesByNumber(
  mangaTitle: string,
  chapterNumber: number,
  useDataSaver = false
) {
  const manga = await findMangaByTitle(mangaTitle);
  if (!manga) throw new Error('Manga not found on MangaDex');
  const chapter = await findChapterByNumber(manga.id, chapterNumber);
  if (!chapter) throw new Error(`Chapter ${chapterNumber} not found`);
  const { pages, baseUrl, chapterHash, pageFiles, totalPages } = await getChapterPages(chapter.id, useDataSaver);
  return {
    mangaId: manga.id,
    mangaTitle: manga.title || mangaTitle,
    chapterId: chapter.id,
    chapterNumber: chapter.chapterNumber,
    chapterTitle: chapter.title || `Chapter ${chapter.chapterNumber}`,
    baseUrl,
    chapterHash,
    pages,
    pageFiles,
    totalPages,
  };
}

export async function getFirstChapter(mangaTitle: string, useDataSaver = false) {
  const manga = await findMangaByTitle(mangaTitle);
  if (!manga) throw new Error('Manga not found on MangaDex');
  const allChapters = await getAllChapters(manga.id);
  if (!allChapters.length) throw new Error('No chapters found');
  const first = allChapters[0];
  return getChapterPagesByNumber(mangaTitle, first.chapterNumber);
}

export async function getAdjacentChapters(
  mangaTitle: string,
  chapterNumber: number
): Promise<{ prev: { id: string; num: number } | null; next: { id: string; num: number } | null }> {
  const manga = await findMangaByTitle(mangaTitle);
  if (!manga) return { prev: null, next: null };
  const allChapters = await getAllChapters(manga.id);
  if (!allChapters.length) return { prev: null, next: null };
  const idx = allChapters.findIndex((c) => c.chapterNumber === chapterNumber);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? { id: allChapters[idx - 1].id, num: allChapters[idx - 1].chapterNumber } : null,
    next: idx < allChapters.length - 1 ? { id: allChapters[idx + 1].id, num: allChapters[idx + 1].chapterNumber } : null,
  };
}
