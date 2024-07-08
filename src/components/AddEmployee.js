import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddEmployee.css';

function AddEmployee() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://127.0.0.1:5000/api/employees', { name, position }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      console.error("There was an error adding the employee!", error);
    }
  };
  

  return (
    <div className="add-employee-container">
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Position" required />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddEmployee;
