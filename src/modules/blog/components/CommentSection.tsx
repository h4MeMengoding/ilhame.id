import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiMessageCircle,
  FiSend,
  FiShield,
  FiTrash2,
  FiUser,
} from 'react-icons/fi';
import useSWR from 'swr';

import { useAuth } from '@/common/context/AuthContext';
import { fetcher } from '@/services/fetcher';

interface User {
  id: number;
  name: string;
  avatar_url?: string;
  role?: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: User;
  replies?: Comment[];
}

interface CommentSectionProps {
  blogId: number;
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: number) => void;
  onDelete: (commentId: number) => void;
  replyingTo: number | null;
}

const CommentItem = ({
  comment,
  onReply,
  onDelete,
  replyingTo,
}: CommentItemProps) => {
  const { user: currentUser } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const canDelete = isAdmin || currentUser?.id === comment.user.id;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='border-l-2 border-neutral-200 pl-4 dark:border-neutral-700'>
      <div className='flex space-x-3'>
        <div className='flex-shrink-0'>
          {comment.user.avatar_url ? (
            <img
              src={comment.user.avatar_url}
              alt={comment.user.name}
              className='h-8 w-8 rounded-full object-cover'
            />
          ) : (
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700'>
              <FiUser className='h-4 w-4 text-neutral-500' />
            </div>
          )}
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium text-neutral-900 dark:text-neutral-100'>
              {comment.user.name}
            </p>
            {comment.user.role === 'admin' && (
              <span className='inline-flex items-center space-x-1 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white'>
                <FiShield className='h-3 w-3' />
                <span>Admin</span>
              </span>
            )}
            <p className='text-xs text-neutral-500 dark:text-neutral-400'>
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
          <div className='mt-1'>
            <p className='whitespace-pre-wrap text-sm text-neutral-700 dark:text-neutral-300'>
              {comment.content}
            </p>
          </div>
          <div className='mt-2 flex items-center space-x-3'>
            <button
              onClick={() => onReply(comment.id)}
              className='text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            >
              Reply
            </button>
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className='inline-flex items-center space-x-1 text-xs font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300'
              >
                <FiTrash2 className='h-3 w-3' />
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            )}
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className='mt-4 space-y-4'>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onDelete={onDelete}
                  replyingTo={replyingTo}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentForm = ({
  blogId,
  parentId = null,
  onSubmit,
  onCancel,
}: {
  blogId: number;
  parentId?: number | null;
  onSubmit: () => void;
  onCancel?: () => void;
}) => {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error('Please login to comment');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/blog/${blogId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          user_id: user.id,
          parent_id: parentId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setContent('');
        onSubmit();
        toast.success('Comment posted successfully!');
      } else {
        toast.error(result.message || 'Failed to post comment');
      }
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className='py-8 text-center'>
        <p className='text-neutral-600 dark:text-neutral-400'>
          Please{' '}
          <Link
            href='/login'
            className='text-blue-600 hover:underline dark:text-blue-400'
          >
            login
          </Link>{' '}
          to post a comment
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
          {parentId ? 'Write a reply' : 'Write a comment'}
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-400'
          placeholder={
            parentId ? 'Write your reply...' : 'Share your thoughts...'
          }
          disabled={isSubmitting}
        />
      </div>
      <div className='flex space-x-2'>
        <button
          type='submit'
          disabled={isSubmitting || !content.trim()}
          className='inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <FiSend className='h-4 w-4' />
          <span>
            {isSubmitting ? 'Posting...' : parentId ? 'Reply' : 'Post Comment'}
          </span>
        </button>
        {onCancel && (
          <button
            type='button'
            onClick={onCancel}
            className='inline-flex items-center rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const CommentSection = ({ blogId }: CommentSectionProps) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [deletedComments, setDeletedComments] = useState<Set<number>>(
    new Set(),
  );

  const {
    data: commentsData,
    error,
    mutate: mutateComments,
  } = useSWR(`/api/blog/${blogId}/comments`, fetcher);

  const comments = commentsData?.data || [];

  // Filter out deleted comments immediately
  const filteredComments = comments
    .filter((comment: Comment) => !deletedComments.has(comment.id))
    .map((comment: Comment) => ({
      ...comment,
      replies:
        comment.replies?.filter((reply) => !deletedComments.has(reply.id)) ||
        [],
    }));

  const handleCommentSubmitted = () => {
    mutateComments();
    setReplyingTo(null);
    // Clear deleted comments set when new data is fetched
    setDeletedComments(new Set());
  };

  const handleReply = (parentId: number) => {
    setReplyingTo(replyingTo === parentId ? null : parentId);
  };

  const handleDelete = async (commentId: number) => {
    try {
      const token = localStorage.getItem('auth_token');

      // Immediately mark as deleted in local state
      setDeletedComments((prev) => {
        const newSet = new Set(prev);
        newSet.add(commentId);
        return newSet;
      });

      const response = await fetch(
        `/api/blog/${blogId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (result.success) {
        toast.success('Comment deleted successfully');
        // Refresh data from server after a short delay
        setTimeout(() => {
          mutateComments();
        }, 500);
      } else {
        // Revert the local deletion if API failed
        setDeletedComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
        toast.error(result.message || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Delete error:', error);
      // Revert the local deletion on error
      setDeletedComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      toast.error('Failed to delete comment');
    }
  };

  if (error) {
    return (
      <div className='py-8 text-center'>
        <p className='text-red-600 dark:text-red-400'>
          Failed to load comments
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-center space-x-2'>
        <FiMessageCircle className='h-5 w-5 text-neutral-600 dark:text-neutral-400' />
        <h3 className='text-lg font-semibold text-neutral-900 dark:text-neutral-100'>
          Comments ({filteredComments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <CommentForm blogId={blogId} onSubmit={handleCommentSubmitted} />

      {/* Comments List */}
      {filteredComments.length > 0 ? (
        <div className='space-y-6'>
          {filteredComments.map((comment: Comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                onReply={handleReply}
                onDelete={handleDelete}
                replyingTo={replyingTo}
              />

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className='ml-11 mt-4'>
                  <CommentForm
                    blogId={blogId}
                    parentId={comment.id}
                    onSubmit={handleCommentSubmitted}
                    onCancel={() => setReplyingTo(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='py-8 text-center'>
          <FiMessageCircle className='mx-auto h-12 w-12 text-neutral-400' />
          <p className='mt-2 text-neutral-600 dark:text-neutral-400'>
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
