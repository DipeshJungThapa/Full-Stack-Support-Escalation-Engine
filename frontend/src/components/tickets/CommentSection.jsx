import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../contexts/AuthContext';
import { Send, User, Lock, Clock } from 'lucide-react';

const CommentSection = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/?ticket=${ticketId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post('/comments/', {
        ticket: ticketId,
        content: newComment,
        is_internal: isInternal,
      });
      setNewComment('');
      setIsInternal(false);
      fetchComments();
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const isAgent = user?.role === 'AGENT' || user?.role === 'ADMIN';

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
                  <Clock className="w-3 h-3" /> 1 hour ago
                </span>
                {comment.is_internal && (
                  <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-widest border border-amber-200">
                    <Lock className="w-3 h-3" /> Internal Note
                  </span>
                )}
              </div>

              {!comment.is_internal ? (
                <div className="premium-card p-6 bg-white border-slate-200 rounded-2xl shadow-sm">
                  <p className="text-slate-700 text-sm font-medium leading-relaxed">{comment.content}</p>
                </div>
              ) : (
                <p className="text-slate-800 text-sm font-medium leading-relaxed">{comment.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Remove the "No discussion yet" block if it's confusing */}
      </div>

      {/* Reply Input */}
      <div className="flex gap-4 mt-6 bg-white p-6 rounded-3xl premium-card">
        <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100 flex-shrink-0">
          <User className="w-5 h-5 text-primary-600" />
        </div>
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment or update..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 min-h-24 transition-all"
          />
          <div className="flex items-center justify-between">
            {isAgent && (
              <label className="flex items-center gap-3 cursor-pointer group">
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
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="premium-button-primary disabled:opacity-50 disabled:cursor-not-allowed px-8"
            >
              Reply
              <Send className="w-4 h-4 ml-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
