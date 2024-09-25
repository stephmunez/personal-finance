const express = require('express');
const router = express.Router();
const {
  getPots,
  getPot,
  createPot,
  updatePot,
  deletePot,
} = require('../controllers/pots');

router.get('/', getPots);
router.get('/:id', getPot);
router.post('/', createPot);
router.patch('/:id', updatePot);
router.delete('/:id', deletePot);

module.exports = router;
