import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const StoreRatings = () => {
  const [storeId, setStoreId] = useState(localStorage.getItem('storeId') || '');
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 
useEffect(() => {
  const storedRatings = localStorage.getItem('ratings');
  if (storeId && storedRatings) {
    setRatings(JSON.parse(storedRatings));
  }
}, [storeId]);

  const fetchRatings = async () => {
    if (!storeId.trim()) return;

    setLoading(true);
    setError('');
    setRatings([]);

    try {
      const res = await API.get(`/rating/${storeId.trim()}`);
      setRatings(res.data);

      localStorage.setItem('storeId', storeId.trim());
      localStorage.setItem('ratings', JSON.stringify(res.data));

      if (res.data.length === 0) {
        setError('No ratings found for this store.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch ratings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <input
        type="text"
        placeholder="Enter Store ID"
        value={storeId}
        onChange={(e) => setStoreId(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
      />
      <button onClick={fetchRatings} disabled={!storeId.trim() || loading}>
        {loading ? 'Loading...' : 'Get Ratings'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      <ul style={{ marginTop: '10px' }}>
        {ratings.map((r, idx) => (
          <li key={idx}>
            User {r.user_id} rated: {r.rating}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreRatings;
