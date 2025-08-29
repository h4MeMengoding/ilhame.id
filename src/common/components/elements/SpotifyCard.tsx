// import Image from 'next/image';
import Link from 'next/link';
import { BiLogoSpotify } from 'react-icons/bi';

import { useGetDataSpotify } from '../useGetDataSpotify';

// Define the interfaces
interface Artist {
  href: string;
  name: string;
}

// eslint-disable-next-line unused-imports/no-unused-vars
interface Data {
  currentlyPlaying: boolean;
  albumArt: {
    url: string;
  };
  href: string;
  name: string;
  artists: Artist[];
  playlistHref: string;
  playlistName: string;
}

const SpotifyCard: React.FC = (): JSX.Element | null => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error, isLoading } = useGetDataSpotify();

  // Spotify functionality disabled - show disabled state
  if (error || !data) {
    return (
      <div className='flex w-full items-center rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-800'>
        <div className='relative w-full'>
          <div className='flex items-center gap-8'>
            <div className='flex h-[75px] w-[75px] items-center justify-center overflow-hidden rounded-lg bg-neutral-300 dark:bg-neutral-700 sm:h-[100px] sm:w-[100px]'>
              <BiLogoSpotify className='h-8 w-8 text-neutral-500' />
            </div>
            <div className='flex flex-col items-start gap-1 md:gap-3'>
              <h1 className='text-md font-bold text-neutral-500 md:text-lg'>
                SPOTIFY DISABLED
              </h1>
              <p className='text-sm text-neutral-500'>
                Spotify functionality is currently disabled
              </p>
            </div>
          </div>
          <Link
            href='https://spotify.com'
            target='_blank'
            rel='noopener noreferrer'
            className='absolute right-0 top-0'
          >
            <BiLogoSpotify className='h-5 w-5 text-neutral-500 md:h-8 md:w-8' />
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='flex w-full items-center rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-800'>
        <div className='relative w-full'>
          <div className='flex items-center gap-8'>
            <div className='h-[75px] w-[75px] animate-pulse overflow-hidden rounded-lg bg-neutral-300 dark:bg-neutral-700 sm:h-[100px] sm:w-[100px]'></div>
            <div className='flex flex-col items-start gap-1 md:gap-3'>
              <div className='h-4 w-[178px] animate-pulse rounded bg-neutral-300 dark:bg-neutral-700'></div>
              <div className='h-5 w-[187px] animate-pulse rounded bg-neutral-300 dark:bg-neutral-700'></div>
              <div className='h-4 w-[143px] animate-pulse rounded bg-neutral-300 dark:bg-neutral-700'></div>
            </div>
          </div>
          <Link
            href='https://spotify.com'
            target='_blank'
            rel='noopener noreferrer'
            className='absolute right-0 top-0'
          >
            <BiLogoSpotify className='h-5 w-5 md:h-8 md:w-8' />
          </Link>
        </div>
      </div>
    );
  }

  // Data will always be null when Spotify is disabled
  return null;
};

export default SpotifyCard;
