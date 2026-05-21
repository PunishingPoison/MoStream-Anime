import { NextRequest, NextResponse } from 'next/server';
import * as mangadex from '@/lib/providers/mangadex';
import * as consumet from '@/lib/providers/consumet';
import * as jikan from '@/lib/providers/jikan';
import * as kitsu from '@/lib/providers/kitsu';
import * as mangahook from '@/lib/providers/mangahook';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const provider = searchParams.get('provider');

  if (!query) {
    return NextResponse.json({ error: 'Missing query param: q' }, { status: 400 });
  }

  if (provider === 'mangadex') {
    const results = await mangadex.searchManga(query);
    return NextResponse.json({ results });
  }
  if (provider === 'jikan') {
    const results = await jikan.searchManga(query);
    return NextResponse.json({ results });
  }
  if (provider === 'kitsu') {
    const results = await kitsu.searchManga(query);
    return NextResponse.json({ results });
  }
  if (provider === 'mangahook') {
    const results = await mangahook.searchManga(query);
    return NextResponse.json({ results });
  }
  if (provider === 'consumet' || provider === 'comick') {
    const results = await consumet.searchManga(query);
    return NextResponse.json({ results });
  }

  const errors: string[] = [];
  for (const [name, fn] of Object.entries(SEARCH_PROVIDERS)) {
    try {
      const results = await fn(query);
      if (results.length > 0) {
        return NextResponse.json({ results, provider: name });
      }
    } catch (e: any) {
      errors.push(`${name}: ${e.message}`);
    }
  }
  return NextResponse.json({ results: [], errors }, { status: 200 });
}

const SEARCH_PROVIDERS: Record<string, (q: string) => Promise<any[]>> = {
  mangadex: mangadex.searchManga,
  jikan: jikan.searchManga,
  kitsu: kitsu.searchManga,
  consumet: consumet.searchManga,
  mangahook: mangahook.searchManga,
};
