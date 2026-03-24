import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

async function setupTables() {
    let url = process.env.DATABASE_URL;
    if (url.includes('?')) url = url.split('?')[0];

    const pool = new Pool({
        connectionString: url,
        ssl: { rejectUnauthorized: false },
    });

    try {
        console.log('--- Database Setup ---');

        // 1. Create schemas
        await pool.query("CREATE SCHEMA IF NOT EXISTS auth");
        await pool.query("CREATE SCHEMA IF NOT EXISTS ecommerce");
        console.log('✅ Schemas ensured.');

        // 2. Create customers table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS auth.customers (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table auth.customers ensured.');

        // 3. Create admins table (optional but good for context)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS auth.admins (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table auth.admins ensured.');

        console.log('--- Setup Complete ---');
    } catch (err) {
        console.error('❌ Setup failed:', err.message);
    } finally {
        await pool.end();
    }
}

setupTables();
