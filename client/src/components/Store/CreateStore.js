import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateStorePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate= useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://localhost:5000/api/store/store',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.status === 201) {
        setMessage('Store created successfully!');
        setFormData({ name: '', email: '', address: '' });
      }
      navigate('/owner/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h1>Create Store</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Store Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter store name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Store Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter store email"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">Store Address</label>
          <textarea
            id="address"
            name="address"
            className="form-control"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter store address"
            required
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Store'}
        </button>
      </form>
    </div>
  );
};

export default CreateStorePage;
