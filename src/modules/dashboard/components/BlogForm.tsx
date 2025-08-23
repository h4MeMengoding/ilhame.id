import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';

import Card from '@/common/components/elements/Card';
import RichTextEditor from '@/common/components/elements/RichTextEditor';
import SectionHeading from '@/common/components/elements/SectionHeading';

interface Blog {
  id: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image_url?: string;
  status: 'draft' | 'published';
  is_featured: boolean;
}

interface BlogFormProps {
  blog?: Blog | null;
  onSuccess: () => void;
  onCancel: () => void;
  mutate?: () => void;
}

const BlogForm = ({ blog, onSuccess, onCancel, mutate }: BlogFormProps) => {
  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    content: blog?.content || '',
    excerpt: blog?.excerpt || '',
    featured_image_url: blog?.featured_image_url || '',
    status: blog?.status || 'draft',
    is_featured: blog?.is_featured || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(
    !!blog?.slug,
  );
  const [slugError, setSlugError] = useState<string | null>(null);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens and spaces
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => {
      const newSlug = !isSlugManuallyEdited ? generateSlug(title) : prev.slug;
      return {
        ...prev,
        title,
        slug: newSlug,
      };
    });

    // Update slug error if slug was auto-generated
    if (!isSlugManuallyEdited) {
      const newSlug = generateSlug(title);
      setSlugError(validateSlug(newSlug));
    }
  };

  const handleSlugChange = (slug: string) => {
    setIsSlugManuallyEdited(true);
    // Sanitize slug input in real-time
    const sanitizedSlug = slug
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-');
    setFormData((prev) => ({ ...prev, slug: sanitizedSlug }));

    // Validate and show error
    const error = validateSlug(sanitizedSlug);
    setSlugError(error);
  };

  const validateSlug = (slug: string) => {
    if (!slug) return 'Slug is required';
    if (slug.length < 3) return 'Slug must be at least 3 characters';
    if (!/^[a-z0-9-]+$/.test(slug))
      return 'Slug can only contain lowercase letters, numbers, and hyphens';
    if (slug.startsWith('-') || slug.endsWith('-'))
      return 'Slug cannot start or end with hyphen';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('Slug is required');
      return;
    }

    // Validate slug
    if (slugError) {
      toast.error(slugError);
      return;
    }

    setIsSubmitting(true);

    try {
      const url = blog
        ? `/api/dashboard/blogs/${blog.id}`
        : '/api/dashboard/blogs';

      const method = blog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Force cache revalidation - BlogManager will handle this via onSuccess
        toast.success(
          blog
            ? 'Blog post updated successfully!'
            : 'Blog post created successfully!',
        );
        onSuccess();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save blog post');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <button
            onClick={handleCancel}
            className='flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
          >
            <FiArrowLeft className='h-4 w-4' />
            <span>Back</span>
          </button>
          <SectionHeading
            title={blog ? 'Edit Blog Post' : 'Add New Blog Post'}
          />
        </div>
      </div>

      <Card className='p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Basic Information */}
          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                Title *
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
                placeholder='Blog post title'
              />
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                  Slug *{' '}
                  {!isSlugManuallyEdited && (
                    <span className='text-xs text-green-600 dark:text-green-400'>
                      (Auto)
                    </span>
                  )}
                </label>
                <button
                  type='button'
                  onClick={() => {
                    setIsSlugManuallyEdited(false);
                    const newSlug = generateSlug(formData.title);
                    setFormData((prev) => ({ ...prev, slug: newSlug }));
                    setSlugError(validateSlug(newSlug));
                  }}
                  className='text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                  title='Generate slug from title'
                >
                  🔄 Auto-generate
                </button>
              </div>
              <input
                type='text'
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                required
                className={`mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400 ${
                  slugError
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-neutral-300 dark:border-neutral-600'
                }`}
                placeholder='url-friendly-slug'
              />
              <div className='mt-1'>
                <p
                  className={`text-xs ${slugError ? 'text-red-500' : 'text-neutral-500 dark:text-neutral-400'}`}
                >
                  {slugError || `URL: /blog/${formData.slug || 'your-slug'}`}
                </p>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              rows={2}
              className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
              placeholder='Brief description of the post...'
            />
          </div>

          {/* Featured Image URL */}
          <div>
            <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
              Featured Image URL
            </label>
            <input
              type='url'
              value={formData.featured_image_url}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  featured_image_url: e.target.value,
                }))
              }
              className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
              placeholder='https://example.com/image.jpg'
            />
          </div>

          {/* Content */}
          <div>
            <label className='mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
              Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) =>
                setFormData((prev) => ({ ...prev, content }))
              }
              placeholder='Write your blog content here...'
              className='mt-1'
            />
            <p className='mt-1 text-xs text-neutral-500 dark:text-neutral-400'>
              Use the toolbar above to format your content.
            </p>
          </div>

          {/* Settings */}
          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as 'draft' | 'published',
                  }))
                }
                className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white'
              >
                <option value='draft'>Draft</option>
                <option value='published'>Published</option>
              </select>
            </div>
            <div className='flex items-center'>
              <label className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={formData.is_featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_featured: e.target.checked,
                    }))
                  }
                  className='rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800'
                />
                <span className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                  Featured Post
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end space-x-4 pt-6'>
            <button
              type='button'
              onClick={handleCancel}
              className='flex items-center space-x-2 rounded-lg border border-neutral-300 px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800'
            >
              <FiX className='h-4 w-4' />
              <span>Cancel</span>
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
            >
              <FiSave className='h-4 w-4' />
              <span>{isSubmitting ? 'Saving...' : 'Save Blog Post'}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BlogForm;
