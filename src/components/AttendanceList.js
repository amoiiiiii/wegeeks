import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceList = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get('http://localhost:8080/attendance');
        setAttendanceList(response.data);
      } catch (error) {
        console.error('Failed to fetch attendance data', error);
        toast.error('Failed to fetch attendance data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const handleDelete = async (id_user) => {
    if (!id_user) {
      console.error('ID is not defined');
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/attendance/${id_user}`);
      setAttendanceList(attendanceList.filter(attendance => attendance.id_user !== id_user));
      toast.success('Attendance deleted successfully.');
    } catch (error) {
      console.error('Failed to delete attendance', error);
      toast.error('Failed to delete attendance.');
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return format(date, 'dd-MM-yyyy HH:mm:ss');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Attendance List</h1>
      <table className="w-full text-sm text-left text-black-500 dark:text-black-400">
        <thead className="text-xs text-black-700 uppercase bg-black-50 dark:bg-black-700 dark:text-black-400">
          <tr>
            <th scope="col" className="px-6 py-3">No</th>
            <th scope="col" className="px-6 py-3">Employee ID</th>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Check-In Time</th>
            <th scope="col" className="px-6 py-3">Check-Out Time</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendanceList
            .sort((a, b) => new Date(b.check_in_time) - new Date(a.check_in_time)) // Sort new entries to the top
            .map((attendance, index) => (
              <tr key={attendance.id_user} className={`odd:bg-white even:bg-black-50 border-b dark:border-black-700`}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{attendance.id_user}</td>
                <td className="px-6 py-4">{attendance.username}</td>
                <td className="px-6 py-4">{formatDate(attendance.check_in_time)}</td>
                <td className="px-6 py-4">
                  {attendance.check_out_time ? formatDate(attendance.check_out_time) : 'Not Checked Out'}
                </td>
                <td className="px-6 py-4">{attendance.status}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(attendance.id_user)}
                    className="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
};

export default AttendanceList;
