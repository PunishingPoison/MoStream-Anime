import { NextRequest, NextResponse } from 'next/server';
import * as kitsu from '@/lib/providers/kitsu';

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
      const results = await kitsu.searchManga(q);
      return NextResponse.json({ results });
    }
    if (path === 'chapters') {
      const id = searchParams.get('id');
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
      const chapters = await kitsu.getMangaChapters(id);
      return NextResponse.json({ chapters });
    }
    return NextResponse.json({ error: 'Unknown path' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
