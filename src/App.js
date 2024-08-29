<<<<<<< HEAD
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
=======
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AddEmployee from './components/AddEmployee';
import UpdateEmployee from './components/UpdateEmployee';
import Login from './components/Login';
import Logout from './components/Logout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/add" element={<AddEmployee />} />
        <Route path="/update/:id" element={<UpdateEmployee />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}
>>>>>>> 09b8d3331c9f19ab50ffd412ecc294172741d6d3

export default App;
