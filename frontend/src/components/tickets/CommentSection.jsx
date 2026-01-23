import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const CommentSection = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/?ticket_id=${ticketId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/comments/', {
        ticket: ticketId,
        content: newComment
      });
      setNewComment('');
      fetchComments(); // Reload comments
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-bold mb-4">Comments</h3>

      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span className="font-medium text-gray-700">{comment.author_email || 'Unknown User'}</span>
              <span>{new Date(comment.created_at).toLocaleString()}</span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
        {!loading && comments.length === 0 && (
          <p className="text-gray-500 italic">No comments yet.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows="3"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
