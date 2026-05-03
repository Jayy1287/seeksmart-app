# SeekSmart Production Beta Checklist

## Required Before Public Traffic

- Configure production `DATABASE_URL` and `DIRECT_URL`.
- Configure `ADMIN_PASSWORD` with a long random secret.
- Confirm database backup and restore steps in Supabase.
- Set `NEXT_PUBLIC_SITE_URL` or the production site URL used by metadata.
- Run `npm run build`.
- Run `SMOKE_BASE_URL=https://your-domain.example npm run test:smoke`.
- Verify `/api/v1/health` returns healthy in production.

## Trust And Legal

- Review `/privacy` and `/terms` with final business details.
- Replace the feedback mailto with the real branded inbox.
- Keep audit V1 anonymous until saved reports and privacy language are ready.
- Avoid collecting sensitive customer, health, financial, credential, or private document data.

## Launch QA

- Run the audit from `/audit/start` to `/audit/results`.
- Open the top recommended use-case page and one recommended tool page.
- Check mobile screenshots for home, audit, use-case detail, tool detail, submit, and feedback.
- Verify public submissions are rate-limited and still accepted for normal users.
- Verify admin login still works and rate limits repeated attempts.

## Measurement

- Connect the provider-neutral `seeksmart:analytics` events to the chosen analytics provider.
- Track page views, audit starts, audit completions, submission completions, and tool website clicks.
- Review audit outputs manually from test users before adding accounts or paid reports.

## Go-To-Market

- Choose the first narrow audience.
- Publish the first 10 high-quality resources or playbooks.
- Do direct outreach to 30-50 operators or small businesses.
- Collect feedback through calls, forms, and the feedback inbox.
