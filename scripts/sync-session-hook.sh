#!/bin/bash
# Claude Code Stop hook — syncs session time to dashboard
# Reads hook input from stdin, extracts transcript_path, runs sync script

# Read stdin (hook input JSON)
INPUT=$(cat)

# Extract transcript_path from the hook input
TRANSCRIPT_PATH=$(echo "$INPUT" | node -e "
  let d=''; process.stdin.on('data',c=>d+=c);
  process.stdin.on('end',()=>{try{console.log(JSON.parse(d).transcript_path||'')}catch{console.log('')}});
")

if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
  exit 0
fi

# Run sync script in background so it doesn't block Claude Code
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
(cd "$SCRIPT_DIR" && npx tsx src/lib/sync-sessions.ts "$TRANSCRIPT_PATH" 2>/dev/null) &

exit 0
