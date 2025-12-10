const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/', (req, res) => {
  res.send('Hello from Borrower route!');
});

module.exports = router;
