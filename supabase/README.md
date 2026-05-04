# Supabase setup — ForPrincess

One-time steps to bring the backend online. ~10 minutes.

## 1. Create project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Region: **Singapore** (lowest latency from Vietnam).
3. Save the auto-generated DB password somewhere safe.

## 2. Run the schema

In the Supabase dashboard → **SQL Editor** → **New query**, paste the
contents of [`schema.sql`](./schema.sql) and run it. The script is
idempotent, so re-running is safe.

It creates:
- `user_role` and `wish_priority` enums.
- `profiles` table (extends `auth.users`).
- `wish_items` table with `is_secretly_buying` / `is_gifted` flags.
- Two indexes (status, gifted-at).
- An `updated_at` trigger.
- Row-Level Security policies for the Princess / Knight split.

## 3. Storage bucket

**Storage** → **New bucket**:
- Name: `wish-images`
- Public: **on** (we serve via the public CDN URL).
- File size limit: 2 MB.

After creating the bucket, **re-run [`schema.sql`](./schema.sql)** so the
storage RLS policies at the bottom of the file get applied. "Public" only
makes reads public — uploads still need an explicit `insert` policy on
`storage.objects`, otherwise every upload gets rejected by RLS.

## 4. Auth

**Authentication** → **Providers** → **Email**:
- Enable email + password.
- **Disable Sign-up** ("Allow new users to sign up" → off). Only the two
  hand-created users can log in.

## 5. Create the two users + profiles

**Authentication** → **Users** → **Add user** twice (one for Princess,
one for Knight). Then back in the **SQL Editor**:

```sql
insert into profiles (id, display_name, role) values
  ('e2d149a6-94ba-4e0c-98ca-263cef4dc47c', 'Princess', 'PRINCESS'),
  ('f7cb7d69-458f-420f-bbed-b1d96e19b496',   'Knight',   'KNIGHT');
```

## 6. Wire env vars

Copy [`/.env.example`](../.env.example) to `.env.local` and paste the
values from **Settings → API**:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only)

That's it. `npm run dev` should now talk to Supabase.

## 7. (Optional) Generate typed DB definitions

Once the schema is live, regenerate the typed `Database` definitions:

```bash
SUPABASE_PROJECT_ID=your-project-ref npm run db:types
```

This overwrites `src/types/db.ts` with the generated types.
