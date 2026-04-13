import { NextRequest, NextResponse } from 'next/server';
import { performSearch } from '@/lib/search';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const version = searchParams.get('version') || undefined;

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await performSearch(query, version);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
