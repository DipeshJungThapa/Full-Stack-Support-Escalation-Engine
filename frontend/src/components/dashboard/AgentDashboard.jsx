import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const { logout, user } = useAuth();
  const [filter, setFilter] = useState('ALL'); // ALL, ASSIGNED, UNASSIGNED

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets/');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'ASSIGNED') return ticket.assigned_to === user.id;
    if (filter === 'UNASSIGNED') return ticket.assigned_to === null;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agent Dashboard</h1>
        <div className="flex gap-4">
          <span className="text-gray-600">Agent: {user?.email}</span>
          <button onClick={logout} className="text-red-600 hover:text-red-800">Logout</button>
          <Link to="/tickets/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">New Ticket</Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 ${filter === 'ALL' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All Tickets
        </button>
        <button
          className={`px-4 py-2 ${filter === 'ASSIGNED' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setFilter('ASSIGNED')}
        >
          My Assigned
        </button>
        <button
          className={`px-4 py-2 ${filter === 'UNASSIGNED' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setFilter('UNASSIGNED')}
        >
          Unassigned Pool
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredTickets.map((ticket) => (
            <li key={ticket.id}>
              <Link to={`/tickets/${ticket.id}`} className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">{ticket.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                          ticket.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 gap-4">
                      <p>Priority: {ticket.priority}</p>
                      <p>{ticket.assigned_to ? 'Assigned' : 'Unassigned'}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {filteredTickets.length === 0 && (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No tickets found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AgentDashboard;
