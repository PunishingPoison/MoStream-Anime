const BASE_URL = 'https://mangapill.com';

export interface MpResult {
  id: string;
  title: string;
}

export interface MpChapter {
  id: string;
  chapterNumber: number;
  title: string;
}

export const MP_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

export async function searchManga(query: string): Promise<MpResult[]> {
  try {
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, { headers: MP_HEADERS });
    const html = await res.text();
    const results: MpResult[] = [];
    
    const linkRegex = /<a[^>]+href="\/manga\/(\d+\/[^"]+)"[^>]*>([^<]+)<\/a>/g;
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const title = match[2].trim();
      if (title && !title.includes('<') && !title.includes('img')) {
        results.push({ id: match[1], title });
      }
    }
    
    const altRegex = /<a[^>]+href="\/manga\/(\d+\/[^"]+)"/g;
    if (results.length === 0) {
      const ids = [...html.matchAll(altRegex)].map(m => m[1]);
      const uniqueIds = Array.from(new Set(ids));
      return uniqueIds.map(id => ({ id, title: query }));
    }

    const unique = new Map<string, MpResult>();
    results.forEach(r => unique.set(r.id, r));
    return Array.from(unique.values());
  } catch {
    return [];
  }
}

export async function getMangaChapters(mangaId: string): Promise<MpChapter[]> {
  try {
    const res = await fetch(`${BASE_URL}/manga/${mangaId}`, { headers: MP_HEADERS });
    const html = await res.text();
    const chapters: MpChapter[] = [];
    
    const regex = /<a[^>]+href="\/chapters\/([^"]+)"[^>]*>Chapter\s+(\d+(\.\d+)?)<\/a>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      chapters.push({
        id: match[1],
        chapterNumber: parseFloat(match[2]),
        title: `Chapter ${match[2]}`
      });
    }
    
    return chapters;
  } catch {
    return [];
  }
}

export async function getChapterPages(chapterId: string): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/chapters/${chapterId}`, { headers: MP_HEADERS });
    const html = await res.text();
    const pages: string[] = [];
    
    const regex = /<picture[^>]*>\s*<img[^>]+data-src="([^"]+)"/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      pages.push(match[1]);
    }

    if (pages.length === 0) {
      const regex2 = /<picture[^>]*>\s*<img[^>]+src="([^"]+)"/gi;
      while ((match = regex2.exec(html)) !== null) {
        pages.push(match[1]);
      }
    }
    
    return pages;
  } catch {
    return [];
  }
}
