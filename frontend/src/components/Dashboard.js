import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('https://student-feedback-app-1-6dwe.onrender.com/feedback');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await axios.delete(`https://student-feedback-app-1-6dwe.onrender.com/feedback/${id}`);
        setFeedbacks(feedbacks.filter(f => f.id !== id));
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const averageRating = feedbacks.length > 0 ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1) : 0;

  if (loading) {
    return <div className="dashboard"><div className="loading">Loading feedbacks...</div></div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Student Feedback Dashboard</h2>
        <div className="stats">
          <div className="stat">
            <h3>Total Feedbacks</h3>
            <p>{feedbacks.length}</p>
          </div>
          <div className="stat">
            <h3>Average Rating</h3>
            <p>{averageRating}/5</p>
          </div>
        </div>
        <button className="submit-btn" onClick={() => navigate('/')}>Submit New Feedback</button>
      </header>
      {feedbacks.length === 0 ? (
        <div className="no-data">No feedback submitted yet.</div>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course Code</th>
              <th>Rating</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.studentname}</td>
                <td className="course-code">{feedback.coursecode}</td>
                <td className="rating">{'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}</td>
                <td>{feedback.comments || 'No comments'}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(feedback.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
