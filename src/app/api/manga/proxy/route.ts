import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_DOMAINS = ['mangadex.network', 'mangadex.org', 'uploads.mangadex.org'];
const TELEMETRY_URL = 'https://api.mangadex.network/report';

async function sendQosReport(payload: {
  url: string;
  success: boolean;
  cached: boolean;
  bytes: number;
  duration: number;
}) {
  try {
    await fetch(TELEMETRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // silent — telemetry must never break reading
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const base = searchParams.get('base');
  const hash = searchParams.get('hash');
  const quality = searchParams.get('quality') || 'data';
  const file = searchParams.get('file');

  if (!base || !hash || !file) {
    return NextResponse.json({ error: 'Missing required params: base, hash, file' }, { status: 400 });
  }

  try {
    const baseUrl = new URL(base);
    const allowed = ALLOWED_DOMAINS.some((d) => baseUrl.hostname.endsWith(d));
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden: invalid image domain' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid base URL' }, { status: 400 });
  }

  const validQuality = quality === 'data' || quality === 'data-saver';
  const imageUrl = `${base}/${validQuality ? quality : 'data'}/${hash}/${file}`;

  const start = performance.now();
  let bytes = 0;
  let success = false;
  let cached = false;

  try {
    const response = await fetch(imageUrl, {
      headers: { 'User-Agent': 'MoStream-Anime/1.0' },
    });

    const duration = Math.round(performance.now() - start);
    success = response.ok;

    if (!response.ok) {
      if (!base.includes('mangadex.org')) {
        sendQosReport({ url: imageUrl, success: false, cached: false, bytes: 0, duration });
      }
      return new NextResponse(`Image fetch failed: ${response.status}`, { status: response.status });
    }

    const cacheHeader = response.headers.get('X-Cache') || '';
    cached = cacheHeader.toUpperCase().startsWith('HIT');
    bytes = parseInt(response.headers.get('Content-Length') || '0', 10);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    if (bytes === 0) bytes = buffer.byteLength;

    if (!base.includes('mangadex.org')) {
      sendQosReport({ url: imageUrl, success: true, cached, bytes, duration });
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': bytes.toString(),
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'X-Image-Source': 'mangadex',
        'X-QoS-Bytes': bytes.toString(),
        'X-QoS-Duration': duration.toString(),
        'X-QoS-Cached': cached.toString(),
      },
    });
  } catch {
    const duration = Math.round(performance.now() - start);
    if (!base.includes('mangadex.org')) {
      sendQosReport({ url: imageUrl, success: false, cached: false, bytes: 0, duration });
    }
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
