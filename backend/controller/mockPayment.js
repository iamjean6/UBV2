import pool from '../pgdb/db.js';
import { updateOrderStatus } from './orderController.js';

/**
 * MOCK PAYMENT CALLBACK
 * Simulates a payment provider calling back Urbanville with a status.
 * This is useful for testing the order and stock management flow.
 */
export const mockPaymentCallback = async (req, res) => {
    const { orderId, simulate_status } = req.body; // simulate_status: 'successful' or 'failed'

    if (!orderId || !simulate_status) {
        return res.status(400).json({ status: 'error', message: 'orderId and simulate_status are required' });
    }

    // Reuse the updateOrderStatus logic
    // In a real scenario, this would be triggered by a webhook from M-Pesa, Stripe, etc.
    req.body.status = simulate_status;
    return updateOrderStatus(req, res);
};
