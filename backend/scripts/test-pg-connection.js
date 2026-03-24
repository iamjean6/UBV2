import 'dotenv/config';
import pool from '../pgdb/db.js';

async function testConnection() {
    console.log('Testing PostgreSQL connection...');
    try {
        const res = await pool.query('SELECT NOW(), current_database()');
        console.log('Connection successful!');
        console.log('Current Database:', res.rows[0].current_database);
        console.log('Server Time:', res.rows[0].now);

        // Attempt to list tables in sports schema
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'sports'
        `);
        console.log('Tables found in "sports" schema:', tables.rows.map(r => r.table_name).join(', '));

        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }
}

testConnection();
