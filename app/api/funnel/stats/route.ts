import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/funnel/store';

export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId') ?? 'yani-trend';
  const stats = store.getStats(businessId);
  return NextResponse.json({ stats });
}
