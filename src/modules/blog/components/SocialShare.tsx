import { useState } from 'react';
import { FiFacebook, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { BiLink } from 'react-icons/bi';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShare({
  url,
  title,
  description = '',
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    window.open(link, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
        Share this article:
      </p>
      <div className='flex flex-wrap gap-2'>
        <button
          onClick={() => handleShare('twitter')}
          className='flex items-center gap-2 rounded-lg bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90'
          aria-label='Share on Twitter'
        >
          <FiTwitter className='h-4 w-4' />
          <span>Twitter</span>
        </button>

        <button
          onClick={() => handleShare('facebook')}
          className='flex items-center gap-2 rounded-lg bg-[#4267B2] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90'
          aria-label='Share on Facebook'
        >
          <FiFacebook className='h-4 w-4' />
          <span>Facebook</span>
        </button>

        <button
          onClick={() => handleShare('linkedin')}
          className='flex items-center gap-2 rounded-lg bg-[#0077B5] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90'
          aria-label='Share on LinkedIn'
        >
          <FiLinkedin className='h-4 w-4' />
          <span>LinkedIn</span>
        </button>

        <button
          onClick={() => handleShare('whatsapp')}
          className='flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90'
          aria-label='Share on WhatsApp'
        >
          <FaWhatsapp className='h-4 w-4' />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
          }`}
          aria-label='Copy link'
        >
          <BiLink className='h-4 w-4' />
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
}
