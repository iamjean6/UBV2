import express from 'express';
import { getDashboardStats, getPlayerStatsSummary, getAdminActivities, getSystemVitals } from '../controller/adminController.js';
import { protectAdminRoute, protectSuperAdminRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here require at least Admin access
router.use(protectAdminRoute);

router.get('/dashboard-stats', getDashboardStats);
router.get('/player-stats-summary', getPlayerStatsSummary);

// Only Superadmin can see admin activities and system vitals
router.get('/activities', protectSuperAdminRoute, getAdminActivities);
router.get('/vitals', protectSuperAdminRoute, getSystemVitals);

export default router;
