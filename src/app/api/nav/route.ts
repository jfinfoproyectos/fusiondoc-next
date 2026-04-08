import { NextRequest, NextResponse } from 'next/server';
import { getNavigation, getTopics } from '@/lib/github';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const activeTopic = searchParams.get('topic') || undefined;

  try {
    // If no topic requested, or checking for topic list, we could handle that
    // But primarily we want the navigation for the sidebar
    const navItems = await getNavigation(activeTopic);
    return NextResponse.json({ navItems });
  } catch (error) {
    console.error('Error in /api/nav:', error);
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 });
  }
}
