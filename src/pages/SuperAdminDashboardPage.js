import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import RegisterForm from './RegisterForm';
import { FaUsers, FaTasks, FaChartBar } from 'react-icons/fa';

const SuperAdminDashboardPage = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [regularUsers, setRegularUsers] = useState([]);
  const [superAdminUsers, setSuperAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminUsers(response.data.adminUsers);
        setRegularUsers(response.data.regularUsers);
        setSuperAdminUsers(response.data.superAdminUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users with roles:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessAlert]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8080/api/auth/logout',
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAdminUsers(adminUsers.filter((user) => user.id !== userId));
      setRegularUsers(regularUsers.filter((user) => user.id !== userId));
      setSuperAdminUsers(superAdminUsers.filter((user) => user.id !== userId));
      setShowDeleteConfirmation(false);
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdate = async (userId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/auth/user/${userId}/updateToAdmin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const updatedUsers = await axios.get('http://localhost:8080/api/auth/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAdminUsers(updatedUsers.data.adminUsers);
      setRegularUsers(updatedUsers.data.regularUsers);
      setSuperAdminUsers(updatedUsers.data.superAdminUsers);

      setShowSuccessAlert(true);
      closeModal();
    } catch (error) {
      console.error('Error updating user:', error.response ? error.response.data : error.message);
      setError('Failed to update user role. Please try again.');
    }
  };

  const openDeleteConfirmationModal = (id) => {
    setSelectedUserId(id);
    setShowDeleteConfirmation(true);
  };

  const openUpdateModal = (id) => {
    setSelectedUserId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowDeleteConfirmation(false);
    setSelectedUserId(null);
    setSelectedUserRole('');
  };

  const handleUserRoleChange = (e) => {
    setSelectedUserRole(e.target.value);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/api/auth/user/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      const updatedUsers = await axios.get('http://localhost:8080/api/auth/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAdminUsers(updatedUsers.data.adminUsers);
      setRegularUsers(updatedUsers.data.regularUsers);
      setSuperAdminUsers(updatedUsers.data.superAdminUsers);
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error updating user status:', error.response ? error.response.data : error.message);
      setError('Failed to update user status. Please try again.');
    }
  };

  return (
    <div className="flex">
      <Sidebar onSelectView={setCurrentView} onLogout={handleLogout} />
      <div className="flex-1 p-8 bg-gray-100">
        {showSuccessAlert && (
          <div role="alert" className="alert alert-success mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Operation completed successfully!</span>
          </div>
        )}

        {currentView === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
                <div className="bg-blue-500 p-4 rounded-full mr-4">
                  <FaUsers className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">User Statistics</h3>
                  <p>Overview of user statistics and engagement.</p>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
                <div className="bg-green-500 p-4 rounded-full mr-4">
                  <FaTasks className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tasks Overview</h3>
                  <p>Manage and track ongoing tasks and projects.</p>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
                <div className="bg-purple-500 p-4 rounded-full mr-4">
                  <FaChartBar className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
                  <p>Analyze performance metrics and reports.</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-500 text-white shadow-lg rounded-lg p-6 text-center">
                  <div className="bg-blue-600 p-4 rounded-full mb-4 mx-auto flex items-center justify-center">
                    <FaUsers className="text-white text-3xl" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">Total Admin</h2>
                  <p className="text-4xl font-bold">{adminUsers.length}</p>
                </div>

                <div className="bg-green-500 text-white shadow-lg rounded-lg p-6 text-center">
                  <div className="bg-green-600 p-4 rounded-full mb-4 mx-auto flex items-center justify-center">
                    <FaUsers className="text-white text-3xl" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">Total Users</h2>
                  <p className="text-4xl font-bold">{regularUsers.length}</p>
                </div>

                <div className="bg-purple-500 text-white shadow-lg rounded-lg p-6 text-center">
                  <div className="bg-purple-600 p-4 rounded-full mb-4 mx-auto flex items-center justify-center">
                    <FaUsers className="text-white text-3xl" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">Total Super Admin</h2>
                  <p className="text-4xl font-bold">{superAdminUsers.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'create-account' && <RegisterForm />}

        {currentView === 'users' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Daftar Pengguna</h2>
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Nama Pengguna</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Role</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {[...adminUsers, ...regularUsers, ...superAdminUsers].map((user) => (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border-b">{user.id}</td>
                    <td className="py-2 px-4 border-b">{user.username}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.role}</td>
                    <td className="py-2 px-4 border-b">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className="select select-bordered w-full"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => openUpdateModal(user.id)}
                        className="btn btn-primary btn-sm mr-2"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => openDeleteConfirmationModal(user.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

     {/* Update Modal */}
<dialog id="my_modal_3" className="modal" open={showModal}>
  <div className="modal-box">
    <form method="dialog">
      {/* Close button */}
      <button
        onClick={closeModal}
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
      >
        ✕
      </button>
    </form>
    <h3 className="font-bold text-lg">Update User Role</h3>
    <select
      value={selectedUserRole}
      onChange={handleUserRoleChange}
      className="border border-gray-300 rounded-md p-2 mb-4 w-full"
    >
      <option value="">Select Role</option>
      <option value="Admin">Admin</option>
      <option value="User">User</option>
    </select>
    <div className="flex justify-end">
      <button
        onClick={closeModal}
        className="bg-gray-300 text-gray-800 rounded-lg py-2 px-4 mr-2"
      >
        Cancel
      </button>
      <button
        onClick={() => handleUpdate(selectedUserId)}
        className="bg-blue-500 text-white rounded-lg py-2 px-4"
      >
        Update
      </button>
    </div>
  </div>
</dialog>


      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Delete User</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-800 rounded-lg py-2 px-4 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedUserId)}
                className="bg-red-500 text-white rounded-lg py-2 px-4"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboardPage;
