import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from './CommentSection';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/tickets/${id}/`);
      setTicket(response.data);
    } catch (error) {
      console.error("Failed to fetch ticket", error);
      // Handle 404
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleAssign = async () => {
    try {
      await api.post(`/tickets/${id}/assign/`);
      fetchTicket();
    } catch (error) {
      console.error("Failed to assign ticket", error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.post(`/tickets/${id}/change_status/`, { status: newStatus });
      fetchTicket();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!ticket) return <div>Ticket not found.</div>;

  const isAgent = user?.role === 'AGENT' || user?.role === 'ADMIN';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate('/dashboard')} className="mb-4 text-blue-600 hover:underline">
        &larr; Back to Dashboard
      </button>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold leading-6 text-gray-900">{ticket.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Created by {ticket.created_by_email}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
              {ticket.status}
            </span>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800`}>
              {ticket.priority}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{ticket.description}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {ticket.assigned_to_email || 'Unassigned'}
                {isAgent && !ticket.assigned_to && (
                  <button
                    onClick={handleAssign}
                    className="ml-4 text-blue-600 hover:text-blue-900 font-medium text-xs border border-blue-600 rounded px-2 py-1"
                  >
                    Claim Ticket
                  </button>
                )}
              </dd>
            </div>
            {isAgent && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt className="text-sm font-medium text-gray-500">Actions</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex gap-2">
                  {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={ticket.status === status}
                      className={`px-3 py-1 rounded text-xs font-semibold ${ticket.status === status
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Mark {status}
                    </button>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <CommentSection ticketId={ticket.id} />
    </div>
  );
};

export default TicketDetail;
