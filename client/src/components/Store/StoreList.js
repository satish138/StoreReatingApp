import React, { useEffect, useState } from 'react';
import API from '../../services/api';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await API.get('/store/');
        setStores(res.data);
      } catch (err) {
        setError('Failed to load stores.');
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  if (loading) return <p>Loading stores...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (stores.length === 0) return <p>No stores found.</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {stores.map((store) => (
        <li key={store.store_id} style={{ marginBottom: '10px' }}>
          <strong>{store.name}</strong> (Rating: {store.rating ?? 'N/A'})
        </li>
      ))}
    </ul>
  );
};

export default StoreList;
