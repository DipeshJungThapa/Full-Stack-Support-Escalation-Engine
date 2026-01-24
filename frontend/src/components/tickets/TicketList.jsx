import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Stats from '../dashboard/Stats';
import {
  ChevronRight,
  Circle,
  Clock,
  Plus,
  Filter,
  User,
  Ticket,
  CheckCircle2
} from 'lucide-react';

const TicketList = ({ title = "My Tickets", subtitle = "Manage and track your open support requests." }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets/');
        if (Array.isArray(response.data)) {
          setTickets(response.data);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CLOSED': return 'bg-slate-50 text-slate-600 border-slate-100';
      case 'ESCALATED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'HIGH': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'MEDIUM': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'LOW': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const formatId = (id) => id.toString().split('-')[0].toUpperCase();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500 mt-1 font-medium">{subtitle}</p>
        </div>
        <button
          onClick={() => navigate('/tickets/new')}
          className="premium-button-primary shadow-lg shadow-primary-600/20"
        >
          <Plus className="w-5 h-5" />
          Create Ticket
        </button>
      </div>

      <Stats />

      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="font-bold text-slate-800 text-lg">Recent Tickets</h2>
        </div>

        <div className="space-y-3">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-24 premium-card animate-pulse" />
            ))
          ) : tickets.map((ticket) => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="premium-card p-5 block group hover:border-primary-200"
            >
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-full border ${getStatusStyle(ticket.status)}`}>
                  {ticket.status === 'OPEN' ? <Circle className="w-5 h-5 fill-current opacity-50" /> :
                    ticket.status === 'RESOLVED' ? <CheckCircle2 className="w-5 h-5" /> :
                      <Clock className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-primary-600 tracking-wide uppercase">#{formatId(ticket.id)}</span>
                    <h3 className="font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors uppercase">
                      {ticket.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 font-medium truncate max-w-2xl">
                    {ticket.description}
                  </p>

                  <div className="mt-3 flex items-center gap-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getPriorityStyle(ticket.priority)}`}>
                      {ticket.priority} Priority
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold tracking-tight">Updated {formatTime(ticket.updated_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-400 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
          {!loading && tickets.length === 0 && (
            <div className="text-center py-20 premium-card bg-slate-50/50 border-dashed">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-semibold text-lg">No tickets found</p>
              <p className="text-slate-400 text-sm">Get started by creating your first support ticket.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketList;
