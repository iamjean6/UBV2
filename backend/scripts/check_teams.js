import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });
import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

async function checkTeams() {
    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    try {
        const res = await pool.query('SELECT id, name FROM sports.teams');
        console.log('Available Teams:', res.rows);
        process.exit(0);
    } catch (err) {
        console.error('Check teams failed:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

checkTeams();
