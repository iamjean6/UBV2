import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });
import pool from '../pgdb/db.js';

async function migrate() {
    try {
        console.log('Starting migration: ALTER COLUMN position TYPE text[]...');
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
    }
}

migrate();
