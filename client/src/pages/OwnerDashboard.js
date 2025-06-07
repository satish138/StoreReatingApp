import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner, Container, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/store/stores', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStores(response.data);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setError('Failed to fetch stores');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const navigateStore = () => {
    navigate('/store/create');
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏬 My Stores</h2>
        <Button variant="primary" onClick={navigateStore}>
          ➕ Create New Store
        </Button>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      {!loading && !error && stores.length === 0 && (
        <Alert variant="info">You have not created any stores yet.</Alert>
      )}

      <Row xs={1} md={2} lg={3} className="g-4">
        {!loading &&
          !error &&
          stores.map((store) => (
            <Col key={store.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">{store.name}</Card.Title>
                  <Card.Text>
                    <strong>Email:</strong> {store.email}
                  </Card.Text>
                  <Card.Text>
                    <strong>Address:</strong> {store.address}
                  </Card.Text>
                  <Card.Text>
                    <strong>Rating:</strong> {parseFloat(store.rating || 0).toFixed(1)} ⭐ ({store.ratingCount} ratings)
                  </Card.Text>

                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default OwnerDashboard;
