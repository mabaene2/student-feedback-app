const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase setup - USING YOUR CREDENTIALS
const supabaseUrl = 'https://yqjdepwusyutrggaooom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxamRlcHd1c3l1dHJnZ2Fvb29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2ODMxMzUsImV4cCI6MjA3NzI1OTEzNX0.QfbfsKMJ1deFgc-a4mZi_7F_cPggHv_7cfyhkZP5HpY';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Connected to Supabase database.');

// Create table if not exists
const createTable = async () => {
  const { error } = await supabase.rpc('create_feedback_table_if_not_exists');
  if (error) console.log('Table may already exist:', error.message);
};
createTable();

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
