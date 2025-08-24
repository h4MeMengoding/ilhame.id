import { useEffect, useState } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import useSWR from 'swr';

import { fetcher } from '@/services/fetcher';

interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function CategoryDropdown({
  value,
  onChange,
  className = '',
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState(value);

  const { data: categoriesData } = useSWR('/api/gallery/categories', fetcher);
  const existingCategories = categoriesData?.data || [];

  // Filter categories based on search term
  const filteredCategories = existingCategories.filter((category: string) =>
    category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectCategory = (category: string) => {
    setInputValue(category);
    onChange(category);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setSearchTerm(inputValue);
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicking on dropdown items
    setTimeout(() => {
      setIsOpen(false);
      setSearchTerm('');
    }, 200);
  };

  return (
    <div className={`relative ${className}`}>
      <div className='relative'>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder='Enter or select category'
          className='w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white'
        />
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'
        >
          <FiChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className='absolute z-50 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800'>
          <div className='max-h-60 overflow-auto py-1'>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category: string) => (
                <button
                  key={category}
                  type='button'
                  onClick={() => handleSelectCategory(category)}
                  className='flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700'
                >
                  <span className='text-neutral-900 dark:text-neutral-100'>
                    {category}
                  </span>
                  {inputValue === category && (
                    <FiCheck className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                  )}
                </button>
              ))
            ) : searchTerm && searchTerm.trim() !== '' ? (
              <div className='px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400'>
                Press Enter to add "{searchTerm}" as new category
              </div>
            ) : (
              <div className='px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400'>
                No categories found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
