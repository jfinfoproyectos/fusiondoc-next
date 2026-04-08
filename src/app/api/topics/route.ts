import { NextResponse } from 'next/server';
import { getTopics } from '@/lib/github';

export async function GET() {
  try {
    const topics = await getTopics();
    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Error in /api/topics:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}
