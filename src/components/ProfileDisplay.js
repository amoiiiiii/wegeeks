import React, { useState } from 'react';
import ProfileEditModal from './ProfileEditModal'; // Import your modal component

const ProfileDisplay = ({ profileImage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex-none gap-2">
      <div className="dropdown dropdown-end">
        <div 
          tabIndex={0} 
          role="button" 
          className="btn btn-ghost btn-circle avatar"
          onClick={handleEditClick} // Open the modal on click
        >
          <div className="w-10 rounded-full">
            <img
              src={profileImage}
              alt="Profile"
              style={{ width: '90px', height: '90px', borderRadius: '10%' }}
            />
          </div>
        </div>
      </div>

      {/* Conditionally render the modal */}
      {isModalOpen && (
        <ProfileEditModal
          profileImage={profileImage}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProfileDisplay;
