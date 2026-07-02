import { Router } from 'express';
import { getDailyRecords, getDailyRecord, createDailyRecord, updateDailyRecord, deleteDailyRecord } from '../controllers/dailyRecordController.js';

const router = Router();
router.get('/', getDailyRecords);
router.get('/:id', getDailyRecord);
router.post('/', createDailyRecord);
router.put('/:id', updateDailyRecord);
router.delete('/:id', deleteDailyRecord);
export default router;
