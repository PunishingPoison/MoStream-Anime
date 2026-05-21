import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_DOMAINS = ['mangadex.network', 'mangadex.org', 'uploads.mangadex.org'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get('base');
  const hash = searchParams.get('hash');
  const quality = searchParams.get('quality') || 'data';
  const file = searchParams.get('file');

  if (!base || !hash || !file) {
    return new NextResponse('Missing required params: base, hash, file', { status: 400 });
  }

  try {
    const baseUrl = new URL(base);
    const allowed = ALLOWED_DOMAINS.some((d) => baseUrl.hostname.endsWith(d));
    if (!allowed) {
      return new NextResponse('Forbidden: invalid image domain', { status: 403 });
    }
  } catch {
    return new NextResponse('Invalid base URL', { status: 400 });
  }

  const validQuality = quality === 'data' || quality === 'data-saver';
  const imageUrl = `${base}/${validQuality ? quality : 'data'}/${hash}/${file}`;

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'MoStream-Anime/1.0',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Image fetch failed: ${response.status}`, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'X-Image-Source': 'mangadex',
      },
    });
  } catch (err) {
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
