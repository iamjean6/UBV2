import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });
import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

async function migrate() {
    if (!connectionString) {
        console.error('DATABASE_URL is not defined');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    try {
        console.log('Starting migration with full connection string...');
        await pool.query(`
            ALTER TABLE sports.players 
            ALTER COLUMN position TYPE text[] 
            USING array[position];
        `);
        console.log('Migration successful!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();
