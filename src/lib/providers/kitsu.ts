const KITSU_API = 'https://kitsu.io/api/edge';

export interface KitsuResult {
  id: string;
  title: string;
  image: string;
  slug: string;
}

async function kitsuFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${KITSU_API}${path}`, {
    headers: {
      'User-Agent': 'MoStream-Anime/1.0',
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    },
  });
  if (!res.ok) throw new Error(`Kitsu API error: ${res.status}`);
  return res.json();
}

function pickTitle(attributes: any): string {
  return attributes?.canonicalTitle || attributes?.titles?.en || attributes?.titles?.en_jp || attributes?.slug || '';
}

export async function searchManga(query: string): Promise<KitsuResult[]> {
  const data = await kitsuFetch<any>(
    `/manga?filter[text]=${encodeURIComponent(query)}&page[limit]=10`
  );
  return (data.data || []).map((m: any) => ({
    id: m.id,
    title: pickTitle(m.attributes),
    image: m.attributes?.posterImage?.original || m.attributes?.posterImage?.large || '',
    slug: m.attributes?.slug || '',
  }));
}

export async function getMangaChapters(kitsuId: string): Promise<{ id: string; chapterNumber: number; title: string; volumeNumber: number }[]> {
  let chapters: any[] = [];
  let url = `/manga/${kitsuId}/chapters?page[limit]=20&sort=number`;

  try {
    while (url && chapters.length < 2000) {
      const data = await kitsuFetch<any>(url);
      if (!data.data) break;
      chapters.push(...data.data);
      // Kitsu pagination URLs are absolute, we need to extract the path
      if (data.links?.next) {
        const nextUrl = new URL(data.links.next);
        url = nextUrl.pathname + nextUrl.search;
      } else {
        break;
      }
    }
  } catch (e) {
    console.error('Kitsu chapter fetch error:', e);
  }

  return chapters.map((c: any) => ({
    id: c.id,
    chapterNumber: c.attributes?.number || 0,
    title: c.attributes?.canonicalTitle || `Chapter ${c.attributes?.number}`,
    volumeNumber: c.attributes?.volumeNumber || 0,
  })).filter((c: { chapterNumber: number }) => c.chapterNumber > 0);
}
