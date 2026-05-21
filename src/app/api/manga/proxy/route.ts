import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_PATTERNS = [
  { domain: 'mangadex.org', referer: 'https://mangadex.org/' },
  { domain: 'mangadex.network', referer: 'https://mangadex.org/' },
  { domain: 'uploads.mangadex.org', referer: 'https://mangadex.org/' },
  { domain: 'comick.art', referer: 'https://comick.art/' },
  { domain: 'comicknew.pictures', referer: 'https://comick.art/' },
  { domain: 'mangahere.com', referer: 'https://www.mangahere.com/' },
  { domain: 'mangapill.com', referer: 'https://mangapill.com/' },
  { domain: 'mangareader.com', referer: 'https://mangareader.com/' },
  { domain: 'kitsu.io', referer: 'https://kitsu.io/' },
  { domain: 'myanimelist.net', referer: 'https://myanimelist.net/' },
  { domain: 'cdn.myanimelist.net', referer: 'https://myanimelist.net/' },
  { domain: 'anilist.co', referer: 'https://anilist.co/' },
  { domain: 's4.anilist.co', referer: 'https://anilist.co/' },
];

const TELEMETRY_URL = 'https://api.mangadex.network/report';

function isAllowed(url: string): string | null {
  try {
    const parsed = new URL(url);
    for (const pattern of ALLOWED_PATTERNS) {
      if (parsed.hostname === pattern.domain || parsed.hostname.endsWith('.' + pattern.domain)) {
        return pattern.referer;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function reportQos(url: string, success: boolean, bytes: number, duration: number) {
  try {
    await fetch(TELEMETRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'MoStream-Anime/1.0' },
      body: JSON.stringify({ url, success, cached: false, bytes, duration }),
    });
  } catch {
    // silent
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing query param: url' }, { status: 400 });
  }

  const referer = isAllowed(url);
  if (!referer) {
    return NextResponse.json({ error: 'Forbidden: invalid image source' }, { status: 403 });
  }

  const start = performance.now();
  let bytes = 0;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MoStream-Anime/1.0',
        'Referer': referer,
      },
    });

    const duration = Math.round(performance.now() - start);

    if (!response.ok) {
      const isMd = url.includes('mangadex.network') && !url.includes('mangadex.org');
      if (isMd) reportQos(url, false, 0, duration);
      return new NextResponse(`Image fetch failed: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    bytes = buffer.byteLength;

    const isMdNode = url.includes('mangadex.network') && !url.includes('mangadex.org');
    if (isMdNode) reportQos(url, true, bytes, duration);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': bytes.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'X-Image-Source': url.includes('mangadex') ? 'mangadex' : 'other',
      },
    });
  } catch {
    const duration = Math.round(performance.now() - start);
    const isMd = url.includes('mangadex.network') && !url.includes('mangadex.org');
    if (isMd) reportQos(url, false, 0, duration);
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
