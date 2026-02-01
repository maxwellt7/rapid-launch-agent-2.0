import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n');

  try {
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    console.log(`📅 Server time: ${testResult.rows[0].now}\n`);

    // Read and run schema file
    const schemaPath = join(__dirname, '001_initial_schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf8');

    console.log('📝 Running schema migration: 001_initial_schema.sql');

    await pool.query(schemaSql);

    console.log('✅ Schema migration completed successfully\n');

    // Verify tables created
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📊 Created tables:');
    tablesResult.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n✅ Database migration completed successfully!');
    console.log('\n🎉 Your database is ready to use.\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('\nError details:', error.message);

    if (error.code) {
      console.error('Error code:', error.code);
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
runMigrations();
