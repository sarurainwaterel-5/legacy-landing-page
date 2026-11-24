# Legacy Partners — website, client portal and admin

Next.js 16 app for legacypartners.agency: the public site (life insurance, credit repair, tax preparation),
lead capture, a client portal and a staff dashboard. Hosted on Vercel; data in Neon Postgres; documents in a
private Vercel Blob store.

## What's in it

- **Public site** — `/`, `/life-insurance`, `/credit-repair`, `/tax-preparation`, `/about`, `/privacy`, `/terms`.
  Fully server-rendered (search engines and link previews see the content).
- **Leads** — the quote form posts to `/api/leads`, which saves to Postgres (with the consent text shown) and
  emails `NOTIFY_EMAIL`. Google Analytics `generate_lead` fires only after a successful save. `/thank-you` embeds Calendly.
- **Client portal** (`/portal`) — sign in with an 8-character email code or Google. Clients upload documents,
  sign agreements, follow credit repair disputes and message staff.
- **Admin** (`/admin`) — for emails listed in `ADMIN_EMAILS`: leads, clients, cases, dispute items, agreements,
  documents and messages.

## Compliance notes (read before launch)

- Credit repair agreements follow the Credit Repair Organizations Act: separate rights disclosure before signing,
  written fee terms, a 3-business-day cancellation right (computed in `src/lib/business-days.js`) with an in-portal
  cancel button, and no fees before services are performed. Texas also requires Credit Services Organization
  registration and a surety bond (Tex. Fin. Code ch. 393) — set `NEXT_PUBLIC_CSO_REGISTRATION`. **Agreements can't be
  signed until the business address and CSO registration are set.** Have an attorney review `src/lib/agreements.js`.
  Credit repair is **switched off** (hidden from the site, quote form, portal and admin) until
  `NEXT_PUBLIC_CREDIT_REPAIR_OPEN=true` is set on Vercel and the site is redeployed.
- Tax information may only be used for tax preparation unless the client signs a separate IRC § 7216 consent.
- Tax preparers must keep a written information security plan (FTC Safeguards Rule / IRS Pub. 4557).

## Local development

```bash
docker run -d --name legacy-pg -e POSTGRES_USER=legacy -e POSTGRES_PASSWORD=legacy -e POSTGRES_DB=legacy -p 54330:5432 postgres:16-alpine
docker exec -i legacy-pg psql -U legacy -d legacy < prisma/schema-changes/20261124_init.sql
cp .env.example .env.local   # fill in values; without EMAIL_USER, sign-in codes are printed to the terminal
npm install
npm run dev                  # http://localhost:3200
npm test                     # unit tests
```

## Database changes

Schema changes are SQL files in `prisma/schema-changes/`, applied by hand (`psql "$DIRECT_URL" -f file.sql`),
then `npx prisma generate`.

## Environment variables

See `.env.example`.
