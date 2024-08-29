import React, { useEffect, useState } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import { format } from 'date-fns';
import { FaUsers } from 'react-icons/fa'; // Pastikan Anda sudah menginstal react-icons

const AdminDashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [absenceCount, setAbsenceCount] = useState(0);
  const [attendanceList, setAttendanceList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch total number of employees
      const userResponse = await axios.get('http://localhost:8080/api/auth/user', {
=======
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
>>>>>>> 09b8d3331c9f19ab50ffd412ecc294172741d6d3
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
<<<<<<< HEAD
      const totalUsers = userResponse.data.adminUsers.length + userResponse.data.regularUsers.length + userResponse.data.superAdminUsers.length;
      setTotalEmployees(totalUsers);
  
      // Fetch today's attendance data
      const response = await axios.get('http://localhost:8080/api/attendance/today', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const { attendanceData, counts } = response.data;

      // Set attendance list and counts
      setAttendanceList(attendanceData);
      setAttendanceCount(counts.attendance);
      setAbsenceCount(counts.absence);
  
    } catch (error) {
      console.error('Error fetching data:', error.response ? error.response.data : error.message);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd-MM-yyyy HH:mm:ss');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
=======
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
>>>>>>> 09b8d3331c9f19ab50ffd412ecc294172741d6d3
    }
  };

  return (
<<<<<<< HEAD
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      
      {/* Cards Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Total Employees */}
          <div className="bg-blue-500 text-white shadow-lg rounded-lg p-6 text-center">
            <div className="bg-blue-600 p-4 rounded-full mb-4 mx-auto flex items-center justify-center">
              <FaUsers className="text-white text-3xl" />
            </div>
            <h3 className="text-2xl font-semibold mb-4">Total Employees</h3>
            <p className="text-3xl font-bold">{totalEmployees}</p>
          </div>

          {/* Card 2: Attendance Today */}
          <div className="bg-green-500 text-white shadow-lg rounded-lg p-6 text-center">
            <div className="bg-green-600 p-4 rounded-full mb-4 mx-auto flex items-center justify-center">
              <FaUsers className="text-white text-3xl" />
            </div>
            <h4 className="text-2xl font-semibold mb-4">Attendance Today</h4>
            <p className="text-2xl font-bold">{attendanceCount} Present</p>
          </div>

          {/* Card 3: Absences Today */}
          <div className="bg-red-500 text-white shadow-lg rounded-lg p-6 text-center">
            <div className="bg-red-600 p-4 rounded-full mb-4 mx-auto flex items-center justify-center">
              <FaUsers className="text-white text-3xl" />
            </div>
            <h4 className="text-2xl font-semibold mb-4">Absences Today</h4>
            <p className="text-2xl font-bold">{absenceCount} Absent</p>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Today's Attendance</h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-black-500 dark:text-black-400">
            <thead className="text-xs text-black-700 uppercase bg-black-50 dark:bg-black-700 dark:text-black-400">
              <tr>
                <th scope="col" className="px-6 py-3">No</th>
                <th scope="col" className="px-6 py-3">Employee ID</th>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Check-In Time</th>
                <th scope="col" className="px-6 py-3">Check-Out Time</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((attendance, index) => (
                Number.isInteger(Number(attendance.id_user)) ? (
                  <tr key={attendance.id_user} className={`odd:bg-white even:bg-black-50 border-b dark:border-black-700`}>
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{attendance.id_user}</td>
                    <td className="px-6 py-4">{attendance.username}</td>
                    <td className="px-6 py-4">{formatDate(attendance.check_in_time)}</td>
                    <td className="px-6 py-4">
                      {attendance.check_out_time ? formatDate(attendance.check_out_time) : 'Not Checked Out'}
                    </td>
                    <td className="px-6 py-4">{attendance.status}</td>
                  </tr>
                ) : (
                  <tr key={index} className={`odd:bg-white even:bg-black-50 border-b dark:border-black-700`}>
                    <td className="px-6 py-4" colSpan="6">Invalid user data</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
=======
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
>>>>>>> 09b8d3331c9f19ab50ffd412ecc294172741d6d3

export default AdminDashboard;
