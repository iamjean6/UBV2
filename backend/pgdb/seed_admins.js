import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;
let connectionString = process.env.DATABASE_URL;

if (connectionString && connectionString.includes('?')) {
    connectionString = connectionString.split('?')[0];
}

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    }
});

async function seed() {
    try {
        console.log('Starting seed process...');

        // 1. Create Admin Activities Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS auth.admin_activities (
                id SERIAL PRIMARY KEY,
                admin_id UUID NOT NULL REFERENCES auth.admins(id) ON DELETE CASCADE,
                admin_username VARCHAR(255) NOT NULL,
                action VARCHAR(50) NOT NULL,
                target_module VARCHAR(100),
                target_id VARCHAR(255),
                details JSONB,
                ip_address VARCHAR(45),
                created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Ensured auth.admin_activities table exists.');

        // 2. Hash Passwords
        const superadminPassword = await bcrypt.hash('obuya_1407', 10);
        const adminPassword = await bcrypt.hash('urban@2012#', 10);

        // 3. Insert Superadmin
        await pool.query(`
            INSERT INTO auth.admins (username, email, password_hash, is_active)
            VALUES ($1, $2, $3, true)
            ON CONFLICT (username) DO UPDATE 
            SET password_hash = EXCLUDED.password_hash, is_active = true
        `, ['jean_obuya16', 'jean_obuya@urbanville.com', superadminPassword]);
        console.log('Seeded superadmin: jean_obuya16');

        // 4. Insert Admin
        await pool.query(`
            INSERT INTO auth.admins (username, email, password_hash, is_active)
            VALUES ($1, $2, $3, true)
            ON CONFLICT (username) DO UPDATE 
            SET password_hash = EXCLUDED.password_hash, is_active = true
        `, ['nyawanda@ubv', 'nyawanda@urbanville.com', adminPassword]);
        console.log('Seeded admin: nyawanda@ubv');

        console.log('Seed process completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
