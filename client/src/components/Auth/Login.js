import React, { useState } from 'react';
import { Form, Button, Container, Card, Spinner, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { saveToken } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/auth/login', form);
      const { token } = res.data;
      const user = jwtDecode(token);

      if (!user || !user.role) {
        throw new Error('Invalid user data received');
      }

      saveToken(token, user);
      login(user, token);

      toast.success('Login successful! Redirecting...', {
        autoClose: 1500,
      });

      setTimeout(() => {
        if (user.role === 'System Administrator') {
          navigate('/admin/dashboard');
        } else if (user.role === 'Normal User') {
          navigate('/rating');
        } else if (user.role === 'Store Owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/');
        }
      }, 1800);
    } catch (err) {
      console.error(err);
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center bg-light p-3"
      style={{ minHeight: '100vh', overflow: 'hidden' }}
    >
      <Card
        className="shadow-lg rounded-4 d-flex flex-column flex-md-row overflow-hidden"
        style={{ maxWidth: 900, width: '100%', maxHeight: '90vh' }}
      >
        {/* Left: Form */}
        <div
          style={{
            flex: 1,
            padding: '2rem',
            backgroundColor: 'white',
            overflowY: 'auto',
            maxHeight: '90vh',
          }}
        >
          <h3 className="mb-4 text-center">Login</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Form.Group>

            <div className="d-grid mt-3">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
          </Form>
        </div>

        {/* Right: Image */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#f8f9fa',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
          }}
        >
          <Image
            src="https://cdn.appfollow.io/blog/static/appfollow_17795350-b59d-45a3-bc60-abdae31bace1.jpg"
            alt="Store Rating"
            fluid
            style={{ maxHeight: '100%', objectFit: 'contain', borderRadius: '12px' }}
          />
        </div>
      </Card>

      <ToastContainer position="top-right" />
    </Container>
  );
};

export default LoginPage;
