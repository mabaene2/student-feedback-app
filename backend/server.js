const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL setup with Render's database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false  // REQUIRED for Render PostgreSQL
  }
});

// Initialize database table
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        studentName VARCHAR(100) NOT NULL,
        courseCode VARCHAR(20) NOT NULL,
        comments TEXT,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database table ready');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initializeDatabase();

// Routes
app.get('/feedback', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM feedback ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('GET Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/feedback', async (req, res) => {
  const { studentname, coursecode, comments, rating } = req.body;
  
  if (!studentname || !coursecode || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO feedback (studentName, courseCode, comments, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [studentname, coursecode, comments, rating]
    );
    res.json({ id: result.rows[0].id });
  } catch (error) {
    console.error('POST Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/feedback/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM feedback WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('DELETE Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Connected to Render PostgreSQL database');
});
