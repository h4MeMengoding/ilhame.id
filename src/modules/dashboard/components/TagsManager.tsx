import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiPlus, FiTag, FiTrash2 } from 'react-icons/fi';

import Card from '@/common/components/elements/Card';
import SectionHeading from '@/common/components/elements/SectionHeading';

interface Tag {
  id: number;
  name: string;
  slug: string;
  _count: {
    blogs: number;
  };
}

const TagsManager = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/dashboard/tags', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setTags(result.data);
      } else {
        toast.error('Failed to fetch tags');
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to fetch tags');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setTagName(tag.name);
    } else {
      setEditingTag(null);
      setTagName('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTag(null);
    setTagName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tagName.trim()) {
      toast.error('Tag name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingTag
        ? `/api/dashboard/tags/${editingTag.id}`
        : '/api/dashboard/tags';

      const method = editingTag ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ name: tagName.trim() }),
      });

      if (response.ok) {
        toast.success(
          editingTag
            ? 'Tag updated successfully!'
            : 'Tag created successfully!',
        );
        handleCloseModal();
        fetchTags();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save tag');
      }
    } catch (error) {
      console.error('Error saving tag:', error);
      toast.error('Failed to save tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (tag: Tag) => {
    const confirmMessage =
      tag._count.blogs > 0
        ? `Are you sure you want to delete "${tag.name}"? This will remove it from ${tag._count.blogs} blog post(s).`
        : `Are you sure you want to delete "${tag.name}"?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`/api/dashboard/tags/${tag.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        toast.success('Tag deleted successfully!');
        fetchTags();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete tag');
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <SectionHeading title='Tags' icon={<FiTag className='mr-2' />} />
        <button
          onClick={() => handleOpenModal()}
          className='flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
        >
          <FiPlus className='h-4 w-4' />
          <span>Add Tag</span>
        </button>
      </div>

      <Card className='p-6'>
        {isLoading ? (
          <div className='py-12 text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent'></div>
            <p className='mt-4 text-neutral-600 dark:text-neutral-400'>
              Loading tags...
            </p>
          </div>
        ) : tags.length === 0 ? (
          <div className='flex flex-col items-center justify-center space-y-4 py-12 text-neutral-400 dark:text-neutral-500'>
            <FiTag className='h-16 w-16' />
            <div className='text-center'>
              <h3 className='text-lg font-semibold text-neutral-900 dark:text-white'>
                No tags yet
              </h3>
              <p className='mt-1 text-sm text-neutral-600 dark:text-neutral-400'>
                Create your first tag to start organizing blog posts.
              </p>
            </div>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-neutral-200 dark:divide-neutral-700'>
              <thead>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
                    Slug
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
                    Posts
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-neutral-200 dark:divide-neutral-700'>
                {tags.map((tag) => (
                  <tr
                    key={tag.id}
                    className='transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                  >
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='flex items-center'>
                        <div className='rounded-full bg-blue-100 p-2 dark:bg-blue-900/30'>
                          <FiTag className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                        </div>
                        <span className='ml-3 text-sm font-medium text-neutral-900 dark:text-white'>
                          {tag.name}
                        </span>
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400'>
                      {tag.slug}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400'>
                      {tag._count.blogs} post{tag._count.blogs !== 1 ? 's' : ''}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-right text-sm'>
                      <button
                        onClick={() => handleOpenModal(tag)}
                        className='mr-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                        title='Edit tag'
                      >
                        <FiEdit2 className='h-4 w-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(tag)}
                        className='text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                        title='Delete tag'
                      >
                        <FiTrash2 className='h-4 w-4' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='w-full max-w-md rounded-lg bg-white p-6 dark:bg-neutral-800'>
            <h3 className='mb-4 text-lg font-semibold text-neutral-900 dark:text-white'>
              {editingTag ? 'Edit Tag' : 'Add New Tag'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                  Tag Name *
                </label>
                <input
                  type='text'
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400'
                  placeholder='e.g., JavaScript'
                  autoFocus
                />
              </div>
              <div className='flex justify-end space-x-3'>
                <button
                  type='button'
                  onClick={handleCloseModal}
                  className='rounded-lg border border-neutral-300 px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingTag
                      ? 'Update'
                      : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsManager;
