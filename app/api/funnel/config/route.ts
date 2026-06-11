import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/funnel/store';
import { BusinessConfig } from '@/lib/funnel/types';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (id) {
    const config = store.getConfig(id);
    if (!config) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ config });
  }
  return NextResponse.json({ configs: store.getAllConfigs() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as BusinessConfig;
    if (!body.id || !body.name) {
      return NextResponse.json({ error: 'id and name required' }, { status: 400 });
    }
    const config = store.upsertConfig({ ...body, createdAt: body.createdAt ?? new Date().toISOString() });
    return NextResponse.json({ config }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
