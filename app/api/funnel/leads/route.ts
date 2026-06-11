import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/funnel/store';
import { Lead } from '@/lib/funnel/types';

export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId') ?? undefined;
  const leads = store.getLeads(businessId);
  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { businessId, name, phone, email, utm } = body;

    if (!businessId || !phone) {
      return NextResponse.json({ error: 'businessId and phone required' }, { status: 400 });
    }

    const lead = store.createLead({
      businessId,
      name: name || 'Sin nombre',
      phone,
      email,
      status: 'new',
      score: 10,
      stage: 'awareness',
      tags: [],
      chatHistory: [],
      customFields: {},
      utm: utm || {},
      qualification: { painPoints: [], interests: [], objections: [] },
    });

    return NextResponse.json({ lead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
