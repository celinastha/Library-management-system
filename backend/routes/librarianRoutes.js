const express = require('express');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const router = express.Router();
const db = require('../utils/db');

router.use(verifyToken, requireRole('librarian'));

router.get('/', (req, res) => {
  res.send('Hello from Librarian route!');
});

module.exports = router;
