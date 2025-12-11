const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db= require('./utils/db.js');
// const librarianRoutes = require('./routes/librarianRoutes.js');
const borrowerRoutes = require('./routes/borrowerRoutes.js');


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// app.use('/routes/librarian', librarianRoutes);
app.use('/routes/borrower', borrowerRoutes);

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

app.get('/loans/search', async (req, res) => {
    try {

        const searchTerm = req.query.q || '';
        const [results] = await db.query('CALL search_loans(?)', [searchTerm]);
        return res.json(results[0]);

    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error.message 
        });
    }
});


app.put('/checkin', async (req, res) => {
    const { loanIds } = req.body;
    console.log(loanIds)

    if (!Array.isArray(loanIds)) {
        return res.status(400).json({ error: 'not an array' });
    }

    if (loanIds.length > 3) {
        return res.status(400).json({ error: 'only 3 inputs' });
    }

    try {
        const args = [
            loanIds[0] || null,
            loanIds[1] || null,
            loanIds[2] || null
        ];
        await db.query(
            'CALL checkin_books(?, ?, ?)', 
            args
        );

        return res.json({ 
            message: 'Check-in processed successfully.',
            checkedInCount: loanIds.length 
        });

    } catch (error) {
        return res.status(500).json({ 
            error: error.message,
            details: error.message 
        });
    }
});



app.post('/fines/refresh', async (req, res) => {
    try {
        await db.query('CALL refresh_fines()');
        
        res.json({ message: 'Fines refreshed successfully.' });
    } catch (error) {
        console.error('Refresh Fines Error:', error);
        res.status(500).json({ error: error.message });
    }
});


app.post('/fines/pay', async (req, res) => {
    const { card_id } = req.body;

    if (!card_id) {
        return res.status(400).json({ error: 'Card ID is required.' });
    }

    try {
        await db.query('CALL pay_fines(?)', [card_id]);
        
        res.json({ message: 'Fines paid successfully.' });

    } catch (error) {

        if (error.sqlState === '45000') {
            return res.status(409).json({ 
                error: 'Cannot pay fines. You still have overdue books checked out.' 
            });
        }
        
        console.error('Pay Fines Error:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/fines', async (req, res) => {
    const { card_id, paid } = req.query;

    if (!card_id) {
        return res.status(400).json({ error: 'Card ID is required as a query parameter.' });
    }

    const includePaid = paid === 'true';

    try {
        const [results] = await db.query('CALL display_fines(?, ?)', [card_id, includePaid]);


        res.json(results[0]);

    } catch (error) {
        console.error('Display Fines Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});