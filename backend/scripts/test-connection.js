import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

async function testConnection() {
    const urls = [
        process.env.DATABASE_URL,
        process.env.DATABASE_URL.replace('-pooler', '') // Try direct connection
    ];

    for (let url of urls) {
        console.log('\n--- Testing connection to:', url.split('@')[1].split('?')[0]);

        if (url.includes('?')) {
            url = url.split('?')[0];
        }

        const pool = new Pool({
            connectionString: url,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000,
        });

        try {
            console.log('Attempting to connect...');
            const start = Date.now();
            const res = await pool.query('SELECT NOW()');
            console.log('✅ Successfully connected!');
            console.log('Result:', res.rows[0]);
            console.log('Response time:', Date.now() - start, 'ms');
            break; // Stop if one works
        } catch (err) {
            console.error('❌ Connection failed!');
            console.error('Error code:', err.code);
            console.error('Error message:', err.message);
        } finally {
            await pool.end();
        }
    }
}

testConnection();
