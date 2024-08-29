import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceFormModal = ({ onClose = () => {}, hasCheckedIn }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [errorMessage, setErrorMessage] = useState('');
  const [checkedIn, setCheckedIn] = useState(hasCheckedIn);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const validUserId = userId && !isNaN(userId) ? parseInt(userId, 10) : null;

  useEffect(() => {
    setCheckedIn(hasCheckedIn);
  }, [hasCheckedIn]);

  useEffect(() => {
    if (!validUserId) {
      setErrorMessage('User ID not found.');
      return;
    }

    const timerId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timerId);
  }, [validUserId]);

  const handleSubmit = async (status) => {
    if (!validUserId) {
      setErrorMessage('User ID is not available.');
      return;
    }

    if (status === 'check-in' && checkedIn) {
      setErrorMessage('You have already checked in today.');
      return;
    }

    if (status === 'check-out' && !checkedIn) {
      setErrorMessage('You must check in before checking out.');
      return;
    }

    setErrorMessage('');

    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toISOString().split('T')[1].split('.')[0];

    const dataToSend = {
      id_user: validUserId,
      check_in_date: currentDate,
      status: status,
      check_in_time: status === 'check-in' ? currentTime : null,
      check_out_time: status === 'check-out' ? currentTime : null,
    };

    try {
      await axios.post('http://localhost:8080/attendance', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (status === 'check-in') {
        setCheckedIn(true);
        toast.success('Check-in successful!');
      } else if (status === 'check-out') {
        setCheckedIn(false);
        toast.success('Check-out successful!');
      }

      setTimeout(() => {
        onClose();
      }, 5000);
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to add attendance');
      }
      console.error('API error:', error);
    }
  };

  return (
    <dialog id="attendanceFormModal" className="modal" open>
      <div className="modal-box relative">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Attendance</h2>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <div className="text-center mb-4">
          <p className="text-lg">Current Time:</p>
          <p className="text-xl font-mono">{currentTime}</p>
        </div>
        <div className="flex justify-between">
          {!checkedIn && (
            <button
              type="button"
              onClick={() => handleSubmit('check-in')}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Check In
            </button>
          )}
          {checkedIn && (
            <button
              type="button"
              onClick={() => handleSubmit('check-out')}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Check Out
            </button>
          )}
        </div>
        <ToastContainer />
      </div>
    </dialog>
  );
};

export default AttendanceFormModal;
