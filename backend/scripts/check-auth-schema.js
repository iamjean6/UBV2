import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

async function checkSchema() {
    let url = process.env.DATABASE_URL;
    if (url.includes('?')) url = url.split('?')[0];

    const pool = new Pool({
        connectionString: url,
        ssl: { rejectUnauthorized: false },
    });

    try {
        console.log('Checking schemas...');
        const schemas = await pool.query("SELECT schema_name FROM information_schema.schemata");
        console.log('Schemas:', schemas.rows.map(r => r.schema_name).join(', '));

        console.log('\nChecking tables in auth schema...');
        const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'auth'");
        if (tables.rows.length === 0) {
            console.log('No tables found in auth schema!');
        } else {
            console.log('Tables in auth:', tables.rows.map(r => r.table_name).join(', '));

            for (const table of tables.rows) {
                console.log(`\nColumns in auth.${table.table_name}:`);
                const cols = await pool.query(`
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_schema = 'auth' AND table_name = '${table.table_name}'
                `);
                console.table(cols.rows);
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
    }
}

checkSchema();
