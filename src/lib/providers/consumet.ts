import type { MangaParser } from '@consumet/extensions/dist/models';

type ProviderConstructor = new () => MangaParser;

const PROVIDER_MODULES: { name: string; path: string }[] = [
  { name: 'comick', path: '@consumet/extensions/dist/providers/manga/comick' },
  { name: 'mangahere', path: '@consumet/extensions/dist/providers/manga/mangahere' },
  { name: 'mangapill', path: '@consumet/extensions/dist/providers/manga/mangapill' },
];

async function getProvider(name: string): Promise<MangaParser | null> {
  const mod = PROVIDER_MODULES.find((p) => p.name === name) || PROVIDER_MODULES[0];
  if (!mod) return null;
  try {
    const imported = await import(mod.path);
    const Ctor: ProviderConstructor = imported.default;
    return new Ctor();
  } catch {
    return null;
  }
}

export interface ConsumetResult {
  id: string;
  title: string;
  image: string;
  provider: string;
}

export interface ConsumetChapter {
  id: string;
  chapterNumber: number;
  title: string;
  provider: string;
}

export async function searchManga(query: string): Promise<ConsumetResult[]> {
  const provider = await getProvider('comick');
  if (!provider) return [];

  try {
    const result: any = await provider.search(query, '1');
    return (result.results || []).map((r: any) => ({
      id: r.id,
      title: typeof r.title === 'string' ? r.title : r.title?.userPreferred || r.title?.english || r.title?.romaji || '',
      image: r.image || '',
      provider: 'comick',
    }));
  } catch {
    return [];
  }
}

export async function getMangaChapters(
  mangaId: string,
  providerName?: string
): Promise<ConsumetChapter[]> {
  const provider = await getProvider(providerName || 'comick');
  if (!provider) return [];

  try {
    const info = await provider.fetchMangaInfo(mangaId);
    return (info.chapters || []).map((ch: any) => ({
      id: ch.id,
      chapterNumber: ch.chapterNumber ?? 0,
      title: ch.title || `Chapter ${ch.chapterNumber}`,
      provider: providerName || 'comick',
    }));
  } catch {
    return [];
  }
}

export async function getChapterPages(
  chapterId: string
): Promise<string[]> {
  for (const mod of PROVIDER_MODULES) {
    const provider = await getProvider(mod.name);
    if (!provider) continue;
    try {
      const result = await provider.fetchChapterPages(chapterId);
      const pages = (result || []).map((pg: any) => pg.img).filter(Boolean);
      if (pages.length > 0) return pages;
    } catch {
      continue;
    }
  }
  return [];
}
