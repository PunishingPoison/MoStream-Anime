const JIKAN_API = 'https://api.jikan.moe/v4';

export interface JikanResult {
  malId: number;
  title: string;
  image: string;
}

export interface JikanChapter {
  id: number;
  chapterNumber: number;
  title: string;
}

let lastRequest = 0;
async function jikanFetch<T>(path: string): Promise<T> {
  const now = Date.now();
  const elapsed = now - lastRequest;
  if (elapsed < 400) {
    await new Promise((r) => setTimeout(r, 400 - elapsed));
  }
  lastRequest = Date.now();
  const res = await fetch(`${JIKAN_API}${path}`, {
    headers: { 'User-Agent': 'MoStream-Anime/1.0' },
  });
  if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);
  return res.json();
}

export async function searchManga(query: string): Promise<JikanResult[]> {
  const data = await jikanFetch<any>(`/manga?q=${encodeURIComponent(query)}&limit=10&sfw=true`);
  return (data.data || []).map((m: any) => ({
    malId: m.mal_id,
    title: m.title || m.title_english || '',
    image: m.images?.jpg?.image_url || '',
  }));
}

export async function getMangaChapters(malId: number): Promise<JikanChapter[]> {
  const allChapters: JikanChapter[] = [];
  let page = 1;
  while (page <= 3) {
    const data = await jikanFetch<any>(`/manga/${malId}/chapters?page=${page}`);
    const chs: JikanChapter[] = (data.data || []).map((c: any) => ({
      id: c.mal_id,
      chapterNumber: c.chapter || 0,
      title: c.title || `Chapter ${c.chapter}`,
    }));
    allChapters.push(...chs);
    if (!data.pagination?.has_next_page) break;
    page++;
  }
  return allChapters.filter((c) => c.chapterNumber > 0);
}

export async function getMangaFull(malId: number): Promise<any> {
  return jikanFetch<any>(`/manga/${malId}/full`);
}
