export interface ComickResult {
  id: string;
  title: string;
}

export interface ComickChapter {
  id: string;
  chapterNumber: number;
  title: string;
}

const COMICK_API = 'https://api.comick.fun';

export async function searchManga(query: string): Promise<ComickResult[]> {
  try {
    const res = await fetch(`${COMICK_API}/v1.0/search?q=${encodeURIComponent(query)}&limit=10`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((m: any) => ({
      id: m.slug,
      title: m.title || '',
    }));
  } catch {
    return [];
  }
}

export async function getMangaInfo(slug: string): Promise<{ title: string; chapters: ComickChapter[] }> {
  try {
    const res = await fetch(`${COMICK_API}/comic/${slug}/chapters?limit=20000&lang=en`);
    if (!res.ok) return { title: slug, chapters: [] };
    const data = await res.json();
    const chapters: ComickChapter[] = (data.chapters || []).map((c: any) => ({
      id: c.hid,
      chapterNumber: parseFloat(c.chap) || 0,
      title: c.title || `Chapter ${c.chap}`,
    })).filter((c: ComickChapter) => c.chapterNumber > 0);
    
    // Sort chapters ascending
    chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);

    return {
      title: slug,
      chapters,
    };
  } catch {
    return { title: slug, chapters: [] };
  }
}

export async function getChapterPages(hid: string): Promise<string[]> {
  try {
    const res = await fetch(`${COMICK_API}/chapter/${hid}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.chapter?.md_images || []).map((img: any) => `https://meo.comick.pictures/${img.b2key}`);
  } catch {
    return [];
  }
}
