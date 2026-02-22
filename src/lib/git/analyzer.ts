import { GitCommit } from './github';
import { createHash } from 'crypto';

export interface WorkSession {
  sessionId: string;
  startDate: string;
  endDate: string;
  hours: number;
  commits: GitCommit[];
}

const SESSION_GAP_MS = 2 * 60 * 60 * 1000; // 2 hours
const SINGLE_COMMIT_HOURS = 0.5; // 30 min estimate for single commit
const SESSION_BUFFER_HOURS = 0.5; // 30 min buffer for multi-commit sessions

export function groupIntoSessions(commits: GitCommit[]): WorkSession[] {
  if (commits.length === 0) return [];

  const sorted = [...commits].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const sessions: WorkSession[] = [];
  let currentSession: GitCommit[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prevTime = new Date(sorted[i - 1].date).getTime();
    const currTime = new Date(sorted[i].date).getTime();

    if (currTime - prevTime > SESSION_GAP_MS) {
      sessions.push(buildSession(currentSession));
      currentSession = [sorted[i]];
    } else {
      currentSession.push(sorted[i]);
    }
  }

  sessions.push(buildSession(currentSession));
  return sessions;
}

function buildSession(commits: GitCommit[]): WorkSession {
  const first = new Date(commits[0].date);
  const last = new Date(commits[commits.length - 1].date);

  let hours: number;
  if (commits.length === 1) {
    hours = SINGLE_COMMIT_HOURS;
  } else {
    const spanHours = (last.getTime() - first.getTime()) / (1000 * 60 * 60);
    hours = spanHours + SESSION_BUFFER_HOURS;
  }

  // Round to nearest 0.25
  hours = Math.round(hours * 4) / 4;
  if (hours < 0.25) hours = 0.25;

  const sessionId = createHash('sha256')
    .update(commits.map((c) => c.sha).join(','))
    .digest('hex')
    .slice(0, 12);

  return {
    sessionId,
    startDate: commits[0].date,
    endDate: commits[commits.length - 1].date,
    hours,
    commits,
  };
}
