-- Fix role enum: migrate 'user' -> 'manager' and use enum (admin, manager, guest).
-- Run this once when you see: invalid input value for enum users_role_enum: "user"
-- Example: psql -U postgres -d Crud_db -f scripts/fix-role-enum.sql

BEGIN;

-- Drop default so the column type can be changed
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

-- Create new enum with admin, manager, guest (no 'user')
CREATE TYPE users_role_enum_new AS ENUM ('admin', 'manager', 'guest');

-- Change column to new type: map existing 'user' to 'manager'
ALTER TABLE users
  ALTER COLUMN role TYPE users_role_enum_new
  USING (
    CASE WHEN role::text = 'user' THEN 'manager'::users_role_enum_new
         ELSE role::text::users_role_enum_new
    END
  );

-- Drop old enum and rename new one so TypeORM keeps working
DROP TYPE users_role_enum;
ALTER TYPE users_role_enum_new RENAME TO users_role_enum;

-- Restore default
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'manager'::users_role_enum;

COMMIT;
