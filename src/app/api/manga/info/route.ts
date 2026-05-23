import { NextRequest, NextResponse } from 'next/server';
import * as mangadex from '@/lib/providers/mangadex';
import * as consumet from '@/lib/providers/consumet';
import * as kitsu from '@/lib/providers/kitsu';
import * as mangahook from '@/lib/providers/mangahook';
import * as comick from '@/lib/providers/comick';
import { mangaCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const provider = searchParams.get('provider');

  if (!id) {
    return NextResponse.json({ error: 'Missing query param: id' }, { status: 400 });
  }

  const isTitle = searchParams.get('isTitle') === 'true';
  const cacheKey = `manga-info-v4-${provider || 'auto'}-${id}-${isTitle}`;

  try {
    const data = await mangaCache.getOrFetch(cacheKey, async () => {
      let targetProvider = provider;
      
      const fetchFromProvider = async (pName: string, queryId: string) => {
        let resolvedId = queryId;
        if (isTitle) {
          if (pName === 'mangadex') {
            const res = await mangadex.searchManga(queryId);
            if (res.length > 0) resolvedId = res[0].id;
            else return null;
          } else if (pName === 'consumet' || pName === 'comick_consumet') {
            const res = await consumet.searchManga(queryId);
            if (res.length > 0) resolvedId = res[0].id;
            else return null;
          } else if (pName === 'mangahook') {
            const res = await mangahook.searchManga(queryId);
            if (res.length > 0) resolvedId = res[0].id;
            else return null;
          } else if (pName === 'kitsu') {
            const res = await kitsu.searchManga(queryId);
            if (res.length > 0) resolvedId = res[0].id;
            else return null;
          } else if (pName === 'comick') {
            const res = await comick.searchManga(queryId);
            if (res.length > 0) resolvedId = res[0].id;
            else return null;
          }
        }

        let info;
        if (pName === 'mangadex') info = await mangadex.getMangaInfo(resolvedId);
        else if (pName === 'mangahook') info = { id: resolvedId, ...(await mangahook.getMangaInfo(resolvedId)) };
        else if (pName === 'consumet' || pName === 'comick_consumet') info = { id: resolvedId, title: '', chapters: await consumet.getMangaChapters(resolvedId, pName) };
        else if (pName === 'kitsu') info = { id: resolvedId, title: '', chapters: await kitsu.getMangaChapters(resolvedId) };
        else if (pName === 'comick') info = { id: resolvedId, ...(await comick.getMangaInfo(resolvedId)) };
        
        if (info && info.chapters && info.chapters.length > 0) {
          return { ...info, provider: pName };
        }
        return null;
      };

      if (targetProvider) {
        const result = await fetchFromProvider(targetProvider, id);
        if (result) return result;
      } else {
        const errors: string[] = [];
        const results = await Promise.all([
          fetchFromProvider('comick', id).catch((e) => { errors.push(`comick: ${e.message}`); return null; }),
          fetchFromProvider('mangadex', id).catch((e) => { errors.push(`mangadex: ${e.message}`); return null; }),
          fetchFromProvider('consumet', id).catch((e) => { errors.push(`consumet: ${e.message}`); return null; }),
          fetchFromProvider('mangahook', id).catch((e) => { errors.push(`mangahook: ${e.message}`); return null; })
        ]);

        let bestResult = null;
        let maxChapters = 0;

        for (const res of results) {
          if (res && res.chapters && res.chapters.length > maxChapters) {
            maxChapters = res.chapters.length;
            bestResult = res;
          }
        }

        if (bestResult) return bestResult;
        
        return { id, title: isTitle ? id : '', chapters: [], errors };
      }
      
      return { id, title: isTitle ? id : '', chapters: [] };
    });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ id, title: '', chapters: [], error: err.message }, { status: 200 });
  }
}
