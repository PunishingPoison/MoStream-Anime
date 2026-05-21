const MANGADEX_API = 'https://api.mangadex.org';

export interface MdResult {
  id: string;
  title: string;
}

export interface MdChapter {
  id: string;
  chapterNumber: number;
  title: string;
}

export interface MdMangaInfo {
  id: string;
  title: string;
  chapters: MdChapter[];
}

async function mdFetch<T>(path: string, retries = 2): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(`${MANGADEX_API}${path}`, {
      headers: { 'User-Agent': 'MoStream-Anime/1.0' },
    });
    if (res.ok) return res.json();
    if (res.status === 429 && attempt < retries) {
      await new Promise((r) => setTimeout(r, (attempt + 1) * 300));
      continue;
    }
    throw new Error(`MangaDex API error: ${res.status}`);
  }
  throw new Error('MangaDex API error: max retries');
}

function pickTitle(titles: Record<string, string>): string {
  return titles.en || titles['ja-ro'] || titles.ja || Object.values(titles)[0] || '';
}

export async function searchManga(query: string): Promise<MdResult[]> {
  const data = await mdFetch<any>(
    `/manga?title=${encodeURIComponent(query)}&limit=10&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&order[relevance]=desc`
  );
  return (data.data || []).map((m: any) => ({
    id: m.id,
    title: pickTitle(m.attributes?.title || {}),
  }));
}

export async function getMangaInfo(id: string): Promise<MdMangaInfo> {
  const data = await mdFetch<any>(
    `/manga/${id}?includes[]=cover_art`
  );
  const m = data.data;
  const title = pickTitle(m.attributes?.title || {});

  const limit = 500;
  let offset = 0;
  let allChapters: MdChapter[] = [];
  let total = 0;

  do {
    const feed = await mdFetch<any>(
      `/manga/${id}/feed?limit=${limit}&offset=${offset}&translatedLanguage[]=en&order[chapter]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=scanlation_group`
    );
    
    total = feed.total || 0;
    
    const chunk: MdChapter[] = (feed.data || [])
      .filter((c: any) => !c.attributes?.isUnavailable && !c.attributes?.externalUrl && c.attributes?.pages > 0)
      .map((c: any) => ({
        id: c.id,
        chapterNumber: parseFloat(c.attributes?.chapter) || 0,
        title: c.attributes?.title || `Chapter ${c.attributes?.chapter}`,
      }))
      .filter((c: MdChapter) => c.chapterNumber > 0);
      
    allChapters = allChapters.concat(chunk);
    offset += limit;
  } while (offset < total);

  // deduplicate by chapter number (keep the first one found, which is the latest uploaded or highest rated depending on order)
  const uniqueChapters = Array.from(
    new Map(allChapters.map((c) => [c.chapterNumber, c])).values()
  ).sort((a, b) => a.chapterNumber - b.chapterNumber);

  return { id, title, chapters: uniqueChapters };
}

export async function getChapterPages(
  chapterId: string
): Promise<{ pages: string[]; baseUrl: string; hash: string }> {
  const data = await mdFetch<any>(`/at-home/server/${chapterId}`);
  const baseUrl: string = data.baseUrl;
  const hash: string = data.chapter.hash;
  const pageFiles: string[] = data.chapter.data || data.chapter.dataSaver;
  const proxyBase = '/api/manga/proxy?url=';
  const pages = pageFiles.map(
    (f: string) => `${proxyBase}${encodeURIComponent(`${baseUrl}/data/${hash}/${f}`)}`
  );
  return { pages, baseUrl, hash };
}

export function getCoverUrl(mangaId: string, fileName: string): string {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`;
}
