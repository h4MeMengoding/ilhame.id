import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';

import Card from '@/common/components/elements/Card';
import SectionHeading from '@/common/components/elements/SectionHeading';
import { STACKS } from '@/common/constant/stacks';
import { ProjectItemProps } from '@/common/types/projects';

interface ProjectFormProps {
  project?: ProjectItemProps | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectForm = ({ project, onSuccess, onCancel }: ProjectFormProps) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    image: project?.image || '',
    link_demo: project?.link_demo || '',
    link_github: project?.link_github || '',
    stacks: project?.stacks ? JSON.parse(project.stacks).join(', ') : '',
    content: project?.content || '',
    is_show: project?.is_show ?? true,
    is_featured: project?.is_featured ?? false,
    updated_at: project?.updated_at
      ? new Date(project.updated_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  });
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize selectedStacks properly when project changes
  useEffect(() => {
    if (project?.stacks) {
      try {
        const parsedStacks = JSON.parse(project.stacks);
        setSelectedStacks(Array.isArray(parsedStacks) ? parsedStacks : []);
      } catch (error) {
        console.warn('Failed to parse project stacks:', error);
        setSelectedStacks([]);
      }
    } else {
      setSelectedStacks([]);
    }

    // Also reset form data when project changes
    setFormData({
      title: project?.title || '',
      slug: project?.slug || '',
      description: project?.description || '',
      image: project?.image || '',
      link_demo: project?.link_demo || '',
      link_github: project?.link_github || '',
      stacks: project?.stacks ? JSON.parse(project.stacks).join(', ') : '',
      content: project?.content || '',
      is_show: project?.is_show ?? true,
      is_featured: project?.is_featured ?? false,
      updated_at: project?.updated_at
        ? new Date(project.updated_at).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    });
  }, [project]);

  // Get available stacks from the STACKS constant
  const availableStacks = Object.keys(STACKS);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !project ? generateSlug(title) : prev.slug, // Only auto-generate for new projects
    }));
  };

  const handleStackToggle = (stack: string) => {
    setSelectedStacks((prev) => {
      if (prev.includes(stack)) {
        return prev.filter((s) => s !== stack);
      } else {
        return [...prev, stack];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one tech stack is selected
    if (selectedStacks.length === 0) {
      toast.error('Please select at least one technology');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        stacks: JSON.stringify(selectedStacks),
        updated_at: new Date(formData.updated_at).toISOString(),
      };

      const url = project ? `/api/projects/${project.id}` : '/api/projects';
      const method = project ? 'PUT' : 'POST';
      const token = localStorage.getItem('auth_token');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(
          project
            ? 'Project updated successfully!'
            : 'Project created successfully!',
        );
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save project');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <button
            onClick={onCancel}
            className='flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
          >
            <FiArrowLeft className='h-4 w-4' />
            <span>Back</span>
          </button>
          <SectionHeading
            title={project ? 'Edit Project' : 'Add New Project'}
          />
        </div>
      </div>

      <Card className='p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                Title *
              </label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleTitleChange}
                required
                className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
                placeholder='Project title'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                Slug *
              </label>
              <input
                type='text'
                name='slug'
                value={formData.slug}
                onChange={handleInputChange}
                required
                className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
                placeholder='project-slug'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
              Description
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
              placeholder='Project description (optional)'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
              Image URL *
            </label>
            <input
              type='url'
              name='image'
              value={formData.image}
              onChange={handleInputChange}
              required
              className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
              placeholder='https://example.com/image.jpg'
            />
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                Demo Link
              </label>
              <input
                type='url'
                name='link_demo'
                value={formData.link_demo}
                onChange={handleInputChange}
                className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
                placeholder='https://demo.example.com'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                GitHub Link
              </label>
              <input
                type='url'
                name='link_github'
                value={formData.link_github}
                onChange={handleInputChange}
                className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
                placeholder='https://github.com/username/repo'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
              Tech Stack *
            </label>
            <div className='mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4'>
              {availableStacks.map((stack) => (
                <button
                  key={stack}
                  type='button'
                  onClick={() => handleStackToggle(stack)}
                  className={`flex items-center space-x-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
                    selectedStacks.includes(stack)
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-300'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-500 dark:hover:bg-neutral-700'
                  }`}
                >
                  {STACKS[stack]}
                  <span className='truncate'>{stack}</span>
                </button>
              ))}
            </div>
            {selectedStacks.length > 0 && (
              <div className='mt-2'>
                <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                  Selected: {selectedStacks.join(', ')}
                </p>
              </div>
            )}
            {selectedStacks.length === 0 && (
              <p className='mt-1 text-sm text-red-500'>
                Please select at least one technology
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
              Content (Markdown)
            </label>
            <textarea
              name='content'
              value={formData.content}
              onChange={handleInputChange}
              rows={8}
              className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
              placeholder='Detailed project description in Markdown format...'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
              Updated Date *
            </label>
            <input
              type='datetime-local'
              name='updated_at'
              value={formData.updated_at}
              onChange={handleInputChange}
              required
              className='mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
            />
            <p className='mt-1 text-xs text-neutral-500 dark:text-neutral-400'>
              This date will be saved as the project's last update time
            </p>
          </div>

          <div className='flex space-x-6'>
            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                name='is_show'
                checked={formData.is_show}
                onChange={handleInputChange}
                className='rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800'
              />
              <span className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                Show on website
              </span>
            </label>

            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                name='is_featured'
                checked={formData.is_featured}
                onChange={handleInputChange}
                className='rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800'
              />
              <span className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                Featured project
              </span>
            </label>
          </div>

          <div className='flex justify-end space-x-4 pt-6'>
            <button
              type='button'
              onClick={onCancel}
              className='flex items-center space-x-2 rounded-lg border border-neutral-300 px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800'
            >
              <FiX className='h-4 w-4' />
              <span>Cancel</span>
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50'
            >
              <FiSave className='h-4 w-4' />
              <span>{isLoading ? 'Saving...' : 'Save Project'}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProjectForm;
