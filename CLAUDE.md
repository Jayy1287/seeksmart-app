# SeekSmart: rules for AI coding agents

These instructions apply to Claude Code and any other agent working in this repository. They override default agent behaviour.

## Commits and pull requests

- Use the git identity already configured in the clone you are working in. Do not change it. In the maintainer's clone that is the repository owner; in a contributor's clone it is the contributor, whose commits must be signed off (`git commit -s`, see CONTRIBUTING.md and CLA.md).
- Never add `Co-Authored-By`, `Generated with`, robot emoji, or any other AI attribution to commit messages, PR titles, or PR descriptions. The human whose identity is configured is the author of record.
- Commit message style: imperative subject under 72 characters, blank line, then short bullet points describing what changed and why.
- Commit in logical batches as work progresses. Do not push or force-push unless the person you are working with asks in that conversation.
- Never commit `.env*` files, `tmp/`, backups, credentials, or anything under `public/logos` and `public/screenshots` (third-party media, see NOTICE.md).

## Working in this repo

- Read `HANDOFF.md` for architecture, `CONTRIBUTING.md` for the workflow, and `docs/REVAMP_PLAN.md` for product direction before large changes.
- Keep the dependency direction: `app -> features/server -> shared/lib`; no database access from UI components.
- Run `npm run lint`, `npm run typecheck`, `npm run test:recommendations`, and `npm run build` before calling work done.
- `.env` may point at a production database. Back up before migrations or seeds, and confirm with the person you are working with before any destructive or outward-facing action (deploys, force pushes, data deletion).
- Licensing: code is AGPL-3.0-only, the catalogue dataset is CC BY-NC-SA 4.0, the brand is reserved. Do not add dependencies or content whose licence conflicts with that.
