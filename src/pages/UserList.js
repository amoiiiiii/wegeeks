import React, { useState } from 'react';
import axios from 'axios';

const UserList = ({ users, onDelete, onStatusChange }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Function to handle delete and show modal
  const handleDelete = (id) => {
    onDelete(id);
    setDeleteModalOpen(true);
  };

  // Function to close the delete modal
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  // Function to open the update modal
  const handleUpdate = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setUpdateModalOpen(true);
  };

  // Function to close the update modal
  const closeUpdateModal = () => {
    setUpdateModalOpen(false);
  };

  // Function to handle role change
  const handleRoleChange = async () => {
    if (newRole === "Admin" && selectedUser.role !== "Admin") {
      try {
        // Making an API call to update the user to Admin
        const response = await axios.put(
          `http://localhost:8080/api/auth/user/${selectedUser.id}/updateToAdmin`,
          {}, // You can send additional data here if needed
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming the token is stored in localStorage
            },
          }
        );
        if (response.status === 200) {
          alert('User role updated to Admin successfully!');
        }
      } catch (error) {
        console.error('Error updating user role:', error);
        alert('Failed to update user role.');
      }
    }
    closeUpdateModal();
  };

  // Function to handle status change
  const handleStatusChange = (id, newStatus) => {
    onStatusChange(id, newStatus);
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full bg-white">
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
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                <div className="relative">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    className="border rounded-md p-1 appearance-none bg-white w-full"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.5rem 1.5rem'
                    }}
                  >
                    <option value="Active" className="text-green-500">Active</option>
                    <option value="Inactive" className="text-red-500">Inactive</option>
                  </select>
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => handleUpdate(user)} className="bg-blue-500 text-white py-1 px-3 rounded-md mr-2 hover:bg-blue-600">
                  Update
                </button>
                <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Success Modal */}
      {isDeleteModalOpen && (
        <dialog id="success-modal" className="modal" open>
          <div className="modal-box relative">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeDeleteModal}>✕</button>
            <h3 className="font-bold text-lg">Success!</h3>
            <p className="py-4">Successfully deleted the user.</p>
          </div>
        </dialog>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && (
        <dialog id="my_modal_3" className="modal" open>
          <div className="modal-box">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeUpdateModal}>✕</button>
            <h3 className="font-bold text-lg">Update Role for {selectedUser.username}</h3>
            <p className="py-4">Select the new role for the user:</p>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="border rounded-md p-1 appearance-none bg-white w-full"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="modal-action">
              <button onClick={handleRoleChange} className="btn bg-blue-500 text-white hover:bg-blue-600">Save</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default UserList;
