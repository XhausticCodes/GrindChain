import express from 'express';
import geminiController from '../controllers/geminiController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/generate-task', authMiddleware, geminiController.generateTask);
router.get('/tasks', authMiddleware, geminiController.getTasks);
router.delete('/tasks/:taskId', authMiddleware, geminiController.deleteTask);

export default router;