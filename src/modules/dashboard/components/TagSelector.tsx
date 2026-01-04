import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  selectedTagIds: number[];
  onChange: (tagIds: number[]) => void;
}

const TagSelector = ({ selectedTagIds, onChange }: TagSelectorProps) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

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
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleRemoveTag = (tagId: number) => {
    onChange(selectedTagIds.filter((id) => id !== tagId));
  };

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));
  const availableTags = tags.filter((tag) => !selectedTagIds.includes(tag.id));

  return (
    <div className='relative'>
      {/* Selected Tags Display */}
      <div className='mb-2 flex flex-wrap gap-2'>
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
          >
            {tag.name}
            <button
              type='button'
              onClick={() => handleRemoveTag(tag.id)}
              className='ml-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50'
            >
              <FiX className='h-3 w-3' />
            </button>
          </span>
        ))}
      </div>

      {/* Dropdown Trigger */}
      <div className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-left text-sm text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white'
        >
          {selectedTagIds.length === 0
            ? 'Select tags...'
            : `${selectedTagIds.length} tag${selectedTagIds.length !== 1 ? 's' : ''} selected`}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Overlay to close dropdown when clicking outside */}
            <div
              className='fixed inset-0 z-10'
              onClick={() => setIsOpen(false)}
            ></div>

            {/* Dropdown Content */}
            <div className='absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-neutral-300 bg-white shadow-lg dark:border-neutral-600 dark:bg-neutral-800'>
              {isLoading ? (
                <div className='p-4 text-center text-sm text-neutral-600 dark:text-neutral-400'>
                  Loading tags...
                </div>
              ) : availableTags.length === 0 ? (
                <div className='p-4 text-center text-sm text-neutral-600 dark:text-neutral-400'>
                  {tags.length === 0
                    ? 'No tags available. Create tags first in Tags Management.'
                    : 'All tags selected'}
                </div>
              ) : (
                <div className='py-1'>
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      type='button'
                      onClick={() => {
                        handleToggleTag(tag.id);
                      }}
                      className='flex w-full items-center px-4 py-2 text-left text-sm text-neutral-900 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700'
                    >
                      <span className='flex-1'>{tag.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Helper Text */}
      {tags.length === 0 && !isLoading && (
        <p className='mt-1 text-xs text-neutral-500 dark:text-neutral-400'>
          No tags available.{' '}
          <a
            href='/dashboard/tags'
            target='_blank'
            className='text-blue-600 hover:underline dark:text-blue-400'
          >
            Create tags
          </a>{' '}
          to organize your blog posts.
        </p>
      )}
    </div>
  );
};

export default TagSelector;
