import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratings, setRatings] = useState({});
  const [ratingHistory, setRatingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = parseInt(localStorage.getItem('userId'), 10) || 1;

  const fetchStores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/store');
      setStores(response.data);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError('Failed to load stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    const storedHistory = localStorage.getItem('ratingHistory');
    if (storedHistory) {
      setRatingHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ratingHistory', JSON.stringify(ratingHistory));
  }, [ratingHistory]);

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRatingChange = (storeId, value) => {
    setRatings(prev => ({ ...prev, [storeId]: value }));
  };

  const submitRating = async (storeId) => {
    const ratingValue = ratings[storeId];
    if (!ratingValue || ratingValue === 0) {
      alert('Please select a rating before submitting.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

       await axios.post(
        'http://localhost:5000/api/rating',
        {
          user_id: userId,
          store_id: storeId,
          rating: ratingValue,
        },
        { headers }
      );

      const store = stores.find(s => s.id === storeId);
      alert(`Successfully submitted ${ratingValue} star rating for "${store?.name}"`);

      const newHistory = [
        ...ratingHistory,
        {
          storeName: store?.name || 'Unknown Store',
          rating: ratingValue,
          date: new Date().toISOString().slice(0, 10),
        }
      ];
      setRatingHistory(newHistory);
      setRatings(prev => ({ ...prev, [storeId]: 0 }));

      fetchStores();
    } catch (err) {
      console.error('Failed to submit rating:', err);
      alert('Failed to submit rating.');
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">📊 Rate Nearby Stores</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search stores by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <div className="alert alert-info">Loading stores...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {filteredStores.map(store => (
          <div className="col-md-6 mb-4" key={store.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{store.name}</h5>
                <p className="card-text text-muted">{store.address}</p>

                <p>
                  <strong>Average Rating:</strong> {parseFloat(store.rating || 0).toFixed(1)} ⭐
                </p>
                <p className="text-muted">
                  <strong>Total Ratings:</strong> {store.ratingCount || 0}
                </p>

                <div className="d-flex align-items-center gap-2">
                  <label className="form-label mb-0">Rate:</label>
                  <select
                    value={ratings[store.id] || 0}
                    onChange={e => handleRatingChange(store.id, Number(e.target.value))}
                    className="form-select form-select-sm w-auto"
                  >
                    <option value={0}>Select</option>
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>
                        {n} Star{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => submitRating(store.id)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!loading && filteredStores.length === 0 && (
          <div className="col-12">
            <div className="alert alert-warning">No stores found.</div>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserDashboard;
