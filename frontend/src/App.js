import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FeedbackForm from './components/FeedbackForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Student Feedback App</h1>
          <p>Share your thoughts and help us improve!</p>
        </header>
        <nav className="navigation">
          <Link to="/" className="nav-btn">Submit Feedback</Link>
          <Link to="/dashboard" className="nav-btn">View Dashboard</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<FeedbackForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>&copy; 2025 Student Feedback App</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
