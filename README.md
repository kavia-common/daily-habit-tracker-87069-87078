# daily-habit-tracker-87069-87078

## Supabase Setup and Seeding

Use the SQL files under ./supabase in this order:

1) schema.sql
2) policies.sql
3) seed.sql (optional demo data)

Run them in your Supabase project SQL Editor. Before running seed.sql, set the test user id for the session using your auth.users UUID:

select set_config('app.test_user_id', '<your-auth-user-uuid>', false);

You can re-run seed.sql; it is guarded to avoid duplicate inserts.