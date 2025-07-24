import express from 'express';
import geminiController from '../controllers/geminiController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-task', authMiddleware, geminiController.generateTask);
router.post('/create-manual-task', authMiddleware, geminiController.createManualTask);
router.get('/tasks', authMiddleware, geminiController.getTasks);
router.delete('/tasks/:taskId', authMiddleware, geminiController.deleteTask);
router.patch('/tasks/:taskId/roadmap/:itemIndex', authMiddleware, geminiController.updateRoadmapItem);
router.get('/analytics', authMiddleware, geminiController.getTaskAnalytics);
router.post('/migrate-tasks', authMiddleware, geminiController.migrateTasksCompletedField); // **NEW: Migration route**

export default router;