import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiMessageCircle, FiSend, FiUser } from 'react-icons/fi';
import useSWR from 'swr';

import { useAuth } from '@/common/context/AuthContext';
import { fetcher } from '@/services/fetcher';

interface User {
  id: number;
  name: string;
  avatar_url?: string;
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
  replyingTo: number | null;
}

const CommentItem = ({ comment, onReply, replyingTo }: CommentItemProps) => {
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
          <div className='mt-2'>
            <button
              onClick={() => onReply(comment.id)}
              className='text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            >
              Reply
            </button>
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className='mt-4 space-y-4'>
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
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

  const {
    data: commentsData,
    error,
    mutate: mutateComments,
  } = useSWR(`/api/blog/${blogId}/comments`, fetcher);

  const comments = commentsData?.data || [];

  const handleCommentSubmitted = () => {
    mutateComments();
    setReplyingTo(null);
  };

  const handleReply = (parentId: number) => {
    setReplyingTo(replyingTo === parentId ? null : parentId);
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
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <CommentForm blogId={blogId} onSubmit={handleCommentSubmitted} />

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className='space-y-6'>
          {comments.map((comment: Comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                onReply={handleReply}
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
