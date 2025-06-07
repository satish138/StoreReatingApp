import React, { useState } from 'react';
import axios from 'axios';

const SubmitRating = () => {
  const [form, setForm] = useState({ storeId: '', userId: '', rating: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    if (!form.storeId.trim()) {
      setError('Store ID is required');
      return false;
    }
    if (!form.userId.trim()) {
      setError('User ID is required');
      return false;
    }
    const rating = Number(form.rating);
    if (!rating || rating < 1 || rating > 5) {
      setError('Rating must be a number between 1 and 5');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:5000/api/rating', {
        store_id: form.storeId.trim(),
        user_id: form.userId.trim(),
        rating: Number(form.rating),
      });
      setSuccess('✅ Rating submitted successfully!');
      setForm({ storeId: '', userId: '', rating: '' });
    } catch (err) {
      setError(err.response?.data?.message || '❌ Failed to submit rating');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow">
        <div className="card-body">
          <h4 className="card-title text-center mb-4">📊 Submit a Rating</h4>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Store ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Store ID"
                value={form.storeId}
                onChange={(e) => setForm({ ...form, storeId: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">User ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter User ID"
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                className="form-control"
                placeholder="Enter Rating"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Submit Rating
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitRating;
