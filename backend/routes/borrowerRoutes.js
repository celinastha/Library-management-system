const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/', (req, res) => {
  res.send('Hello from Borrower route!');
});

router.post('/',async (req,res)=>{
  const { ssn, name, address, phone } = req.body;

  if (!ssn || !name || !address || !phone) {
      return res.status(400).json({ 
          error: 'Missing required fields: ssn, name, address, and phone are required.' 
      });
  }

  try {

      await db.query(
          'CALL add_borrower(?, ?, ?, ?)', 
          [ssn, name, address, phone]
      );

      return res.status(201).json({ 
          message: 'Borrower added successfully.',
          data: { ssn, name } 
      });

  } catch (error) {
      if (error.sqlState === '45000' || (error.message && error.message.includes('Borrower with this SSN already exists'))) {
          return res.status(409).json({ 
              error: error.message
          });
      }

      return res.status(500).json({ 
          error: error.message
      });
  }
  
})

module.exports = router;
