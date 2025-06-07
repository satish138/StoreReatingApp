import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Auth/Login';
import RegisterPage from './components/Auth/Register';
import CreateStore from './components/Store/CreateStore';
import StoreList from './components/Store/StoreList';
import SubmitRating from './components/Rating/SubmitRating';
import StoreRatings from './components/Rating/StoreRatings';
import NavbarComponent from './components/Navbar/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';


import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import RatingPage from './pages/UserDashboard';

function App() {
  return (
    <Router>
      <NavbarComponent />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['System Administrator']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Store Owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rating" 
            element={
              <ProtectedRoute allowedRoles={['Normal User']}>
                <RatingPage />
              </ProtectedRoute>
            } 
          />

    
          <Route 
            path="/store/create" 
            element={
              <ProtectedRoute allowedRoles={['Store Owner', 'System Administrator']}>
                <CreateStore />
              </ProtectedRoute>
            } 
          />
          <Route path="/stores" element={<StoreList />} />

        
          <Route 
            path="/rating/submit" 
            element={
              <ProtectedRoute allowedRoles={['Normal User', 'Store Owner', 'System Administrator']}>
                <SubmitRating />
              </ProtectedRoute>
            } 
          />
          <Route path="/rating/:storeId" element={<StoreRatings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
