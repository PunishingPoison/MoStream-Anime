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
