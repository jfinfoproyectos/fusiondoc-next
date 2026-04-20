import { NextRequest, NextResponse } from 'next/server';
import { getTopics } from '@/lib/github';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const versionParam = searchParams.get('version') || undefined;

  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  const domainVersion = (subdomain && subdomain !== 'localhost' && subdomain !== 'www' && subdomain !== '127') ? subdomain : undefined;
  
  const version = versionParam || domainVersion;

  try {
    const topics = await getTopics(version);
    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Error in /api/topics:', error);
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
}
