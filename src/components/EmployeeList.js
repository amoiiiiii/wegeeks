<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { FaEye, FaEdit, FaTrash, FaKey, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EmployeeList() {
  const [users, setUsers] = useState([]);
  const [detailUser, setDetailUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [updateUser, setUpdateUser] = useState({
    id: '',
    username: '',
    email: '',
    no: '',
    position: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (detailUser) {
      console.log('Profile Picture URL:', detailUser.profile_picture_url);
    }
  }, [detailUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const { adminUsers, regularUsers, superAdminUsers } = response.data;
      setUsers([...adminUsers, ...regularUsers, ...superAdminUsers]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const userData = response.data;
      userData.profile_picture_url = `http://localhost:8080/uploads/image/users/${userData.profile_picture}`;
      
      setDetailUser(userData);
      console.log('User data fetched:', userData);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8080/api/auth/user/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchUsers();
        alert('User berhasil dihapus');
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDetail = async (user) => {
    await fetchUserById(user.id);
    const modal = document.getElementById('detail_user_modal');
    if (modal) {
      modal.showModal();
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/users/${updateUser.id}`, updateUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('User berhasil diupdate');
      document.getElementById('update_user_modal').close();
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleResetPassword = async (id) => {
    try {
      await axios.post(`http://localhost:8080/api/auth/user/${id}/reset-password`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Password has been reset to the default');
      document.getElementById('reset_password_modal').close();
    } catch (error) {
      toast.error('Error resetting password');
      console.error('Error resetting password:', error);
=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/employees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("There was an error fetching the employees!", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchEmployees();
    } catch (error) {
      console.error("There was an error deleting the employee!", error);
>>>>>>> 09b8d3331c9f19ab50ffd412ecc294172741d6d3
    }
  };

  return (
<<<<<<< HEAD
    <div className="admin-dashboard-container">
      <ToastContainer />

      {/* Modal for displaying user details */}
      <dialog id="detail_user_modal" className="modal">
        {detailUser && (
          <div className="modal-box w-11/12 max-w-5xl">
            <div className="flex items-center">
              <img
                src={detailUser.profile_picture_url}
                alt="Profile"
                className="profile-photo"
              />
              <div className="user-details ml-4">
                <h3 className="font-bold text-lg">User Detail</h3>
                <p><strong>ID:</strong> {detailUser.id}</p>
                <p><strong>Name:</strong> {detailUser.username}</p>
                <p><strong>Email:</strong> {detailUser.email}</p>
                <p><strong>No:</strong> {detailUser.no}</p>
                <p><strong>Position:</strong> {detailUser.position}</p>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => document.getElementById('detail_user_modal').close()}>Close</button>
            </div>
          </div>
        )}
      </dialog>

      {/* Modal for updating user */}
      <dialog id="update_user_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl p-6">
          <h3 className="font-bold text-lg mb-4">Update User</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name:</label>
              <input
                type="text"
                name="username"
                value={updateUser.username}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={updateUser.email}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">No:</label>
              <input
                type="text"
                name="no"
                value={updateUser.no}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position:</label>
              <input
                type="text"
                name="position"
                value={updateUser.position}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="modal-action mt-4">
              <button type="submit" className="btn btn-black">Update</button>
              <button
                type="button"
                className="btn btn-black"
                onClick={() => document.getElementById('update_user_modal').close()}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Modal for resetting password */}
      <dialog id="reset_password_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl p-6">
          <h3 className="font-bold text-lg mb-4">Reset Password</h3>
          <p>Password will be reset to the default value.</p>
          <div className="mb-4">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 1 1 0 1h-.75a.5.5 0 0 0 0 1h.5a2 2 0 1 0-2-2 .5.5 0 0 1-.75-.5Z"
                />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value="password"
                readOnly
                className="flex-grow bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </label>
          </div>
          <div className="modal-action mt-4">
            <button className="btn btn-black" onClick={handleResetPassword}>Reset Password</button>
            <button
              className="btn btn-black"
              onClick={() => document.getElementById('reset_password_modal').close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      {/* Table displaying users */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.position}</td>
                <td>
                  <button
                    onClick={() => handleDetail(user)}
                    className="btn btn-sm btn-warning mr-2"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => {
                      setUpdateUser(user);
                      document.getElementById('update_user_modal').showModal();
                    }}
                    className="btn btn-sm btn-success mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="btn btn-sm btn-danger"
                    style={{ marginRight: '8px' }}
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => document.getElementById('reset_password_modal').showModal()}
                    className="btn btn-sm btn-gray mr-2"
                  >
                    <FaKey />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
=======
    <div>
      <h2>Employee List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>
                <Link to={`/update/${employee.id}`}>Update</Link>
                <button onClick={() => handleDelete(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
>>>>>>> 09b8d3331c9f19ab50ffd412ecc294172741d6d3
    </div>
  );
}

export default EmployeeList;
