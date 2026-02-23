#!/usr/bin/env node
/**
 * Claude Code Session → Dashboard Sync Script
 *
 * Parses Claude Code JSONL session files and syncs them as time entries.
 *
 * Usage:
 *   npx tsx src/lib/sync-sessions.ts <session.jsonl>       # sync single session
 *   npx tsx src/lib/sync-sessions.ts --bulk <project-dir>  # sync all sessions in dir
 *
 * Env:
 *   SYNC_API_KEY   — API key for the dashboard sync endpoint
 *   SYNC_API_URL   — (optional) override API URL, defaults to https://homebaked.dev
 */

import { readFileSync, readdirSync } from 'fs';
import { basename, join, resolve } from 'path';

const API_URL = process.env.SYNC_API_URL || 'https://homebaked.dev';
const API_KEY = process.env.SYNC_API_KEY;

interface JsonlEvent {
  type: string;
  sessionId?: string;
  timestamp?: string;
  cwd?: string;
  message?: {
    role?: string;
  };
}

interface SessionData {
  sessionId: string;
  projectName: string;
  startTime: string;
  endTime: string;
  hours: number;
  messageCount: number;
}

function parseSessionFile(filePath: string): SessionData | null {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');

  let sessionId: string | null = null;
  let cwd: string | null = null;
  let firstTimestamp: string | null = null;
  let lastTimestamp: string | null = null;
  let userMessageCount = 0;

  for (const line of lines) {
    if (!line.trim()) continue;

    let event: JsonlEvent;
    try {
      event = JSON.parse(line);
    } catch {
      continue; // skip malformed lines
    }

    // Extract session metadata from first event that has it
    if (!sessionId && event.sessionId) {
      sessionId = event.sessionId;
    }
    if (!cwd && event.cwd) {
      cwd = event.cwd;
    }

    // Track timestamps
    if (event.timestamp) {
      if (!firstTimestamp) firstTimestamp = event.timestamp;
      lastTimestamp = event.timestamp;
    }

    // Count user messages
    if (event.type === 'user' && event.message?.role === 'user') {
      userMessageCount++;
    }
  }

  if (!sessionId || !firstTimestamp || !lastTimestamp || !cwd) {
    return null;
  }

  // Derive project name from the working directory folder name
  const projectName = basename(cwd);

  // Calculate duration in hours
  const start = new Date(firstTimestamp);
  const end = new Date(lastTimestamp);
  const durationMs = end.getTime() - start.getTime();
  const hours = durationMs / (1000 * 60 * 60);

  // Skip very short sessions (< 1 minute)
  if (hours < 1 / 60) {
    return null;
  }

  return {
    sessionId,
    projectName,
    startTime: firstTimestamp,
    endTime: lastTimestamp,
    hours: Math.round(hours * 100) / 100,
    messageCount: userMessageCount,
  };
}

async function syncSession(session: SessionData): Promise<void> {
  const url = `${API_URL}/api/dashboard/sessions/sync`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY!,
    },
    body: JSON.stringify(session),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[FAIL] ${session.sessionId}: HTTP ${res.status} — ${text}`);
    return;
  }

  const data = await res.json();
  const result = data.results?.[0];
  if (result?.status === 'duplicate') {
    console.log(`[SKIP] ${session.sessionId}: already synced`);
  } else if (result?.status === 'created') {
    console.log(`[OK]   ${session.sessionId}: ${session.hours}h → project #${result.projectId}`);
  } else if (result?.error) {
    console.error(`[FAIL] ${session.sessionId}: ${result.error}`);
  }
}

async function main() {
  if (!API_KEY) {
    console.error('Error: SYNC_API_KEY environment variable is required');
    process.exit(1);
  }

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage:');
    console.error('  npx tsx src/lib/sync-sessions.ts <session.jsonl>');
    console.error('  npx tsx src/lib/sync-sessions.ts --bulk <project-dir>');
    process.exit(1);
  }

  if (args[0] === '--bulk') {
    // Bulk mode: sync all .jsonl files in the given directory
    const dir = resolve(args[1] || '.');
    const files = readdirSync(dir).filter((f) => f.endsWith('.jsonl'));
    console.log(`Found ${files.length} session files in ${dir}`);

    const sessions: SessionData[] = [];
    for (const file of files) {
      const session = parseSessionFile(join(dir, file));
      if (session) sessions.push(session);
    }

    console.log(`Parsed ${sessions.length} valid sessions`);

    // Batch sync
    if (sessions.length > 0) {
      const url = `${API_URL}/api/dashboard/sessions/sync`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(sessions),
      });

      if (!res.ok) {
        console.error(`HTTP ${res.status}: ${await res.text()}`);
        process.exit(1);
      }

      const data = await res.json();
      for (const result of data.results) {
        if (result.status === 'duplicate') {
          console.log(`[SKIP] ${result.sessionId}: already synced`);
        } else if (result.status === 'created') {
          console.log(`[OK]   ${result.sessionId}: → project #${result.projectId}`);
        } else if (result.error) {
          console.error(`[FAIL] ${result.sessionId}: ${result.error}`);
        }
      }
    }
  } else {
    // Single file mode
    const filePath = resolve(args[0]);
    const session = parseSessionFile(filePath);
    if (!session) {
      console.error(`Could not parse session from ${filePath}`);
      process.exit(1);
    }
    console.log(`Session: ${session.sessionId}`);
    console.log(`Project: ${session.projectName}`);
    console.log(`Duration: ${session.hours}h (${session.messageCount} user messages)`);
    console.log(`Period: ${session.startTime} → ${session.endTime}`);
    await syncSession(session);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
