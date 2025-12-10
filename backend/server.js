const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db= require('./utils/db.js')


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Simple route
app.get('/', (req, res) => {
  res.send('Hello from Express + MySQL backend!');
});


app.get('/search', async (req, res) => {

    const searchTerm = req.query.q;

    // if (!searchTerm) {
    //     // return res.status(400).json({ error: 'Search term is required' });
    // }

    try {

        const [results] = await db.execute('CALL search_books(?)', [searchTerm??'']);


        res.json(results[0]);

    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ error: 'Database error' });
    }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});