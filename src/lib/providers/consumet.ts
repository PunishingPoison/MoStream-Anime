import type { MangaParser } from '@consumet/extensions/dist/models';

type ProviderConstructor = new () => MangaParser;

const PROVIDER_MODULES: { name: string; path: string }[] = [
  { name: 'comick', path: '@consumet/extensions/dist/providers/manga/comick' },
  { name: 'mangahere', path: '@consumet/extensions/dist/providers/manga/mangahere' },
  { name: 'mangapill', path: '@consumet/extensions/dist/providers/manga/mangapill' },
];

import { MANGA } from '@consumet/extensions';

async function getProvider(name: string): Promise<MangaParser | null> {
  try {
    if (name === 'mangapill') return new MANGA.MangaPill();
    if (name === 'mangahere') return new MANGA.MangaHere();
    return new MANGA.ComicK();
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

export async function searchManga(query: string, providerName?: string): Promise<ConsumetResult[]> {
  const targetProvider = providerName || 'mangapill';
  const provider = await getProvider(targetProvider);
  if (!provider) return [];

  try {
    const result: any = await provider.search(query, '1');
    return (result.results || []).map((r: any) => ({
      id: r.id,
      title: typeof r.title === 'string' ? r.title : r.title?.userPreferred || r.title?.english || r.title?.romaji || '',
      image: r.image || '',
      provider: targetProvider,
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
  chapterId: string,
  providerName?: string
): Promise<string[]> {
  const modsToTry = providerName
    ? PROVIDER_MODULES.filter(p => p.name === providerName)
    : PROVIDER_MODULES;

  for (const mod of modsToTry) {
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
