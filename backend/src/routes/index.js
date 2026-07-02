import { Router } from 'express';
import categoryRoutes from './categoryRoutes.js';
import dailyRecordRoutes from './dailyRecordRoutes.js';
import inspirationRoutes from './inspirationRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();
router.use('/categories', categoryRoutes);
router.use('/daily-records', dailyRecordRoutes);
router.use('/inspirations', inspirationRoutes);
router.use('/upload', uploadRoutes);
export default router;
