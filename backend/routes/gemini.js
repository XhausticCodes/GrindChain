import express from 'express';
import geminiController from '../controllers/geminiController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-task', authMiddleware, geminiController.generateTask);
router.post('/create-manual-task', authMiddleware, geminiController.createManualTask);
router.post('/generate-group-task-structure', authMiddleware, geminiController.generateGroupTaskStructure);
router.get('/tasks', authMiddleware, geminiController.getTasks);
router.delete('/tasks/:taskId', authMiddleware, geminiController.deleteTask);
router.patch('/tasks/:taskId/roadmap/:itemIndex', authMiddleware, geminiController.updateRoadmapItem);
router.patch('/tasks/:taskId/group-subtask/:headerIndex/:subtaskIndex', authMiddleware, geminiController.updateGroupSubtask);
router.patch('/tasks/:taskId/assign', authMiddleware, geminiController.assignGroupTask);
router.get('/task-notifications', authMiddleware, geminiController.getTaskNotifications);
router.patch('/task-notifications/:notificationId/read', authMiddleware, geminiController.markNotificationAsRead);
router.get('/analytics', authMiddleware, geminiController.getTaskAnalytics);
router.get('/group-analytics', authMiddleware, geminiController.getGroupAnalytics);
router.post('/migrate-tasks', authMiddleware, geminiController.migrateTasksCompletedField); // **NEW: Migration route**

export default router;