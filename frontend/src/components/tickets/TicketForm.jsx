import React, { useState, useRef } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, AlertTriangle, ChevronLeft, FileIcon, FileText, Paperclip, Plus, Send, ShieldCheck, Upload, X } from 'lucide-react';
import { validateAndFilterFiles } from '../../utils/fileUtils';

const TicketForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const { files: validFiles, oversizedFiles } = validateAndFilterFiles(e.target.files, files);
    if (oversizedFiles.length > 0) {
      alert(`The following files exceed the 10MB limit and were not added: ${oversizedFiles.join(', ')}`);
    }
    setFiles(validFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let ticketId = null;
    try {
      // 1. Create the ticket
      const ticketResponse = await api.post('/tickets/', formData);
      ticketId = ticketResponse.data.id;

      // 2. Upload attachments if any
      if (files.length > 0) {
        const failedUploads = [];
        for (const file of files) {
          try {
            const fileData = new FormData();
            fileData.append('file', file);
            fileData.append('ticket', ticketId);
            await api.post('/attachments/', fileData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          } catch (uploadError) {
            console.error('Failed to upload attachment:', file.name, uploadError);
            failedUploads.push(file.name);
          }
        }
        if (failedUploads.length > 0) {
          alert(`Ticket created, but some attachments failed: ${failedUploads.join(', ')}`);
        }
      }

      navigate(`/tickets/${ticketId}`);
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create ticket. Please check your connection or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">New Support Case</h1>
          <p className="text-slate-500 font-medium italic">Describe your issue and we'll get on it.</p>
        </div>
      </div>

      <div className="premium-card p-10 bg-white">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2 text-capitalize">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1">Case Subject</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="e.g. System latency in region US-East"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600/20 transition-all shadow-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1">Priority Level</label>
                <div className="relative">
                  <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600/20 transition-all shadow-sm appearance-none"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1">Issue Description</label>
              <textarea
                placeholder="Please provide as much detail as possible..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 min-h-48 transition-all shadow-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5" /> Attachments
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors group cursor-pointer"
                onClick={() => fileInputRef.current.click()}>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-slate-300 group-hover:text-primary-400 transition-colors" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Click to upload files</p>
                  <p className="text-[10px] text-slate-400 font-medium">Maximum size: 10MB per file</p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm animate-slide-in">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-primary-50 text-primary-600 p-2 rounded-lg font-bold text-[10px] uppercase">
                          {file.name.split('.').pop()}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-700 truncate leading-none mb-1">{file.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                        className="p-1 px-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-300 transition-all ml-1.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="premium-button-primary px-10 shadow-lg shadow-primary-600/20 group"
            >
              {loading ? 'Submitting...' : (
                <>
                  Submit Case
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
