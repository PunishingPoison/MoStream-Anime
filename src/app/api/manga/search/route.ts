import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (!query) {
    return NextResponse.json({ error: 'Missing query param: q' }, { status: 400 });
  }

  try {
    const Comick = (await import('@consumet/extensions/dist/providers/manga/comick')).default;
    const provider = new Comick();
    const result = await provider.search(query, page.toString());
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Manga search error:', err);
    return NextResponse.json({ error: err.message || 'Search failed' }, { status: 500 });
  }
}
