import { NextRequest, NextResponse } from 'next/server';
import * as mangahook from '@/lib/providers/mangahook';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Missing path param' }, { status: 400 });
  }

  try {
    if (path === 'search') {
      const q = searchParams.get('q');
      if (!q) return NextResponse.json({ error: 'Missing q' }, { status: 400 });
      const results = await mangahook.searchManga(q);
      return NextResponse.json({ results });
    }
    if (path === 'info') {
      const id = searchParams.get('id');
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
      const info = await mangahook.getMangaInfo(id);
      return NextResponse.json(info);
    }
    if (path === 'chapter') {
      const id = searchParams.get('id');
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
      const pages = await mangahook.getChapterPages(id);
      const proxied = pages.map((url: string) => ({
        img: url.startsWith('http') ? `/api/manga/proxy?url=${encodeURIComponent(url)}` : url,
        page: 0,
      }));
      return NextResponse.json(proxied);
    }
    return NextResponse.json({ error: 'Unknown path' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
