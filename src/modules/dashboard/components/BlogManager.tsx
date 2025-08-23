import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit, FiEye, FiPlus, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import useSWR from 'swr';

import Card from '@/common/components/elements/Card';
import SectionHeading from '@/common/components/elements/SectionHeading';
import SectionSubHeading from '@/common/components/elements/SectionSubHeading';
import { useAuth } from '@/common/context/AuthContext';
import { fetcher } from '@/services/fetcher';

import BlogForm from './BlogForm';

interface Blog {
  id: number;
  title: string;
  slug: string;
  content?: string;
  status: 'draft' | 'published';
  excerpt?: string;
  featured_image_url?: string;
  created_at: string;
  updated_at: string;
  author: {
    name?: string;
    email: string;
  };
  total_views_count: number;
  is_featured: boolean;
}

const BlogManager = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cacheKey, setCacheKey] = useState(Date.now());
  const { user } = useAuth();

  const { data, error, mutate } = useSWR(
    `/api/dashboard/blogs?page=${page}&per_page=10&t=${cacheKey}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 0, // Disable deduping to always fetch fresh data
      refreshInterval: 0, // Disable auto refresh
      revalidateIfStale: true,
      revalidateOnMount: true,
    },
  );

  const blogs: Blog[] = data?.data?.posts || [];
  const totalPages = data?.data?.total_pages || 1;
  const isLoading = !data && !error;

  const handleCreateNew = () => {
    setEditingBlog(null);
    setIsFormOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/dashboard/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        // Optimistically remove the blog from UI
        const updatedBlogs = blogs.filter((blog) => blog.id !== id);
        mutate(
          { data: { posts: updatedBlogs, total_pages: totalPages } },
          false,
        );

        // Then revalidate from server
        await mutate();

        toast.success('Blog post deleted successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete blog post');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog post');
      // Revalidate to ensure UI consistency
      mutate();
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingBlog(null);

    // Update cache key to force fresh data
    setCacheKey(Date.now());

    // Force aggressive refresh data from server
    mutate(undefined, {
      revalidate: true,
      rollbackOnError: false,
      populateCache: false,
    });

    toast.success(
      editingBlog
        ? 'Blog post updated successfully!'
        : 'Blog post created successfully!',
    );
  };

  const handleHardSync = async () => {
    setIsRefreshing(true);
    try {
      // Update cache key to force fresh data
      setCacheKey(Date.now());

      // Force complete cache invalidation and fresh fetch
      await mutate(undefined, {
        revalidate: true,
        rollbackOnError: false,
        populateCache: false,
        optimisticData: undefined,
      });
      toast.success('Blog posts synchronized successfully!');
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to synchronize blog posts');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Card className='p-6 text-center'>
        <p className='text-neutral-600 dark:text-neutral-400'>
          You don't have permission to access this feature.
        </p>
      </Card>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      {/* Header */}
      <div className='flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <div>
          <SectionHeading title='Blog Management' />
          <SectionSubHeading>
            Manage your blog posts and articles
          </SectionSubHeading>
        </div>
        <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
          <button
            onClick={handleHardSync}
            disabled={isRefreshing}
            className='flex w-full items-center justify-center space-x-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 sm:w-auto'
          >
            <FiRefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>{isRefreshing ? 'Syncing...' : 'Hard Sync'}</span>
          </button>
          <button
            onClick={handleCreateNew}
            className='flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 sm:w-auto'
          >
            <FiPlus className='h-4 w-4' />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Blog Form Modal */}
      {isFormOpen && (
        <BlogForm
          blog={editingBlog}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingBlog(null);
          }}
          mutate={mutate}
        />
      )}

      {/* Blog List */}
      <Card className='p-6'>
        {isLoading ? (
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='animate-pulse'>
                <div className='mb-2 h-4 rounded bg-neutral-200 dark:bg-neutral-700'></div>
                <div className='h-3 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700'></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className='py-8 text-center'>
            <p className='text-red-600 dark:text-red-400'>
              Failed to load blog posts
            </p>
          </div>
        ) : blogs.length === 0 ? (
          <div className='py-8 text-center'>
            <p className='text-neutral-600 dark:text-neutral-400'>
              No blog posts found. Create your first post!
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className='flex items-center justify-between border-b border-neutral-200 pb-4 last:border-b-0 dark:border-neutral-700'
              >
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center space-x-3'>
                    <h3 className='truncate font-medium text-neutral-900 dark:text-white'>
                      {blog.title}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        blog.status === 'published'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>
                  <p className='mt-1 truncate text-sm text-neutral-600 dark:text-neutral-400'>
                    {blog.excerpt || 'No excerpt available'}
                  </p>
                  <div className='mt-2 flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400'>
                    <span>By {blog.author?.name || blog.author?.email}</span>
                    <span>•</span>
                    <span>
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <div className='flex items-center space-x-1'>
                      <FiEye className='h-3 w-3' />
                      <span>{blog.total_views_count} views</span>
                    </div>
                  </div>
                </div>
                <div className='ml-4 flex items-center space-x-2'>
                  <button
                    onClick={() => handleEdit(blog)}
                    className='rounded-lg p-2 text-neutral-600 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-neutral-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400'
                    title='Edit'
                  >
                    <FiEdit className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className='rounded-lg p-2 text-neutral-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-900/20 dark:hover:text-red-400'
                    title='Delete'
                  >
                    <FiTrash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center space-x-2'>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                page === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogManager;
