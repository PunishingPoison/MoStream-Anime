import { NextRequest, NextResponse } from 'next/server';

const PROXY_BASE = '/api/manga/proxy?url=';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing query param: id' }, { status: 400 });
  }

  try {
    const Comick = (await import('@consumet/extensions/dist/providers/manga/comick')).default;
    const provider = new Comick();
    const result = await provider.fetchChapterPages(id);

    const proxied = (result || []).map((p: any) => ({
      ...p,
      img: p.img ? `${PROXY_BASE}${encodeURIComponent(p.img)}` : p.img,
    }));

    return NextResponse.json(proxied);
  } catch (err: any) {
    console.error('Manga chapter error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch chapter pages' }, { status: 500 });
  }
}
