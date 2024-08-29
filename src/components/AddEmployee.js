import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [no, setNo] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Set default values
  const defaultPassword = 'defaultpassword';
  const defaultRole = 'user';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password: defaultPassword,
        role: defaultRole,
        no,
        position
      });
      console.log('Response:', response); // Log response for debugging

      // Show modal on successful registration
      setMessage(''); 
      setShowModal(true);
      setUsername('');
      setEmail('');
      setNo('');
      setPosition('');
    } catch (error) {
      console.error('Registration error:', error); // Log error for debugging
      setMessage('Error registering user. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Create Account User</h2>
      {message && <p className={`text-${message.includes('Error') ? 'red' : 'green'}-500`}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="grow"
              placeholder="Username"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path
                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="grow"
              placeholder="Email"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd" />
            </svg>
            <input
              type="password"
              value={defaultPassword}
              className="grow"
              readOnly
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M1 2.5a1.5 1.5 0 0 1 1.5-1.5h11A1.5 1.5 0 0 1 15 2.5v11A1.5 1.5 0 0 1 13.5 15h-11A1.5 1.5 0 0 1 1 13.5v-11ZM2 2a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-11Z" />
            </svg>
            <input
              type="text"
              value={no}
              onChange={(e) => setNo(e.target.value)}
              className="grow"
              placeholder="Phone"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                d="M3 1.5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 13 1.5v13A1.5 1.5 0 0 1 11.5 16h-7A1.5 1.5 0 0 1 3 14.5v-13Zm1 0a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-7Z" />
            </svg>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="grow"
              placeholder="Position"
              required
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm">Role</label>
          <input
            type="text"
            value={defaultRole}
            className="input input-bordered w-full"
            readOnly
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Create 
          </button>
        </div>
      </form>

      {/* Modal */}
      {showModal && (
        <dialog id="my_modal_3" open className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Registration Successful!</h3>
            <p className="py-4">Your account has been created successfully.</p>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default RegisterForm;
