import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Stats from './Stats';
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [filter, setFilter] = useState('ASSIGNED'); // ALL, ASSIGNED, UNASSIGNED
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets/');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'ASSIGNED') return ticket.assigned_to === user.id;
    if (filter === 'UNASSIGNED') return ticket.assigned_to === null;
    return true;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'OPEN': return 'text-sky-600 bg-sky-50 border-sky-100';
      case 'IN_PROGRESS': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'RESOLVED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'ESCALATED': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-rose-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'LOW': return 'bg-sky-500';
      default: return 'bg-slate-500';
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTimeExact = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-capitalize">
            {filter === 'ASSIGNED' ? 'Assigned Tickets' : filter === 'UNASSIGNED' ? 'Unassigned Pool' : 'All Active Tickets'}
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and track your active support requests.</p>
        </div>
        <button
          onClick={() => navigate('/tickets/new')}
          className="premium-button-primary shadow-lg shadow-primary-600/20"
        >
          <Plus className="w-5 h-5" />
          New Ticket
        </button>
      </div>

      <Stats />

      <div className="premium-card overflow-hidden">
        {/* Tabs & Search */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50">
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
            {[
              { id: 'ASSIGNED', label: 'Assigned to Me', count: tickets.filter(t => t.assigned_to === user?.id).length },
              { id: 'UNASSIGNED', label: 'Unassigned', count: tickets.filter(t => t.assigned_to === null).length },
              { id: 'ALL', label: 'All Active' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${filter === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${filter === tab.id ? 'bg-primary-50' : 'bg-slate-200 text-slate-600'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Filter by ID, subject..."
                className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              />
            </div>
            <button className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic-last-row">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-6"><div className="h-4 bg-slate-100 rounded" /></td>
                  </tr>
                ))
              ) : filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5 text-sm font-bold text-slate-400 uppercase tracking-tight">
                    #TKT-{formatId(ticket.id)}
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <Link to={`/tickets/${ticket.id}`} className="text-sm font-bold text-slate-900 hover:text-primary-600 transition-colors block uppercase">
                        {ticket.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">Requester: {ticket.created_by_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`} />
                      <span className="text-sm font-bold text-slate-700">{ticket.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-slate-700">{formatDate(ticket.created_at)}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{formatTimeExact(ticket.created_at)}</p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="w-5 h-5 ml-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {filteredTickets.length} of {tickets.length} results
          </p>
          <div className="flex items-center gap-2">
            <button disabled className="p-1 px-2 text-slate-300 cursor-not-allowed"><ChevronLeft className="w-5 h-5" /></button>
            <button className="p-1 px-2 text-slate-400 hover:text-slate-900"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
