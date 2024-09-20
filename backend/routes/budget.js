const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('this is the budget route');
});

module.exports = router;
