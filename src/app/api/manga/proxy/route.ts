import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'comick.art',
  'www.comick.art',
  'cdn1.comicknew.pictures',
  'cdn2.comicknew.pictures',
  'cdn3.comicknew.pictures',
  'cdn4.comicknew.pictures',
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing query param: url' }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    const allowed = ALLOWED_ORIGINS.some((d) => parsed.hostname === d || parsed.hostname.endsWith('.' + d));
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden: invalid image domain' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MoStream-Anime/1.0',
        'Referer': 'https://comick.art/',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Image fetch failed: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/webp';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  } catch {
    return new NextResponse('Image proxy error', { status: 502 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
