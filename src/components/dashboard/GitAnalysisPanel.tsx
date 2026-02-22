'use client';

import { useState } from 'react';
import { GitBranch, Play, Clock } from 'lucide-react';

interface WorkSession {
  sessionId: string;
  startDate: string;
  endDate: string;
  hours: number;
  commits: { sha: string; message: string; author: string; date: string }[];
}

interface AnalysisResult {
  sessions: WorkSession[];
  newEntries: number;
  totalHours: number;
  error?: string;
}

interface GitAnalysisPanelProps {
  projectId: number;
  repoUrl: string | null;
  onNewEntries: () => void;
}

export default function GitAnalysisPanel({ projectId, repoUrl, onNewEntries }: GitAnalysisPanelProps) {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAnalyze() {
    setLoading(true);
    setError('');
    setResult(null);

    const res = await fetch(`/api/dashboard/projects/${projectId}/analyze-git`, { method: 'POST' });
    const data = await res.json();

    if (data.error) {
      setError(data.error);
    } else {
      setResult(data);
      if (data.newEntries > 0) onNewEntries();
    }
    setLoading(false);
  }

  if (!repoUrl) {
    return (
      <div className="bg-white rounded-xl border border-cream-dark p-8 text-center">
        <GitBranch className="w-8 h-8 text-warm-gray-light mx-auto mb-3" />
        <p className="text-warm-gray">No GitHub repo connected.</p>
        <p className="text-sm text-warm-gray-light mt-1">Edit this project to add a GitHub repo URL.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-cream-dark p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-charcoal">GitHub Repository</p>
          <p className="text-xs text-warm-gray mt-0.5 truncate max-w-md">{repoUrl}</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-charcoal text-cream text-sm font-medium hover:bg-charcoal-light transition-colors disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          {loading ? 'Analyzing...' : 'Analyze Commits'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div>
          <div className="bg-honey/5 border border-honey/20 rounded-xl p-4 mb-4">
            <p className="text-sm text-charcoal">
              Found <span className="font-semibold">{result.sessions.length}</span> work sessions
              ({result.totalHours.toFixed(1)}h total).
              {result.newEntries > 0 && (
                <span className="text-honey font-medium"> Added {result.newEntries} new time entries.</span>
              )}
              {result.newEntries === 0 && (
                <span className="text-warm-gray"> No new entries to add.</span>
              )}
            </p>
          </div>

          <div className="space-y-3">
            {result.sessions.map((session) => (
              <div key={session.sessionId} className="bg-white rounded-xl border border-cream-dark p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warm-gray" />
                    <span className="text-sm font-medium text-charcoal">
                      {new Date(session.startDate).toLocaleDateString()} — {session.hours}h
                    </span>
                  </div>
                  <span className="text-xs text-warm-gray bg-cream-dark px-2 py-0.5 rounded-full">
                    {session.commits.length} commit{session.commits.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-1">
                  {session.commits.slice(0, 5).map((commit) => (
                    <p key={commit.sha} className="text-xs text-warm-gray truncate">
                      <span className="font-mono text-warm-gray-light">{commit.sha.slice(0, 7)}</span>{' '}
                      {commit.message.split('\n')[0]}
                    </p>
                  ))}
                  {session.commits.length > 5 && (
                    <p className="text-xs text-warm-gray-light">...and {session.commits.length - 5} more</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
