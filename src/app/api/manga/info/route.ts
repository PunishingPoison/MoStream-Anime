import { NextRequest, NextResponse } from 'next/server';
import * as mangadex from '@/lib/providers/mangadex';
import * as consumet from '@/lib/providers/consumet';
import * as kitsu from '@/lib/providers/kitsu';
import * as mangahook from '@/lib/providers/mangahook';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const provider = searchParams.get('provider');

  if (!id) {
    return NextResponse.json({ error: 'Missing query param: id' }, { status: 400 });
  }

  if (provider === 'mangadex') {
    const info = await mangadex.getMangaInfo(id);
    return NextResponse.json(info);
  }
  if (provider === 'kitsu') {
    const chapters = await kitsu.getMangaChapters(id);
    return NextResponse.json({ id, title: '', chapters });
  }
  if (provider === 'mangahook') {
    const info = await mangahook.getMangaInfo(id);
    return NextResponse.json({ id, ...info });
  }
  if (provider === 'consumet' || provider === 'comick' || provider === 'mangahere' || provider === 'mangapill') {
    const chapters = await consumet.getMangaChapters(id, provider);
    return NextResponse.json({ id, title: '', chapters });
  }

  const errors: string[] = [];
  for (const [name, fn] of Object.entries(INFO_PROVIDERS)) {
    try {
      const result = await fn(id);
      if (result.chapters && result.chapters.length > 0) {
        return NextResponse.json({ ...result, provider: name });
      }
    } catch (e: any) {
      errors.push(`${name}: ${e.message}`);
    }
  }
  return NextResponse.json({ id, title: '', chapters: [], errors }, { status: 200 });
}

const INFO_PROVIDERS: Record<string, (id: string) => Promise<any>> = {
  mangadex: mangadex.getMangaInfo,
  kitsu: async (id: string) => {
    const chapters = await kitsu.getMangaChapters(id);
    return { id, title: '', chapters };
  },
  mangahook: mangahook.getMangaInfo,
  consumet: async (id: string) => {
    const chapters = await consumet.getMangaChapters(id);
    return { id, title: '', chapters };
  },
};
