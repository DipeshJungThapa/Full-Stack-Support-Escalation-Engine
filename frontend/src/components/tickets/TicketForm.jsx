import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const TicketForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'LOW'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tickets/', formData);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create ticket.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center">Create New Ticket</h3>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Brief summary of the issue"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block">Description</label>
            <textarea
              name="description"
              placeholder="Detailed description"
              rows="4"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block">Priority</label>
            <select
              name="priority"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div className="flex items-baseline justify-between mt-4">
            <button className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Submit Ticket</button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
