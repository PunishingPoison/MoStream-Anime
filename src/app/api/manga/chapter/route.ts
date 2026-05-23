import { NextRequest, NextResponse } from 'next/server';
import * as mangadex from '@/lib/providers/mangadex';
import * as consumet from '@/lib/providers/consumet';
import * as mangahook from '@/lib/providers/mangahook';
import * as comick from '@/lib/providers/comick';
import * as mangapill from '@/lib/providers/mangapill';

const PROXY_BASE = '/api/manga/proxy?url=';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const provider = searchParams.get('provider');

  if (!id) {
    return NextResponse.json({ error: 'Missing query param: id' }, { status: 400 });
  }

  if (provider === 'mangadex') {
    const { pages } = await mangadex.getChapterPages(id);
    const proxied = pages.map((url: string) => ({
      img: url,
      page: 0,
    }));
    return NextResponse.json(proxied);
  }
  if (provider === 'mangahook') {
    const pages = await mangahook.getChapterPages(id);
    const proxied = pages.map((url: string) => ({
      img: url.startsWith('http') ? `${PROXY_BASE}${encodeURIComponent(url)}` : url,
      page: 0,
    }));
    return NextResponse.json(proxied);
  }
  if (provider === 'comick') {
    const pages = await comick.getChapterPages(id);
    const proxied = pages.map((url: string) => ({
      img: url.startsWith('http') ? `${PROXY_BASE}${encodeURIComponent(url)}` : url,
      page: 0,
    }));
    return NextResponse.json(proxied);
  }
  if (provider === 'mangapill') {
    const pages = await mangapill.getChapterPages(id);
    const proxied = pages.map((url: string) => ({
      img: url.startsWith('http') ? `${PROXY_BASE}${encodeURIComponent(url)}` : url,
      page: 0,
    }));
    return NextResponse.json(proxied);
  }
  if (provider === 'consumet' || provider === 'comick_consumet' || provider === 'mangahere') {
    const pages = await consumet.getChapterPages(id, provider === 'consumet' || provider === 'comick_consumet' ? 'comick' : provider);
    const proxied = pages.map((url: string) => ({
      img: url.startsWith('http') ? `${PROXY_BASE}${encodeURIComponent(url)}` : url,
      page: 0,
    }));
    return NextResponse.json(proxied);
  }

  const errors: string[] = [];
  for (const [name, fn] of Object.entries(CHAPTER_PROVIDERS)) {
    try {
      const pages = await fn(id);
      const proxied = pages.map((url: string) => ({
        img: url.startsWith('http') ? `${PROXY_BASE}${encodeURIComponent(url)}` : url,
        page: 0,
      }));
      if (proxied.length > 0) {
        return NextResponse.json(proxied);
      }
    } catch (e: any) {
      errors.push(`${name}: ${e.message}`);
    }
  }
  return NextResponse.json([], { status: 200 });
}

const CHAPTER_PROVIDERS: Record<string, (id: string) => Promise<string[]>> = {
  comick: comick.getChapterPages,
  mangadex: async (id: string) => {
    const { pages } = await mangadex.getChapterPages(id);
    return pages;
  },
  mangahook: mangahook.getChapterPages,
  consumet: consumet.getChapterPages,
};
