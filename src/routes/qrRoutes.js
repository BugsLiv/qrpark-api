import express from 'express';

import { scanVehicleQr } from '../controllers/qrController.js';

const router = express.Router();

router.get('/scan/:qrToken', scanVehicleQr);

export default router;