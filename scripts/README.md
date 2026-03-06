# Database scripts

## Fix role enum (user → manager)

Fixes the error: **invalid input value for enum users_role_enum: "user"**

After changing roles from (admin, user, guest) to (admin, manager, guest), run the migration **once** before starting the backend.

### Option 1: npm script (recommended, no psql needed)

From the backend folder:

```bash
cd NexusCrud_Backend
npm run db:fix-role-enum
```

Uses your `.env` (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD or DB_PASS, DB_NAME). Then start the backend:

```bash
npm run start:dev
```

### Option 2: psql

```bash
psql -U postgres -d Crud_db -f scripts/fix-role-enum.sql
```

### Option 3: pgAdmin or another GUI

Open `scripts/fix-role-enum.sql` and run its contents against your database.
