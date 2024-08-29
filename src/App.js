import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboardPage from './pages/UserDashboardPage';
import SiDebar from './components/SiDebar';
import SuperAdminDashboardPage from './pages/SuperAdminDashboardPage';
import PrivateRoute from './components/PrivateRoute';
import ResetPassword from './components/ResetPassword';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/reset" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<PrivateRoute element={<UserDashboardPage />} requiredRole="user" />} />
        <Route path="/admin" element={<PrivateRoute element={<SiDebar />} requiredRole="admin" />} />
        <Route path="/superadmin" element={<PrivateRoute element={<SuperAdminDashboardPage />} requiredRole="super_admin" />} />
        {/* Rute lain */}
      </Routes>
    </Router>
  );
};

export default App;
