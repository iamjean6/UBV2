import express from 'express';
import { getFeatures, getOneStory, createStory, updateStory, deleteStory, getLikes } from '../controller/featureController.js';

import { protectAdminRoute } from '../middleware/authMiddleware.js';
import { logAdminActivity } from '../middleware/adminActivityLogger.js';

const router = express.Router();

router.get('/', getFeatures);
router.get('/:id', getOneStory);
router.get('/:id/likes', getLikes);

// Protected mutation routes
router.post('/', protectAdminRoute, logAdminActivity('CREATE_STORY', 'Features'), createStory);
router.put('/:id', protectAdminRoute, logAdminActivity('UPDATE_STORY', 'Features'), updateStory);
router.delete('/:id', protectAdminRoute, logAdminActivity('DELETE_STORY', 'Features'), deleteStory);

export default router;
