import { useState } from 'react';
import {
  FiCheck,
  FiCopy,
  FiFacebook,
  FiLinkedin,
  FiShare2,
  FiTwitter,
  FiX,
} from 'react-icons/fi';
import { IoLogoWhatsapp } from 'react-icons/io5';

interface ShareModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

export default function ShareModal({ url, title, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    };

    window.open(
      shareUrls[platform as keyof typeof shareUrls],
      '_blank',
      'noopener,noreferrer,width=600,height=400',
    );
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-800 dark:bg-neutral-900'>
        {/* Header */}
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-xl font-bold text-neutral-900 dark:text-white'>
            Share Article
          </h2>
          <button
            onClick={onClose}
            className='rounded-lg p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300'
          >
            <FiX className='h-5 w-5' />
          </button>
        </div>

        <p className='mb-6 text-sm text-neutral-600 dark:text-neutral-400'>
          Share this article with your network
        </p>

        {/* Copy Link */}
        <div className='mb-6'>
          <label className='mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
            Copy Link
          </label>
          <div className='flex gap-2'>
            <input
              type='text'
              value={url}
              readOnly
              className='flex-1 rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
            />
            <button
              onClick={handleCopyLink}
              className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
            >
              {copied ? (
                <>
                  <FiCheck className='h-4 w-4' />
                  Copied
                </>
              ) : (
                <>
                  <FiCopy className='h-4 w-4' />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Media */}
        <div className='mb-6'>
          <label className='mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
            Share on Social Media
          </label>
          <div className='grid grid-cols-3 gap-3'>
            <button
              onClick={() => handleShare('twitter')}
              className='flex items-center justify-center gap-2 rounded-lg bg-[#1DA1F2] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
            >
              <FiTwitter className='h-5 w-5' />
              <span className='hidden sm:inline'>Twitter</span>
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className='flex items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
            >
              <FiFacebook className='h-5 w-5' />
              <span className='hidden sm:inline'>Facebook</span>
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className='flex items-center justify-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
            >
              <FiLinkedin className='h-5 w-5' />
              <span className='hidden sm:inline'>LinkedIn</span>
            </button>
          </div>
        </div>

        {/* WhatsApp */}
        <button
          onClick={() => handleShare('whatsapp')}
          className='mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90'
        >
          <IoLogoWhatsapp className='h-5 w-5' />
          WhatsApp
        </button>

        {/* Native Share (Mobile) */}
        {typeof navigator !== 'undefined' &&
          typeof navigator.share === 'function' && (
            <button
              onClick={handleNativeShare}
              className='flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800'
            >
              <FiShare2 className='h-5 w-5' />
              Share via...
            </button>
          )}
      </div>
    </>
  );
}
