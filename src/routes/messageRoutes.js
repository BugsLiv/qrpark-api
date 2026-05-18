// routes/messageRoutes.js

import express from 'express';

import {
  sendMessageToVehicleOwner,
  getMyMessages,
} from '../controllers/messageController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', sendMessageToVehicleOwner);

router.get('/my-messages', protect, getMyMessages);

export default router;