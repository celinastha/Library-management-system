const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db= require('./utils/db.js');
// const librarianRoutes = require('./routes/librarianRoutes.js');
// const borrowerRoutes = require('./routes/borrowerRoutes.js');


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// app.use('/routes/librarian', librarianRoutes);
// app.use('/routes/borrower', borrowerRoutes);

// Simple route
app.get('/', (req, res) => {
  res.send('Hello from Express + MySQL backend!');
});


app.get('/search', async (req, res) => {

    const searchTerm = req.query.q;

    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    try {

        const [results] = await db.execute('CALL search_books(?)', [searchTerm??'']);


        res.json(results[0]);

    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/checkout', async (req, res) => {
  const {isbn, card_id}= req.body;
  if (!isbn || !card_id) {
    return res.status(400).json({ error: 'Missing required fields: isbn, card_id'});
  }

  try {
    const query = 'CALL checkout_book(?, ?)';
    await db.query(query, [isbn, card_id]);

    res.status(201).json({ 
      message: 'Book checked out successsfully',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
    });

  } catch (err) {
    
    if (err.sqlState === '45000') {
      return res.status(409).json({ error: err.message }); 
    }

    res.status(500).json({ error: err.message });
  }
})


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});