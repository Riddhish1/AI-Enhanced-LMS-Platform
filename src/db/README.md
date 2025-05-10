# Database Migrations

This directory contains SQL migrations for the learning platform's database structure.

## Running Migrations

To apply the migrations to your Supabase database, follow these steps:

1. Make sure you have the Supabase CLI installed:
   ```
   npm install -g supabase
   ```

2. Log in to your Supabase account:
   ```
   supabase login
   ```

3. Link your project:
   ```
   supabase link --project-ref your-project-ref
   ```

4. Apply the migrations in order:
   ```
   supabase db push
   ```

## Migration Files

- `001_initial_schema.sql`: Initial database schema with users, courses, and modules tables
- `002_user_progress.sql`: Added user progress tracking functionality
- `003_create_learning_goals.sql`: Added learning goals feature

## Creating New Migrations

When adding a new feature that requires database changes, create a new migration file with incremental numbering:

```
004_your_feature_name.sql
```

Make sure to:
1. Use atomic operations
2. Include proper error handling (IF EXISTS/IF NOT EXISTS)
3. Set up appropriate Row Level Security policies
4. Add indexes for frequently queried columns

## Reverting Migrations

To revert a migration, create a new migration file that undoes the changes. For example:

```sql
-- Revert learning goals feature
DROP TABLE IF EXISTS learning_goals;
``` 