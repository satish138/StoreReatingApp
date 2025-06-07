import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import API from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'Normal User',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (form.name.length < 20 || form.name.length > 60) {
      setError('Name must be between 20 and 60 characters.');
      return false;
    }
    if (form.address.length > 400) {
      setError('Address must be less than 400 characters.');
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,16}$/;
    if (!passwordRegex.test(form.password)) {
      setError(
        'Password must be 6-16 chars, include at least 1 uppercase and 1 special character.'
      );
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await API.post('/auth/register', form);
      toast.success('Registered successfully!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <ToastContainer
        transition={Slide}
        limit={3}
        newestOnTop
        closeButton={true}
        style={{ width: '320px', fontSize: '0.9rem', marginTop: '1rem' }}
      />

      <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center bg-light p-3">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={7} lg={5} xl={4}>
            <Card className="shadow rounded-4 border-0">
              <Card.Body className="p-4">
                <h2 className="mb-4 text-center fw-bold text-primary">Create an Account</h2>
                <p className="text-center text-muted mb-4">
                  Join us today! Please fill in the information below.
                </p>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      isInvalid={error.includes('Name')}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Name must be between 20 and 60 characters.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      isInvalid={error.includes('Password')}
                      required
                    />
                    <Form.Text className="text-muted">
                      6-16 characters, 1 uppercase, 1 special character.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">
                      Password must meet the criteria.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Your address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      isInvalid={error.includes('Address')}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Address must be less than 400 characters.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formRole">
                    <Form.Label>Select Role</Form.Label>
                    <Form.Select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      required
                    >
                      <option value="Normal User">Normal User</option>
                      <option value="Store Owner">Store Owner</option>
                      <option value="System Administrator">System Administrator</option>
                    </Form.Select>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 fw-semibold py-2">
                    Register
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer className="text-center text-muted small">
                Already have an account? <a href="/login">Login here</a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterPage;
