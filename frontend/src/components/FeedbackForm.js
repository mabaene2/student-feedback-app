import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    studentname: '',
    coursecode: '',
    comments: '',
    rating: 1
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentname.trim()) newErrors.studentname = 'Student name is required';
    if (!formData.coursecode.trim()) newErrors.coursecode = 'Course code is required';
    if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5000/feedback', formData);
      alert('Feedback submitted successfully!');
      setFormData({
        studentname: '',
        coursecode: '',
        comments: '',
        rating: 1
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            className={`star ${star <= formData.rating ? 'active' : ''}`}
            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="feedback-form">
      <header className="form-header">
        <h2>Submit Your Course Feedback</h2>
        <p>Help us improve by sharing your thoughts!</p>
      </header>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="studentName">Student Name *</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={errors.studentName ? 'error' : ''}
          />
          {errors.studentName && <span className="error-message">{errors.studentName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="courseCode">Course Code *</label>
          <input
            type="text"
            id="courseCode"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            placeholder="e.g., CS101, MATH201"
            className={errors.courseCode ? 'error' : ''}
          />
          {errors.courseCode && <span className="error-message">{errors.courseCode}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows="4"
            placeholder="Share your thoughts about the course..."
          />
        </div>

        <div className="form-group">
          <label>Rating *</label>
          {renderStars()}
          <p className="rating-text">Current rating: {formData.rating}/5</p>
          {errors.rating && <span className="error-message">{errors.rating}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
          <button type="button" className="dashboard-btn" onClick={() => navigate('/dashboard')}>
            View Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
