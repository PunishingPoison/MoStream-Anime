import { NextRequest, NextResponse } from 'next/server';
import * as jikan from '@/lib/providers/jikan';

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
      const results = await jikan.searchManga(q);
      return NextResponse.json({ results });
    }
    if (path === 'chapters') {
      const id = parseInt(searchParams.get('id') || '', 10);
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
      const chapters = await jikan.getMangaChapters(id);
      return NextResponse.json({ chapters });
    }
    if (path === 'full') {
      const id = parseInt(searchParams.get('id') || '', 10);
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
      const data = await jikan.getMangaFull(id);
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: 'Unknown path' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
