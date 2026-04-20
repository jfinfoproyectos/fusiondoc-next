import { NextRequest, NextResponse } from 'next/server';
import { getNavigation, getTopics } from '@/lib/github';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const activeTopic = searchParams.get('topic') || undefined;
  const versionParam = searchParams.get('version') || undefined;

  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  const domainVersion = (subdomain && subdomain !== 'localhost' && subdomain !== 'www' && subdomain !== '127') ? subdomain : undefined;
  
  const version = versionParam || domainVersion;

  try {
    const navItems = await getNavigation(activeTopic, version);
    return NextResponse.json({ navItems });
  } catch (error) {
    console.error('Error in /api/nav:', error);
    return NextResponse.json({ error: 'Failed to fetch navigation' }, { status: 500 });
  }
}
