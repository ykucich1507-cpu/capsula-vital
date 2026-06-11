import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/funnel/store';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const lead = store.getLead(params.id);
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patch = await req.json();
    const lead = store.updateLead(params.id, patch);
    if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
