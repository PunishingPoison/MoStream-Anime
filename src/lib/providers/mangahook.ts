const HOOK_API = 'https://mangahook-api.vercel.app';

export interface HookResult {
  id: string;
  title: string;
  image: string;
}

export interface HookChapter {
  id: string;
  chapterNumber: number;
  title: string;
}

async function hookFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${HOOK_API}${path}`, {
    headers: { 'User-Agent': 'MoStream-Anime/1.0' },
  });
  if (!res.ok) throw new Error(`Manga Hook API error: ${res.status}`);
  return res.json();
}

export async function searchManga(query: string): Promise<HookResult[]> {
  const data = await hookFetch<any>(`/search?q=${encodeURIComponent(query)}&limit=10`);
  const results = data.results || data.data || [];
  return results.map((r: any) => ({
    id: r.id || r._id || '',
    title: r.title || '',
    image: r.image || r.cover || '',
  }));
}

export async function getMangaInfo(id: string): Promise<{ title: string; chapters: HookChapter[] }> {
  const data = await hookFetch<any>(`/manga/${id}`);
  const chapters: HookChapter[] = (data.chapters || data.data?.chapters || []).map((c: any) => ({
    id: c.id || c._id || '',
    chapterNumber: parseFloat(c.chapterNumber || c.number || c.chapter) || 0,
    title: c.title || `Chapter ${c.chapterNumber || c.number || c.chapter}`,
  }));
  return {
    title: data.title || data.data?.title || '',
    chapters,
  };
}

export async function getChapterPages(chapterId: string): Promise<string[]> {
  const data = await hookFetch<any>(`/chapter/${chapterId}`);
  const pages = data.pages || data.data?.pages || data.images || [];
  return pages.map((p: any) => (typeof p === 'string' ? p : p.img || p.src || p.url || '')).filter(Boolean);
}
