# Firestore to PostgreSQL/Neon Migration

Complete migration toolkit for moving from Firebase Firestore to Neon PostgreSQL.

## Prerequisites

1. **Node.js 18+** and npm
2. **Neon PostgreSQL account** at https://neon.tech
3. **Firebase project** with Firestore data
4. **Firebase Admin SDK access** (for OAuth data export)

## Quick Start

### 1. Install Dependencies

```bash
cd migration
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Firebase (Source)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# Neon PostgreSQL (Target)
DATABASE_URL=postgresql://user:password@host.neon.tech/db?sslmode=require
```

### 3. Run Schema

Apply the PostgreSQL schema to Neon:

```bash
psql "postgresql://user:password@host.neon.tech/db?sslmode=require" -f schema.sql
```

Or use the Prisma migration:

```bash
npx prisma migrate deploy
```

### 4. Export Firestore Data

```bash
npm run export-firestore
```

This exports all collections to `firestore-export.json`.

### 5. Import to PostgreSQL

```bash
npm run import-postgres
```

### 6. Verify Migration

```bash
npm run verify
```

### Full Migration (Single Command)

```bash
npm run full-migration
```

## Migration Order

Data is imported in this order to respect foreign key constraints:

1. **users** → user_stats, study_preferences, user_subjects, user_badges, user_availability
2. **rooms** → room_members
3. **messages**
4. **resources**
5. **study_sessions** → session_breaks
6. **quiz_attempts**

## ID Mapping

Firebase document IDs are preserved as `firebase_id` columns for reference. New UUIDs are generated for PostgreSQL primary keys.

Example mapping:

```
Firebase: users/abc123 → PostgreSQL: users/550e8400-e29b-41d4-a716-446655440000
```

The mapping is maintained in memory during migration to resolve references.

## Troubleshooting

### "Collection not found"

- Verify Firebase config in `.env`
- Check your Firestore security rules allow read access

### "Foreign key constraint failed"

- Check if referenced users/rooms exist
- Run verify.js to identify orphaned records

### "Connection refused" to Neon

- Verify DATABASE_URL is correct
- Check Neon dashboard for connection issues

### Need to restart migration

```bash
npm run rollback  # Truncate all tables
npm run full-migration  # Re-run
```

## OAuth Migration

Firebase Auth OAuth data requires separate export:

1. Go to Firebase Console → Authentication → Users
2. Export users (includes provider data)
3. Run `npm run migrate-oauth`

## Next Steps After Migration

1. **Update your app configuration**
   - Replace Firebase SDK with PostgreSQL client
   - Update authentication logic

2. **Set up file storage**
   - Migrate Firebase Storage files to S3/R2
   - Update `storage_key` in resources table

3. **Implement new backend**
   - Use the Prisma schema as reference
   - See `../backend/` for implementation examples

## File Structure

```
migration/
├── schema.sql                 # PostgreSQL schema
├── package.json
├── .env.example
├── prisma/
│   └── schema.prisma          # Prisma ORM schema
└── src/
    ├── database.js            # PostgreSQL connection
    ├── firebase.js            # Firestore exporter
    ├── transform.js           # Data transformation
    ├── export-firestore.js    # Export script
    ├── import-postgres.js     # Import script
    ├── verify.js              # Verification script
    ├── rollback.js            # Rollback script
    └── migrate-oauth.js       # OAuth migration
```
