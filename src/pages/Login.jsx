import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';  // Import AuthContext
import loginImage from '../assets/login.jpg'; // Ensure the image path is correct

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // Access login function from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        login(data.token);  // Use context's login function to store the token
        navigate('/home');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong during login.');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden md:flex w-1/2 h-screen">
        <img src={loginImage} alt="Login Visual" className="object-cover h-full w-full" style={{ alignSelf: 'flex-start' }} />
      </div>
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        <h1 className="text-4xl font-bold mb-2 text-blue-900">Invexa</h1>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          Welcome to Invexa — your ultimate platform for seamless product discovery and efficient order management.
        </p>
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition duration-200"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-blue-700 hover:underline">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
