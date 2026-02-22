import { db } from '@/lib/db';
import { timeEntries, projects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { fetchCommits } from './github';
import { groupIntoSessions, WorkSession } from './analyzer';

export interface AnalysisResult {
  sessions: WorkSession[];
  newEntries: number;
  totalHours: number;
}

export async function analyzeGitTime(projectId: number): Promise<AnalysisResult> {
  // Get project
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId));
  if (!project?.githubRepoUrl) {
    throw new Error('Project has no GitHub repo URL');
  }

  // Find the latest git_auto entry to get "since" date
  const existingEntries = await db
    .select()
    .from(timeEntries)
    .where(
      and(
        eq(timeEntries.projectId, projectId),
        eq(timeEntries.source, 'git_auto')
      )
    );

  const existingSessionIds = new Set(existingEntries.map((e) => e.sessionId).filter(Boolean));

  // Find the latest commit date to fetch since
  let since: string | undefined;
  if (existingEntries.length > 0) {
    const dates = existingEntries.map((e) => new Date(e.date).getTime());
    const latestDate = new Date(Math.max(...dates));
    // Go back 1 day to catch any edge cases
    latestDate.setDate(latestDate.getDate() - 1);
    since = latestDate.toISOString();
  }

  // Fetch and analyze
  const commits = await fetchCommits(project.githubRepoUrl, since);
  const sessions = groupIntoSessions(commits);

  // Upsert new sessions only
  let newEntries = 0;
  let totalHours = 0;

  for (const session of sessions) {
    totalHours += session.hours;

    if (existingSessionIds.has(session.sessionId)) continue;

    await db.insert(timeEntries).values({
      projectId,
      date: session.startDate.split('T')[0],
      hours: session.hours,
      source: 'git_auto',
      sessionId: session.sessionId,
      commitHash: session.commits[0].sha,
      notes: `${session.commits.length} commit(s): ${session.commits[0].message.split('\n')[0]}`,
    });
    newEntries++;
  }

  return { sessions, newEntries, totalHours };
}
