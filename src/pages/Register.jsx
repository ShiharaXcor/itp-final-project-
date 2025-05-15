import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../assets/login.jpg';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    location: '',
    address: '',
    contact: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
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
          Join Invexa and streamline your inventory, orders, and customer connections in one smart platform.
        </p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          <input name="name" placeholder="Full Name" onChange={handleChange} className="input" required />
          <input name="email" placeholder="Email" type="email" onChange={handleChange} className="input" required />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} className="input" required />
          <input name="confirmPassword" placeholder="Confirm Password" type="password" onChange={handleChange} className="input" required />
          <input name="businessName" placeholder="Business Name" onChange={handleChange} className="input" />
          <input name="location" placeholder="Location" onChange={handleChange} className="input" />
          <input name="address" placeholder="Address" onChange={handleChange} className="input" />
          <input name="contact" placeholder="Contact Number" onChange={handleChange} className="input" />
          <div className="sm:col-span-2">
            <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition">
              Register
            </button>
          </div>
          <div className="sm:col-span-2 text-center">
            <p className="text-sm text-gray-600 mt-2">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-blue-700 hover:underline">
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
