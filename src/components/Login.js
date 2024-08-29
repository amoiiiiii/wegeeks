import React, { useState } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      const { token, role, id } = response.data;
  
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', id);
  
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'user') {
        navigate('/user');
      } else if (role === 'super_admin') {
        navigate('/superadmin');
      } else {
        navigate('/'); // Default redirect
      }
  
      console.log("id", id);
      console.log("token", token);

    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('There was an error logging in!', error);
    }
  };
  
  return (
    <div className="bg-white font-family-karla h-screen">
      <div className="w-full flex flex-wrap">
        {/* Login Section */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
            <p className="text-center text-3xl">Welcome.</p>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form className="flex flex-col pt-3 md:pt-8" onSubmit={handleSubmit}>
              <div className="flex flex-col pt-4">
                <label htmlFor="email" className="text-lg">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col pt-4 relative">
                <label htmlFor="password" className="text-lg">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </span>
                </div>
              </div>
              <input type="submit" value="Log In" className="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8" />
            </form>
          </div>
        </div>
        {/* Image Section */}
        <div className="w-1/2 shadow-2xl hidden md:block">
          <img className="object-cover w-full h-screen" src="https://static.vecteezy.com/system/resources/previews/001/991/652/non_2x/sign-in-page-flat-design-concept-illustration-icon-account-login-user-login-abstract-metaphor-can-use-for-landing-page-mobile-app-ui-posters-banners-free-vector.jpg" alt="Background" />
        </div>
      </div>
=======

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      // Simpan token JWT di local storage atau sesi
      localStorage.setItem('token', response.data.token);
      setEmail('');
      setPassword('');
      setError(null);
    } catch (error) {
      setError('Email atau password salah');
    }
  };

  return (
    <div>
      <h2>Form Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
>>>>>>> 09b8d3331c9f19ab50ffd412ecc294172741d6d3
    </div>
  );
};

<<<<<<< HEAD
export default Login;
=======
export default LoginForm;
>>>>>>> 09b8d3331c9f19ab50ffd412ecc294172741d6d3
