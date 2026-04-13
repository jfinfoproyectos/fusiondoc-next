import { NextRequest, NextResponse } from 'next/server';
import { getTopics } from '@/lib/github';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const version = searchParams.get('version') || undefined;

  try {
    const topics = await getTopics(version);
    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Error in /api/topics:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}
