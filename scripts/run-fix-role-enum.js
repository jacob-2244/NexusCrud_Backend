/**
 * One-time migration: fix users_role_enum (user -> manager).
 * Run: node scripts/run-fix-role-enum.js
 * Uses .env from project root (NexusCrud_Backend).
 */

const { readFileSync, existsSync } = require('fs');
const { resolve } = require('path');
const { Client } = require('pg');

function loadEnv() {
  const envPath = resolve(__dirname, '../.env');
  if (!existsSync(envPath)) return;
  const content = readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const m = line.match(/^\s*([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  });
}

loadEnv();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'Crud_db',
};

const sql = `
BEGIN;
-- Drop default so the column type can be changed
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;

CREATE TYPE users_role_enum_new AS ENUM ('admin', 'manager', 'guest');
ALTER TABLE users
  ALTER COLUMN role TYPE users_role_enum_new
  USING (
    CASE WHEN role::text = 'user' THEN 'manager'::users_role_enum_new
         ELSE role::text::users_role_enum_new
    END
  );
DROP TYPE users_role_enum;
ALTER TYPE users_role_enum_new RENAME TO users_role_enum;

-- Restore default
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'manager'::users_role_enum;
COMMIT;
`;

async function main() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to', config.database);
    await client.query(sql);
    console.log('Migration completed: role enum is now (admin, manager, guest).');
  } catch (err) {
    if (err.message && err.message.includes('already exists')) {
      console.log('Enum already migrated (users_role_enum_new or new enum exists). Nothing to do.');
    } else {
      console.error('Migration failed:', err.message);
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

main();
