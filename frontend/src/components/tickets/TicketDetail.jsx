import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from './CommentSection';
import {
  ChevronLeft,
  Clock,
  Circle,
  AlertCircle,
  ShieldAlert,
  Share2,
  Edit3,
  User,
  Calendar,
  Tag,
  Hash,
  FileIcon,
  Download
} from 'lucide-react';

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

  if (loading) return (
    <div className="animate-pulse space-y-8">
      <div className="h-8 bg-slate-200 rounded w-1/4" />
      <div className="flex gap-8">
        <div className="flex-1 h-96 bg-slate-100 rounded-xl" />
        <div className="w-80 h-96 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
  if (!ticket) return <div className="text-center py-20 text-slate-500 font-bold">Ticket not found.</div>;

  const isAgent = user?.role === 'AGENT' || user?.role === 'ADMIN';

  const ALLOWED_TRANSITIONS = {
    'OPEN': ['IN_PROGRESS'],
    'IN_PROGRESS': ['ESCALATED', 'RESOLVED'],
    'ESCALATED': ['IN_PROGRESS', 'RESOLVED'],
    'RESOLVED': ['CLOSED'],
    'CLOSED': []
  };

  const allowedNextStatuses = user?.role === 'ADMIN'
    ? ['OPEN', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'CLOSED'].filter(s => s !== ticket.status)
    : ALLOWED_TRANSITIONS[ticket.status] || [];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'OPEN': return 'text-sky-600 bg-sky-50 border-sky-100';
      case 'IN_PROGRESS': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'RESOLVED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'ESCALATED': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
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

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      {/* Header / Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
          <span>Dashboard</span>
          <span className="text-slate-200">/</span>
          <span className="text-slate-600">Ticket Details</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Main Content */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(ticket.status)}`}>
                <Circle className="w-2.5 h-2.5 fill-current inline-block mr-1 opacity-50" />
                {ticket.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-600 border border-rose-100 font-bold uppercase tracking-wider">
                <AlertCircle className="w-2.5 h-2.5 inline-block mr-1" />
                {ticket.priority} Priority
              </span>
              <span className="text-slate-400 font-bold text-[11px] uppercase tracking-tighter ml-auto flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" /> ID: #{formatId(ticket.id)}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight uppercase">
              {ticket.title}
            </h1>
            <div className="flex items-center gap-6 text-slate-500 font-bold text-xs uppercase tracking-tight">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-300" />
                Created on {formatDateTime(ticket.created_at)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-300" />
                Updated {formatTime(ticket.updated_at)}
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="premium-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-tight">
                <Edit3 className="w-4 h-4 text-primary-600" />
                Description
              </div>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>

            {/* Ticket Attachments */}
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="mt-10 pt-8 border-t border-slate-100">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Original Attachments</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ticket.attachments.map((file) => (
                    <a
                      key={file.id}
                      href={file.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-slate-200 rounded-xl p-4 flex items-center gap-4 bg-white hover:border-primary-200 hover:shadow-md transition-all group flex-1"
                    >
                      <div className="bg-primary-50 p-2.5 rounded-xl text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <FileIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-700 truncate">{file.file_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{(file.file_size / 1024).toFixed(1)} KB</p>
                      </div>
                      <Download className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <CommentSection ticketId={ticket.id} />
        </div>

        {/* Right Column: Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Actions Card */}
          <div className="premium-card p-6">
            <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-tight">Actions</h3>

            <div className="space-y-4">
              {/* Contextual Action Buttons */}
              <div className="space-y-3">
                {ticket.status === 'OPEN' && isAgent && (
                  <button
                    onClick={handleAssign}
                    className="w-full premium-button-primary justify-center shadow-lg shadow-primary-600/10"
                  >
                    Claim Ticket
                  </button>
                )}

                {ticket.status === 'IN_PROGRESS' && isAgent && (
                  <button
                    onClick={() => handleStatusChange('RESOLVED')}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
                  >
                    Mark as Resolved
                  </button>
                )}

                {(ticket.status === 'RESOLVED' || ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') && (user.id === ticket.created_by || user.role === 'ADMIN') && (
                  <button
                    onClick={() => handleStatusChange('CLOSED')}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
                  >
                    Close Ticket
                  </button>
                )}

                {(ticket.status === 'IN_PROGRESS' || ticket.status === 'ESCALATED') && isAgent && (
                  <button
                    onClick={() => handleStatusChange('OPEN')}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-600 rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Move back to Open
                  </button>
                )}

                {(ticket.status === 'IN_PROGRESS' || ticket.status === 'OPEN') && isAgent && (
                  <button
                    onClick={() => handleStatusChange('ESCALATED')}
                    className="w-full flex items-center justify-center gap-2 bg-rose-50 border border-rose-100 rounded-xl py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4" /> Escalate Ticket
                  </button>
                )}

                {ticket.status === 'ESCALATED' && user.role === 'ADMIN' && (
                  <button
                    onClick={() => handleStatusChange('IN_PROGRESS')}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 border border-blue-100 rounded-xl py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    Mark as In Progress
                  </button>
                )}

                {/* If nothing matches, show an informative message */}
                {ticket.status === 'CLOSED' && (
                  <p className="text-center py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                    This ticket is archived.
                  </p>
                )}

                {ticket.status !== 'CLOSED' && !isAgent && user.id !== ticket.created_by && (
                  <p className="text-center py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                    No actions available.
                  </p>
                )}
              </div>

              {user.role === 'ADMIN' && (
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 italic">Admin Override</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-[10px] font-bold text-slate-700 focus:outline-none"
                  >
                    {['OPEN', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'CLOSED'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Details Card */}
          <div className="premium-card p-6">
            <h3 className="font-bold text-slate-900 mb-6 uppercase tracking-tight">Details</h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Requester</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400 font-bold text-xs uppercase">
                    {ticket.created_by_email[0]}
                  </div>
                  <span className="text-sm font-bold text-slate-700 truncate">{ticket.created_by_email}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Assignee</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${ticket.assigned_to ? 'bg-primary-50 text-primary-600 border-primary-100' : 'bg-slate-100 text-slate-400 border-slate-200'} flex items-center justify-center border font-bold text-xs uppercase`}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 truncate">
                    {ticket.assigned_to_email || 'Unassigned'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
