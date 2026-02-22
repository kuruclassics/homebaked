export interface GitCommit {
  sha: string;
  message: string;
  author: string;
  date: string; // ISO string
}

function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  // Handles https://github.com/owner/repo and https://github.com/owner/repo.git
  const match = url.match(/github\.com\/([^/]+)\/([^/.]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

export async function fetchCommits(
  repoUrl: string,
  since?: string,
): Promise<GitCommit[]> {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) throw new Error('Invalid GitHub repo URL');

  const { owner, repo } = parsed;
  const token = process.env.GITHUB_PAT;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const allCommits: GitCommit[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = new URL(`https://api.github.com/repos/${owner}/${repo}/commits`);
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('page', String(page));
    if (since) url.searchParams.set('since', since);

    const res = await fetch(url.toString(), { headers });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GitHub API error ${res.status}: ${text}`);
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;

    for (const commit of data) {
      allCommits.push({
        sha: commit.sha,
        message: commit.commit?.message ?? '',
        author: commit.commit?.author?.name ?? commit.author?.login ?? 'unknown',
        date: commit.commit?.author?.date ?? '',
      });
    }

    if (data.length < perPage) break;
    page++;
    // Safety: cap at 10 pages (1000 commits)
    if (page > 10) break;
  }

  return allCommits.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
