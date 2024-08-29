// UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <img
        alt="Profile"
        src={profile.profile_picture ? `${profile.profile_picture}?${new Date().getTime()}` : '/default-avatar.png'}
        className="object-cover w-full h-full rounded-full"
      />
      <h2>{profile.username}</h2>
      {/* Other profile details */}
    </div>
  );
};

export default UserProfile;
