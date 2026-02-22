import { NextRequest, NextResponse } from 'next/server';
import { analyzeGitTime } from '@/lib/git/orchestrate';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const result = await analyzeGitTime(Number(id));
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
