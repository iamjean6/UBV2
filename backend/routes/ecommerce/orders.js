import express from 'express';
import { createOrder, updateOrderStatus, getSuccessfulOrders } from '../../controller/orderController.js';
import { protectCustomerRoute, protectAdminRoute } from '../../middleware/authMiddleware.js';
import { logAdminActivity } from '../../middleware/adminActivityLogger.js';

const router = express.Router();

// POST Create a new order (Protected)
router.post('/', protectCustomerRoute, createOrder);

// POST Update order status (Typically called by payment callbacks or mock handlers)
// POST Update order status (Admin)
router.post('/update-status', protectAdminRoute, logAdminActivity('UPDATE_ORDER_STATUS', 'Ecommerce'), updateOrderStatus);

// GET Successful orders (Tracking - Admin/Superadmin)
router.get('/successful', protectAdminRoute, getSuccessfulOrders);

export default router;
