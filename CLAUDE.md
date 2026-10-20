# SeekSmart: rules for AI coding agents

These instructions apply to Claude Code and any other agent working in this repository. They override default agent behaviour.

## Commits and pull requests

- Commits are authored by the repository owner. Use the git identity already configured in this clone (`Sanjay Rajakumar <sanjayrajakumar17@gmail.com>`). Do not change it.
- Never add `Co-Authored-By`, `Generated with`, `Signed-off-by: Claude`, robot emoji, or any other AI attribution to commit messages, PR titles, or PR descriptions. The owner is the author of record.
- Commit message style: imperative subject under 72 characters, blank line, then short bullet points describing what changed and why. No trailers.
- Commit in logical batches as work progresses (the owner wants visible, periodic commits). Do not push or force-push unless the owner asks in that conversation.
- Never commit `.env*` files, `tmp/`, backups, or credentials.

## Working in this repo

- Read `HANDOFF.md` for architecture and `docs/REVAMP_PLAN.md` for product direction before large changes.
- Keep the dependency direction: `app -> features/server -> shared/lib`; no database access from UI components.
- Run `npm run lint`, `npm run typecheck`, `npm run test:recommendations`, and `npm run build` before calling work done.
- Production data lives in Supabase; `.env` may point at it. Back up before migrations or seeds, and confirm with the owner before any destructive or outward-facing action (deploys, force pushes, data deletion).
