import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });
import pool from '../pgdb/db.js';

async function check() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'sports' AND table_name = 'players';
        `);
        console.log(res.rows);
        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
}

check();
