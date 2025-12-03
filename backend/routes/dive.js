import express from 'express';
import { getDives, getOneDive, createDive, deleteDive, updateDive } from '../controllers/diveController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router()

// require auth for all dive routes
router.use(requireAuth)

// GET all dives
router.get('/', getDives)

// GET one dive
router.get('/:id', getOneDive)

// POST a new dive
router.post('/', createDive)

// DELETE a dive
router.delete('/:id', deleteDive)

// UPDATE a dive
router.patch('/:id', updateDive)

export default router