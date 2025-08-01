import express from 'express';
import {
  createOrJoinGroup,
  updateGroup,
  leaveGroup,
  getGroupDetails,
  getCurrentGroup,
  getAllGroups
} from '../controllers/groupController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create or join a group
router.post('/join', createOrJoinGroup);

// Get current user's group
router.get('/current', getCurrentGroup);

// Get group details
router.get('/:groupId', getGroupDetails);

// Update group details
router.put('/:groupId', updateGroup);

// Leave group
router.delete('/:groupId/leave', leaveGroup);

// Debug: Get all groups
router.get('/debug/all', getAllGroups);

export default router;
