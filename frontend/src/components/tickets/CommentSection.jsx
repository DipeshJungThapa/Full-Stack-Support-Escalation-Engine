import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import { Send, User, Clock, CheckCircle2, Paperclip, X } from 'lucide-react';
import { validateAndFilterFiles } from '../../utils/fileUtils';

const CommentSection = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [files, setFiles] = useState([]);
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/tickets/${ticketId}/comments/`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleFileChange = (e) => {
    const { files: validFiles, oversizedFiles } = validateAndFilterFiles(e.target.files, files);
    if (oversizedFiles.length > 0) {
      alert(`Files exceeding 10MB limit: ${oversizedFiles.join(', ')}`);
    }
    setFiles(validFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() && files.length === 0) return;

    try {
      // 1. Post the comment
      const commentResponse = await api.post('/comments/', {
        ticket: ticketId,
        content: newComment,
        is_internal: isInternal,
      });
      const commentId = commentResponse.data.id;

      // 2. Upload attachments if any
      if (files.length > 0) {
        for (const file of files) {
          const fileData = new FormData();
          fileData.append('file', file);
          fileData.append('comment', commentId);
          await api.post('/attachments/', fileData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }

      setNewComment('');
      setFiles([]);
      setIsInternal(false);
      fetchComments();
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const isAgent = user?.role === 'AGENT' || user?.role === 'ADMIN';

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 pb-10">
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">Discussion</h2>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`flex gap-4 ${comment.is_internal ? 'opacity-90' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 flex-shrink-0">
              <User className="w-5 h-5 text-slate-400" />
            </div>

            <div className={`flex-1 ${comment.is_internal ? 'bg-amber-50/50 border border-amber-100 p-6 rounded-2xl relative' : 'space-y-2'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">{comment.author_email}</span>
                <span className="text-slate-400 font-bold text-[10px] flex items-center gap-1 uppercase">
                  <Clock className="w-3 h-3" /> {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {comment.is_internal && (
                  <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-widest border border-amber-200">
                    <Lock className="w-3 h-3" /> Internal Note
                  </span>
                )}
              </div>

              <div className={!comment.is_internal ? "premium-card p-6 bg-white border-slate-200 rounded-2xl shadow-sm" : ""}>
                <p className="text-slate-700 text-sm font-medium leading-relaxed">{comment.content}</p>

                {/* Comment Attachments */}
                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                    {comment.attachments.map((file) => (
                      <a
                        key={file.id}
                        href={file.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all group"
                      >
                        <FileIcon className="w-3.5 h-3.5 text-primary-500" />
                        <span className="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">{file.file_name}</span>
                        <Download className="w-3 h-3 text-slate-300 group-hover:text-primary-600 ml-1" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Input */}
      <div className="mt-6 bg-white p-6 rounded-3xl premium-card">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 flex-shrink-0">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type your message here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 min-h-24 transition-all"
            />

            {/* Selected Files Display */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-slide-in">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-100 p-1.5 px-3 rounded-xl border border-slate-200 group">
                    <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{file.name}</span>
                    <button type="button" onClick={() => removeFile(idx)} className="text-slate-400 hover:text-rose-500 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest"
                >
                  <Paperclip className="w-4 h-4" />
                  Attach File
                  <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} />
                </button>
                {isAgent && (
                  <label className="flex items-center gap-3 cursor-pointer group ml-2">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600 transition-all cursor-pointer"
                    />
                    <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest group-hover:text-amber-600 transition-colors">
                      Internal Note
                    </span>
                  </label>
                )}
              </div>
              <button
                type="submit"
                disabled={!newComment.trim() && files.length === 0}
                className="premium-button-primary disabled:opacity-50 disabled:cursor-not-allowed px-8"
              >
                Post Reply
                <Send className="w-4 h-4 ml-1" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
