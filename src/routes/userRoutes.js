import express from 'express';
import { getUsers, deleteUser, updateUserByAdmin } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/').get(protect, authorize('admin'), getUsers);
router.route('/:id').delete(protect, authorize('admin'), deleteUser);
router.route('/:id').put(protect, authorize('admin'), updateUserByAdmin);

export default router;