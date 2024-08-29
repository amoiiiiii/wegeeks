import React from 'react';
import { FaTachometerAlt, FaUserPlus, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onSelectView, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Panggil fungsi logout dari komponen induk
    navigate('/login'); // Arahkan pengguna ke halaman login setelah logout
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="flex flex-col py-4 px-6">
        <h3 className="text-2xl font-bold mb-6">Super Admin</h3>
        <nav>
          <ul>
            <li className="mb-2">
              <button
                onClick={() => onSelectView('dashboard')}
                className="flex items-center py-2 px-4 rounded hover:bg-blue-700 w-full text-left"
              >
                <FaTachometerAlt className="mr-3" />
                Dashboard
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => onSelectView('create-account')}
                className="flex items-center py-2 px-4 rounded hover:bg-blue-700 w-full text-left"
              >
                <FaUserPlus className="mr-3" />
                Create Account
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => onSelectView('users')}
                className="flex items-center py-2 px-4 rounded hover:bg-blue-700 w-full text-left"
              >
                <FaUsers className="mr-3" />
                Users
              </button>
            </li>
            <li className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center py-2 px-4 rounded hover:bg-blue-700 w-full text-left"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div> 
    </div>
  );
};

export default Sidebar;
