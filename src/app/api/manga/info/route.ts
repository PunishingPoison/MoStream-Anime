import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing query param: id' }, { status: 400 });
  }

  try {
    const MangaKakalot = (await import('@consumet/extensions/dist/providers/manga/mangakakalot')).default;
    const provider = new MangaKakalot();
    const result = await provider.fetchMangaInfo(id);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Manga info error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch manga info' }, { status: 500 });
  }
}
