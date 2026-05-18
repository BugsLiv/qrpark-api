import express from 'express';
import { registerUser, loginUser, getMe, updateMe, updatePhoneVisibility, verifyOtp } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/updateMe', protect, updateMe); 
router.put('/phone-visibility', protect, updatePhoneVisibility);
router.post('/verify-otp', verifyOtp);

export default router;