import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import AddEmployee from './AddEmployee';
import EmployeeList from './EmployeeList';
import AttendanceList from './AttendanceList';
import Absences from './Absences';
import Recap from './Recap'; 
import AttendanceFormModal from './AttendanceFormModal';
import AbsenceFormModal from './AbsenceFormModal';

import { HomeIcon, UserPlusIcon, UsersIcon, ClipboardDocumentListIcon, DocumentMinusIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import ProfileEditModal from './ProfileEditModal';

const Sidebar = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showAttendanceFormModal, setShowAttendanceFormModal] = useState(false);
  const [showAbsenceFormModal, setShowAbsenceFormModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [profileEdit, setProfileEdit] = useState({ name: '', profilePicture: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const res = await axios.get(`http://localhost:8080/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfile(res.data);
        setProfileImage(`http://localhost:8080${res.data.url}`);
        setProfileEdit({ name: res.data.name, profilePicture: null });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);
  const handleOpenAttendanceForm = () => {
    setShowAttendanceFormModal(true);
  };

  const handleOpenAbsenceForm = () => {
    setShowAbsenceFormModal(true);
  };
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    setProfileEdit((prev) => ({
      ...prev,
      profilePicture: e.target.files[0] || null
    }));
  };

  const handleProfileSubmit = async (profilePicture) => {
    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('name', profileEdit.name);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
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
        name: profileEdit.name,
        profilePicture: response.data.url
      });
      setProfileImage(`http://localhost:8080${response.data.url}`);
      setShowProfileEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'addEmployee':
        return <AddEmployee />;
      case 'employeeList':
        return <EmployeeList />;
      case 'attendanceList':
        return <AttendanceList />;
      case 'absencesList':
        return <Absences />;
      case 'recap':
        return <Recap />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="navbar bg-base-100">
        <div className="flex-1">
          {/* Add any navbar content here */}
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{ width: '90px', height: '90px', borderRadius: '10%' }}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a
                  onClick={() => setShowProfileEditModal(true)}
                  className="justify-between"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  onClick={() => setShowAttendanceFormModal(true)}
                  className="justify-between"
                >
                  attendance
                </a>
              </li>
              <li>
                <a
                  onClick={() => setShowAbsenceFormModal(true)}
                  className="justify-between"
                >
                  absences
                </a>
              </li>
              <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              >
                <HomeIcon className="w-6 h-6 mr-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span>Admin Dashboard</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => setCurrentView('addEmployee')}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              >
                <UserPlusIcon className="w-6 h-6 mr-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span>Add Employee</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => setCurrentView('employeeList')}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              >
                <UsersIcon className="w-6 h-6 mr-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span>Employee List</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => setCurrentView('attendanceList')}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              >
                <ClipboardDocumentListIcon className="w-6 h-6 mr-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span>Attendance List</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => setCurrentView('absencesList')}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              >
                <DocumentMinusIcon className="w-6 h-6 mr-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span>Absences</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => setCurrentView('recap')}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"
              >
                <ChartBarIcon className="w-6 h-6 mr-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span>Recap</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Content Area */}
      <div className="p-4 sm:ml-64">
        {renderContent()}
      </div>
      {showAttendanceFormModal && (
          <AttendanceFormModal
            onClose={() => setShowAttendanceFormModal(false)} // Tutup modal ketika selesai
            hasCheckedIn={false} // Sesuaikan dengan status check-in pengguna
          />
        )}

        {showAbsenceFormModal && (
          <AbsenceFormModal
            onClose={() => setShowAbsenceFormModal(false)} // Tutup modal ketika selesai
          />
        )}
      {/* Profile Edit Modal */}
      {showProfileEditModal && (
        <ProfileEditModal
          onClose={() => setShowProfileEditModal(false)}
          profileEdit={profileEdit}
          handleProfileChange={handleProfileChange}
          handleProfilePictureChange={handleProfilePictureChange}
          handleProfileSubmit={handleProfileSubmit}
          profileImage={profileImage} // Pass the updated profileImage
        />
      )}
    </>

    
  );
  
};

export default Sidebar;
