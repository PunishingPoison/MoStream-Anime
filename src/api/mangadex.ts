const MANGADEX_API = 'https://api.mangadex.org';

export async function searchManga(query: string, limit = 20, offset = 0) {
  const url = `${MANGADEX_API}/manga?title=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('MangaDex API error');
  return res.json();
}

export async function getMangaDetails(id: string) {
  const url = `${MANGADEX_API}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('MangaDex API error');
  return res.json();
}

export async function getMangaChapters(mangaId: string, limit = 100, offset = 0) {
  const url = `${MANGADEX_API}/manga/${mangaId}/feed?limit=${limit}&offset=${offset}&translatedLanguage[]=en&order[chapter]=desc&contentRating[]=safe&contentRating[]=suggestive`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('MangaDex API error');
  return res.json();
}

export async function getChapterPages(chapterId: string) {
  const url = `${MANGADEX_API}/at-home/server/${chapterId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('MangaDex API error');
  return res.json();
}

export function getChapterPageUrl(baseUrl: string, chapterHash: string, fileName: string): string {
  return `${baseUrl}/data/${chapterHash}/${fileName}`;
}

export async function getPopularManga(limit = 20, offset = 0) {
  const url = `${MANGADEX_API}/manga?limit=${limit}&offset=${offset}&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&includes[]=cover_art`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('MangaDex API error');
  return res.json();
}

export async function findMangaByTitle(title: string) {
  const data = await searchManga(title, 5);
  if (!data?.data?.length) return null;
  const exact = data.data.find((m: any) =>
    m.attributes?.title?.en?.toLowerCase() === title.toLowerCase() ||
    m.attributes?.title?.ja?.toLowerCase() === title.toLowerCase() ||
    m.attributes?.altTitles?.some((at: any) =>
      Object.values(at).some((v: any) => typeof v === 'string' && v.toLowerCase() === title.toLowerCase())
    )
  );
  return exact || data.data[0];
}

export async function findChapterByNumber(mangaId: string, chapterNumber: number) {
  const chapters = await getMangaChapters(mangaId, 100);
  if (!chapters?.data?.length) return null;
  const chapter = chapters.data.find((c: any) => {
    const ch = parseFloat(c.attributes?.chapter);
    return !isNaN(ch) && Math.floor(ch) === chapterNumber;
  });
  return chapter || chapters.data[0];
}

export async function getChapterPagesByNumber(mangaTitle: string, chapterNumber: number) {
  const manga = await findMangaByTitle(mangaTitle);
  if (!manga) throw new Error('Manga not found on MangaDex');
  const mangaId = manga.id;
  const chapter = await findChapterByNumber(mangaId, chapterNumber);
  if (!chapter) throw new Error(`Chapter ${chapterNumber} not found`);
  const chapterId = chapter.id;
  const pagesData = await getChapterPages(chapterId);
  return {
    mangaId,
    mangaTitle: manga.attributes?.title?.en || mangaTitle,
    chapterId,
    chapterNumber: parseFloat(chapter.attributes?.chapter) || chapterNumber,
    chapterTitle: chapter.attributes?.title || `Chapter ${chapterNumber}`,
    baseUrl: pagesData.baseUrl,
    chapterHash: pagesData.chapter?.hash,
    pages: (pagesData.chapter?.data || []).map((f: string) =>
      getChapterPageUrl(pagesData.baseUrl, pagesData.chapter.hash, f)
    ),
    totalPages: (pagesData.chapter?.data || []).length,
  };
}

export async function getFirstChapter(mangaTitle: string) {
  const manga = await findMangaByTitle(mangaTitle);
  if (!manga) throw new Error('Manga not found on MangaDex');
  const chapters = await getMangaChapters(manga.id, 100);
  if (!chapters?.data?.length) throw new Error('No chapters found');
  const first = chapters.data[chapters.data.length - 1];
  const chNum = parseFloat(first.attributes?.chapter) || 1;
  return getChapterPagesByNumber(mangaTitle, Math.floor(chNum));
}

export async function getAdjacentChapters(mangaTitle: string, chapterNumber: number) {
  const manga = await findMangaByTitle(mangaTitle);
  if (!manga) return { prev: null, next: null };
  const chapters = await getMangaChapters(manga.id, 100);
  if (!chapters?.data?.length) return { prev: null, next: null };
  const sorted = [...chapters.data]
    .map((c: any) => ({ id: c.id, num: parseFloat(c.attributes?.chapter) || 0 }))
    .filter((c) => c.num > 0)
    .sort((a, b) => a.num - b.num);
  const currentIdx = sorted.findIndex((c) => Math.floor(c.num) === chapterNumber);
  return {
    prev: currentIdx > 0 ? sorted[currentIdx - 1] : null,
    next: currentIdx < sorted.length - 1 ? sorted[currentIdx + 1] : null,
  };
}
