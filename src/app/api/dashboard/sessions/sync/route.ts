import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { timeEntries, projects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  // API key auth (not JWT — so the hook can call without browser cookies)
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.SYNC_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const sessions: Array<{
    sessionId: string;
    projectName: string;
    startTime: string;
    endTime: string;
    hours: number;
    messageCount: number;
  }> = Array.isArray(body) ? body : [body];

  const results = [];

  for (const session of sessions) {
    const { sessionId, projectName, startTime, endTime, hours, messageCount } = session;

    if (!sessionId || !projectName || !startTime || !endTime || !hours) {
      results.push({ sessionId, error: 'Missing required fields' });
      continue;
    }

    // Match project by name or GitHub repo URL folder
    const allProjects = await db.select().from(projects);
    const normalizedName = projectName.toLowerCase();
    const matched = allProjects.find((p) => {
      if (p.name.toLowerCase().includes(normalizedName)) return true;
      if (normalizedName.includes(p.name.toLowerCase())) return true;
      if (p.githubRepoUrl) {
        const repoFolder = p.githubRepoUrl.split('/').pop()?.toLowerCase() ?? '';
        if (repoFolder === normalizedName || normalizedName.includes(repoFolder)) return true;
      }
      return false;
    });

    if (!matched) {
      results.push({ sessionId, error: `No matching project for "${projectName}"` });
      continue;
    }

    // Check for existing entry with this sessionId (dedup)
    const existing = await db
      .select()
      .from(timeEntries)
      .where(and(eq(timeEntries.sessionId, sessionId), eq(timeEntries.source, 'claude_session')));

    if (existing.length > 0) {
      results.push({ sessionId, status: 'duplicate', projectId: matched.id });
      continue;
    }

    // Insert new time entry
    const date = startTime.split('T')[0]; // extract YYYY-MM-DD
    const result = await db
      .insert(timeEntries)
      .values({
        projectId: matched.id,
        date,
        hours: Math.round(hours * 100) / 100,
        source: 'claude_session',
        sessionId,
        notes: `Claude Code session: ${messageCount} messages, ${new Date(startTime).toLocaleTimeString()} – ${new Date(endTime).toLocaleTimeString()}`,
      })
      .returning();

    results.push({ sessionId, status: 'created', entryId: result[0].id, projectId: matched.id });
  }

  return NextResponse.json({ results });
}
