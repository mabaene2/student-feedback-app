const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Connected to Supabase database.');

// Routes
app.get('/feedback', async (req, res) => {
  const { data, error } = await supabase
    .from('feedback')
    .select('*');

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json(data);
});

app.post('/feedback', async (req, res) => {
  const { studentname, coursecode, comments, rating } = req.body;
  if (!studentname || !coursecode || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('feedback')
    .insert([{ studentname, coursecode, comments, rating }])
    .select();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ id: data[0].id });
});

app.delete('/feedback/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('feedback')
    .delete()
    .eq('id', id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ message: 'Feedback deleted successfully' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
