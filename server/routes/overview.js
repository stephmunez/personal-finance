const express = require('express');
const router = express.Router();
const { getOverview } = require('../controllers/overview');

router.get('/', getOverview);

module.exports = router;
