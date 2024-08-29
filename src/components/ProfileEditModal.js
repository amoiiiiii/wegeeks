import React, { useState } from 'react';

const ProfileEditModal = ({ profileImage, onClose, handleProfileSubmit }) => {
  const [newProfileImage, setNewProfileImage] = useState(profileImage);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      setProfilePicture(file); // Simpan file baru ke state
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleProfileSubmit(profilePicture); // Kirim file baru ke parent component untuk di-submit
    onClose(); // Tutup modal setelah submit
  };

  const handleModalClose = () => {
    onClose();
  };

  return (
    <dialog id="profileEditModal" className="modal" open>
      <div className="modal-box relative">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleModalClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <img
              src={newProfileImage}
              alt="Profile"
              style={{ width: '90px', height: '90px', borderRadius: '10%' }}
            />
            <input
              type="file"
              onChange={handleProfilePictureChange}
              className="file-input file-input-bordered w-full mt-2"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-black">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ProfileEditModal;
