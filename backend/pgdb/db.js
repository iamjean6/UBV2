import pg from 'pg';
const { Pool } = pg;
let connectionString = process.env.DATABASE_URL;


if (connectionString && connectionString.includes('?')) {
    connectionString = connectionString.split('?')[0];
}

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 30000, // Wait 30s for Neon cold start
    idleTimeoutMillis: 30000,      // Close idle clients after 30s
    max: 10                        // Limit pool size
});

// Helper to log connection status
pool.on('connect', () => {
    console.log('Connected to PostgreSQL (Neon)');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
    process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
