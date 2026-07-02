import { Router } from 'express';
import { getInspirations, getInspiration, createInspiration, updateInspiration, deleteInspiration } from '../controllers/inspirationController.js';

const router = Router();
router.get('/', getInspirations);
router.get('/:id', getInspiration);
router.post('/', createInspiration);
router.put('/:id', updateInspiration);
router.delete('/:id', deleteInspiration);
export default router;
