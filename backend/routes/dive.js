const express = require('express')
const { getDives, getOneDive, createDive, deleteDive, updateDive } = require('../controllers/diveController')
const requireAuth = require('../middleware/requireAuth')

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


module.exports = router