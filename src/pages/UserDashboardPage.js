<<<<<<< HEAD
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AttendanceForm from './AttendanceForm';
import AbsencesForm from './AbsencesForm';
import ChangePassword from './ChangePassword'; // Import ChangePassword component
import { FaRegPaperPlane, FaCalendarAlt } from 'react-icons/fa';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isToday } from 'date-fns';

const UserPage = () => {
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [setLoading] = useState(true); 
  const [profileEdit, setProfileEdit] = useState({ username: '', no: '', profilePicture: null });
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [absenceRequests, setAbsenceRequests] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [isEditing, setIsEditing] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false); // For Change Password Modal

  const navigate = useNavigate();

  const profileData = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/user/${userId}`);
      console.log(res.data)
      setProfileImage(`http://localhost:8080${res.data.url}`);
        
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    profileData();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const [profileResponse, attendanceResponse, absenceResponse] = await Promise.all([
            axios.get(`http://localhost:8080/user/${userId}`),
            axios.get(`http://localhost:8080/api/attendance/${userId}`),
            axios.get(`http://localhost:8080/api/absence/${userId}`)
          ]);
  
          // Construct the full profile picture URL
          const profileData = profileResponse.data;
          profileData.profile_picture_url = `http://localhost:8080${profileData.url}${profileData.profile_picture}`;
  
          setProfile(profileData);
          setProfileEdit({
            name: profileData.name,
            username: profileData.username,
            no: profileData.no,
            profilePicture: null
          });
          setAttendanceHistory(attendanceResponse.data);
          setAbsenceRequests(absenceResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [userId]);
  
  

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileEdit((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const response = await axios.get(`http://localhost:8080/user/${userId}`);
          const profileData = response.data;
          setProfile({
            ...profileData,
            profilePicture: profileData.url ? `http://localhost:8080${profileData.url}` : null
          });
          setProfileEdit({
            username: profileData.username,
            no: profileData.no,
            profilePicture: null // Reset profile picture if not editing
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [userId]);
  


  const handleProfilePictureChange = (e) => {
    setProfileEdit((prev) => ({
      ...prev,
      profilePicture: e.target.files[0] || null // Ensure file is correctly set
    }));
  };
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', profileEdit.username); // Tambahkan username
    formData.append('phone', profileEdit.phone); // Tambahkan nomor telepon
  
    if (profileEdit.profilePicture) {
      formData.append('profilePicture', profileEdit.profilePicture);
    }
    
    try {
      const response = await axios.put(
        `http://localhost:8080/api/auth/user/${userId}/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setProfile({
        ...profile,
        username: profileEdit.username,
        phone: profileEdit.phone,
        profilePicture: response.data.url
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
    }
  };

  const Calendar = () => {
    const today = new Date();
    const firstDayOfMonth = startOfMonth(today);
    const lastDayOfMonth = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
          <div className="bg-red-200 rounded-full p-4">
            <FaCalendarAlt className="text-red-600 text-3xl" />
          </div>
          <h2 className="text-xl font-semibold ml-4">Calendar</h2>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="p-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {daysInMonth.map((date, index) => {
            const isTodayDate = isToday(date);
            return (
              <div
                key={index}
                className={`p-2 rounded-full ${isTodayDate ? 'bg-blue-200 text-blue-700' : ''}`}
              >
                <p>{date.getDate()}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="navbar bg-blue-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Attendance</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-10 rounded-full">
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{ width: '90px', height: '90px', borderRadius: '10%' }}
                />
                <p>{profile?.name}</p>
              </div>
            </div>
            {showDropdown && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a
                    onClick={() => { setIsEditing(true); setShowDropdown(false); }}
                    className="justify-between"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a onClick={() => setShowModal(true)}>Change Password</a>
                </li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <form method="dialog" onSubmit={(e) => e.preventDefault()}>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h3 className="font-bold text-lg">Change Password</h3>
              <p className="py-4">Please enter your new password below.</p>
              <ChangePassword /> {/* Render the change password component here */}
            </form>
          </div>
        </dialog>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Absence Requests Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
          <div className="bg-yellow-200 rounded-full p-4">
          <FaRegPaperPlane className="text-yellow-600 text-3xl" />
          </div>
          <h2 className="text-xl font-semibold ml-4">Absence Requests</h2>
          </div>
          <p className="mb-4 text-gray-700">
          To request an absence, click on the "Request Absence" button and fill out the required information. You can specify the reason for your absence and the date range.
         </p>
         <button onClick={() => setShowAbsenceModal(true)} className="bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-700">
          Request Absence
         </button>
         <ul className="mt-4 text-sm">
         {absenceRequests.map((request, index) => (
         <li key={index} className="border-b py-2">
         <p className="font-semibold">{request.reason}</p>
        <p>{format(new Date(request.startDate), 'MMMM dd, yyyy')} - {format(new Date(request.endDate), 'MMMM dd, yyyy')}</p>
        </li>
        ))}
       </ul>
       </div>


          {/* Attendance History Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center mb-4">
              <div className="bg-green-200 rounded-full p-4">
              <FaRegPaperPlane className="text-green-600 text-3xl" />
              </div>
              <h2 className="text-xl font-semibold ml-4">Attendance</h2>
            </div>
            <p className="mb-4 text-gray-700">
              To mark your attendance, click on the "Mark Attendance" button. Ensure that you are in the office premises to successfully mark your attendance.
            </p>
            <button onClick={() => setShowAttendanceModal(true)} className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700">
              Mark Attendance
            </button>
            <ul className="mt-4 text-sm">
              {attendanceHistory.map((attendance, index) => (
                <li key={index} className="border-b py-2">
                  <p className="font-semibold">{format(new Date(attendance.date), 'MMMM dd, yyyy')}</p>
                  <p>Check-In: {format(new Date(attendance.checkIn), 'hh:mm a')}</p>
                  <p>Check-Out: {attendance.checkOut ? format(new Date(attendance.checkOut), 'hh:mm a') : 'N/A'}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Calendar Section */}
          <div>
            <Calendar />
          </div>
        </div>
      </main>

      {/* Attendance Form Modal */}
      {showAttendanceModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <form method="dialog" onSubmit={(e) => e.preventDefault()}>
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setShowAttendanceModal(false)}
              >
                ✕
              </button>
              <AttendanceForm /> {/* Render the attendance form component here */}
            </form>
          </div>
        </dialog>
      )}

          {/* Absence Modal */}
          {showAbsenceModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <AbsencesForm />
            <div className="modal-action">
              <button onClick={() => setShowAbsenceModal(false)} className="btn">Close</button>
            </div>
          </div>
        </dialog>
      )}

{isEditing && (
  <dialog open className="modal modal-open">
    <div className="modal-box">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleProfileSubmit}>
        <div className="form-control mb-4">
          <label className="label">Username</label>
          <input
            type="text"
            name="username"
            value={profileEdit.username}
            onChange={handleProfileChange}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">Phone Number</label>
          <input
            type="text"
            name="no"
            value={profileEdit.no}
            onChange={handleProfileChange}
            className="input input-bordered"
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            className="file-input w-full max-w-xs"
            onChange={handleProfilePictureChange}
          />
        </div>
        <div className="modal-action">
          <button type="submit" className="btn btn-black">Save</button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </dialog>
)}
    </div>
  );
};

export default UserPage;
=======
import React from 'react';

const UserDashboardPage = () => {
  return (
    <div>
      <header>
        {/* Header content */}
      </header>
      <nav>
        <ul>
          <li>Profil Pengguna</li>
          <li>Absensi Saya</li>
        </ul>
      </nav>
      <main>
        <section>
          <h1>Dashboard User</h1>
          <div>
            <h2>Informasi Profil</h2>
            <p>Nama: John Doe</p>
            <p>Email: john.doe@example.com</p>
            <p>Foto Profil: [Gambar]</p>
          </div>
          <div>
            <h2>Absensi Hari Ini</h2>
            <p>Tanggal: 08-07-2024</p>
            <p>Status: Masuk</p>
          </div>
        </section>
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default UserDashboardPage;
>>>>>>> 09b8d3331c9f19ab50ffd412ecc294172741d6d3
