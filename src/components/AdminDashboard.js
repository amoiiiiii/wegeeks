import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // State untuk memicu efek samping

  useEffect(() => {
    fetchEmployees();
  }, [refreshKey]); // Memanggil fetchEmployees setiap kali refreshKey berubah

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/employees', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRefreshKey((prevKey) => prevKey + 1); // Memicu efek samping untuk refresh data
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="actions">
        <Link to="/add">
          <button>Add Employee</button>
        </Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>
                <Link to={`/update/${employee.id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
