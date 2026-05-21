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

export async function getMangaChapters(kitsuId: string): Promise<{ id: string; chapterNumber: number; title: string }[]> {
  const data = await kitsuFetch<any>(
    `/manga/${kitsuId}/chapters?page[limit]=100&sort=number`
  );
    return (data.data || []).map((c: any) => ({
    id: c.id,
    chapterNumber: c.attributes?.number || 0,
    title: c.attributes?.canonicalTitle || `Chapter ${c.attributes?.number}`,
  })).filter((c: { chapterNumber: number }) => c.chapterNumber > 0);
}
