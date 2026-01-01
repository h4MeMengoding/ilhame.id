import Image from 'next/image';
import { useState } from 'react';
import { FiEye, FiHeart, FiX } from 'react-icons/fi';

interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  is_featured: boolean;
  created_at: string;
}

interface GalleryMasonryProps {
  items: GalleryItem[];
}

interface ImageModalProps {
  item: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ item, isOpen, onClose }: ImageModalProps) => {
  if (!isOpen || !item) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4'
      onClick={onClose}
    >
      <div
        className='relative max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-neutral-900'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute right-4 top-4 z-10 rounded-full bg-black bg-opacity-50 p-3 text-white transition-all hover:bg-opacity-70'
        >
          <FiX size={24} />
        </button>

        <div className='flex max-h-[95vh] flex-col lg:flex-row'>
          {/* Image Container */}
          <div className='flex flex-1 items-center justify-center bg-neutral-100 p-4 dark:bg-neutral-800 lg:p-6'>
            <div className='relative max-h-full max-w-full'>
              <Image
                src={item.image_url}
                alt={item.title}
                width={1200}
                height={800}
                className='h-auto max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-lg lg:max-h-[85vh]'
                unoptimized
                priority
              />
            </div>
          </div>

          {/* Details Panel */}
          <div className='w-full border-t border-neutral-200 p-4 dark:border-neutral-700 lg:max-h-[95vh] lg:w-80 lg:min-w-80 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:p-6'>
            <div className='mb-4 flex items-start justify-between'>
              <h2 className='text-xl font-bold text-neutral-900 dark:text-white'>
                {item.title}
              </h2>
              {item.is_featured && (
                <span className='inline-flex items-center space-x-1 rounded-full bg-yellow-500 px-2 py-1 text-xs font-medium text-white'>
                  <FiHeart className='h-3 w-3' />
                  <span>Featured</span>
                </span>
              )}
            </div>

            {item.description && (
              <p className='mb-4 text-neutral-600 dark:text-neutral-400'>
                {item.description}
              </p>
            )}

            <div className='space-y-3'>
              {item.category && (
                <div>
                  <span className='text-sm font-medium text-neutral-500 dark:text-neutral-400'>
                    Category:
                  </span>
                  <span className='ml-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                    {item.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryMasonry = ({ items }: GalleryMasonryProps) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const openModal = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleImageLoad = (itemId: number) => {
    setLoadedImages((prev) => new Set(prev).add(itemId));
  };

  if (items.length === 0) {
    return (
      <div className='py-16 text-center'>
        <div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800'>
          <FiEye className='h-8 w-8 text-neutral-400' />
        </div>
        <h3 className='mt-4 text-lg font-medium text-neutral-900 dark:text-neutral-100'>
          No images found
        </h3>
        <p className='mt-2 text-neutral-600 dark:text-neutral-400'>
          No gallery items to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry Grid - Larger layout with fewer columns */}
      <div className='columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-2 xl:columns-3'>
        {items.map((item, index) => (
          <div
            key={item.id}
            className='cursor-pointer break-inside-avoid'
            onClick={() => openModal(item)}
          >
            <div className='group relative overflow-hidden rounded-xl bg-neutral-100 shadow-lg transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl dark:bg-neutral-800'>
              <div className='relative'>
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={600}
                  height={400}
                  className={`h-auto w-full object-cover transition-all duration-700 ${
                    loadedImages.has(item.id)
                      ? 'filter-none'
                      : 'contrast-90 brightness-110 grayscale filter'
                  }`}
                  placeholder='blur'
                  blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+'
                  priority={index < 6} // Only first 6 images get priority
                  sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  onLoad={() => handleImageLoad(item.id)}
                />

                {/* Overlay */}
                <div className='absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-40' />

                {/* Hover Icons */}
                <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                  <div className='flex space-x-4'>
                    <button className='rounded-full bg-white p-3 text-neutral-900 shadow-lg transition-transform hover:scale-110'>
                      <FiEye className='h-6 w-6' />
                    </button>
                  </div>
                </div>

                {/* Featured Badge */}
                {item.is_featured && (
                  <div className='absolute left-4 top-4'>
                    <span className='inline-flex items-center space-x-1 rounded-full bg-yellow-500 px-3 py-2 text-sm font-medium text-white shadow-lg'>
                      <FiHeart className='h-4 w-4' />
                      <span>Featured</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ImageModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default GalleryMasonry;
