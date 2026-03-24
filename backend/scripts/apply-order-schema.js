import 'dotenv/config';
import pool from '../pgdb/db.js';

async function applySchema() {
    try {
        console.log('--- Applying Order Tracking Schema ---');

        // 1. Ensure ecommerce schema exists
        await pool.query("CREATE SCHEMA IF NOT EXISTS ecommerce");

        // 2. Orders table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ecommerce.orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES auth.customers(id),
                status VARCHAR(20) DEFAULT 'pending',
                total_amount DECIMAL(12, 2) NOT NULL,
                currency VARCHAR(3) DEFAULT 'KSH',
                payment_method VARCHAR(50),
                shipping_address TEXT,
                city VARCHAR(100),
                phone_number VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Table ecommerce.orders ensured.');

        // 3. Order Items table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ecommerce.order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES ecommerce.orders(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL,
                variant_id INTEGER,
                quantity INTEGER NOT NULL,
                price_at_purchase DECIMAL(12, 2) NOT NULL
            )
        `);
        console.log('✅ Table ecommerce.order_items ensured.');

        console.log('--- Schema Applied Successfully ---');
    } catch (err) {
        console.error('❌ Schema application failed:', err.message);
    } finally {
        await pool.end();
    }
}

applySchema();
