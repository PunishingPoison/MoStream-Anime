import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = await params;
  const { searchParams } = new URL(request.url);
  const quality = searchParams.get('quality') || 'data';

  if (!chapterId) {
    return NextResponse.json({ error: 'Missing chapterId' }, { status: 400 });
  }

  try {
    const mdRes = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`, {
      headers: { 'User-Agent': 'MoStream-Anime/1.0' },
    });

    if (!mdRes.ok) {
      const text = await mdRes.text();
      return NextResponse.json(
        { error: `MangaDex at-home fetch failed: ${mdRes.status}`, detail: text },
        { status: mdRes.status }
      );
    }

    const data = await mdRes.json();
    const baseUrl: string = data.baseUrl;
    const hash: string = data.chapter.hash;
    const pageFiles: string[] = quality === 'data-saver' ? data.chapter.dataSaver : data.chapter.data;

    const proxyBase = '/api/manga/proxy';
    const pages = pageFiles.map(
      (f: string) =>
        `${proxyBase}?base=${encodeURIComponent(baseUrl)}&hash=${hash}&quality=${quality}&file=${f}`
    );

    return NextResponse.json({
      baseUrl,
      hash,
      quality,
      totalPages: pageFiles.length,
      pageFiles,
      pages,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
