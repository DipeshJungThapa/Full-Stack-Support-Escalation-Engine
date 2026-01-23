import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError('Failed to register. Email might be taken.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center">Create an account</h3>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block">First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <label className="block">Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <label className="block">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-baseline justify-between mt-4">
            <button className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Register</button>
            <Link to="/login" className="text-sm text-blue-600 hover:underline">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
