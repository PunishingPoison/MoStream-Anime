import { NextRequest, NextResponse } from 'next/server';

const TELEMETRY_URL = 'https://api.mangadex.network/report';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, success, cached, bytes, duration } = body;

    if (!url || typeof success !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload: url (string) and success (boolean) required' }, { status: 400 });
    }

    const payload = {
      url: String(url),
      success: Boolean(success),
      cached: Boolean(cached ?? false),
      bytes: Number(bytes ?? 0),
      duration: Number(duration ?? 0),
    };

    const mdRes = await fetch(TELEMETRY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      forwarded: mdRes.ok,
      status: mdRes.status,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
