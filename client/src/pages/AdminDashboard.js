import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Button, Form, Alert, Row, Col, Card, Dropdown, ButtonGroup,
} from 'react-bootstrap';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/admin/users', headers);
      setUsers(res.data);
    } catch (err) {
      setError('Unable to fetch users.');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stats', headers);
      setStats(res.data);
    } catch (err) {
      setError('Unable to fetch system stats.');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  },[]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/admin/users/${userId}/role`,
        { role: newRole },
        headers
      );
      setSuccess('✅ User role updated successfully.');
      setError('');
      fetchUsers();
    } catch (err) {
      setError('❌ Failed to update role.');
      setSuccess('');
    }
  };

  const filteredUsers = users.filter((user) =>
    [user.name, user.email, user.address, user.role].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center">🛠️ Admin Dashboard</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* System Analytics */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center border-primary">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h3>{stats.users}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-success">
            <Card.Body>
              <Card.Title>Total Stores</Card.Title>
              <h3>{stats.stores}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center border-warning">
            <Card.Body>
              <Card.Title>Total Ratings</Card.Title>
              <h3>{stats.ratings}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search Filter */}
      <Form.Control
        type="text"
        placeholder="🔍 Filter by name, email, address, or role"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {/* User Table */}
      <h4 className="mb-3">👥 User Management</h4>
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Current Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td>
                <Dropdown as={ButtonGroup} size="sm">
                  <Button variant="outline-secondary" disabled>
                    Change Role
                  </Button>
                  <Dropdown.Toggle split variant="secondary" id={`dropdown-${user.id}`} />
                  <Dropdown.Menu>
                    {['System Administrator', 'Normal User', 'Store Owner'].map((roleOption) =>
                      roleOption !== user.role ? (
                        <Dropdown.Item
                          key={roleOption}
                          eventKey={roleOption}
                          onClick={() => handleRoleChange(user.id, roleOption)}
                        >
                          Set as {roleOption}
                        </Dropdown.Item>
                      ) : null
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;
